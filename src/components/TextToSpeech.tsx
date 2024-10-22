import React, { useState } from "react";
import { textToSpeech } from "../utils/translate";

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const [loading, setLoading] = useState(false);

  const handleAudioPlay = async () => {
    setLoading(true);

    try {
      const audioData = await textToSpeech(text); // Get the first element from the array
      const audioSrc = `data:audio/mp3;base64,${audioData}`; // Construct audio source

      const audio = new Audio(audioSrc);
      audio.play();
    } catch (error) {
      console.error("Error fetching audio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="align-middle">
      <button
        onClick={handleAudioPlay}
        aria-label="Play text"
        className="text-gray-800 hover:text-blue-600"
        disabled={loading}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 11V13M6 8V16M9 10V14M12 7V17M15 4V20M18 9V15M21 11V13"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </span>
  );
};

export default TextToSpeech;
