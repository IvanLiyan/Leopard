import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";
import * as fonts from "@toolkit/fonts";
import * as illustrations from "@assets/illustrations";
import {
  palettes,
  pageBackground,
  white,
} from "@toolkit/lego-legacy/DEPRECATED_colors";
import { useStringArrayQueryParam, useStringQueryParam } from "@toolkit/url";

/* Merchant Components */
import AnnouncementDetail from "@merchant/component/announcements/AnnouncementDetail";

/* Merchant API */
import * as announcementAPI from "@merchant/api/announcements";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* SVGs */
import starIcon from "@assets/img/fbw/star.svg";
import calendarIcon from "@assets/img/this-week.svg";
import { Announcement } from "@merchant/api/announcements";

const SORT_TYPE_IMPORTANT = "1";
const SORT_TYPE_RECENT = "2";

export const programTypeToImgUrlMap: {
  [type in announcementAPI.ProgramType]: string;
} = {
  ADVANCED_LOGISTICS_PROGRAM: illustrations.advancedLogistics,
  EPC: illustrations.epc,
  FBW_FBS: illustrations.fbw2,
  MERCHANT_STANDING: illustrations.platinumMerchantStanding,
  PARTIAL_REFUNDS: illustrations.refunds,
  PRODUCTBOOST: illustrations.productBoostDarkBlue,
  RETURNS_PROGRAM: illustrations.returns,
  WISH_EXPRESS: illustrations.wishExpressBlueBox,
  WISHPOST: illustrations.wishPost,
};

