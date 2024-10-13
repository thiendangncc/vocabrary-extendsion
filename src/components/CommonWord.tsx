import React, { useState } from "react";
import Translate from "./Translate";

interface WordData {
  id: number;
  value: {
    word: string;
    href: string;
    type: string;
    level: string;
    us: {
      mp3: string;
      ogg: string;
    };
    uk: {
      mp3: string;
      ogg: string;
    };
    phonetics: {
      us: string;
      uk: string;
    };
    examples: string[];
  };
}

interface CommonWordProps {
  wordData: WordData;
  markWord: (word: string) => void;
}

const CommonWord: React.FC<CommonWordProps> = ({ wordData, markWord }) => {
  const [showAllExamples, setShowAllExamples] = useState(false);

  const toggleExamples = () => {
    setShowAllExamples((prev) => !prev);
  };
  return (
    <div key={wordData.id} className="mb-6 relative">
      {/* Checkbox Icon */}
      <button
        onClick={() => markWord(wordData.value.word)}
        className="absolute top-2 right-2 text-gray-600 hover:text-blue-600"
        aria-label="Mark this word"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 11l2 2 4-4"
          />
        </svg>
      </button>
      <Translate word={wordData.value.word} />
      <h1 className="text-2xl font-bold mb-2">{wordData.value.word}</h1>
      <p className="text-gray-700 mb-2">
        Type: <span className="font-semibold">{wordData.value.type}</span> |
        Level: <span className="font-semibold">{wordData.value.level}</span>
      </p>

      <div className="mb-4">
        <div className="flex space-x-6 mt-2">
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">
              US ({wordData.value.phonetics.us}):
            </span>
            <button
              onClick={() => new Audio(wordData.value.us.mp3).play()}
              className="flex items-center text-blue-600 hover:text-blue-800"
              aria-label="Play US pronunciation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.623-2.36A1 1 0 009 10.5v3a1 1 0 001.129.832l3.623-2.36a1 1 0 000-1.664z"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">
              UK ({wordData.value.phonetics.uk}):
            </span>
            <button
              onClick={() => new Audio(wordData.value.uk.mp3).play()}
              className="flex items-center text-blue-600 hover:text-blue-800"
              aria-label="Play UK pronunciation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.623-2.36A1 1 0 009 10.5v3a1 1 0 001.129.832l3.623-2.36a1 1 0 000-1.664z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Examples:</h2>
        <ul className="list-disc ml-5">
          {wordData.value.examples
            .slice(0, showAllExamples ? undefined : 2)
            .map((example, index) => (
              <li key={index} className="text-gray-700">
                {example}
              </li>
            ))}
        </ul>
        <div className="flex justify-between mt-4">
          {wordData.value.examples.length > 2 && (
            <div className="flex justify-start">
              <button
                onClick={toggleExamples}
                className="text-blue-600 hover:underline mt-2"
              >
                {showAllExamples ? "Show less" : "Read more"}
              </button>
            </div>
          )}
          <a
            href={wordData.value.href}
            className="text-blue-600 hover:underline"
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default CommonWord;
