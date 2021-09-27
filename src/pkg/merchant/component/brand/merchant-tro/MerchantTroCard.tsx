//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Relative Imports */
import ShowTroMessagesModal from "./ShowTroMessagesModal";
import ShowTroMerchantReplyModal from "./ShowTroMerchantReplyModal";
import SendTroUpdateFormModal from "./SendTroUpdateFormModal";
import MerchantInjunctionCaseLabel from "./MerchantInjunctionCaseLabel";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  InjunctionResult,
  InjunctionPayment,
} from "@merchant/api/brand/merchant-tro";
import { InjunctionMerchantReply } from "@merchant/api/brand/merchant-tro";
import { ReplyType } from "@merchant/api/brand/merchant-tro";
import { CellInfo } from "@ContextLogic/lego";

type MerchantTroCardProps = BaseProps & {
  readonly injunctionResult: InjunctionResult;
  readonly onUpdate: () => void;
};

const MerchantTroCard = (props: MerchantTroCardProps) => {
  const styles = useStylesheet(props);
  const { className, style, injunctionResult, onUpdate } = props;

  const showMessages = () =>
    new ShowTroMessagesModal(
      injunctionResult.basic_info.plaintiff_name,
      injunctionResult.admin_replies,
    ).render();

  const showMerchantReply = (reply: InjunctionMerchantReply) =>
    new ShowTroMerchantReplyModal({ reply }).render();

  const sendTroUpdateFormModal = async () =>
    new SendTroUpdateFormModal({
      injunctionId: injunctionResult.basic_info.id,
      onUpdate,
    }).render();

  const isCaseResolvedPending = injunctionResult.merchant_replies.find(
    (reply) => reply.reply_type === "RESOLVED",
  );
  const ReplyMessages: { [key in ReplyType]: string } = {
    HIRED_LAWYER: i`Provided lawyer details`,
    NORMAL_REPLY: i`Sent message`,
    RESOLVED: i`Sent case resolution details`,
  };
  // TODO: refactor render logic soon
  return (
    <div className={css(styles.root, className, style)}>
      {isCaseResolvedPending ? (
        <Alert
          text={
            i`Case resolved? Send us an update of your settlement to ` +
            i`expedite the restoration of your store.`
          }
          sentiment="info"
        />
      ) : (
        <Alert
          text={
            i`Was this injunction filed in error? Consider hiring an attorney ` +
            i`to challenge the Plaintiff’s claims.`
          }
          sentiment="info"
          link={{
            text: i`Learn more`,
            url: zendeskURL("360008058353"),
          }}
        />
      )}
      <Card>
        <div className={css(styles.topControls)}>
          <div className={css(styles.headSectionWrapper)}>
            <div className={css(styles.headSection)}>
              <Text weight="bold" className={css(styles.title)}>
                {injunctionResult.basic_info.plaintiff_name}
              </Text>
              {injunctionResult.admin_replies.length > 0 && (
                <Link onClick={showMessages}> View messages </Link>
              )}
            </div>
            <div className={css(styles.dateField)}>
              {injunctionResult.basic_info.tro_entered_date}
            </div>
          </div>

          <div className={css(styles.updateSection)}>
            <PrimaryButton
              className={css(styles.actionButton)}
              style={{ padding: "10px 70px" }}
              onClick={sendTroUpdateFormModal}
            >
              Send update
            </PrimaryButton>
          </div>
        </div>

        <div className={css(styles.caseControls)}>
          <div className={css(styles.detailSection)}>
            <Text weight="bold" className={css(styles.subTitle)}>
              {ci18n("refers to court case", "Case status")}
            </Text>
            <div className={css(styles.detailContent)}>
              <MerchantInjunctionCaseLabel
                status={injunctionResult.basic_info.merchant_case_status}
              />
            </div>
          </div>
          <div className={css(styles.detailSection)}>
            <Text className={css(styles.subTitle)}>
              {ci18n("refers to court case", "Case Number")}
            </Text>

            <div className={css(styles.detailContent)}>
              {injunctionResult.basic_info.case_number}
            </div>
          </div>
        </div>

        <div className={css(styles.penaltyControls)}>
          <div className={css(styles.restrictionSection)}>
            <Text weight="bold" className={css(styles.subTitle)}>
              Applied Court-ordered restrictions
            </Text>
            {injunctionResult.restrictions.map((restriction) => {
              return (
                <div className={css(styles.penaltyContent)} key={restriction}>
                  {restriction}
                </div>
              );
            })}
          </div>
        </div>

        <div className={css(styles.detailControls)}>
          <div className={css(styles.detailSection)}>
            <Text weight="bold" className={css(styles.subTitle)}>
              Plaintiff’s counsel{" "}
            </Text>
            <div className={css(styles.detailContent)}>
              {injunctionResult.basic_info.plaintiff_counsel}
            </div>
            <div className={css(styles.detailContent)}>
              {injunctionResult.basic_info.plaintiff_counsel_email}
            </div>
            <div className={css(styles.detailContent)}>
              {injunctionResult.basic_info.plaintiff_counsel_phone}
            </div>
          </div>

          <div className={css(styles.detailSection)}>
            <Text weight="bold" className={css(styles.subTitle)}>
              IP at issue
            </Text>

            <div className={css(styles.detailContent)}>
              {injunctionResult.basic_info.ip_at_issue}
            </div>
          </div>
          <div className={css(styles.detailSection)}>
            <Text weight="bold" className={css(styles.subTitle)}>
              Court
            </Text>

            <div className={css(styles.detailContent)}>
              {injunctionResult.basic_info.court_name}
            </div>
          </div>
        </div>

        <div className={css(styles.tableControls)}>
          <Text weight="bold" className={css(styles.title)}>
            Problematic listings
          </Text>
          <Table className={css(styles.table)} data={injunctionResult.products}>
            <ProductColumn title={i`Products`} columnKey="id" width={450} />
            <Table.CurrencyColumn
              columnKey="gmv"
              currencyCode="USD"
              title={"GMV"}
              minWidth={84}
              description={i`Lifetime GMV of products`}
              align="left"
            />
          </Table>
        </div>
        <div className={css(styles.tableControls)}>
          <Text weight="bold" className={css(styles.title)}>
            Court-ordered payments
          </Text>
          <Table className={css(styles.table)} data={injunctionResult.payments}>
            <Table.Column title={i`Date`} columnKey="date" />
            <Table.LinkColumn
              title={i`Penalty ID`}
              columnKey="id"
              align="left"
              href={({
                row,
              }: CellInfo<InjunctionPayment["id"], InjunctionPayment>) =>
                `/penalty/${row.id}`
              }
              text={({
                row,
              }: CellInfo<InjunctionPayment["id"], InjunctionPayment>) =>
                `${row.id}`
              }
              openInNewTab
            />
            <Table.Column
              title={i`Penalty Type`}
              minWidth={236}
              columnKey="type_name"
            />

            <Table.Column columnKey="amount" title={i`Amount`} align="left">
              {({
                row,
                value,
              }: CellInfo<InjunctionPayment["amount"], InjunctionPayment>) => {
                return formatCurrency(value, row.currency);
              }}
            </Table.Column>
          </Table>
        </div>
        <div className={css(styles.tableControls)}>
          <Text weight="bold" className={css(styles.title)}>
            Update history
          </Text>
          <Table
            className={css(styles.table)}
            data={injunctionResult.merchant_replies}
          >
            <Table.Column
              title={i`Description`}
              columnKey="reply_type"
              minWidth={400}
            >
              {({ row, value }) => (
                <Link onClick={() => showMerchantReply(row)}>
                  {/* if you find this please fix the any types (legacy) */}
                  {(ReplyMessages as any)[row.reply_type]}{" "}
                </Link>
              )}
            </Table.Column>

            <Table.Column title={i`Date`} columnKey="date" />
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default observer(MerchantTroCard);

const useStylesheet = (props: MerchantTroCardProps) => {
  const { pageGuideXForPageWithTable: pageX, pageGuideX: largePageX } =
    useDimenStore();
  const { primary, textLight, textDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        topControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          padding: `10px ${pageX} 10px ${pageX}`,
        },
        penaltyControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          padding: `10px ${largePageX} 10px ${pageX}`,
        },
        detailControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "flex-start",
          padding: `10px ${largePageX} 10px ${pageX}`,
          ":nth-child(1n) > *": {
            ":not(:last-child)": {
              width: 300,
              flex: "0 0 300px",
            },
          },
        },
        caseControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "flex-start",
          padding: `10px ${largePageX} 10px ${pageX}`,
          ":nth-child(1n) > *": {
            ":not(:last-child)": {
              width: 300,
              flex: "0 0 300px",
            },
          },
        },

        tableControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: `10px ${largePageX} 10px ${pageX}`,
        },
        table: {
          marginTop: 20,
        },
        penaltyContent: {
          fontSize: 24,
          color: textDark,
        },
        detailContent: {},
        dateField: {
          color: textLight,
          padding: `0px ${pageX} 10px 0px`,
        },
        actionButton: {
          marginBottom: 10,
          paddingTop: 10,
        },
        updateSection: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        },
        headSection: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        headSectionWrapper: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        },
        restrictionSection: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          ":nth-child(1n) > *": {
            padding: `10px 0% 10px 0%`,
          },
        },
        detailSection: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        },
        card: {
          marginBottom: 20,
        },
        link: {},
        resourceTitle: {
          fontSize: 20,
          marginBottom: 24,
        },
        title: {
          fontSize: 24,
          lineHeight: 1.33,
          color: textDark,
          marginRight: 25,
          userSelect: "none",
        },
        subTitle: {
          fontSize: 20,
          lineHeight: 1.33,
          color: textDark,
          marginRight: 25,
          userSelect: "none",
        },
        fadeOnHover: {
          transition: "opacity 0.3s linear",
          opacity: 1,
          ":hover": {
            opacity: 0.6,
          },
        },
        productImage: {
          width: 32,
          height: 32,
          marginRight: 10,
        },
        productName: {
          opacity: 1,
          color: primary,
          transition: "opacity 0.3s linear",
          ":hover": {
            opacity: 0.6,
          },
          cursor: "pointer",
        },
      }),
    [largePageX, pageX, primary, textLight, textDark],
  );
};
