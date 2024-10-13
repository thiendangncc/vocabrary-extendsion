/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import VocabularyModel from "../database/VocabularyModel";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import TextToSpeech from "./TextToSpeech";

const VocabularyList = () => {
  // Example vocabulary data
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

  return (
    <div className="overflow-y-auto h-full border-t border-gray-200">
      {vocabularies.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No vocabulary found.</p>
      ) : (
        <ul className="space-y-3">
          {vocabularies.map((vocab: any) => (
            <li
              key={vocab.keyword}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {vocab.keyword}
                  {vocab.count && <span> ({vocab.count})</span>}
                  <TextToSpeech text={vocab.keyword} />
                </p>
                <p className="text-sm text-gray-600">{vocab.notes}</p>
              </div>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(vocab.keyword)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12V17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14 12V17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4 7H20"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VocabularyList;
