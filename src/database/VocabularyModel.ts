// VocabularyModel.ts
import { IPageWordCount } from "../utils/type";
import BaseModel from "./BaseModel";

export interface VocabularyData {
  keyword: string;
  notes: string;
  url: string;
  selectedText: string;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  createdAt?: number; //timestamp
  count?: number;
  countHistory?: IPageWordCount[];
}

class VocabularyModel extends BaseModel<{ [key: string]: VocabularyData }> {
  constructor() {
    super("vocabularies"); // Collection name
  }

  async addVocabulary(uid: string, vocabulary: VocabularyData): Promise<void> {
    const vocabularies = (await this.read(uid)) || {};
    if (vocabularies[vocabulary.keyword]) {
      return;
    }
    vocabulary.createdAt = new Date().getTime();

    vocabularies[vocabulary.keyword] = vocabulary;
    await this.create(uid, vocabularies);
  }

  async updateVocabulary(
    uid: string,
    keyword: string,
    newVocabulary: VocabularyData
  ): Promise<void> {
    const vocabularies = await this.read(uid);
    if (vocabularies) {
      vocabularies[keyword] = newVocabulary;
      await this.update(uid, vocabularies);
    }
  }
  async updateWordsCount(uid: string, words: Record<string, IPageWordCount>) {
    for (const key in words) {
      await this.updateWordCount(uid, key, words[key]);
    }
  }
  async updateWordCount(
    uid: string,
    keyword: string,
    wordCount: IPageWordCount
  ): Promise<void> {
    const vocabularies = await this.read(uid);
    if (!vocabularies || !vocabularies[keyword]) {
      throw Error("not found");
    }
    vocabularies[keyword]["count"] =
      (vocabularies[keyword]["count"] || 0) + wordCount.count;
    if (!vocabularies[keyword]["countHistory"]) {
      vocabularies[keyword]["countHistory"] = [];
    }
    vocabularies[keyword]["countHistory"]?.push(wordCount);
    await this.update(uid, vocabularies);
  }
  async deleteVocabulary(uid: string, keyword: string): Promise<void> {
    const vocabularies = await this.read(uid);
    if (vocabularies) {
      delete vocabularies[keyword];
      await this.update(uid, vocabularies);
    }
  }
  async getFeed(uid: string) {
    const data = await this.read(uid);
    if (!data) return null;
    // Convert the object into an array of entries and sort
    const sortedData = Object.entries(data).sort(([, vocabA], [, vocabB]) => {
      // const dataA = vocabA?.createdAt || 0;
      // const dataB = vocabB?.createdAt || 0;
      const dataA = vocabA?.count || 0;
      const dataB = vocabB?.count || 0;
      return dataB - dataA; // descending order
    });

    // Convert back to an object if needed
    const sortedObject = Object.fromEntries(sortedData);
    return sortedObject;
  }
  async deleteVocabularyByKeyword(
    uid: string,
    keyword: string
  ): Promise<VocabularyData[]> {
    const vocabularies = await this.read(uid);
    if (!vocabularies) return [];
    if (vocabularies) {
      delete vocabularies[keyword];
      await this.update(uid, vocabularies);
    }
    return Object.values(vocabularies) || [];
  }
}

export default new VocabularyModel();
