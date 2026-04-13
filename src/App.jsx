import { useState } from "react";

import { useSpeed } from "./utils/position";
import { AlwaysWake } from "./utils/screen";
import { Analytic } from "./components/analytic";
import { Spedometer } from "./components/spedometer";

export default function App() {
  const [speed, _speedWindow, _motion, _motionscore] = useSpeed();
  const [analytic, setAnalytic] = useState(false);

  return (
    <>
      <AlwaysWake />
      <Spedometer speed={speed} />
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
