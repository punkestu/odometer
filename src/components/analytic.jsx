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
import { useEffect, useState } from "react";
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
  const times = Array.from({ length: 100 }, (_, i) => {
    return new Date(now + i * 1000).toLocaleTimeString();
  });
  const [topSpeed, setTopSpeed] = useState(0);
  const [speedMonitor, setSpeedMonitor] = useState(
    times.map((value) => ({ time: value, value: 0 })),
  );
  const [motionMonitor, setMotionMonitor] = useState(
    times.map((value) => ({ time: value, value: 0 })),
  );
  useEffect(() => {
    const intervalID = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      setSpeedMonitor((prev) => [
        ...prev.slice(-GRAPH_LIMIT + 1),
        { time, value: speedWindow.at(-1) },
      ]);
      setMotionMonitor((prev) => [
        ...prev.slice(-GRAPH_LIMIT + 1),
        { time, value: motionscore.current },
      ]);
    }, 1000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);
  useEffect(() => {
    setTopSpeed((prev) => Math.max(prev, speed));
  }, [speed]);
  return (
    <section className="p-4">
      <p>Top Speed: {topSpeed.toFixed(2)} km/h</p>
      <Bar
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
          labels: speedMonitor.slice(-GRAPH_LIMIT).map((speed) => speed.time),
          datasets: [
            {
              id: 1,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              label: "Speed",
              data: speedMonitor
                .slice(-GRAPH_LIMIT)
                .map((speed) => speed.value),
            },
            // {
            //   id: 2,
            //   borderColor: "rgb(255, 99, 132)",
            //   backgroundColor: "rgba(255, 99, 132, 0.5)",
            //   label: "Motion",
            //   data: motionMonitor
            //     .slice(-GRAPH_LIMIT)
            //     .map((speed) => speed.value),
            // },
          ],
        }}
      />
      <p
        style={{
          color:
            motionscore.current >= MOTION_SCORE_THRESHOLD ? "green" : "black",
        }}
      >
        Motion: {motion.x.toFixed(2)}, {motion.y.toFixed(2)},{" "}
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
          <li>Speed:</li>
          {speedMonitor.slice(-10).map((speed, i) => {
            return <li key={i}>{speed.value.toFixed(2)} km/h</li>;
          })}
        </ul>
        <ul style={{ width: "50%" }}>
          <li>Motion:</li>
          {motionMonitor.slice(-10).map((motion, i) => {
            return <li key={i}>{motion.value.toFixed(2)} km/h</li>;
          })}
        </ul>
      </div>
    </section>
  );
}
