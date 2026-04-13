import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { MOTION_SCORE_THRESHOLD } from "../utils/position";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const GRAPH_LIMIT = 100;

export function Analytic({ speedWindow, motionscore, motion, speed }) {
  const now = new Date();
  const [topSpeed, setTopSpeed] = useState(0);

  const [times, setTimes] = useState(
    // new Array(GRAPH_LIMIT).map((_, i) => {
    //   return new Date(now + i * 1000).toLocaleTimeString()
    // })
    []
  );
  const [speedMonitor, setSpeedMonitor] = useState(
    // new Array(GRAPH_LIMIT).fill(0),
    []
  );
  const [motionMonitor, setMotionMonitor] = useState(
    // new Array(GRAPH_LIMIT).fill(0),
    []
  );
  
  useEffect(()=>{
    const intervalID = setInterval(() => {
      setTimes([...times, new Date().toLocaleTimeString()].slice(-GRAPH_LIMIT));
      setSpeedMonitor(prev => [...prev, speedWindow.at(-1)].slice(-GRAPH_LIMIT));
      setMotionMonitor(prev => [...prev, motionscore.current].slice(-GRAPH_LIMIT));
    }, 1000);
    return () => {
      clearInterval(intervalID);
    }
  }, [times]);
  useEffect(() => {
    setTopSpeed((prev) => Math.max(prev, speed));
  }, [speed]);
  return (
    <section className="p-4">
      <p><span className="font-semibold">Top Speed:</span> {topSpeed.toFixed(2)} km/h</p>
      <Line
        datasetIdKey="id"
        options={{
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 4,
              },
            },
          },
        }}
        data={{
          labels: times,
          datasets: [
            {
              id: 1,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              label: "Speed",
              data: speedMonitor
                .slice(-GRAPH_LIMIT),
            },
            {
              id: 2,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              label: "Motion",
              data: motionMonitor
                .slice(-GRAPH_LIMIT),
            },
          ],
        }}
      />
      <p
        style={{
          color:
            motionscore.current >= MOTION_SCORE_THRESHOLD ? "green" : "black",
        }}
      >
        <span className="font-semibold">Motion:</span> {motion.x.toFixed(2)}, {motion.y.toFixed(2)},{" "}
        {motion.z.toFixed(2)}
      </p>
      <p
        style={{
          color:
            motionscore.current >= MOTION_SCORE_THRESHOLD ? "green" : "black",
        }}
      >
        ({motionscore.current.toFixed(2)})
      </p>
      <div style={{ display: "flex" }}>
        <ul style={{ width: "50%" }}>
          <li className="font-semibold">Speed:</li>
          {speedMonitor.slice(-GRAPH_LIMIT / 10).map((speed, i) => {
            return <li key={i}>{speed.toFixed(2)} km/h</li>;
          })}
        </ul>
        <ul style={{ width: "50%" }}>
          <li className="font-semibold">Motion:</li>
          {motionMonitor.slice(-GRAPH_LIMIT / 10).map((motion, i) => {
            return <li key={i}>{motion.toFixed(2)} km/h</li>;
          })}
        </ul>
      </div>
    </section>
  );
}
