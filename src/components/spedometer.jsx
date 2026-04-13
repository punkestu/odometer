import { useCallback, useEffect, useMemo, useState } from "react";

const WALKING_THRESHOLD = 0.2; // in kmh
const RUNNING_THRESHOLD = 0.5; // in kmh
const RIDING_THRESHOLD = 15; // in kmh

function getStateFromSpeed(speed) {
  if (speed > WALKING_THRESHOLD) {
    return "Is Walking...";
  } else if (speed > RUNNING_THRESHOLD) {
    return "Is Running...";
  } else if (speed > RIDING_THRESHOLD) {
    return "Is Riding...";
  }

  return "Stopped...";
}

const HISTORY_LIMIT = 10;

export function Spedometer({ speed }) {
  const [speedHistory, setSpeedHistory] = useState([]);
  const pushSpeed = useCallback((newSpeed) => {
    setSpeedHistory((prev) => [...prev, newSpeed].slice(-HISTORY_LIMIT));
  }, []);
  useEffect(() => {
    const intervalID = setInterval(() => {
        pushSpeed(speed);
        console.log(speedHistory);
    }, 100);
    return () => {
        clearInterval(intervalID);
    }
  }, [speed]);
  const speedDisplay = useMemo(() => {
    if (speedHistory.length === 0) return 0;

    const avg = speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;

    // filter values too far from average
    const filtered = speedHistory.filter(
      (v) => Math.abs(v - avg) < 5, // threshold (tune this)
    );

    if (filtered.length === 0) return avg;

    return filtered.reduce((a, b) => a + b, 0) / filtered.length;
  }, [speedHistory]);
  return (
    <section className="p-4">
      <h1 className="font-black text-9xl text-center">
        {speedDisplay.toFixed(2)} <span className="text-xl">KM/h</span>
      </h1>
      <p className="text-center">{getStateFromSpeed(speedDisplay)}</p>
    </section>
  );
}
