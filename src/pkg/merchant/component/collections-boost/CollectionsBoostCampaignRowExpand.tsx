import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import { weightMedium } from "@toolkit/fonts";

/* Merchant Components */
import CollectionBoostSearchQueryStatusLabel from "@merchant/component/collections-boost/CollectionBoostSearchQueryStatusLabel";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  CollectionsBoostApiCampaign,
  CollectionsBoostCampaignFee,
} from "@merchant/api/collections-boost";

type CollectionRowExpandProps = BaseProps & {
  readonly campaign: CollectionsBoostApiCampaign;
};

const CollectionsBoostCampaignRowExpand = (props: CollectionRowExpandProps) => {
  const { className, campaign } = props;

  const styles = useStyleSheet();

  const searchQueries = campaign.search_queries;

  const currency = campaign.localized_currency;

  const renderFeeId = (row: CollectionsBoostCampaignFee) => {
    const { fee_id: feeId, fee_type: feeType } = row;
    if (feeType === "CREDIT") {
      return <p>{feeId}</p>;
    }
    return (
      <Link href={`/fee/${feeId}`} openInNewTab>
        {feeId}
      </Link>
    );
  };

  const renderFeeDescription = (row: CollectionsBoostCampaignFee) => {
    const { fee_type: feeType } = row;
    const description =
      feeType === "CREDIT"
        ? i`CollectionBoost Credit Payment`
        : i`Account Balance Withdrawal`;
    return <p>{description}</p>;
  };

  const renderReceipt = () => {
    const { state, campaign_fees: campaignFees } = campaign;
    if (state !== "STARTED" && state !== "ENDED") {
      return null;
    }
    return (
      <div className={css(styles.section)}>
        <div className={css(styles.title)}>Receipt:</div>
        <Table
          noDataMessage={i`No Invoices`}
          className={css(styles.expandRowContent)}
          rowHeight={65}
          cellStyle={() => ({ fontSize: 16 })}
          data={campaignFees}
        >
          <Table.Column title={i`ID`} columnKey="fee_id" noDataMessage="-">
            {({ row }) => renderFeeId(row)}
          </Table.Column>
          <Table.CurrencyColumn
            title={i`Charge`}
            columnKey="amount"
            noDataMessage="-"
            currencyCode={currency}
          />
          <Table.Column
            title={i`Description`}
            columnKey="fee_type"
            noDataMessage="-"
          >
            {({ row }) => renderFeeDescription(row)}
          </Table.Column>
        </Table>
      </div>
    );
  };

  return (
    <div className={css(styles.root, className)}>
      {renderReceipt()}
      <div className={css(styles.section)}>
        <div className={css(styles.title)}>Campaign's Search terms:</div>
        <Table
          className={css(styles.expandRowContent)}
          data={searchQueries}
          rowHeight={65}
          cellStyle={() => ({ fontSize: 16 })}
          highlightRowOnHover
          overflowY="scroll"
        >
          <Table.Column title={i`Search Term`} columnKey="search_term" />
          <Table.CurrencyColumn
            title={i`Bid`}
            columnKey="bid"
            currencyCode={currency}
          />
          <Table.Column title={i`Bid Status`} columnKey="state">
            {({ row }) => {
              const { state } = row;
              return (
                <div className={css(styles.rowCellItems)}>
                  <CollectionBoostSearchQueryStatusLabel state={state} />
                  {state === "REJECTED" && (
                    <Info
                      className={css(styles.info)}
                      text={
                        i`Search term is rejected because the bid is not high ` +
                        i`enough to be promoted. Please increase the bid and try again.`
                      }
                      size={16}
                      sentiment="info"
                    />
                  )}
                </div>
              );
            }}
          </Table.Column>
        </Table>
      </div>
    </div>
  );
};

export default CollectionsBoostCampaignRowExpand;

const useStyleSheet = () => {
  const { pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          background: pageBackground,
          padding: "15px 20px",
        },
        expandRowContent: {
          margin: "24px 24px 0px 24px",
          maxHeight: "250px",
          overflowY: "scroll",
        },
        section: {
          margin: "24px 0px",
        },
        title: {
          color: textBlack,
          fontSize: 20,
          fontWeight: weightMedium,
          marginBottom: 20,
        },
        rowCellItems: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        info: {
          marginLeft: 5,
        },
      }),
    [pageBackground, textBlack],
  );
};
