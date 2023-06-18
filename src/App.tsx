import { startTransition, useState } from "react";
import PlotFigure from "./PlotFigure";
import * as Plot from "@observablehq/plot";
import { useInterval, useMeasure } from "react-use";
import { twMerge } from "tailwind-merge";
import { MyData, generateData } from "./mock-data";

const INTERVAL = 70;

function App() {
	const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();
	const [data, setData] = useState<MyData[]>([]);
	const [start, setStart] = useState(false);
	const [time, setTime] = useState(0);

	useInterval(
		() => {
			startTransition(() => {
				setData((prev) => {
					const last = prev.at(-1) ?? { x: 0, y: 0 };
					const delta = INTERVAL / (60 * 1000);
					const mockData = generateData(last, { x: delta, y: delta });

					return [...prev, mockData];
				});
			});
		},
		start ? INTERVAL : null,
	);

	useInterval(() => setTime((prev) => prev + 1), start ? 1000 : null);

	return (
		<div className="w-screen h-screen bg-gray-950" ref={containerRef}>
			<span className="absolute top-5 right-32 text-gray-950">{time}</span>
			<button
				className={twMerge(
					"absolute top-4 right-4 rounded px-2 py-0.5 bg-green-300 hover:bg-green-400 w-16",
					start && "bg-red-300 hover:bg-red-400",
				)}
				type="button"
				onClick={() => {
					console.log({ data });
					setStart((prev) => !prev);
				}}
			>
				{start ? "Pause" : "Start"}
			</button>
			<PlotFigure
				options={{
					width,
					height,
					y: { grid: true },
					marks: [
						Plot.areaY(data, { x: "x", y: "y", fillOpacity: 0.3 }),
						Plot.lineY(data, { x: "x", y: "y" }),
						Plot.ruleY([0, 6]),
						Plot.ruleX([0, 6]),
					],
				}}
			/>
		</div>
	);
}

export default App;
