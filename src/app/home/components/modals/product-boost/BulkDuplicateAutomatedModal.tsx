import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  BulkDuplicateAutomatedCampaignParams,
  BulkDuplicateCampaign,
  PB_DUPLICATE_CAMPAIGN_BULK_ENDPOINT,
} from "@home/toolkit/product-boost";
import { PaymentCurrencyCode } from "@schema";
import { useToastStore } from "@core/stores/ToastStore";
import {
  CopyButton,
  Layout,
  Link,
  RowSelectionArgs,
  Table,
} from "@ContextLogic/lego";
import { useMutation } from "@core/toolkit/restApi";
import { css } from "@core/toolkit/styling";
import ModalTitle from "@core/components/modal/ModalTitle";
import Illustration from "@core/components/Illustration";
import { formatCurrency } from "@core/toolkit/currency";
import ModalFooter from "@core/components/modal/ModalFooter";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import numeral from "numeral";
import { merchFeURL } from "@core/toolkit/router";

export type BulkDuplicateAutomatedModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly campaignsToDuplicate: ReadonlyArray<BulkDuplicateCampaign>;
    readonly maxAllowedSpending: number;
    readonly onClose: () => unknown;
    readonly currencyCode: PaymentCurrencyCode;
  };

const BulkDuplicateAutomatedModal: React.FC<
  BulkDuplicateAutomatedModalProps
