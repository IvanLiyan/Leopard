/* eslint-disable local-rules/use-markdown */
/* eslint-disable filenames/match-regex */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment-timezone";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import * as dimen from "@toolkit/lego-legacy/dimen";
import {
  palettes,
  pageBackground,
} from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as timeConfigData from "@toolkit/payments/timezone-data";
import { Select } from "@ContextLogic/lego";
import { formatDatetimeLocalized } from "@toolkit/datetime";

const RowHeight = 50;
const TimeTitleWidth = 40;
const TitleWidth = 180;

type DisbursementInfoProps = {
  readonly is_in_disbursement: boolean;
  readonly is_in_weekly_disbursement: boolean;
  readonly disbursement_id: string | "";
  readonly disbursement_date: number;
  readonly payment_creation_date: number;
  readonly validation_date: number;
  readonly wire_transfer_date: number;
  readonly prev_disbursement_id: string | "";
  readonly prev_disbursement_date: number;
  readonly prev_payment_creation_date: number;
  readonly prev_validation_date: number;
  readonly prev_wire_transfer_date: number;
  readonly weekly_disbursement_id: string | "";
  readonly weekly_disbursement_date: number;
  readonly prev_weekly_disbursement_id: string | "";
  readonly prev_weekly_disbursement_date: number;
  readonly cutoff_times: any;
};

@observer
export default class ViewDisbursementInfo extends Component<
  DisbursementInfoProps
