export const getSearchTermsScore = (
  suggestionsMap: Map<string, Map<string, []>>,
  suggestionInfo: {
    suggestionMessage: string;
    suggestionTerms: string;
    duplicateTitle: string;
    tooLongTitle: string;
    lowCoverageTitle: string;
    maxNumWordTitle: string;
    searchQueries: string;
  }
) => {
  const getTooLongScore = () => {
    const result = suggestionsMap
      .get(suggestionInfo.tooLongTitle)
      ?.get(suggestionInfo.suggestionTerms);
    if (result) {
      return 100 - result.length * 10;
    }
    return 100;
  };

  const getMaxNumWordScore = () => {
    const result = suggestionsMap
      .get(suggestionInfo.maxNumWordTitle)
      ?.get(suggestionInfo.suggestionTerms);
    if (result) {
      return 100 - result.length * 10;
    }
    return 100;
  };

  const getLowCoverageScore = () => {
    const lowCovWords = suggestionsMap
      .get(suggestionInfo.lowCoverageTitle)
      ?.get(suggestionInfo.suggestionTerms);
    const totalWords = suggestionInfo.searchQueries
      .split(",")
      .filter((k) => k.length > 0);
    const totalWordsSet = new Set(totalWords);
    if (lowCovWords && totalWords && totalWordsSet.size > 0) {
      return 100 * (1 - lowCovWords.length / totalWordsSet.size);
    }
    return 100;
  };

  const score = Math.max(
    20,
    Math.min(getTooLongScore(), getMaxNumWordScore(), getLowCoverageScore())
  );

  return score;
};
