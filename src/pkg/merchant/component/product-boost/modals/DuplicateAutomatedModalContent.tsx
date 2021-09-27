import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import moment from "moment/moment";
import hash from "object-hash";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { CurrencyInput } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { DayPickerInput } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import ModalHeader from "@merchant/component/core/modal/ModalHeader";
import { Link } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import BudgetBreakDownTable from "@merchant/component/product-boost/BudgetBreakDownTable";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Toolkit */
import BudgetValidator from "@toolkit/product-boost/validators/BudgetValidator";

import { OnTextChangeEvent } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { APIResponse } from "@toolkit/api";
import { CurrencyCode } from "@toolkit/currency";
import DimenStore from "@merchant/stores/DimenStore";
import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";

export type DuplicateAutomatedModalContentProps = BaseProps & {
  readonly campaignId: string;
  readonly campaignName: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly maxBudget: number;
  readonly onCampaignUpdated?: () => unknown;
  readonly onUpdateAllowedSpending?: () => unknown;
  readonly onClose?: () => unknown;
  readonly maxSpendingBreakdown: any;
  readonly maxAllowedSpending: number;
  readonly isPayable: boolean;
  readonly dupSource?: number | null;
  readonly currencyCode?: CurrencyCode;
  readonly productCount?: number;
  readonly minStartDate: Date;
  readonly maxStartDate: Date;
  readonly allowMaxboost: boolean;
  readonly maxNumWeeks: number;
};

const formatDate = (date: Date): string => {
  return moment(date).format("MM/DD/YYYY");
};
const formatApiDate = (date: Date): string => {
  return moment(date).format("YYYY-MM-DD");
};

const BUDGET_FIELD_WIDTH = 238;

@observer
class DuplicateAutomatedModalContent extends Component<
  DuplicateAutomatedModalContentProps
