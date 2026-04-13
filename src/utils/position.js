import { useCallback, useEffect, useRef, useState } from "react";

export const MOTION_SCORE_THRESHOLD = 1;
const SPEED_WINDOW_LENGTH = 10;

export function useSpeed() {
    const [speed, setSpeed] = useState(0);
    const [speedWindow, setSpeedWindow] = useState(new Array(SPEED_WINDOW_LENGTH).fill(0));
    const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });

    const motionScore = useRef(0);
    const lastPositionRef = useRef(null);
    const lastSpeedRef = useRef(0);

    const pushSpeed = useCallback((newSpeed) => {
        setSpeedWindow((prev) => [...prev, newSpeed].slice(-SPEED_WINDOW_LENGTH));
    }, []);

    useEffect(() => {
        const intervalID = setInterval(() => {
            pushSpeed(lastSpeedRef.current);
        }, 100);

        return () => {
            clearInterval(intervalID);
        }
    }, [pushSpeed]);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            console.error("Geolocation is not supported");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const speedMps = pos.coords.speed ?? 0;
                lastSpeedRef.current = speedMps * 3.6;
            },
            (err) => {
                console.error("Geolocation error:", err);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 10000,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [pushSpeed]);

    useEffect(() => {
        if (!("Accelerometer" in window)) {
            console.error("Accelerometer is not supported");
            return;
        }

        let acl = null;

        try {
            acl = new Accelerometer({ frequency: 60 });

            const handleReading = () => {
                const current = {
                    x: acl?.x ?? 0,
                    y: acl?.y ?? 0,
                    z: acl?.z ?? 0,
                };

                const last = lastPositionRef.current;

                // ignore first reading so we don't compare against 0,0,0
                if (!last) {
                    lastPositionRef.current = current;
                    return;
                }

                const dx = current.x - last.x;
                const dy = current.y - last.y;
                const dz = current.z - last.z;

                motionScore.current = Math.sqrt(dx * dx + dy * dy + dz * dz);

                setMotion({
                    x: dx,
                    y: dy,
                    z: dz,
                });

                lastPositionRef.current = current;
            };

            acl.addEventListener("reading", handleReading);
            acl.start();

            return () => {
                acl?.removeEventListener("reading", handleReading);
                acl?.stop();
            };
        } catch (err) {
            console.error("Accelerometer error:", err);
        }
    }, []);

    useEffect(() => {
        if (speedWindow.length < SPEED_WINDOW_LENGTH) return;

        const filtered = speedWindow.filter(
            (v) => Number.isFinite(v) && v >= 0
        );

        if (filtered.length === 0) return;

        const sorted = [...filtered].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];

        const clean = filtered.filter((v) => Math.abs(v - median) < 3);

        if (clean.length === 0 || motionScore.current < MOTION_SCORE_THRESHOLD) {
            setSpeed(0);
            return;
        }

        const avg = clean.reduce((sum, v) => sum + v, 0) / clean.length;
        setSpeed(Number(avg.toFixed(2)));
    }, [speedWindow]);

    return [
        speed,
        speedWindow,
        motion,
        motionScore,
    ];
}