> {
  timerID: ReturnType<typeof setTimeout> | undefined | null;

  @observable
  timeUTC: string | null | undefined;

  @observable
  timePST: string | null | undefined;

  @observable
  timeBJT: string | null | undefined;

  @observable
  currentPaymentCycle: number | null | undefined;

  constructor(props: DisbursementInfoProps) {
    super(props);
    this.updateTimes();
    this.currentPaymentCycle = 1;
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.updateTimes(), 1000);
    timeConfigData.getTimezoneDataDisbursementMetaInfo();
  }

  componentWillUnmount() {
    if (this.timerID != null) {
      clearInterval(this.timerID);
    }
    this.timerID = null;
  }

  @action
  updateTimes() {
    const now = moment.utc();
    this.timeUTC = formatDatetimeLocalized(
      now,
      "dddd, MMMM DD, YYYY - hh:mm:ss A"
    );
    this.timePST = formatDatetimeLocalized(
      now.tz("America/Los_Angeles"),
      "dddd, MMMM DD, YYYY - hh:mm:ss A"
    );
    this.timeBJT = formatDatetimeLocalized(
      now.tz("Asia/Shanghai"),
      "dddd, MMMM DD, YYYY - hh:mm:ss A"
    );
  }

  formatDate(timestamp: number) {
    return formatDatetimeLocalized(
      moment.unix(timestamp).utc(),
      "dddd, MMMM DD, YYYY"
    );
  }

  formatTime(timestamp: number) {
    return formatDatetimeLocalized(moment.unix(timestamp).utc(), "HH:mm:ss");
  }

  @computed
  get disbursement() {
    const { disbursement_date: disbursementDate } = this.props;
    return this.formatDate(disbursementDate);
  }

  @computed
  get disbursementDate() {
    const { disbursement_date: disbursementDate } = this.props;
    return this.formatDate(disbursementDate);
  }

  @computed
  get paymentCreationDate() {
    const { payment_creation_date: paymentCreationDate } = this.props;
    return this.formatDate(paymentCreationDate);
  }

  @computed
  get validationDate() {
    const { validation_date: validationDate } = this.props;
    return this.formatDate(validationDate);
  }

  @computed
  get wireTransferDate() {
    const { wire_transfer_date: wireTransferDate } = this.props;
    return this.formatDate(wireTransferDate);
  }

  @computed
  get prevDisbursement() {
    const { prev_disbursement_date: prevDisbursementDate } = this.props;
    return this.formatDate(prevDisbursementDate);
  }

  @computed
  get prevDisbursementDate() {
    const { prev_disbursement_date: prevDisbursementDate } = this.props;
    return this.formatDate(prevDisbursementDate);
  }

  @computed
  get weeklyDisbursement() {
    const { weekly_disbursement_date: weeklyDisbursementDate } = this.props;
    return this.formatDate(weeklyDisbursementDate);
  }

  @computed
  get weeklyDisbursementDate() {
    const { weekly_disbursement_date: weeklyDisbursementDate } = this.props;
    return this.formatDate(weeklyDisbursementDate);
  }

  @computed
  get prevWeeklyDisbursement() {
    const {
      prev_weekly_disbursement_date: prevWeeklyDisbursementDate,
    } = this.props;
    return this.formatDate(prevWeeklyDisbursementDate);
  }

  @computed
  get prevWeeklyDisbursementDate() {
    const {
      prev_weekly_disbursement_date: prevWeeklyDisbursementDate,
    } = this.props;
    return this.formatDate(prevWeeklyDisbursementDate);
  }

  @computed
  get prevPaymentCreationDate() {
    const { prev_payment_creation_date: prevPaymentCreationDate } = this.props;
    return this.formatDate(prevPaymentCreationDate);
  }

  @computed
  get prevValidationDate() {
    const { prev_validation_date: prevValidationDate } = this.props;
    return this.formatDate(prevValidationDate);
  }

  @computed
  get prevWireTransferDate() {
    const { prev_wire_transfer_date: prevWireTransferDate } = this.props;
    return this.formatDate(prevWireTransferDate);
  }

  @computed
  get cutoffUTC() {
    const { cutoff_times: cutoffTimes } = this.props;
    return this.formatTime(cutoffTimes.UTC);
  }

  @computed
  get cutoffPST() {
    const { cutoff_times: cutoffTimes } = this.props;
    return this.formatTime(cutoffTimes.PST);
  }

  @computed
  get cutoffBJT() {
    const { cutoff_times: cutoffTimes } = this.props;
    return this.formatTime(cutoffTimes.BJT);
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: `0% ${dimen.pageGuideX} 0% 0%`,
        backgroundColor: pageBackground,
        marginTop: 30,
      },
      card: {
        marginBottom: 30,
      },
      sheet: {
        display: "flex",
        flexDirection: "column",
      },
      fixedHeightSheetItem: {
        height: RowHeight,
        padding: "0px 20px",
        borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
      },
      fixedHeightDivItem: {
        height: RowHeight,
        padding: "0px 20px",
        borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
        display: "flex",
        alignItems: "center",
        whiteSpace: "pre",
      },
      importantItem: {
        fontWeight: fonts.weightBold,
        backgroundColor: palettes.yellows.LighterYellow,
      },
      sideBySide: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "stretch",
        ":nth-child(1n) > div": {
          flexGrow: 1,
          flexBasis: 0,
          flexShrink: 1,
          ":not(:last-child)": {
            borderRight: `1px solid ${palettes.greyScaleColors.Grey}`,
          },
        },
      },
      sideBySideLeftAlign: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "row",
        flexWrap: "wrap",
        ":nth-child(1n) > div": {
          ":not(:last-child)": {
            borderRight: `1px solid ${palettes.greyScaleColors.Grey}`,
          },
          borderBottom: 0,
        },
        borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
      },
      sectionTitle: {
        color: palettes.textColors.Ink,
        fontSize: 24,
        fontWeight: fonts.weightBold,
        marginBottom: 25,
      },
      paymentCycleText: {
        marginTop: 10,
        marginRight: 10,
      },
      paymentCycle: {
        display: "flex",
        justifyContent: "flex-end",
      },
    });
  }

  renderDisbursementLink(disbId: string, disbName: string) {
    if (disbId) {
      return (
        <Link
          openInNewTab
          href={`merchant-disbursements/disbursement/${disbId}`}
        >
          {disbName}
        </Link>
      );
    }
    return disbName;
  }

  renderDisbursementInfo() {
    const {
      disbursement_id: disbursementId,
      weekly_disbursement_id: weeklyDisbursementId,
      is_in_disbursement: isInDisbursement,
      is_in_weekly_disbursement: isInWeeklyDisbursement,
    } = this.props;
    const title = isInDisbursement
      ? i`Current Disbursement`
      : i`Next Disbursement`;
    const weeklyTitle = isInWeeklyDisbursement
      ? i`Current Weekly Disbursement`
      : i`Next Weekly Disbursement`;
    // Normal Disbursement
    if (this.currentPaymentCycle === 1) {
      return (
        <Card title={title} className={css(this.styles.card)}>
          {isInDisbursement ? (
            <>
              <div
                className={css(
                  this.styles.fixedHeightDivItem,
                  this.styles.importantItem
                )}
              >
                Disbursement is in progress!{" "}
                <span>
                  {this.renderDisbursementLink(
                    disbursementId,
                    this.disbursement
                  )}
                </span>
              </div>
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Disbursement Date`}
                titleWidth={TitleWidth}
              >
                {this.disbursementDate}
              </SheetItem>
            </>
          ) : (
            <>
              <div className={css(this.styles.fixedHeightDivItem)}>
                Next disbursement is{" "}
                <span>
                  {this.renderDisbursementLink(
                    disbursementId,
                    this.disbursement
                  )}
                </span>
              </div>
              <div className={css(this.styles.sideBySideLeftAlign)}>
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Disbursement Date`}
                  titleWidth={TitleWidth}
                >
                  {this.disbursementDate}
                </SheetItem>
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Cutoff Times`}
                  titleWidth="100"
                >
                  {this.cutoffUTC} UTC / {this.cutoffPST} PST / {this.cutoffBJT}{" "}
                  BJT
                </SheetItem>
              </div>
            </>
          )}
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Payment Creation Day`}
            titleWidth={TitleWidth}
          >
            {this.paymentCreationDate}
          </SheetItem>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Validation Day`}
            titleWidth={TitleWidth}
          >
            {this.validationDate}
          </SheetItem>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Wire Transfer Day`}
            titleWidth={TitleWidth}
          >
            {this.wireTransferDate}
          </SheetItem>
        </Card>
      );
    }
    // Weekly Disbursement
    return (
      <Card title={weeklyTitle} className={css(this.styles.card)}>
        {isInWeeklyDisbursement ? (
          <>
            <div
              className={css(
                this.styles.fixedHeightDivItem,
                this.styles.importantItem
              )}
            >
              Disbursement is in progress!{" "}
              <span>
                {this.renderDisbursementLink(
                  weeklyDisbursementId,
                  this.weeklyDisbursement
                )}
              </span>
            </div>
            <SheetItem
              className={css(this.styles.fixedHeightSheetItem)}
              title={i`Disbursement Date`}
              titleWidth={TitleWidth}
            >
              {this.weeklyDisbursementDate}
            </SheetItem>
          </>
        ) : (
          <>
            <div className={css(this.styles.fixedHeightDivItem)}>
              Next disbursement is{" "}
              <span>
                {this.renderDisbursementLink(
                  weeklyDisbursementId,
                  this.weeklyDisbursement
                )}
              </span>
            </div>
            <div className={css(this.styles.sideBySideLeftAlign)}>
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Disbursement Date`}
                titleWidth={TitleWidth}
              >
                {this.weeklyDisbursementDate}
              </SheetItem>
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Cutoff Times`}
                titleWidth="100"
              >
                {this.cutoffUTC} UTC / {this.cutoffPST} PST / {this.cutoffBJT}{" "}
                BJT
              </SheetItem>
            </div>
          </>
        )}
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`Payment Creation Day`}
          titleWidth={TitleWidth}
        >
          {this.weeklyDisbursementDate}
        </SheetItem>
      </Card>
    );
  }

  renderPrevDisbursementInfo() {
    const {
      prev_disbursement_id: prevDisbursementId,
      prev_weekly_disbursement_id: prevWeeklyDisbursementId,
    } = this.props;
    const isNormalDisbursement = this.currentPaymentCycle == 1;
    const title = isNormalDisbursement
      ? i`Previous Disbursement`
      : i`Previous Weekly Disbursement`;
    // Normal Disbursement
    if (this.currentPaymentCycle === 1) {
      return (
        <Card title={title} className={css(this.styles.card)}>
          <div className={css(this.styles.fixedHeightDivItem)}>
            Previous disbursement is{" "}
            <span>
              {this.renderDisbursementLink(
                prevDisbursementId,
                this.prevDisbursement
              )}
            </span>
          </div>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Disbursement Date`}
            titleWidth={TitleWidth}
          >
            {this.prevDisbursementDate}
          </SheetItem>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Payment Creation Day`}
            titleWidth={TitleWidth}
          >
            {this.prevPaymentCreationDate}
          </SheetItem>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Validation Day`}
            titleWidth={TitleWidth}
          >
            {this.prevValidationDate}
          </SheetItem>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Wire Transfer Day`}
            titleWidth={TitleWidth}
          >
            {this.prevWireTransferDate}
          </SheetItem>
        </Card>
      );
    }
    // Weekly Disbursement
    return (
      <Card title={title} className={css(this.styles.card)}>
        <div className={css(this.styles.fixedHeightDivItem)}>
          Previous weekly disbursement is{" "}
          <span>
            {this.renderDisbursementLink(
              prevWeeklyDisbursementId,
              this.prevWeeklyDisbursement
            )}
          </span>
        </div>
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`Disbursement Date`}
          titleWidth={TitleWidth}
        >
          {this.prevWeeklyDisbursementDate}
        </SheetItem>
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`Payment Creation Day`}
          titleWidth={TitleWidth}
        >
          {this.prevWeeklyDisbursementDate}
        </SheetItem>
      </Card>
    );
  }

  setPaymentCycle(paymentCycle: number) {
    this.currentPaymentCycle = paymentCycle;
  }

  render() {
    const paymentCycles = [
      { text: i`Normal`, value: 1 },
      { text: i`Weekly`, value: 2 },
    ];

    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.sideBySide)}>
          <section className={css(this.styles.sectionTitle)}>
            Disbursement Meta Information
          </section>
          <div className={css(this.styles.paymentCycle)}>
            <p className={css(this.styles.paymentCycleText)}>Payment Cycle</p>
            <Select
              options={paymentCycles}
              onSelected={(paymentCycle) => {
                this.setPaymentCycle(paymentCycle);
              }}
              minWidth={70}
              selectedValue={this.currentPaymentCycle}
            />
          </div>
        </div>
        <Card title={i`Current Time`} className={css(this.styles.card)}>
          <div className={css(this.styles.sideBySide)}>
            <SheetItem
              className={css(this.styles.fixedHeightSheetItem)}
              title="UTC"
              titleWidth={TimeTitleWidth}
            >
              {this.timeUTC}
            </SheetItem>
            <SheetItem
              className={css(this.styles.fixedHeightSheetItem)}
              title="PST"
              titleWidth={TimeTitleWidth}
            >
              {this.timePST}
            </SheetItem>
            <SheetItem
              className={css(this.styles.fixedHeightSheetItem)}
              title="BJT"
              titleWidth={TimeTitleWidth}
            >
              {this.timeBJT}
            </SheetItem>
          </div>
        </Card>
        {this.renderDisbursementInfo()}
        {this.renderPrevDisbursementInfo()}
      </div>
    );
  }
}
