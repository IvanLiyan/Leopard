import React, { useMemo, useState, useCallback, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInput, HorizontalField, ProgressBar } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { weightMedium } from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";

/* Merchant Model */
import Collection from "@merchant/model/collections-boost/Collection";
import CollectionBoostSearchTermSuggestion from "@merchant/component/collections-boost/CollectionBoostSearchTermSuggestion";

/* Merchant Components */
import CollectionTilePreview from "@merchant/component/collections-boost/edit-page/CollectionTilePreview";
import { SecureFileInput } from "@merchant/component/core";

/* Toolkit */
import CollectionNameValidator from "@toolkit/collections-boost/CollectionNameValidator";
import { CollectionBoostSearchTermSuggestionsHelper } from "@toolkit/collections-boost/search-term-suggestions-helper";
import { getSearchTermsScore } from "@toolkit/collections-boost/search-term-score";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";

type CollectionBasicsProps = BaseProps & {
  readonly collection: Collection;
};

const CollectionBasics = (props: CollectionBasicsProps) => {
  const { collection, className } = props;
  const { name, logoUrl, oldLogoUrl, searchQueries, relatedProducts } =
    collection;

  const suggestionInfo = useMemo(
    () => ({
      suggestionMessage: "suggestion",
      suggestionTerms: "term",
      duplicateTitle: i`Duplicate search terms`,
      tooLongTitle: i`Long search terms`,
      lowCoverageTitle: i`Low coverage search terms`,
      maxNumWordTitle: i`Search terms with too many words`,
      searchQueries: collection.searchQueries || "",
    }),
    [collection.searchQueries],
  );

  const styles = useStylesheet();
  const { pageBackground, surfaceLight, positive, warning, negative } =
    useTheme();

  const [suggestionsMap, setSuggestionsMap] = useState<
    Map<string, Map<string, []>>
  >(new Map());

  const [showSuggestion, setShowSuggestion] = useState(false);

  const [searchTerms, setSearchTerms] = useState("");
  const debouncedSearchTerms = useDebouncer(searchTerms, 750);

  const updateSuggestionsMap = useCallback(() => {
    const update = async () => {
      const result = await new CollectionBoostSearchTermSuggestionsHelper(
        debouncedSearchTerms,
        suggestionInfo,
      ).updateSuggestions();

      if (result && result.size > 0) {
        setShowSuggestion(true);
      } else {
        setShowSuggestion(false);
      }
      setSuggestionsMap(result);
    };
    update();
  }, [debouncedSearchTerms, suggestionInfo]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateSuggestionsMap, [debouncedSearchTerms]);

  const suggestionScoreField = useMemo(() => {
    const getBarColor = (score: number) => {
      if (score > 0.7) {
        return positive;
      } else if (score >= 0.3) {
        return warning;
      }
      return negative;
    };

    const score = getSearchTermsScore(suggestionsMap, suggestionInfo) / 100;
    const barColor = getBarColor(score);

    if (searchQueries) {
      return (
        <HorizontalField
          className={css(styles.scoreBar)}
          title={i`Suggestion Score`}
          titleAlign="start"
          titleWidth="6"
          popoverContent={
            i`This is an estimation of the quality of the search terms you provided. ` +
            i`A higher score indicates better reachability of search terms. ` +
            i`Please improve your search terms based on the suggestions below.`
          }
        >
          <ProgressBar
            color={barColor}
            progress={score}
            backgroundColor={surfaceLight}
            transitionDurationMs={800}
          />
        </HorizontalField>
      );
    }
  }, [
    suggestionsMap,
    styles.scoreBar,
    surfaceLight,
    suggestionInfo,
    searchQueries,
    positive,
    warning,
    negative,
  ]);

  const nameValidator = new CollectionNameValidator({
    maxLength: 40,
  });

  const onSearchTermsChange = ({ text }: OnTextChangeEvent) => {
    setSearchTerms(text);
    collection.searchQueries = text;
  };

  const uploadLogoField = useMemo(() => {
    const tooltipText = logoUrl
      ? i`If you wish to replace the current collection logo, ` +
        i`you can re-upload an image below.`
      : i`Please upload one light-colored background image to ` +
        i`give buyers a general view of your items. ` +
        i`To be effective, the image needs to clearly represent ` +
        i`products in this collection.`;
    return (
      <HorizontalField
        title={logoUrl ? i`Replace Collection Logo` : i`Upload Collection Logo`}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={tooltipText}
      >
        <SecureFileInput
          bucket="TEMP_UPLOADS_V2"
          accepts=".jpeg,.jpg,.png"
          maxSizeMB={5}
          maxAttachments={1}
          onAttachmentsChanged={(attachments) => {
            collection.logoUrl = attachments[0]?.url || oldLogoUrl;
          }}
          backgroundColor={pageBackground}
          hideFilename
        />
      </HorizontalField>
    );
  }, [collection, styles.verticalMargin, pageBackground, logoUrl, oldLogoUrl]);

  return (
    <div className={css(styles.root, className)}>
      <HorizontalField
        title={i`Collection Name`}
        centerTitleVertically
        className={css(styles.topMargin)}
        popoverContent={
          i`This is a required field. This will be displayed as ` +
          i`the name of the collection you are creating/editing.`
        }
      >
        <TextInput
          value={name}
          placeholder={i`Enter the name of your collection`}
          onChange={({ text }: OnTextChangeEvent) => {
            collection.name = text;
          }}
          validators={[nameValidator]}
          className={css(styles.input)}
        />
      </HorizontalField>
      {uploadLogoField}
      <HorizontalField
        title={i`Preview`}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={i`This will be what your collection looked like to buyers.`}
      >
        <CollectionTilePreview
          collectionName={collection.name || ""}
          collectionLogoUrl={collection.logoUrl || ""}
        />
      </HorizontalField>
      <hr />
      <HorizontalField
        title={i`Search Terms (separated by comma)`}
        centerTitleVertically
        className={css(styles.topMargin)}
        popoverContent={
          i`This is a required field. Collection's search terms ` +
          i`are a list of words or phrases that the users search on Wish for ` +
          i`your collection to appear to them. A maximum of ${10} ` +
          i`search terms can be provided for one collection.`
        }
      >
        <TextInput
          value={searchQueries}
          placeholder={i`Enter search terms of your collection`}
          onChange={onSearchTermsChange}
          className={css(styles.input)}
          height={100}
          isTextArea
          tokenize
        />
        {suggestionScoreField}
        <CollectionBoostSearchTermSuggestion
          showSuggestion={showSuggestion}
          suggestionsMap={suggestionsMap}
          suggestionTerms={suggestionInfo.suggestionTerms}
          suggestionMessage={suggestionInfo.suggestionMessage}
        />
      </HorizontalField>
      <HorizontalField
        title={i`Related Products (optional, separated by comma)`}
        centerTitleVertically
        className={css(styles.topMargin)}
        popoverContent={
          i`This is an optional field. You can include at most ${10} products that ` +
          i`you found on Wish that you want your collection to be linked to. You ` +
          i`can either provide product IDs (e.g '5f3de6b76fa88ca0cb400000') or ` +
          i`links/URLs to the products on Wish. It helps the system to learn ` +
          i`more about your collection. We highly recommend you use this field ` +
          i`to promote your collection to the target customers.`
        }
      >
        <TextInput
          value={relatedProducts}
          placeholder={i`Enter related product ID (e.g 5f3de6b76fa88ca0cb400000,5f3de6b76fa88ca0cb400001)`}
          onChange={({ text }: OnTextChangeEvent) => {
            collection.relatedProducts = text;
          }}
          className={css(styles.input)}
          height={100}
          isTextArea
          tokenize
        />
      </HorizontalField>
    </div>
  );
};

export default observer(CollectionBasics);

const useStylesheet = () => {
  const { textBlack, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        input: {
          width: "60%",
        },
        scoreBar: {
          width: "60%",
          marginTop: 5,
          marginBottom: 5,
        },
        topMargin: {
          marginTop: 20,
        },
        leftMargin: {
          marginLeft: 10,
        },
        verticalMargin: {
          margin: "10px 0",
        },
        text: {
          color: textBlack,
          fontSize: 16,
          fontWeight: weightMedium,
        },
        greyText: {
          color: textLight,
          fontSize: 16,
          fontWeight: weightMedium,
        },
        flexRow: {
          display: "flex",
          alignItems: "center",
        },
        createCampaignTip: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
        },
        createCampaignTipText: {
          fontSize: 14,
          color: textBlack,
        },
      }),
    [textBlack, textLight],
  );
};