const AnnouncementsContainer = () => {
  const [sortType, setSortType] = useStringQueryParam("sort", SORT_TYPE_RECENT);
  const [categoriesChecked, setCategoriesChecked] = useStringArrayQueryParam(
    "categories"
  );
  const [programsChecked, setProgramsChecked] = useStringArrayQueryParam(
    "programs"
  );

  // can get here through 1. /api-announcements, 2. /announcements, 3. /release-notes
  const { announcementRoute } = usePathParams("/:announcementRoute");
  const { locationParamType } = usePathParams(
    "/announcements/:locationParamType"
  );

  // We can access this via /release-notes too, which should default to system-update
  const annType = locationParamType || "system-update";

  const [response] = useRequest(
    announcementAPI.getAnnouncementsList({
      ann_type: annType,
      is_api_announcement: announcementRoute === "api-announcements",
      is_dashboard_mode: undefined,
    })
  );

  const responseData = response?.data;

  const announcements: ReadonlyArray<announcementAPI.Announcement> = useMemo(
    () => response?.data?.results.announcement_dicts || [],
    [response?.data?.results.announcement_dicts]
  );
  const hasTags = response?.data?.results.has_tags;

  const sortedAnnouncements: Array<announcementAPI.Announcement> = useMemo(() => {
    const copiedAnnouncements = [...announcements];

    if (sortType === SORT_TYPE_RECENT) {
      copiedAnnouncements.sort((a, b) => a.created - b.created);
      return copiedAnnouncements;
    }

    // SORT_TYPE_IMPORTANT
    const importantAnnouncements: Announcement[] = [];
    const regularAnnouncements: Announcement[] = [];
    copiedAnnouncements.forEach((ann) => {
      if (ann.important) {
        importantAnnouncements.push(ann);
      } else {
        regularAnnouncements.push(ann);
      }
    });

    // they should already be sorted by creation date
    return [...importantAnnouncements, ...regularAnnouncements];
  }, [announcements, sortType]);

  const isMerchSystemUpdate = annType === "system-update" && hasTags;

  const styles = useStylesheet();

  const categoriesDict = response?.data?.results.categories_dict;
  const programsDict = response?.data?.results.programs_dict;
  if (responseData == null || categoriesDict == null || programsDict == null) {
    return <LoadingIndicator className={css(styles.loading)} />;
  }

  const sortedCategoryTypes = Object.keys(categoriesDict).sort();
  const sortedProgramTypes = Object.keys(programsDict).sort();

  const renderAnnouncements = () => {
    const areAllUnchecked =
      categoriesChecked.length === 0 && programsChecked.length === 0;

    return (
      sortedAnnouncements &&
      sortedAnnouncements.map((ann) => {
        const showAnnouncement =
          areAllUnchecked ||
          (ann.categories &&
            ann.categories.some((category) =>
              categoriesChecked.includes(category[0])
            )) ||
          (ann.program && programsChecked.includes(ann.program[0]));

        return (
          showAnnouncement && (
            <AnnouncementDetail
              key={ann.id}
              announcement={ann}
              className={css(styles.announcement)}
            />
          )
        );
      })
    );
  };

  const handleCategoryCheckChange = (
    checked: boolean,
    category: announcementAPI.CategoryType
  ) => {
    if (checked) {
      setCategoriesChecked([...categoriesChecked, category]);
    } else {
      setCategoriesChecked(categoriesChecked.filter((c) => c !== category));
    }
  };

  const handleProgramCheckChange = (
    checked: boolean,
    program: announcementAPI.ProgramType
  ) => {
    if (checked) {
      setProgramsChecked([...programsChecked, program]);
    } else {
      setProgramsChecked(programsChecked.filter((p) => p !== program));
    }
  };

  const handleClearFilters = () => {
    setProgramsChecked([]);
    setCategoriesChecked([]);
  };

  // if you find this please fix the any types (legacy)
  const handleSortChange = (selectedValue: any) => {
    setSortType(selectedValue);
  };

  const headerBody = isMerchSystemUpdate
    ? i`You can read all of the announcements & system updates here. ` +
      i`Pro-tip, for a quick search on one or multiple topics, you can ` +
      i`apply the tags listed below. `
    : i`You can read all of the announcements or system updates here.`;

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.top)}>
        <WelcomeHeader
          hideBorder
          title={i`Announcements`}
          body={headerBody}
          illustration="thirdPartyBrandedGoodsDeclaration"
        />
        {isMerchSystemUpdate && (
          <div className={css(styles.sortContainer)}>
            <div className={css(styles.sortSelectLabel)}>Sort By</div>
            <div className={css(styles.sortSelectWrapper)}>
              <Select
                options={[
                  {
                    value: SORT_TYPE_IMPORTANT,
                    text: i`Important`,
                    img: starIcon,
                  },
                  {
                    value: SORT_TYPE_RECENT,
                    text: i`Recent`,
                    img: calendarIcon,
                  },
                ]}
                onSelected={(selectedValue) => {
                  handleSortChange(selectedValue);
                }}
                selectedValue={sortType}
                minWidth={150}
              />
            </div>
          </div>
        )}
      </div>
      <div
        className={css(
          styles.contentContainer,
          !isMerchSystemUpdate ? styles.noFilter : ""
        )}
      >
        {isMerchSystemUpdate && (
          <Card className={css(styles.filtersContainer)}>
            <div className={css(styles.filtersTop)}>
              <div className={css(styles.filterListTitle)}>Categories</div>
              <div
                className={css(styles.clearBtn)}
                onClick={handleClearFilters}
              >
                Clear
              </div>
            </div>
            <div className={css(styles.filtersList)}>
              {sortedCategoryTypes.map((categoryType) => {
                return (
                  <CheckboxField
                    className={css(styles.checkbox)}
                    key={categoryType}
                    // if you find this please fix the any types (legacy)
                    title={(categoriesDict as any)[categoryType]}
                    onChange={(checked) => {
                      handleCategoryCheckChange(
                        checked,
                        categoryType as announcementAPI.CategoryType
                      );
                    }}
                    checked={categoriesChecked.includes(categoryType)}
                  />
                );
              })}
            </div>
            <div className={css(styles.filtersTop, styles.programsTitle)}>
              <div className={css(styles.filterListTitle)}>Programs</div>
            </div>
            <div className={css(styles.filtersList)}>
              {sortedProgramTypes.map((programType) => {
                return (
                  <CheckboxField
                    className={css(styles.checkbox)}
                    key={programType}
                    // if you find this please fix the any types (legacy)
                    title={(programsDict as any)[programType]}
                    onChange={(checked) => {
                      handleProgramCheckChange(
                        checked,
                        programType as announcementAPI.ProgramType
                      );
                    }}
                    checked={programsChecked.includes(programType)}
                    // if you find this please fix the any types (legacy)
                    icon={(programTypeToImgUrlMap as any)[programType]}
                  />
                );
              })}
            </div>
          </Card>
        )}
        <div className={css(styles.announcementsContainer)}>
          {renderAnnouncements()}
        </div>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { dimenStore } = useStore();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
          fontFamily: fonts.proxima,
          paddingBottom: 76,
        },
        top: {
          marginBottom: 40,
        },
        header: {
          borderBottom: "none",
        },
        sortSelectWrapper: {
          width: 210, // eslint-disable-line local-rules/no-frozen-width
          marginLeft: 12,
        },
        sortSelectLabel: {
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0",
          color: palettes.textColors.DarkInk,
          fontWeight: fonts.weightMedium,
        },
        sortContainer: {
          paddingLeft: dimenStore.pageGuideX,
          height: 80,
          backgroundColor: white,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        contentContainer: {
          display: "flex",
          flexDirection: "row",
          margin: `0px ${dimenStore.pageGuideX}`,
          alignItems: "flex-start",
        },
        filtersContainer: {
          padding: 24,
          marginRight: 24,
          minWidth: 250,
        },
        checkbox: {
          padding: "8px 0",
        },
        programsTitle: {
          marginTop: 24,
        },
        filtersTop: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
        },
        filterListTitle: {
          width: 110,
          height: 28,
          fontSize: 20,
          fontWeight: fonts.weightBold,
          fontStretch: "normal",
          fontStyle: "normal",
          lineHeight: 1.4,
          letterSpacing: "normal",
          color: palettes.textColors.Ink,
        },
        noFilter: {
          display: "flex",
          justifyContent: "center",
        },
        clearBtn: {
          width: 75,
          height: 18,
          fontSize: 14,
          fontWeight: fonts.weightSemibold,
          fontStretch: "normal",
          fontStyle: "normal",
          lineHeight: 1.29,
          letterSpacing: "normal",
          textAlign: "right",
          color: palettes.textColors.DarkInk,
          cursor: "pointer",
        },
        filtersList: {},
        announcementsContainer: {
          maxWidth: 900,
          marginBottom: 20,
        },
        announcement: {
          marginBottom: 20,
        },
        loading: {
          margin: "300px 50%",
        },
      }),
    [dimenStore.pageGuideX]
  );
};

export default observer(AnnouncementsContainer);
