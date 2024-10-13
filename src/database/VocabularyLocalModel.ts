/* eslint-disable @typescript-eslint/no-explicit-any */
import fullList from "./seed/full-word.json";
import commonWords from "./seed/oxford-3000.json";
import commonPhrases from "./seed/common-phrases.json";
// Create an empty object to store the transformed data
const transformedData: any = {};

// Get the 'word' value and use it as the key
for (const item of fullList as any[]) {
  const key = item.value.word;
  transformedData[key] = item;
}

class VocabularyLocalModel {
  _fullList = transformedData;
  _commonPhrases = commonPhrases;
  _commonWords = commonWords
    .map((c) => {
      return transformedData[c];
    })
    .filter((c) => !!c);

  getCommonPhrases() {
    return this._commonPhrases;
  }
  getCommonWords() {
    return this._commonWords;
  }
  getFullWords() {
    return this._fullList;
  }
}

export default new VocabularyLocalModel();
