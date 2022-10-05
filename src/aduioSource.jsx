import { createSignal } from "solid-js";

const [rawData, setRawData] = createSignal([]);

export const startFromFile = async () => {
	const res = await fetch("/boogie.mp3");
	const byteArray = await res.arrayBuffer();

	const context = new AudioContext();
	const audioBuffer = await context.decodeAudioData(byteArray);

	const source = context.createBufferSource();
	source.buffer = audioBuffer;

	const analyser = context.createAnalyser();
	analyser.fftSize = 512;

	source.connect(analyser);
	analyser.connect(context.destination);
	source.start();

	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	const update = () => {
		analyser.getByteFrequencyData(dataArray);
		const orig = Array.from(dataArray);
		setRawData([[...orig].reverse(), orig].flat());
		console.log(Array.from(dataArray));
		requestAnimationFrame(update);
	};
	requestAnimationFrame(update);
};

export { rawData };
