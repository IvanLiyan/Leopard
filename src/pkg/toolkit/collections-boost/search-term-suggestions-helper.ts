/* Toolkit */
import { call } from "@toolkit/api";

export class CollectionBoostSearchTermSuggestionsHelper {
  text: string;
  maxKeywordLength: number;
  maxNumOfWords: number;
  suggestionMessage: string;
  suggestionTerms: string;
  duplicateTitle: string;
  tooLongTitle: string;
  lowCoverageTitle: string;
  maxNumWordTitle: string;
  message: Map<string, Map<string, []>>;
  tooLongSet: Set<string>;
  lowCoverageSet: Set<string>;
  maxNumWordsSet: Set<string>;

  constructor(
    text: string,
    suggestionInfo: {
      suggestionMessage: string;
      suggestionTerms: string;
      duplicateTitle: string;
      tooLongTitle: string;
      lowCoverageTitle: string;
      maxNumWordTitle: string;
    }
  ) {
    this.text = text;
    this.maxKeywordLength = 20;
    this.maxNumOfWords = 2;
    this.suggestionMessage = suggestionInfo.suggestionMessage;
    this.suggestionTerms = suggestionInfo.suggestionTerms;
    this.duplicateTitle = suggestionInfo.duplicateTitle;
    this.tooLongTitle = suggestionInfo.tooLongTitle;
    this.lowCoverageTitle = suggestionInfo.lowCoverageTitle;
    this.maxNumWordTitle = suggestionInfo.maxNumWordTitle;
    this.message = new Map<string, Map<string, []>>();
    this.tooLongSet = new Set();
    this.lowCoverageSet = new Set();
    this.maxNumWordsSet = new Set();
  }

  async updateSuggestions(): Promise<Map<string, Map<string, []>>> {
    const keywords = this.text.split(",").filter((k) => k.length > 0);
    const searchTermToolWord = i`search term tool`;
    const searchTermToolLink = `[${searchTermToolWord}](../search-term-tool)`;
    const duplicateMessage = i`Please remove duplicate search terms`;
    const longMessage = i`A search term not more than ${20} characters is recommended`;
    const coverageMessage = i`Find better search terms using ${searchTermToolLink}`;
    const wordsMessage = i`Too many words in a search term. A search term less than ${3} words is recommended`;

    const duplicates = new Set(
      keywords
        .filter((item, index) => keywords.indexOf(item) != index)
        .map((keyword) =>
          keyword.length > this.maxKeywordLength
            ? keyword.substring(0, 8) + "..."
            : keyword
        )
    );

    if (duplicates.size > 0) {
      const duplicateMap = new Map();
      duplicateMap.set(this.suggestionMessage, duplicateMessage);
      duplicateMap.set(this.suggestionTerms, Array.from(duplicates));
      this.message.set(this.duplicateTitle, duplicateMap);
    }

    const response = await call("product-boost/keyword/multi-get", {
      keywords: this.text,
    });

    if (response && response.data) {
      for (const keyword of Object.keys(response.data)) {
        if (response.data[keyword].reach_level === 1) {
          const word =
            keyword.length > this.maxKeywordLength
              ? keyword.substring(0, 8) + "..."
              : keyword;

          this.lowCoverageSet.add(word);
        }
      }
    }

    for (const keyword of keywords) {
      if (keyword.length > this.maxKeywordLength) {
        this.tooLongSet.add(keyword.substring(0, 8) + "...");
      }

      if (keyword.split(" ").length > this.maxNumOfWords) {
        this.maxNumWordsSet.add(
          keyword.length > this.maxKeywordLength
            ? keyword.substring(0, 8) + "..."
            : keyword
        );
      }
    }

    if (this.tooLongSet.size > 0) {
      const tooLongMap = new Map();
      tooLongMap.set(this.suggestionMessage, longMessage);
      tooLongMap.set(this.suggestionTerms, Array.from(this.tooLongSet));
      this.message.set(this.tooLongTitle, tooLongMap);
    }
    if (this.lowCoverageSet.size > 0) {
      const lowCoverageMap = new Map();
      lowCoverageMap.set(this.suggestionMessage, coverageMessage);
      lowCoverageMap.set(this.suggestionTerms, Array.from(this.lowCoverageSet));
      this.message.set(this.lowCoverageTitle, lowCoverageMap);
    }
    if (this.maxNumWordsSet.size > 0) {
      const maxNumWordMap = new Map();
      maxNumWordMap.set(this.suggestionMessage, wordsMessage);
      maxNumWordMap.set(this.suggestionTerms, Array.from(this.maxNumWordsSet));
      this.message.set(this.maxNumWordTitle, maxNumWordMap);
    }
    return this.message;
  }
}
