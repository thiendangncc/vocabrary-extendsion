import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CommonWord from "./CommonWord"; // Adjust the import path as necessary
import MyVocabularyModel from "../database/MyVocabularyModel";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

export interface WordData {
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

interface CommonWordListProps {
  data: WordData[];
}

const CommonWordList: React.FC<CommonWordListProps> = ({ data }) => {
  const [items, setItems] = useState<WordData[]>(data.slice(0, 10)); // Initial items
  const [hasMore, setHasMore] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    setItems(data.slice(0, 10));
  }, [data]);

  const fetchMoreData = () => {
    const nextItems = data.slice(items.length, items.length + 10);
    setItems((prevItems) => [...prevItems, ...nextItems]);
    if (nextItems.length < 10) {
      setHasMore(false);
    }
  };
  const markWord = (word: string) => {
    user?.uid && MyVocabularyModel.markVocabulary(user?.uid, word);

    setItems((prevItems) => {
      return prevItems.filter((p) => p.value.word !== word);
    });
  };

  return (
    <div className="p-4 mx-auto bg-white rounded-lg shadow-md">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className="text-center">Loading...</h4>}
        endMessage={<p className="text-center">No more items to load.</p>}
      >
        {items.map((wordData) => (
          <CommonWord
            markWord={markWord}
            key={wordData.value.word}
            wordData={wordData}
          />
        ))}
      </InfiniteScroll>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchMoreData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default CommonWordList;
