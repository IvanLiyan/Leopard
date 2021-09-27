import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Info,
  Button,
  PillRow,
  Popover,
  SearchBox,
  FilterButton,
  CheckboxGrid,
  PageIndicator,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { useIntQueryParam, useStringQueryParam } from "@toolkit/url";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { Locale } from "@toolkit/locales";

/* Merchant Components */
import MerchantAppTableResults from "@merchant/component/external/merchant-apps/store/MerchantAppTableResults";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";

/* Merchant Model */
import {
  categoriesOptions,
  CategoryOption,
} from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import { supportedLanguagesOptions } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";
import { AllowedLocales } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";

import { MerchantAppListing } from "@merchant/api/merchant-apps";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

const PageSize = 18;

type MerchantAppTableProps = BaseProps;

const MerchantAppTable = (props: MerchantAppTableProps) => {
  const styles = useStylesheet(props);
  const { locale } = useLocalizationStore();

  let initialSelectedLocale = new Set([locale]);
  if (!AllowedLocales.includes(locale)) {
    initialSelectedLocale = new Set(["en"]);
  }

  const [searchQueryParam, setSearchQuery] = useStringQueryParam(
    "search_query"
  );
  const [offsetParam, setOffset] = useIntQueryParam("offset");
  const offset = Math.max(0, offsetParam || 0);
  const searchQuery = searchQueryParam || "";

  const [isLoading, setIsLoading] = useState(true);
  const [merchantApps, setMerchantApps] = useState<MerchantAppListing[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [searchThrottle, setSearchThrottle] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [selectedCategories, setSelectedCategories] = useState(new Set([]));
  const [selectedLanguages, setSelectedLanguages] = useState(
    initialSelectedLocale
  );
  const [availableCategories, setAvailableCategories] = useState<
    CategoryOption[]
  >([]);

  let warnLanguageFilter = false;
  if (totalCount < 4 && selectedLanguages.size > 0) {
    warnLanguageFilter = true;
  }

  useEffect(() => {
    const fetchData = async () => {
      const resp = await merchantAppsApi.getCategories().call();
      const categories = resp.data?.categories || [];
      setAvailableCategories(
        categoriesOptions.filter((option) => {
          return categories.includes(option.value);
        })
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const resp = await merchantAppsApi
        .getMerchantAppListing({
          start: offset,
          count: PageSize,
          search_query: searchQuery,
          categories: Array.from(selectedCategories),
          languages: Array.from(selectedLanguages),
        })
        .call();

      const data = resp.data;
      if (data) {
        let apps = [...data.results.rows];
        if (offset == 0 || apps.length > 0) {
          if (offset == 0 && apps.length > 0 && selectedLanguages.has("zh")) {
            // Reverse order of the top 8 ERPs
            const firstApps = apps.splice(0, 6).sort(() => {
              return 0.5 - Math.random();
            });
            apps = [...firstApps, ...apps];
          }
          const numResults = data.results.num_results;
          setMerchantApps(apps);
          setHasNext(!data.results.feed_ended);
          setTotalCount(numResults);
          setLastPage(numResults ? Math.floor((numResults - 1) / PageSize) : 0);
        } else {
          setOffset(0);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [selectedCategories, selectedLanguages, offset, searchQuery, setOffset]);

  //Clean up timeout
  useEffect(() => {
    if (searchThrottle) {
      return () => clearTimeout(searchThrottle);
    }
  }, [searchThrottle]);

  const onSearchChange = ({ text }: OnTextChangeEvent) => {
    if (searchThrottle) {
      clearTimeout(searchThrottle);
    }
    setIsLoading(true);
    setSearchThrottle(
      setTimeout(() => {
        setOffset(0);
        setSearchQuery(text.trim());
      }, 750)
    );
  };

  // if you find this please fix the any types (legacy)
  const onCategoryChange = (selected: any) => {
    setSelectedCategories(new Set(selected));
    setOffset(0);
  };

  const onLanguagesChange = (value: Locale, checked: boolean) => {
    const languages = new Set(selectedLanguages);
    if (checked) {
      languages.add(value);
    } else {
      languages.delete(value);
    }
    setSelectedLanguages(languages);
    setOffset(0);
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.body)}>
        <div className={css(styles.topControls)}>
          <div className={css(styles.searchContainer)}>
            <SearchBox
              className={css(styles.searchBox)}
              onChange={onSearchChange}
              placeholder={i`Search`}
              height={40}
              defaultValue={searchQuery}
              icon="search"
            />
          </div>

          <div className={css(styles.buttons)}>
            <PageIndicator
              className={css(styles.pageIndicator)}
              isLoading={isLoading}
              totalItems={totalCount}
              rangeStart={offset + 1}
              rangeEnd={Math.min(totalCount, offset + PageSize)}
              hasNext={hasNext}
              hasPrev={offset != 0}
              onPageChange={(_nextPage: number) => {
                let nextPage = Math.max(0, _nextPage);
                nextPage = Math.min(lastPage, nextPage);
                setOffset(nextPage * PageSize);
              }}
              currentPage={offset / PageSize}
            />
          </div>
        </div>
        <div className={css(styles.filterRow)}>
          {availableCategories && (
            <div className={css(styles.filter)}>
              <PillRow
                onCheckedChanged={onCategoryChange}
                options={availableCategories}
                selected={selectedCategories}
              />
            </div>
          )}
          <div className={css(styles.filter)}>
            <div className={css(styles.filterButtonGroup)}>
              {!isLoading && warnLanguageFilter && (
                <Info
                  text={
                    i`Your search is being filtered by supported languages. ` +
                    i`Change your filters to see more results.`
                  }
                  size={16}
                  position="left"
                  sentiment="error"
                />
              )}
              <Popover
                position="bottom center"
                on="click"
                closeOnMouseLeave={false}
                popoverContent={() => (
                  <>
                    <CheckboxGrid
                      options={supportedLanguagesOptions}
                      onCheckedChanged={onLanguagesChange}
                      selected={Array.from(selectedLanguages)}
                    />
                    <Button
                      style={{ margin: 10 }}
                      onClick={() => {
                        window.dispatchEvent(
                          // eslint-disable-next-line local-rules/unwrapped-i18n
                          new KeyboardEvent("keyup", { key: "Escape" })
                        );
                      }}
                    >
                      Close
                    </Button>
                  </>
                )}
              >
                <div className={css(styles.filtersPopover)}>
                  <section className={css(styles.title)}>
                    Supported languages
                  </section>

                  <FilterButton style={styles.filterButton}>
                    More filters
                  </FilterButton>
                </div>
              </Popover>
            </div>
          </div>
        </div>
        {merchantApps && (
          <MerchantAppTableResults
            merchantApps={merchantApps}
            isLoading={isLoading}
            selectedLanguages={Array.from(selectedLanguages)}
          />
        )}
      </div>
    </div>
  );
};

export default observer(MerchantAppTable);

const useStylesheet = (props: MerchantAppTableProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.white,
          justifyContent: "center",
        },
        body: {
          backgroundColor: colors.pageBackground,
          margin: "15px 12% 50px",
          padding: "30px 3%",
          maxWidth: 1300,
        },
        filterButtonGroup: {
          display: "flex",
          alignItems: "center",
        },
        filterButton: {
          marginLeft: 10,
          padding: "4px 15px",
        },
        filtersPopover: {
          padding: 20,
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          marginBottom: 20,
        },
        filterRow: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        topControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          "@media (max-width: 600px)": {
            flexDirection: "column",
          },
        },
        filter: {
          marginTop: 25,
        },
        searchContainer: {
          display: "flex",
          flexDirection: "row",
          marginRight: 20,
          flex: 1,
          "@media (max-width: 600px)": {
            marginBottom: 10,
            marginRight: 0,
          },
        },
        searchBox: {
          fontWeight: fonts.weightBold,
          maxWidth: 950,
          width: "100%",
        },
        buttons: {
          display: "flex",
          flexDirection: "row",
        },
        pageIndicator: {
          alignSelf: "stretch",
        },
      }),
    []
  );
};
