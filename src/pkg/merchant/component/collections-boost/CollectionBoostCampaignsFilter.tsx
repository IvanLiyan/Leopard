import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Button,
  Popover,
  FormField,
  FilterButton,
  PrimaryButton,
  DayPickerInput,
  CheckboxGroupField,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import CollectionBoostStatusLabel from "@merchant/component/collections-boost/CollectionBoostStatusLabel";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { CollectionsBoostCampaignState } from "@merchant/api/collections-boost";

/* Merchant Store */
import LocalizationStore from "@merchant/stores/LocalizationStore";

type CampaignsFilterProps = BaseProps & {
  readonly filterStates: ReadonlyArray<CollectionsBoostCampaignState>;
  readonly filterStartDate: Date | undefined | null;
  readonly filterEndDate: Date | undefined | null;
  readonly onFilterChange: (arg: {
    toggleState?: OptionType<CollectionsBoostCampaignState>;
    toStartDate?: Date;
    toEndDate?: Date;
  }) => void;
  readonly onDeselectAll: () => void;
  readonly onApplyFilter: () => void;
};

const CollectionBoostCampaignsFilter = (props: CampaignsFilterProps) => {
  const {
    className,
    filterStates,
    filterStartDate,
    filterEndDate,
    onFilterChange,
    onDeselectAll,
    onApplyFilter,
  } = props;
  const styles = useStyleSheet();
  const { textBlack, primary, borderPrimaryDark } = useTheme();
  const filterOptions = useFilterOptions();

  const hasActiveFilters =
    filterStates.length > 0 ||
    (filterStartDate != undefined && filterStartDate != null) ||
    (filterEndDate != undefined && filterEndDate != null);

  const { locale } = LocalizationStore.instance();

  const renderFilterHeader = () => (
    <div className={css(styles.header)}>
      <section className={css(styles.title)}>Campaign Filter</section>
      {hasActiveFilters && (
        <Button
          onClick={onDeselectAll}
          disabled={false}
          hideBorder
          style={{ padding: "7px 0px", color: textBlack }}
        >
          Deselect All
        </Button>
      )}
    </div>
  );

  const renderFilterBody = () => (
    <div className={css(styles.body)}>
      <CheckboxGroupField
        className={css(styles.filter)}
        title={i`Campaign Status`}
        options={filterOptions}
        onChecked={(state: OptionType<CollectionsBoostCampaignState>) => {
          onFilterChange({ toggleState: state });
        }}
        selected={filterStates}
      />
      <FormField title={i`Start Date`}>
        <DayPickerInput
          value={filterStartDate || undefined}
          onDayChange={(startDate) => {
            onFilterChange({ toStartDate: startDate });
          }}
          locale={locale}
        />
      </FormField>
      <FormField title={i`End Date`}>
        <DayPickerInput
          value={filterEndDate || undefined}
          onDayChange={(endDate) => {
            onFilterChange({ toEndDate: endDate });
          }}
          locale={locale}
        />
      </FormField>
    </div>
  );

  const renderFilterFooter = () => (
    <div className={css(styles.footer)}>
      <PrimaryButton
        className={css(styles.button)}
        onClick={() => {
          onApplyFilter();
          // eslint-disable-next-line local-rules/unwrapped-i18n
          window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
        }}
      >
        Apply Filter
      </PrimaryButton>
    </div>
  );

  return (
    <Popover
      position="bottom right"
      on="click"
      contentWidth={300}
      closeOnMouseLeave={false}
      popoverContent={() => (
        <div className={css(styles.root, className)}>
          {renderFilterHeader()}
          {renderFilterBody()}
          {renderFilterFooter()}
        </div>
      )}
    >
      <FilterButton
        style={[
          styles.filterButton,
          {
            padding: "4px 15px",
            color: hasActiveFilters ? primary : textBlack,
          },
        ]}
        isActive={hasActiveFilters}
        borderColor={hasActiveFilters ? primary : borderPrimaryDark}
      />
    </Popover>
  );
};

export default observer(CollectionBoostCampaignsFilter);

const useFilterOptions = (): ReadonlyArray<
  OptionType<CollectionsBoostCampaignState>
> => {
  return useMemo(
    () => [
      {
        value: "NEW",
        title: () => <CollectionBoostStatusLabel status="NEW" />,
      },
      {
        value: "VALIDATING",
        title: () => <CollectionBoostStatusLabel status="VALIDATING" />,
      },
      {
        value: "STARTED",
        title: () => <CollectionBoostStatusLabel status="STARTED" />,
      },
      {
        value: "ENDED",
        title: () => <CollectionBoostStatusLabel status="ENDED" />,
      },
      {
        value: "CANCELED",
        title: () => <CollectionBoostStatusLabel status="CANCELED" />,
      },
    ],
    []
  );
};

const useStyleSheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          borderBottom: "1px solid #c4cdd5",
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: 10,
        },
        body: {
          maxHeight: 350,
          overflow: "scroll",
          overflowX: "hidden",
          padding: "10px 20px",
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
          color: textBlack,
          fontSize: 20,
          alignSelf: "center",
          textAlign: "center",
        },
        filter: {
          paddingBottom: 16,
          marginTop: 16,
          marginRight: 10,
        },
        button: {
          margin: 5,
        },
        filterButton: {
          alignSelf: "stretch",
        },
      }),
    [textBlack]
  );
};
