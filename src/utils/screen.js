import { useEffect, useRef } from "react";

export function AlwaysWake({ enabled = true }) {
    const wakeLockRef = useRef(null);

    useEffect(() => {
        if (!enabled) return;

        let mounted = true;

        const requestWakeLock = async () => {
            try {
                if (!("wakeLock" in navigator)) return;

                wakeLockRef.current = await navigator.wakeLock.request("screen");

                wakeLockRef.current.addEventListener("release", () => {
                    console.log("Wake lock released");
                });
            } catch (err) {
                console.error("Wake lock error:", err);
            }
        };

        requestWakeLock();

        const handleVisibilityChange = async () => {
            if (
                mounted &&
                document.visibilityState === "visible" &&
                enabled &&
                !wakeLockRef.current
            ) {
                await requestWakeLock();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            mounted = false;
            document.removeEventListener("visibilitychange", handleVisibilityChange);

            if (wakeLockRef.current) {
                wakeLockRef.current.release().catch(console.error);
                wakeLockRef.current = null;
            }
        };
    }, [enabled]);
}