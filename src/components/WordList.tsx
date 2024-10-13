import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Definition {
  definition: string;
  title: string;
  example: string;
  moreInformation: string;
}

interface WordData {
  number: number;
  name: string;
  data: Definition[] | null; // Allow data to be null
}

interface WordListProps {
  wordData: WordData[];
}

const WordList: React.FC<WordListProps> = ({ wordData }) => {
  const [filteredWordData, setFilteredWordData] = useState<WordData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [itemCount, setItemCount] = useState(10); // Number of items to load

  useEffect(() => {
    // Filter out empty word data
    const filteredData = wordData.filter(
      (word) => word.data && word.data.length > 0
    );
    setFilteredWordData(filteredData);
    setHasMore(filteredData.length > itemCount); // Check if there's more data
  }, [wordData]);

  const loadMoreItems = () => {
    // Incrementally increase the count of items to load
    setItemCount((prevCount) => {
      const newCount = prevCount + 10; // Load 10 more items
      setHasMore(newCount < filteredWordData.length); // Check if more items are available
      return newCount;
    });
  };

  return (
    <div style={{ width: 360, height: 370, overflow: "auto" }}>
      <InfiniteScroll
        dataLength={itemCount} // This is important field to render the next data
        next={loadMoreItems} // Function to call for loading more items
        hasMore={hasMore} // Whether more data is available
        loader={<h4>Loading...</h4>} // Loader while fetching more data
        endMessage={
          <p style={{ textAlign: "center" }}>No more items to load.</p>
        } // Message when no more data
      >
        {filteredWordData.slice(0, itemCount).map((word, index) => (
          <div
            key={index}
            className="bg-white border-b border-gray-300 p-4 mb-4"
          >
            <div className="mb-2">
              <h2 className="text-xl font-bold">{word.name}</h2>
            </div>

            {word.data &&
              word.data.map((definition, idx) => (
                <div key={idx} className="mb-2">
                  <h3 className="text-md font-semibold text-indigo-600">
                    {definition.title}
                  </h3>
                  <p className="text-gray-700 mt-1">{definition.definition}</p>
                  <p className="text-gray-500 italic mt-1">
                    Example: {definition.example}
                  </p>

                  {definition.moreInformation && (
                    <details className="mt-2">
                      <summary className="text-blue-500 cursor-pointer">
                        More Information
                      </summary>
                      <div className="text-gray-600 mt-2">
                        {definition.moreInformation
                          .split("\\n")
                          .map((line, lineIdx) => (
                            <p key={lineIdx}>{line}</p>
                          ))}
                      </div>
                    </details>
                  )}
                </div>
              ))}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default WordList;
