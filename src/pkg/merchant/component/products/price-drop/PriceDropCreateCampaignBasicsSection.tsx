import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment-timezone";

/* Lego Components */
import { Checkbox } from "@ContextLogic/lego";
import { DayPickerInput } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import { PriceDropConstants } from "@toolkit/price-drop/constants";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import LocalizationStore from "@stores/LocalizationStore";

type PriceDropCreateCampaignBasicsSectionProps = BaseProps & {
  readonly autoRenew: boolean;
  readonly checkAutoRenew: (checked: boolean) => void;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly onStartDateChange: (date: Date) => void;
};

const PriceDropCreateCampaignBasicsSection = (
  props: PriceDropCreateCampaignBasicsSectionProps,
) => {
  const styles = useStylesheet();
  const {
    className,
    style,
    autoRenew,
    checkAutoRenew,
    startDate,
    endDate,
    onStartDateChange,
  } = props;

  const minDate = moment()
    .tz("America/Los_Angeles")
    .add(PriceDropConstants.CREATE_CAMPAIGN_DELAY_DAYS, "days");
  const maxDate = minDate
    .clone()
    .add(
      PriceDropConstants.CREATE_BY_MERCHANT_IMPRESSION_BOOSTER_DURATION - 1,
      "days",
    );
  const startDateDayPickerProps = {
    selectedDays: startDate,
    disabledDays: [{ before: minDate.toDate() }, { after: maxDate.toDate() }],
  };
  const formatDate = (date: Date): string => {
    return i`${date.toISOString().slice(0, 10)} 00:00 Pacific Time`;
  };

  const { locale } = LocalizationStore.instance();
  const isZh = locale === "zh";

  let propStr = "";
  if (isZh) {
    propStr =
      "我们将对该活动进行分析，以确保被降价的产品能够成功定位。获得批准后，该活动将持续7个自然日，具体取决于所选的开始日期。您可以在下方设置活动的开始日期。日期均以太平洋时间计算。";
  } else {
    propStr =
      i`This campaign will be analyzed to ensure Price Dropped product ` +
      i`is positioned for success. Upon approval, the campaign will run ` +
      i`for ${PriceDropConstants.CREATE_BY_MERCHANT_IMPRESSION_BOOSTER_DURATION} calendar ` +
      i`days depending on the chosen start date. You can set the campaign ` +
      i`start date below. Dates are in Pacific Time.`;
  }

  return (
    <div className={css(className, style)}>
      <div className={css(styles.text)}>{propStr}</div>

      <HorizontalField
        title={i`Start Date`}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        <DayPickerInput
          value={startDate}
          noEdit
          formatDate={formatDate}
          dayPickerProps={startDateDayPickerProps}
          onDayChange={onStartDateChange}
          locale={locale}
        />
      </HorizontalField>

      <HorizontalField
        title={i`End Date`}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        <TextInput value={formatDate(endDate)} disabled />
      </HorizontalField>

      <HorizontalField
        title={i`Auto-renew`}
        centerTitleVertically
        className={css(styles.verticalMargin)}
      >
        <div className={css(styles.flexRow)}>
          <Checkbox checked={autoRenew} onChange={checkAutoRenew} />
          <span className={css(styles.text, styles.leftMargin)}>
            <span>Auto renew this Price Drop campaign after completion</span>
          </span>
        </div>
      </HorizontalField>
    </div>
  );
};

export default observer(PriceDropCreateCampaignBasicsSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightMedium,
        },
        verticalMargin: {
          margin: "10px 0",
        },
        flexRow: {
          display: "flex",
          alignItems: "center",
        },
        leftMargin: {
          marginLeft: 10,
        },
      }),
    [],
  );
};
