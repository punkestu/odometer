import { useEffect, useState } from "react";

import { useSpeed } from "./utils/position";
import { AlwaysWake } from "./utils/screen";
import { Analytic } from "./components/analytic";

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

export default function App() {
  const [speed, _speedWindow, _motion, _motionscore] = useSpeed();
  const [analytic, setAnalytic] = useState(false);
  const [speedDisplay, setSpeedDisplay] = useState(0);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setSpeedDisplay(speed);
    }, 1000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return (
    <>
      <AlwaysWake />
      <section className="p-4">
        <h1 className="font-black text-9xl text-center">
          {speedDisplay} <span className="text-xl">KM/h</span>
        </h1>
        <p className="text-center">{getStateFromSpeed(speedDisplay)}</p>
      </section>
      <div className="flex justify-center">
        <label
          htmlFor="analytic"
          className="flex justify-center items-center gap-1"
        >
          <input
            type="checkbox"
            name="analytic"
            id="analytic"
            onChange={(e) => setAnalytic(e.target.checked)}
          />
          Show Analytics
        </label>
      </div>
      {analytic && (
        <Analytic
          speedWindow={_speedWindow}
          motionscore={_motionscore}
          motion={_motion}
          speed={speed}
        />
      )}
    </>
  );
}
