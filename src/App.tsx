import { useState } from "react";
import { nanoid } from "nanoid";
import PlotFigure from "./PlotFigure";
import * as Plot from "@observablehq/plot";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<PlotFigure
				key={nanoid()}
				options={{
					marks: [
						Plot.dot([], { x: "culmen_length_mm", y: "culmen_depth_mm" }),
					],
				}}
			/>
		</>
	);
}

export default App;