> = ({
  campaignsToDuplicate,
  maxAllowedSpending,
  onClose,
  open,
  currencyCode,
}) => {
  const styles = useStylesheet();

  const toastStore = useToastStore();

  const initalCampaignIds = campaignsToDuplicate.map(
    (campaign) => campaign.campaign_id,
  );

  const [selectedCampaignIds, setSelectedCampaignIds] =
    useState(initalCampaignIds);

  const selectedRows = campaignsToDuplicate.reduce(
    //disabled to satisfy the callback requirement on .reduce
    //eslint-disable-next-line local-rules/no-large-method-params
    (accumulator: number[], row: BulkDuplicateCampaign, index: number) => {
      if (selectedCampaignIds.includes(row.campaign_id)) {
        accumulator = [...accumulator, index];
      }
      return accumulator;
    },
    [],
  );

  const onDuplicateRowSelectionToggled = ({
    row,
    selected,
  }: RowSelectionArgs<BulkDuplicateCampaign>) => {
    if (selected) {
      addCampaign(row);
    } else {
      removeCampaign(row);
    }
  };

  const addCampaign = (row: BulkDuplicateCampaign) => {
    if (!selectedCampaignIds.includes(row.campaign_id)) {
      setSelectedCampaignIds((prevCampaignIds) => [
        ...prevCampaignIds,
        row.campaign_id,
      ]);
    }
  };

  const removeCampaign = (row: BulkDuplicateCampaign) => {
    setSelectedCampaignIds((prevCampaignIds) => {
      const idIndex = prevCampaignIds.indexOf(row.campaign_id);
      return prevCampaignIds.filter((_, index) => {
        return index !== idIndex;
      });
    });
  };

  const { trigger: bulkDuplicateAutomatedCampaign } = useMutation<
    {
      code: number;
      data: unknown;
    },
    BulkDuplicateAutomatedCampaignParams
  >({
    url: PB_DUPLICATE_CAMPAIGN_BULK_ENDPOINT,
  });

  const actionButtonProps = {
    text: i`Duplicate selected campaigns`,
    isDisabled: selectedCampaignIds.length === 0,
    onClick: async () => {
      const params = {
        campaign_ids: [...selectedCampaignIds],
      };
      let response;
      try {
        response = await bulkDuplicateAutomatedCampaign(params);
      } catch (e) {
        if (typeof e == "object" && e != null) {
          toastStore.error(
            (e as { msg?: string }).msg ?? i`Something went wrong`,
          );
        } else {
          toastStore.error(i`Something went wrong`);
        }
      }
      if (response != null && response.code === 0 && response.data) {
        toastStore.positive(i`Your campaigns have been duplicated!`, {
          timeoutMs: 5000,
          link: {
            title: i`View campaigns`,
            url: merchFeURL(`/product-boost/history/list`),
          },
        });
        onClose();
      }
    },
  };

  const cancelButtonProps = {
    text: i`Remind me later`,
    onClick: () => {
      onClose();
    },
  };

  const renderCampaignName = (campaign: BulkDuplicateCampaign) => {
    // If campaign name is empty, showing default text.
    let campaignName = i`(Campaign Name Not Set)`;
    const url = merchFeURL(`/product-boost/detail/${campaign.campaign_id}`);

    if (campaign.campaign_name) {
      campaignName = campaign.campaign_name;
    }

    return (
      <CopyButton
        text={campaign.campaign_id}
        prompt={i`Copy Campaign ID`}
        copyOnBodyClick={false}
      >
        <Link
          className={css(styles.campaignName)}
          openInNewTab
          href={merchFeURL(url)}
        >
          {campaignName}
        </Link>
      </CopyButton>
    );
  };

  const renderSpendOverGmvField = (campaign: BulkDuplicateCampaign) => {
    let spendOverGmv;
    if (campaign.gmv > 0 && campaign.spend != null) {
      spendOverGmv = numeral(campaign.spend / campaign.gmv).format("0.00%");
    } else {
      spendOverGmv = i`No data`;
    }
    return <div>{spendOverGmv}</div>;
  };

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle
        onClose={() => onClose()}
        title={i`Duplicate ProductBoost Campaigns`}
      />
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn
          className={css(styles.content)}
          alignItems="center"
          justifyContent="center"
        >
          <Illustration
            className={css(styles.illustration)}
            name={"homePbModalLogo"}
            alt={""}
          />
          <Heading variant="h1" className={css(styles.title)}>
            Duplicate the following campaigns to gain more sales!
          </Heading>
          <Table
            className={css(styles.campaignsTable)}
            data={campaignsToDuplicate}
            overflowY="visible"
            highlightRowOnHover
            selectedRows={selectedRows}
            canSelectRow={() => true}
            onRowSelectionToggled={onDuplicateRowSelectionToggled}
            rowHeight={68}
          >
            <Table.Column
              _key={undefined}
              title={i`Campaign`}
              columnKey="campaign_name"
            >
              {({ row }: { row: BulkDuplicateCampaign }) =>
                renderCampaignName(row)
              }
            </Table.Column>
            <Table.CurrencyColumn
              _key={undefined}
              title={i`Budget`}
              columnKey="budget"
              currencyCode={currencyCode}
            />
            <Table.CurrencyColumn
              _key={undefined}
              title={i`Spend`}
              columnKey="spend"
              currencyCode={currencyCode}
            />
            <Table.CurrencyColumn
              _key={undefined}
              title={i`GMV`}
              columnKey="gmv"
              currencyCode={currencyCode}
            />
            <Table.Column
              _key={undefined}
              title={i`Spend / GMV`}
              columnKey="spend"
            >
              {({ row }: { row: BulkDuplicateCampaign }) =>
                renderSpendOverGmvField(row)
              }
            </Table.Column>
          </Table>
          <div className={css(styles.balance)}>
            <Text className={css(styles.balanceHeader)} variant="bodyLStrong">
              Available balance:
            </Text>
            <Text className={css(styles.balanceValue)} variant="bodyL">
              {formatCurrency(maxAllowedSpending, currencyCode)}
            </Text>
          </div>
        </Layout.FlexColumn>
        <ModalFooter
          layout="horizontal-centered"
          action={actionButtonProps}
          cancel={cancelButtonProps}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default BulkDuplicateAutomatedModal;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          margin: 24,
          overflow: "hidden",
          maxWidth: "calc(100% - 48px)",
        },
        illustration: {
          width: "150px",
          height: "110px",
          marginBottom: 16,
        },
        title: {
          lineHeight: 1.4,
          textAlign: "center",
          marginBottom: 16,
        },
        balance: {
          display: "flex",
          flexDirection: "row",
          marginBottom: "24px",
          justifyContent: "center",
          alignItems: "center",
        },
        balanceHeader: {
          marginLeft: "24px",
        },
        balanceValue: {
          margin: "0 24px",
        },
        campaignsTable: {
          marginBottom: 16,
          alignSelf: "flex-start",
          maxWidth: "calc(100% - 2px)",
          overflowX: "scroll",
        },
        footerContainer: {
          width: "100%",
        },
        campaignName: {
          fontSize: 14,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
      }),
    [],
  );
};
