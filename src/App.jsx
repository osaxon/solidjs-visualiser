import logo from "./logo.svg";
import { arc, interpolateSinebow, interpolateInferno } from "d3";
import { createMemo, For } from "solid-js";
import { startFromFile, rawData } from "./aduioSource";

const arcBuilder = arc();

const RadialGraph = ({ color, scale }) => {
	const computed = createMemo(() => {
		const data = rawData();

		const total = data.reduce((a, v) => a + v, 0);

		const highCount = data.filter((d) => d > 32).length;
		const intensity = highCount / data.length;

		const paths = [
			{
				path: "",
				color: "",
			},
		];

		const range = 1.0 + intensity;
		const rangeInRadians = range * Math.PI;
		const startAngle = -(rangeInRadians / 2);
		const angle = rangeInRadians / data.length;
		let currentAngle = startAngle;

		for (const d of data) {
			const angle = rangeInRadians * (d / total);
			const path = arcBuilder({
				innerRadius: 50 - ((d + 5) / 255) * 35,
				outerRadius: 50 + ((d + 5) / 255) * 35,
				startAngle: currentAngle,
				endAngle: currentAngle + angle,
			});
			paths.push({
				path,
				color: color(d / 255),
			});
			currentAngle += angle;
		}

		return { paths, intensity };
	});

	return (
		<g transform={`scale(${computed().intensity * scale + 1})`}>
			<For each={computed().paths}>
				{(p) => <path d={p.path} fill={p.color} />}
			</For>
		</g>
	);
};

function App() {
	return (
		<div onClick={startFromFile} style="width: 100vw; height: 100vh">
			<h1 className="title">Click to begin</h1>
			<svg
				width="100%"
				height="100%"
				viewBox="-100 -100 200 200"
				preserveAspectRatio="xMidYMid meet"
			>
				<RadialGraph scale={0.5} color={interpolateSinebow} />
				<RadialGraph scale={1.5} color={interpolateInferno} />
			</svg>
		</div>
	);
}

export default App;
