import React, { useState } from "react";
import VocabularyLocalModel from "../database/VocabularyLocalModel";
import Translate from "./Translate";
import TextToSpeech from "./TextToSpeech";

interface PhraseData {
  category: string;
  items: string[];
}

interface PhraseListProps {}

const PhraseList: React.FC<PhraseListProps> = () => {
  const [phrases] = useState<PhraseData[]>(
    VocabularyLocalModel.getCommonPhrases()
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredPhrases = phrases.filter((phraseData) =>
    phraseData.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 mx-auto bg-white rounded-lg shadow-md">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {filteredPhrases.map((phraseData, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {phraseData.category}
            <button
              onClick={() => toggleCategory(index)}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
              aria-label={expandedCategories.has(index) ? "Collapse" : "Expand"}
            >
              {expandedCategories.has(index) ? "−" : "+"}
            </button>
          </h2>
          {expandedCategories.has(index) && (
            <ul className="list-disc ml-5">
              {phraseData.items.map((item, idx) => (
                <li key={idx} className="text-gray-700">
                  {item}
                  <TextToSpeech text={item} />
                  <Translate word={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhraseList;
