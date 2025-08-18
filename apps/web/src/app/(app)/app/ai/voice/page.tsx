"use client";

import { AIVoiceInput } from "@microboat/web/components/examples/ai/voice/ai-voice-input";
import { useState } from "react";

export default function VoicePage() {
	const [recordings, setRecordings] = useState<
		{ duration: number; timestamp: string }[]
	>([]);

	const handleStop = (duration: number) => {
		setRecordings((prev) => [
			...prev.slice(-4),
			{ duration, timestamp: new Date().toISOString() },
		]);
	};

	return (
		<div className="flex flex-col my-auto">
			<div className="items-center justify-center">
				<AIVoiceInput
					onStart={() => console.log("Recording started")}
					onStop={handleStop}
				/>
			</div>
		</div>
	);
}