> {
  @observable
  actionButtonDisabled = true;

  @observable
  actionButtonLoading = false;

  @observable
  startDate: Date;

  @observable
  endDate: Date;

  @observable
  maxBudget: number;

  @observable
  isMaxboost = true;

  @observable
  minBudget: number | undefined;

  minStartDate: Date;
  maxStartDate: Date;

  maxNumWeeks: number;

  constructor(props: DuplicateAutomatedModalContentProps) {
    super(props);
    this.maxBudget = props.maxBudget;
    this.minStartDate = props.minStartDate;
    this.maxStartDate = props.maxStartDate;
    this.maxNumWeeks = props.maxNumWeeks;

    this.startDate = new Date(props.startDate);
    this.endDate = new Date(props.endDate);

    this.minStartDate =
      this.minStartDate > this.endDate ? this.minStartDate : this.endDate;
    this.maxStartDate =
      this.maxStartDate > this.endDate ? this.maxStartDate : this.endDate;

    this.startDate = this.minStartDate;
    this.endDate = moment(this.startDate)
      .add(this.maxNumWeeks, "weeks")
      .toDate();
    this.setMinBudget();
  }

  @action
  async setMinBudget() {
    const { campaignId, productCount, allowMaxboost } = this.props;
    const startDateStr = formatApiDate(this.startDate);
    const endDateStr = formatApiDate(this.endDate);
    const params = {
      campaign_id: campaignId,
      start_date: startDateStr,
      end_date: endDateStr,
      maxboost_product_count:
        allowMaxboost && this.isMaxboost ? productCount : 0,
    };

    let resp: APIResponse<
      productBoostApi.GetProductBoostCampaignBudgetInfoResult
    > | null = null;

    try {
      resp = await productBoostApi
        .getProductBoostCampaignBudgetInfo(params)
        .call();
    } catch (e) {
      this.minBudget = 0.43;
      return;
    }
    if (resp.code === 0 && resp.data) {
      this.minBudget = resp.data.min_budget;
    }
  }

  @computed
  get budgetValidator() {
    const { maxAllowedSpending, currencyCode } = this.props;

    return new BudgetValidator({
      oldBudget: 0,
      maxAllowedSpending,
      isNewState: true,
      minBudget: this.minBudget || 0,
      currencyCode: currencyCode ? currencyCode : "USD",
    });
  }

  @computed
  get dayPickerProps() {
    return {
      selectedDays: this.startDate,
      disabledDays: [
        {
          before: this.minStartDate,
        },
        {
          after: this.maxStartDate,
        },
      ],
    };
  }

  @computed
  get isSmallScreen(): boolean {
    const { isSmallScreen } = DimenStore.instance();
    return isSmallScreen;
  }

  @computed
  get tableSideMargin(): string {
    return this.isSmallScreen ? "25px" : "40px";
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        fontFamily: "Proxima",
      },
      title: {
        fontSize: 20,
        fontWeight: fonts.weightSemibold,
        margin: `12px 0`,
        lineHeight: 1.4,
        color: palettes.textColors.Ink,
        textAlign: this.isSmallScreen ? "center" : "left",
      },
      subtitle: {
        fontSize: 16,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.5,
        color: palettes.textColors.DarkInk,
      },
      horizontalTitle: {
        fontSize: !this.isSmallScreen ? 16 : 18,
        color: palettes.textColors.DarkInk,
        fontWeight: fonts.weightSemibold,
        cursor: "default",
        lineHeight: 1.5,
        textAlign: "right",
      },
      text: {
        fontSize: 16,
        fontWeight: fonts.weightMedium,
      },
      sideMargin: {
        marginLeft: this.tableSideMargin,
        marginRight: this.tableSideMargin,
      },
      horizontalField: {
        margin: "12px 0",
      },
      originalCampaign: {
        backgroundColor: palettes.greyScaleColors.LighterGrey,
        padding: `12px ${this.tableSideMargin}`,
        margin: "12px 0",
      },
      link: {
        fontSize: 16,
        fontWeight: fonts.weightSemibold,
        color: palettes.coreColors.WishBlue,
        textDecoration: "none",
        wordBreak: "break-all",
      },
      budgetBreakDownTable: {
        display: "block",
        width: "100%",
        position: "relative",
        marginBottom: this.isSmallScreen ? "77px" : 0,
      },
      budgetField: {
        width: BUDGET_FIELD_WIDTH,
        marginLeft: -10,
      },
      headerContainer: this.isSmallScreen
        ? { position: "fixed", top: 0, width: "100%", zIndex: 2 }
        : {},
      header: {
        fontSize: this.isSmallScreen ? 18 : 20,
      },
      footerContainer: this.isSmallScreen
        ? { position: "fixed", bottom: 0, width: "100%", zIndex: 2 }
        : {},
    });
  }

  @computed
  get actionButtonProps() {
    const {
      campaignId,
      dupSource,
      onCampaignUpdated,
      onClose,
      onUpdateAllowedSpending,
    } = this.props;
    return {
      style: this.isSmallScreen ? { flex: 1 } : {},
      isDisabled: this.actionButtonDisabled,
      text: i`Duplicate`,
      isLoading: this.actionButtonLoading,
      onClick: async () => {
        const toastStore = ToastStore.instance();
        const navigationStore = NavigationStore.instance();

        this.actionButtonLoading = true;
        const params = {
          dup_source: dupSource,
          campaign_id: campaignId,
          start_date: formatApiDate(this.startDate),
          max_budget: this.maxBudget,
          is_maxboost: this.isMaxboost,
        };
        let response;
        try {
          response = await productBoostApi
            .duplicateAutomatedCampaign(params)
            .call();
        } catch (e) {
          response = e;
        }
        if (response.code === 0 && response.data) {
          if (onCampaignUpdated) {
            onCampaignUpdated();
          }
          const newCampaignId = response.data.new_campaign_id;
          toastStore.positive(i`Your campaign is duplicated successfully`, {
            timeoutMs: 5000,
            link: {
              title: i`View details`,
              url: `/product-boost/detail/${newCampaignId}`,
            },
          });
          if (onUpdateAllowedSpending) {
            onUpdateAllowedSpending();
          } else if (!this.isSmallScreen) {
            navigationStore.reload();
          } else {
            navigationStore.navigate(`/product-boost/detail/${newCampaignId}`);
          }
          if (onClose) {
            onClose();
          }
        } else {
          if (response.msg) {
            toastStore.error(response.msg);
          }
          this.actionButtonLoading = false;
        }
      },
    };
  }

  @computed
  get cancelButtonProps() {
    const { onClose } = this.props;
    if (this.isSmallScreen) {
      return null;
    }
    return {
      disabled: this.actionButtonLoading,
      text: i`Cancel`,
      onClick: () => {
        if (onClose) {
          onClose();
        }
      },
    };
  }

  @computed
  get renderHeader() {
    const { onClose } = this.props;
    return (
      <div className={css(this.styles.headerContainer)}>
        <ModalHeader
          title={() => {
            return (
              <div className={css(this.styles.header)}>
                Duplicate your campaign
              </div>
            );
          }}
          onClose={onClose}
        />
      </div>
    );
  }

  horizontalTitle(title: string) {
    return () => (
      <section className={css(this.styles.horizontalTitle)}>{title}</section>
    );
  }

  horizontalField(title: string, content: ReactNode) {
    return (
      <HorizontalField
        title={this.horizontalTitle(title)}
        titleWidth={200}
        titleAlign="start"
        className={css(this.styles.horizontalField)}
        key={hash(title)}
      >
        {content}
      </HorizontalField>
    );
  }

  @action
  onDayChange = async (date: Date) => {
    if (moment(date).isSame(this.startDate, "day")) {
      return;
    }
    this.startDate = date;
    this.endDate = moment(date).add(this.maxNumWeeks, "weeks").toDate();
  };

  @action
  onCheckedChanged = (checked: boolean) => {
    this.isMaxboost = checked;
    this.setMinBudget();
  };

  @computed
  get renderDuplicatedCampaign() {
    const { allowMaxboost } = this.props;
    const { maxAllowedSpending, currencyCode } = this.props;
    const { locale } = LocalizationStore.instance();

    let fields = [
      {
        title: i`Start date`,
        content: (
          <DayPickerInput
            value={this.startDate}
            style={{ width: 228 }}
            noEdit
            alignRight
            formatDate={formatDate}
            dayPickerProps={this.dayPickerProps}
            onDayChange={this.onDayChange}
            disabled={false}
            locale={locale}
          />
        ),
      },
      {
        title: i`End date`,
        content: (
          <DayPickerInput
            value={this.endDate}
            style={{ width: 228 }}
            noEdit
            alignRight
            formatDate={formatDate}
            dayPickerProps={this.dayPickerProps}
            onDayChange={() => {}}
            locale={locale}
            disabled
          />
        ),
      },
      {
        title: i`Total budget`,
        content: (
          <CurrencyInput
            className={css(this.styles.budgetField)}
            currencyCode={currencyCode ? currencyCode : "USD"}
            value={this.maxBudget.toString()}
            validators={[this.budgetValidator]}
            onChange={({ textAsNumber }: OnTextChangeEvent) => {
              this.maxBudget = textAsNumber ?? NaN;
            }}
            onValidityChanged={(isValid: boolean) => {
              this.actionButtonDisabled = !isValid;
            }}
          />
        ),
      },
      {
        title: i`Maximum budget`,
        content: (
          <span className={css(this.styles.text)}>
            {formatCurrency(
              maxAllowedSpending,
              currencyCode ? currencyCode : "USD"
            )}
          </span>
        ),
      },
    ];

    if (allowMaxboost) {
      fields = [
        ...fields,
        {
          title: i`MaxBoost`,
          content: (
            <CheckboxField
              checked={this.isMaxboost}
              onChange={this.onCheckedChanged}
            >
              <Popover
                position={"top"}
                popoverContent={
                  i`Products enrolled in MaxBoost will be promoted ` +
                  i`in external media as well.`
                }
                contentWidth={350}
              >
                Enroll in MaxBoost
              </Popover>
            </CheckboxField>
          ),
        },
      ];
    }

    return (
      <div className={css(this.styles.sideMargin)}>
        <div className={css(this.styles.title)}>Your duplicated campaign</div>
        <div className={css(this.styles.subtitle)}>
          Please note that the budget cannot exceed your maximum budget.
        </div>
        {fields.map((field) =>
          this.horizontalField(field.title, field.content)
        )}
      </div>
    );
  }

  @computed
  get renderOriginalCampaign() {
    const {
      campaignId,
      campaignName,
      startDate,
      endDate,
      maxBudget,
      currencyCode,
    } = this.props;
    const startEndDate = `${startDate} - ${endDate}`;
    const fields = [
      {
        title: i`Campaign name`,
        content: (
          <Link
            className={css(this.styles.link)}
            href={`/product-boost/detail/${campaignId}`}
            openInNewTab
          >
            {campaignName}
          </Link>
        ),
      },
      {
        title: i`Duration`,
        content: <span className={css(this.styles.text)}>{startEndDate}</span>,
      },
      {
        title: i`Budget`,
        content: (
          <span className={css(this.styles.text)}>
            {formatCurrency(maxBudget, currencyCode ? currencyCode : "USD")}
          </span>
        ),
      },
    ];

    return (
      <div className={css(this.styles.originalCampaign)}>
        <div className={css(this.styles.title)}>Your original campaign</div>
        {fields.map((field) =>
          this.horizontalField(field.title, field.content)
        )}
      </div>
    );
  }

  @computed
  get renderBudgetBreakdown() {
    const { isPayable, maxAllowedSpending, maxSpendingBreakdown } = this.props;
    return (
      <div className={css(this.styles.budgetBreakDownTable)}>
        <BudgetBreakDownTable
          maxAllowedSpending={maxAllowedSpending}
          maxSpendingBreakdown={maxSpendingBreakdown}
          isPayable={isPayable}
          expended={this.isSmallScreen}
        />
      </div>
    );
  }

  @computed
  get renderFooter() {
    return (
      <div className={css(this.styles.footerContainer)}>
        <ModalFooter
          layout={this.isSmallScreen ? "vertical" : "horizontal"}
          action={this.actionButtonProps}
          cancel={this.cancelButtonProps}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={css(this.styles.root)}>
        {this.renderHeader}
        {this.renderDuplicatedCampaign}
        {this.renderOriginalCampaign}
        {this.renderBudgetBreakdown}
        {this.renderFooter}
      </div>
    );
  }
}
export default DuplicateAutomatedModalContent;
