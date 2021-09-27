import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { CheckboxGroupField } from "@ContextLogic/lego";
import { DayRangePickerInput } from "@ContextLogic/lego";
import { FormField } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

/* Merchant Components */
import CampaignStatusLabel from "@merchant/component/product-boost/CampaignStatusLabel";

import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MarketingCampaignState } from "@schema/types";
import { useProductBoostStore } from "@merchant/stores/product-boost/ProductBoostStore";
import {
  useProductBoostMerchantInfo,
  useProductBoostProperty,
} from "@merchant/stores/product-boost/ProductBoostContextStore";

type CampaignsFilterProps = BaseProps & {
  readonly onCampaignUpdated: () => Promise<unknown>;
};

const CampaignsFilter = (props: CampaignsFilterProps) => {
  const [bodyRef, setBodyRef] = useState<HTMLDivElement | null>(null);
  const [startDateRef, setStartDateRef] = useState<HTMLDivElement | null>(null);
  const [endDateRef, setEndDateRef] = useState<HTMLDivElement | null>(null);
  const { className } = props;

  const styles = useStyleSheet();
  const merchantInfo = useProductBoostMerchantInfo();
  const campaignInfo = useProductBoostProperty();
  const { filterSetting, listElements } = useProductBoostStore();

  if (merchantInfo == null || campaignInfo == null) {
    return (
      <div className={css(styles.loading)}>
        <LoadingIndicator />
      </div>
    );
  }

  const hasAutomatedCampaign =
    merchantInfo.marketing.currentMerchant.hasAutomatedCampaign;
  const maxStartDate = new Date(
    campaignInfo.campaignProperty.maxStartDate.unix * 1000
  );
  const maxNumWeeks = campaignInfo.campaignProperty.maxNumWeeks;

  const campaignStatuses = [
    {
      value: "NEW",
      title: () => {
        return <CampaignStatusLabel status={"NEW"} />;
      },
    },
    {
      value: "SAVED",
      title: () => {
        return <CampaignStatusLabel status={"SAVED"} />;
      },
    },
    {
      value: "STARTED",
      title: () => {
        return <CampaignStatusLabel status={"STARTED"} />;
      },
    },
    {
      value: "PENDING",
      title: () => {
        return <CampaignStatusLabel status={"PENDING"} />;
      },
    },
    {
      value: "ENDED",
      title: () => {
        return <CampaignStatusLabel status={"ENDED"} />;
      },
    },
  ];

  const autoRenewFilters = [
    {
      value: 0,
      title: i`Yes`,
    },
    {
      value: 1,
      title: i`No`,
    },
  ];

  const automatedFilters = [
    {
      value: 0,
      title: i`Yes`,
    },
    {
      value: 1,
      title: i`No`,
    },
  ];

  const renderHeader = () => {
    const { deselectAllFilters, hasActiveFilters } = filterSetting;
    return (
      <div className={css(styles.header)}>
        <section className={css(styles.title)}>Campaign Filters</section>
        {hasActiveFilters && (
          <Button
            onClick={deselectAllFilters}
            disabled={false}
            hideBorder
            style={{ padding: "7px 0px", color: palettes.textColors.DarkInk }}
          >
            Deselect all
          </Button>
        )}
      </div>
    );
  };

  const renderCampaignStatusField = () => {
    return (
      <CheckboxGroupField
        className={css(styles.filter)}
        title={i`Campaign Status`}
        options={campaignStatuses}
        onChecked={(option: OptionType<MarketingCampaignState>) => {
          const typeSet = new Set(filterSetting.campaignStatuses);
          const status = option.value;
          if (typeSet.has(status)) {
            typeSet.delete(status);
          } else {
            typeSet.add(status);
          }
          filterSetting.offset = 0;
          filterSetting.campaignStatuses = Array.from(typeSet);
          listElements.expandedRows.clear();
        }}
        selected={filterSetting.campaignStatuses}
      />
    );
  };

  const renderAutoRenewField = () => {
    return (
      <CheckboxGroupField
        className={css(styles.filter)}
        title={ci18n("ProductBoost campaign auto renew", "Auto Renew")}
        options={autoRenewFilters}
        onChecked={(option: OptionType<number>) => {
          const typeSet = new Set(filterSetting.autoRenewFilters);
          const value = option.value;
          if (typeSet.has(value)) {
            typeSet.delete(value);
          } else {
            typeSet.add(value);
          }
          filterSetting.offset = 0;
          filterSetting.autoRenewFilters = Array.from(typeSet);
          listElements.expandedRows.clear();
        }}
        selected={filterSetting.autoRenewFilters}
      />
    );
  };

  const renderAutomatedField = () => {
    return (
      <CheckboxGroupField
        className={css(styles.filter)}
        title={i`Automated`}
        options={automatedFilters}
        onChecked={(option: OptionType<number>) => {
          const typeSet = new Set(filterSetting.automatedFilters);
          const value = option.value;
          if (typeSet.has(value)) {
            typeSet.delete(value);
          } else {
            typeSet.add(value);
          }
          filterSetting.offset = 0;
          filterSetting.automatedFilters = Array.from(typeSet);
          listElements.expandedRows.clear();
        }}
        selected={filterSetting.automatedFilters}
      />
    );
  };

  const renderStartDateFields = () => {
    return (
      <FormField className={css(styles.datePicker)} title={i`Start Date`}>
        <div
          ref={(ref) => {
            setStartDateRef(ref);
          }}
          onClick={() => {
            if (bodyRef != null && startDateRef != null) {
              bodyRef.scrollTo({
                top: startDateRef.offsetTop - 60,
                behavior: "smooth",
              });
            }
          }}
        >
          <DayRangePickerInput
            height={28}
            onDayRangeChange={(
              fromDate: Date | null | undefined,
              toDate: Date | null | undefined
            ) => {
              filterSetting.offset = 0;
              filterSetting.fromStartDate = fromDate;
              filterSetting.toStartDate = toDate;
              listElements.expandedRows.clear();
            }}
            dayPickerProps={{
              showOutsideDays: true,
              disabledDays: [
                {
                  after: maxStartDate,
                },
              ],
            }}
            inputProps={{
              height: 28,
            }}
            fromDate={filterSetting.fromStartDate}
            toDate={filterSetting.toStartDate}
          />
        </div>
      </FormField>
    );
  };

  const renderEndDateFields = () => {
    const { fromStartDate } = filterSetting;
    const minEndDate = fromStartDate
      ? moment(fromStartDate).add(1, "day").toDate()
      : null;
    const maxEndDate = moment(new Date(maxStartDate))
      .add(7 * maxNumWeeks, "day")
      .toDate();
    return (
      <FormField className={css(styles.datePicker)} title={i`End Date`}>
        <div
          ref={(ref) => {
            setEndDateRef(ref);
          }}
          onClick={() => {
            if (bodyRef != null && endDateRef != null) {
              bodyRef.scrollTo({
                top: endDateRef.offsetTop - 60,
                behavior: "smooth",
              });
            }
          }}
        >
          <DayRangePickerInput
            height={28}
            onDayRangeChange={(
              fromDate: Date | null | undefined,
              toDate: Date | null | undefined
            ) => {
              filterSetting.offset = 0;
              filterSetting.fromEndDate = fromDate;
              filterSetting.toEndDate = toDate;
              listElements.expandedRows.clear();
            }}
            dayPickerProps={{
              showOutsideDays: true,
              disabledDays: [
                {
                  before: minEndDate,
                  after: maxEndDate,
                },
              ],
            }}
            inputProps={{
              height: 28,
            }}
            fromDate={filterSetting.fromEndDate}
            toDate={filterSetting.toEndDate}
          />
        </div>
      </FormField>
    );
  };

  const renderBody = () => {
    return (
      <div
        className={css(styles.body)}
        ref={(ref) => {
          setBodyRef(ref);
        }}
      >
        {renderCampaignStatusField()}
        {renderAutoRenewField()}
        {hasAutomatedCampaign && renderAutomatedField()}
        {renderStartDateFields()}
        {renderEndDateFields()}
      </div>
    );
  };

  const renderFooter = () => {
    const { onCampaignUpdated } = props;
    return (
      <div className={css(styles.footer)}>
        <Button
          onClick={() => {
            // eslint-disable-next-line local-rules/unwrapped-i18n
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
          disabled={false}
          className={css(styles.cancelButton)}
        >
          Cancel
        </Button>
        <PrimaryButton
          onClick={() => {
            onCampaignUpdated();
            // eslint-disable-next-line local-rules/unwrapped-i18n
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
          style={styles.applyButton}
        >
          Apply filters
        </PrimaryButton>
      </div>
    );
  };

  return (
    <div className={css(styles.root, className)}>
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </div>
  );
};

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "20px 20px 0px 20px",
        },
        body: {
          maxHeight: 388,
          overflow: "scroll",
          overflowX: "hidden",
          padding: "0px 20px",
        },
        footer: {
          borderTop: "1px solid #c4cdd5",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "flex-end",
          padding: 16,
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          height: 28,
          cursor: "default",
          userSelect: "none",
          alignSelf: "center",
          textAlign: "center",
        },
        filter: {
          paddingBottom: 16,
          marginTop: 16,
        },
        datePicker: {
          paddingBottom: 16,
          marginTop: 16,
        },
        cancelButton: {
          margin: 4,
          padding: "7px 20px",
          borderRadius: 3,
          color: palettes.textColors.DarkInk,
        },
        applyButton: {
          margin: 4,
        },
        loading: {
          margin: 10,
        },
      }),
    []
  );
};

export default observer(CampaignsFilter);
