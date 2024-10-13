/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import VocabularyLocalModel from "../database/VocabularyLocalModel";
import CommonWordList, { WordData } from "../components/CommonWordList";
import MyVocabularyModel from "../database/MyVocabularyModel";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
const CommonWordPage: React.FC = () => {
  const [wordData] = useState(VocabularyLocalModel.getCommonWords());
  const [skipWords, setSkipWords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user] = useAuthState(auth);

  useEffect(() => {
    user?.uid &&
      MyVocabularyModel.getSkipWords(user?.uid).then((words) =>
        setSkipWords(words)
      );
  }, [user]);

  // Filter word data based on search term
  const filteredWordData = wordData
    .filter(
      (word: WordData) =>
        Object.keys(word).length > 0 &&
        word.value.word.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !skipWords.includes(word.value.word)
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
      <CommonWordList data={filteredWordData} />
    </div>
  );
};

export default CommonWordPage;
