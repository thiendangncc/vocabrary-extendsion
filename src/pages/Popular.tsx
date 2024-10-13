import React, { useState } from "react";
import { wordLists } from "../utils/words";
import WordList from "../components/WordList";
const Popular: React.FC = () => {
  const [wordData] = useState(wordLists);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter word data based on search term
  const filteredWordData = wordData
    .filter(
      (word: any) =>
        Object.keys(word).length > 0 &&
        word.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(() => Math.random() - 0.5); // Shuffle the filtered words

  return (
    <div>
      <div className="mt-1 w-full">
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <WordList wordData={filteredWordData} />
    </div>
  );
};

export default Popular;
