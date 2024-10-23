// VocabularyModel.ts
import BaseModel from "./BaseModel";
import { ProxyFactory } from "./ProxyFactory";

class MyVocabularyModel extends BaseModel<string[]> {
  constructor() {
    super("my_vocabularies"); // Collection name
  }

  async markVocabulary(uid: string, vocabulary: string): Promise<void> {
    const vocabularies = (await this.read(`${uid}/skip_words`)) || [];

    if (!vocabularies) {
      await this.create(`${uid}/skip_words`, [vocabulary]);
      return;
    }
    if (vocabularies.includes(vocabulary)) {
      return;
    }

    await this.update(`${uid}/skip_words`, [...vocabularies, vocabulary]);
  }
  async getSkipWords(uid: string): Promise<string[]> {
    const vocabularies = (await this.read(`${uid}/skip_words`)) || [];
    return vocabularies;
  }
}

export default ProxyFactory.get(MyVocabularyModel, "MyVocabularyModel");
