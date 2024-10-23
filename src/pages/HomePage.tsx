/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import VocabularyList from "../components/VocabularyList";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import VocabularyModel from "../database/VocabularyModel";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vocabularies, setVocabularies] = useState([
    // { id: 1, keyword: "React", note: "A JavaScript library for building UIs" },
    // { id: 2, keyword: "Tailwind", note: "A utility-first CSS framework" },
    // {
    //   id: 3,
    //   keyword: "JavaScript",
    //   note: "A high-level, dynamic programming language",
    // },
  ]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user?.uid) return;
    VocabularyModel.getFeed(user?.uid).then((data: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setVocabularies(Object.values(data) || []);
    });
  }, [user]);

  // Function to handle deleting a vocabulary
  const handleDelete = (keyword: string) => {
    if (!user?.uid) return;
    VocabularyModel.deleteVocabularyByKeyword(user?.uid, keyword).then(() => {
      VocabularyModel.getFeed(user?.uid).then((data: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setVocabularies(Object.values(data) || []);
      });
    });
  };
  // Filter word data based on search term
  const filteredWordData = vocabularies.filter(
    (word: any) =>
      Object.keys(word).length > 0 &&
      word.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-1">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <VocabularyList vocabularies={filteredWordData} onDelete={handleDelete} />
    </div>
  );
};

export default HomePage;
