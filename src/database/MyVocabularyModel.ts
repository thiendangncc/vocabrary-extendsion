// VocabularyModel.ts
import BaseModel from "./BaseModel";

class MyVocabularyModel extends BaseModel<string[]> {
  constructor() {
    super("my_vocabularies"); // Collection name
  }

  async markVocabulary(uid: string, vocabulary: string): Promise<void> {
    const vocabularies = (await this.read(`${uid}/skip_words`)) || [];
    if (vocabularies) {
      if (vocabularies.includes(vocabulary)) {
        return;
      }

      await this.update(`${uid}/skip_words`, [...vocabularies, vocabulary]);
    }

    await this.create(`${uid}/skip_words`, [vocabulary]);
  }
  async getSkipWords(uid: string): Promise<string[]> {
    const vocabularies = (await this.read(`${uid}/skip_words`)) || [];
    return vocabularies;
  }
}

export default new MyVocabularyModel();
