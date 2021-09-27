import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import numeral from "numeral";
import moment from "moment/moment";
import hash from "object-hash";

/* Lego Components */
import { Label } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
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

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CurrencyCode } from "@toolkit/currency";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import DimenStore from "@merchant/stores/DimenStore";
import ToastStore from "@merchant/stores/ToastStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";

export type EnableAutomatedModalContentProps = BaseProps & {
  readonly campaignId: string;
  readonly campaignName: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly maxBudget: number;
  readonly onCampaignUpdated?: () => unknown;
  readonly onUpdateAllowedSpending?: () => unknown;
  readonly maxSpendingBreakdown: any;
  readonly maxAllowedSpending: number;
  readonly isPayable: boolean;
  readonly discount: number;
  readonly hasMaxboostProduct?: boolean;
  readonly onClose?: () => void;
  readonly currencyCode?: CurrencyCode;
  readonly minStartDate: Date;
  readonly maxStartDate: Date;
  readonly allowMaxboost: boolean;
  readonly maxNumWeeks: number;
};

const formatApiDate = (date: Date): string => {
  return moment(date).format("YYYY-MM-DD");
};

@observer
class EnableAutomatedModalContent extends Component<EnableAutomatedModalContentProps> {
  @observable
  actionButtonLoading = false;

  @observable
  startDate: Date;

  @observable
  endDate: Date;

  maxNumWeeks: number;

  constructor(props: EnableAutomatedModalContentProps) {
    super(props);
    const minStartDate = props.minStartDate;
    const maxStartDate = props.maxStartDate;
    this.maxNumWeeks = props.maxNumWeeks;

    this.startDate = new Date(props.startDate);
    this.endDate = new Date(props.endDate);

    if (minStartDate > this.startDate || maxStartDate < this.startDate) {
      this.startDate = minStartDate;
      this.endDate = moment(this.startDate)
        .add(this.maxNumWeeks, "weeks")
        .toDate();
    }
  }

  @computed
  get dayPickerProps() {
    const { minStartDate, maxStartDate } = this.props;
    return {
      selectedDays: this.startDate,
      disabledDays: [
        {
          before: minStartDate,
        },
        {
          after: maxStartDate,
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
      budgetWithDiscount: {
        display: "flex",
      },
      sideMargin: {
        marginLeft: this.tableSideMargin,
        marginRight: this.tableSideMargin,
      },
      horizontalField: {
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
        marginBottom: this.isSmallScreen ? "77px" : 0,
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
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { merchant } = ProductBoostStore.instance();
    const allowMaxboost = merchant.allow_maxboost;
    const {
      hasMaxboostProduct,
      campaignId,
      maxBudget,
      onCampaignUpdated,
      onClose,
      onUpdateAllowedSpending,
    } = this.props;
    return {
      style: this.isSmallScreen ? { flex: 1 } : {},
      isDisabled: false,
      text: i`Activate`,
      isLoading: this.actionButtonLoading,
      onClick: async () => {
        this.actionButtonLoading = true;
        const apiParams = {
          campaign_id: campaignId,
          start_date: formatApiDate(this.startDate),
          end_date: formatApiDate(this.endDate),
          max_budget: maxBudget,
          is_maxboost: hasMaxboostProduct && allowMaxboost,
          caller_source: "ListPageEnableModalEnable",
        };

        let response;
        try {
          response = await productBoostApi.enableCampaign(apiParams).call();
        } catch (e) {
          response = e;
        }

        if (response.code === 0) {
          if (onCampaignUpdated) {
            onCampaignUpdated();
          }
          if (onUpdateAllowedSpending) {
            onUpdateAllowedSpending();
          } else if (!this.isSmallScreen) {
            navigationStore.reload();
          } else {
            navigationStore.navigate(`/product-boost/detail/${campaignId}`);
          }

          toastStore.positive(i`Your campaign is enabled successfully`, {
            timeoutMs: 5000,
            link: {
              title: i`View details`,
              url: `/product-boost/detail/${campaignId}`,
            },
          });
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
                Activate your campaign
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

  @computed
  get renderCampaign() {
    const {
      campaignName,
      campaignId,
      maxBudget,
      discount,
      hasMaxboostProduct,
      maxAllowedSpending,
      allowMaxboost,
    } = this.props;
    let { currencyCode } = this.props;
    currencyCode = currencyCode ? currencyCode : "USD";

    const discountStr = `${numeral(discount).format("0%")} off applied`;

    const discountAmount = maxBudget * discount;
    const displayMaxAllowedSpending = Math.max(
      maxAllowedSpending + discountAmount - maxBudget,
      0,
    );

    const { locale } = LocalizationStore.instance();

    let fields = [
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
        title: i`Start date`,
        content: (
          <DayPickerInput
            value={this.startDate}
            style={{ width: 228 }}
            noEdit
            alignRight
            displayFormat={"MM/DD/YYYY"}
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
            displayFormat={"MM/DD/YYYY"}
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
          <div
            className={css(this.styles.text, this.styles.budgetWithDiscount)}
          >
            {formatCurrency(maxBudget, currencyCode)}
            <Label
              text={discountStr}
              style={{ marginLeft: 4 }}
              textColor="white"
              fontSize={14}
              backgroundColor={palettes.greens.CashGreen}
            />
          </div>
        ),
      },
      {
        title: i`Maximum budget`,
        content: (
          <span className={css(this.styles.text)}>
            {formatCurrency(displayMaxAllowedSpending, currencyCode)}
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
              checked={hasMaxboostProduct || false}
              onChange={() => {}}
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
        <div className={css(this.styles.title)}>
          Your campaign is one click away from the go.
        </div>
        {fields.map((field) =>
          this.horizontalField(field.title, field.content),
        )}
      </div>
    );
  }

  @computed
  get renderBudgetBreakdown() {
    const {
      discount,
      isPayable,
      maxAllowedSpending,
      maxBudget,
      maxSpendingBreakdown,
    } = this.props;
    return (
      <div className={css(this.styles.budgetBreakDownTable)}>
        <BudgetBreakDownTable
          maxAllowedSpending={maxAllowedSpending}
          maxSpendingBreakdown={maxSpendingBreakdown}
          isPayable={isPayable}
          campaignBudget={maxBudget}
          discount={discount}
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
        {this.renderCampaign}
        {this.renderBudgetBreakdown}
        {this.renderFooter}
      </div>
    );
  }
}
export default EnableAutomatedModalContent;
