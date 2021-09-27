/*
 *
 * FulfillmentSettingsContainer.tsx
 * Merchant Web
 *
 * Created by Sola Ogunsakin on 1/20/${currentYear}
 * Copyright © ${currentYear}-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  H5,
  Card,
  Text,
  Markdown,
  EditButton,
  HorizontalField,
} from "@ContextLogic/lego";
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";

import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";
import {
  InitialData,
  FulfillmentSettingNames,
  getCurrentFulfillmentSetting,
  getAvailableFulfillmentSettings,
} from "@toolkit/fulfillment-settings";
import { useTheme } from "@merchant/stores/ThemeStore";
import EducationCard from "@merchant/component/fulfillment-settings/EducationCard";
import DefaultSettingTip from "@merchant/component/fulfillment-settings/DefaultSettingTip";
import ScheduledSettingCard from "@merchant/component/fulfillment-settings/ScheduledSettingCard";
import ProductImpressionMeter from "@merchant/component/fulfillment-settings/ProductImpressionMeter";
import EditFulfillmentSettingsModal from "@merchant/component/fulfillment-settings/EditFulfillmentSettingsModal";

type InitialProps = {
  readonly initialData: InitialData;
};

const FulfillmentSettingsContainer: React.FC<InitialProps> = ({
  initialData,
}: InitialProps) => {
  const { currentMerchant } = initialData;
  const styles = useStylesheet();
  const currentSetting = getCurrentFulfillmentSetting(currentMerchant);
  const {
    fulfillmentExtension: { extensionDays, extensionDeadlineDate },
  } = currentMerchant;

  const currentYear = new Date().getFullYear();

  const description: string = useMemo((): string => {
    const availableSettings = getAvailableFulfillmentSettings(currentMerchant);
    const baseDescription =
      i`View and edit your Vacation Settings below. Please note that ` +
      i`your setting directly affects product impressions for your store.`;
    if (
      availableSettings.includes("CNY_EXTENSION_OPTION_1") ||
      availableSettings.includes("CNY_EXTENSION_OPTION_2")
    ) {
      const extensionClause =
        i`For the two Extension Options available to Mainland ` +
        i`China-based merchants for the ${currentYear} Chinese New Year holiday, you may ` +
        i`change your selections by February 2, ${currentYear} 12:00AM Beijing Time. The ` +
        i`Extension Option you select does not apply to Wish Express, FBW, and ` +
        i`FBS orders. [Learn more](${zendeskURL("1260801500190")})`;
      return `${baseDescription} ${extensionClause}`;
    }
    return baseDescription;
  }, [currentMerchant, currentYear]);

  return (
    <PageRoot>
      <PageGuide>
        <div className={css(styles.root)}>
          <div className={css(styles.content)}>
            <div className={css(styles.settingsContainer)}>
              <H5 className={css(styles.title)}>Vacation Settings</H5>
              {["VACATION_MODE", "PRIMARY_WAREHOUSE_ON_VACATION"].includes(
                currentSetting
              ) && <DefaultSettingTip className={css(styles.tip)} />}
              <Card contentContainerStyle={css(styles.cardContent)}>
                <div className={css(styles.cardContentInner)}>
                  <Markdown text={description} openLinksInNewTab />
                  <div className={css(styles.settingsItems)}>
                    <HorizontalField
                      titleAlign="start"
                      titleWidth={200}
                      className={css(styles.settingField)}
                      title={() => (
                        <Text
                          className={css(styles.settingTitleStyle)}
                          weight="semibold"
                        >
                          Current setting
                        </Text>
                      )}
                    >
                      <Text>{FulfillmentSettingNames[currentSetting]}</Text>
                      <ScheduledSettingCard
                        initialData={initialData}
                        className={css(styles.detailCard)}
                      />
                    </HorizontalField>
                    {currentSetting == "CNY_EXTENSION_OPTION_1" &&
                      extensionDays != null && (
                        <HorizontalField
                          titleAlign="start"
                          centerTitleVertically
                          titleWidth={200}
                          className={css(styles.settingField)}
                          title={() => (
                            <Text
                              className={css(styles.settingTitleStyle)}
                              weight="semibold"
                            >
                              Number of extension days
                            </Text>
                          )}
                        >
                          <Text>{extensionDays}</Text>
                        </HorizontalField>
                      )}
                    {currentSetting == "CNY_EXTENSION_OPTION_2" &&
                      extensionDeadlineDate != null && (
                        <HorizontalField
                          title={i`Extension deadline`}
                          titleAlign="start"
                          centerTitleVertically
                          titleWidth={200}
                          className={css(styles.settingField)}
                          titleStyle={css(styles.settingTitleStyle)}
                        >
                          <Text>{extensionDeadlineDate.mmddyyyy}</Text>
                        </HorizontalField>
                      )}
                    <HorizontalField
                      titleAlign="start"
                      centerTitleVertically
                      titleWidth={200}
                      className={css(styles.settingField)}
                      title={() => (
                        <Text
                          className={css(styles.settingTitleStyle)}
                          weight="semibold"
                        >
                          Product impression meter
                        </Text>
                      )}
                    >
                      <ProductImpressionMeter
                        currentSetting={currentSetting}
                        height={7}
                      />
                    </HorizontalField>
                  </div>
                </div>
                <div className={css(styles.cardBottomSection)}>
                  <EditButton
                    popoverContent={undefined}
                    onClick={() => {
                      new EditFulfillmentSettingsModal({
                        initialData,
                      }).render();
                    }}
                  >
                    Edit
                  </EditButton>
                </div>
              </Card>
            </div>
            <div className={css(styles.education)}>
              <H5 className={css(styles.title)}>Setting types</H5>
              <EducationCard initialData={initialData} />
            </div>
          </div>
        </div>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "20px 0px",
        },
        title: {
          margin: "15px 0",
        },
        content: {
          display: "grid",
          gridGap: 20,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "7fr 3fr",
            alignItems: "start",
          },
          marginBottom: 25,
        },
        settingsContainer: {
          display: "flex",
          flexDirection: "column",
        },
        cardContent: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        cardContentInner: {
          padding: 20,
          display: "flex",
          flexDirection: "column",
        },
        cardBottomSection: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 25,
          marginTop: 15,
          borderTop: `1px solid ${borderPrimary}`,
        },
        settingsItems: {
          margin: "20px 0px",
        },
        settingTitleStyle: {
          fontSize: 15,
          color: textBlack,
        },
        settingField: {
          margin: "15px 0px",
        },
        detailCard: {
          margin: "10px 0px",
        },
        education: {
          display: "flex",
          flexDirection: "column",
        },
        tip: {
          margin: "10px 0px",
        },
      }),
    [textBlack, borderPrimary]
  );
};

export default observer(FulfillmentSettingsContainer);
