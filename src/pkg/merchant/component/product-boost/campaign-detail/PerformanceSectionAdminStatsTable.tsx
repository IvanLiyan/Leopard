import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

/* Toolkit */
import { CampaignAdminPerformanceStats } from "@toolkit/product-boost/utils/campaign-stats";

/* Type Imports*/
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import { Table } from "@ContextLogic/lego";

/* Merchant API */
import {
  getProductBoostCampaignAdminStats,
  ProductBoostCampaignAdminStat,
} from "@merchant/api/product-boost";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly campaign: Campaign;
};

const PerformanceSectionAdminStatsTable: React.FC<Props> = (props: Props) => {
  const styles = useStyleSheet();
  const { campaign } = props;
  const [adminStats, setAdminStats] = useState<
    ReadonlyArray<ProductBoostCampaignAdminStat>
  >([]);

  // get campaign detail
  useEffect(() => {
    const fetchData = async () => {
      const resp = await getProductBoostCampaignAdminStats({
        campaign_id: campaign.id,
      }).call();
      const campaignDetailByDateStats = resp?.data?.campaign_detail_admin_stats;
      const startDate = campaign.startDate;
      const endDate = campaign.endDate;
      const stats = new CampaignAdminPerformanceStats({
        campaignDetailByDateStats,
        startDate,
        endDate,
      }).getAdminDailyStats();
      setAdminStats(stats);
    };
    fetchData();
  }, [campaign.id, campaign.startDate, campaign.endDate]);

  return (
    <Card className={css(styles.tableCard)}>
      <Table data={adminStats}>
        <Table.Column title={`Date`} columnKey={"date"} />
        <Table.NumeralColumn
          title={`Server-Side Impressions`}
          columnKey="total_server_side_impressions"
          noDataMessage={"\u2014"}
          numeralFormat={"0a"}
          align="right"
        />
        <Table.NumeralColumn
          columnKey="total_client_side_impressions"
          noDataMessage={"\u2014"}
          numeralFormat={"0a"}
          align="right"
          title={`Client-Side Impressions`}
        />
        <Table.NumeralColumn
          columnKey="total_click_impressions"
          noDataMessage={"\u2014"}
          numeralFormat={"0a"}
          align="right"
          title={`Click Impressions`}
        />
        <Table.NumeralColumn
          columnKey="total_impressions"
          noDataMessage={"\u2014"}
          numeralFormat={"0a"}
          align="right"
          title={`Total Impressions`}
        />
        <Table.CurrencyColumn
          columnKey="average_server_side_bid"
          noDataMessage={"\u2014"}
          currencyCode={campaign.localizedCurrency}
          multiline
          align="right"
          title={`Server-Side Bid`}
        />
        <Table.CurrencyColumn
          columnKey="average_client_side_bid"
          noDataMessage={"\u2014"}
          currencyCode={campaign.localizedCurrency}
          multiline
          align="right"
          title={`Client-Side Bid`}
        />
        <Table.CurrencyColumn
          columnKey="average_client_click_bid"
          noDataMessage={"\u2014"}
          currencyCode={campaign.localizedCurrency}
          multiline
          align="right"
          title={`Clicks Bid`}
        />
        <Table.CurrencyColumn
          columnKey="pb_attributed_gmv"
          noDataMessage={"\u2014"}
          currencyCode={campaign.localizedCurrency}
          multiline
          align="right"
          title={`PB Attributed GMV`}
        />
        <Table.CurrencyColumn
          columnKey="pb_roas"
          noDataMessage={"\u2014"}
          currencyCode={campaign.localizedCurrency}
          multiline
          align="right"
          title={`PB ROAS`}
        />
      </Table>
    </Card>
  );
};

const useStyleSheet = () => {
  const { textWhite, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        sectionHeader: {
          color: textBlack,
          fontSize: 12,
          fontWeight: weightBold,
          padding: "2px 25px",
          cursor: "default",
          backgroundColor: textWhite,
        },
        expandedTable: {
          margin: "10px",
        },
        image: {
          width: 70,
          height: 70,
          marginRight: 15,
          borderRadius: 4,
        },
        icon: {
          width: 24,
          height: 16,
        },
        tableCard: {
          margin: "50px 50px 0px 50px",
        },
        tableTopControl: {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          justifyContent: "space-between",
          margin: "20px 0px 20px 25px",
          backgroundColor: textWhite,
        },
      }),
    [textWhite, textBlack],
  );
};

export default PerformanceSectionAdminStatsTable;
