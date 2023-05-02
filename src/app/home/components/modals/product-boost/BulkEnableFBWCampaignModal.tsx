import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { PaymentCurrencyCode } from "@schema";
import { useToastStore } from "@core/stores/ToastStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  BulkEnableAutomatedCampaignParams,
  BulkResumeCampaign,
  PB_ENABLE_CAMPAIGN_BULK_ENDPOINT,
} from "@home/toolkit/product-boost";
import {
  CopyButton,
  Layout,
  Link,
  RowSelectionArgs,
  Table,
} from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import Illustration from "@core/components/Illustration";
import { formatCurrency } from "@core/toolkit/currency";
import ModalFooter from "@core/components/modal/ModalFooter";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { useMutation } from "@core/toolkit/restApi";
import { merchFeURL } from "@core/toolkit/router";

export type BulkEnableFBWCampaignModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly fbwCampaignsToEnable?: ReadonlyArray<BulkResumeCampaign>;
    readonly maxAllowedSpending?: number;
    readonly onClose: () => unknown;
    readonly currencyCode: PaymentCurrencyCode;
  };

const BulkEnableFBWCampaignModal: React.FC<BulkEnableFBWCampaignModalProps> = ({
  fbwCampaignsToEnable = [],
  maxAllowedSpending,
  onClose,
  open,
  currencyCode,
}: BulkEnableFBWCampaignModalProps) => {
  const styles = useStylesheet();

  const toastStore = useToastStore();

  const initCampaignIds = fbwCampaignsToEnable.map(
    (campaign) => campaign.campaign_id,
  );

  const [selectedCampaignIds, setSelectedCampaignIds] =
    useState(initCampaignIds);

  const selectedRows = fbwCampaignsToEnable.reduce(
    //disabled to satisfy the callback requirement on .reduce
    //eslint-disable-next-line local-rules/no-large-method-params
    (accumulator: number[], row: BulkResumeCampaign, index: number) => {
      if (selectedCampaignIds.includes(row.campaign_id)) {
        accumulator = [...accumulator, index];
      }
      return accumulator;
    },
    [],
  );

  const onResumeCampaignRowSelectionToggled = ({
    row,
    selected,
  }: RowSelectionArgs<BulkResumeCampaign>) => {
    if (selected) {
      addCampaign(row);
    } else {
      removeCampaign(row);
    }
  };

  const addCampaign = (row: BulkResumeCampaign) => {
    if (!selectedCampaignIds.includes(row.campaign_id)) {
      setSelectedCampaignIds((prevCampaignIds) => [
        ...prevCampaignIds,
        row.campaign_id,
      ]);
    }
  };

  const removeCampaign = (row: BulkResumeCampaign) => {
    setSelectedCampaignIds((prevCampaignIds) => {
      const idIndex = prevCampaignIds.indexOf(row.campaign_id);
      return prevCampaignIds.filter((_, index) => {
        return index !== idIndex;
      });
    });
  };

  const { trigger: bulkEnableAutomatedCampaign } = useMutation<
    {
      code: number;
      data: unknown;
    },
    BulkEnableAutomatedCampaignParams
  >({
    url: PB_ENABLE_CAMPAIGN_BULK_ENDPOINT,
  });

  const actionButtonProps = {
    text: i`Resume selected campaigns`,
    isDisabled: selectedCampaignIds.length === 0,
    onClick: async () => {
      const params = {
        campaign_ids: [...selectedCampaignIds],
        caller_source: "EnableFBWCampaignModalBulkEnable",
      };
      let response;
      try {
        response = await bulkEnableAutomatedCampaign(params);
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
        toastStore.positive(i`Your campaigns have been enabled!`, {
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

  const renderCampaignName = (campaign: BulkResumeCampaign) => {
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

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle title={i`Boost your products`} onClose={() => onClose()} />
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn
          className={css(styles.content)}
          alignItems="center"
          justifyContent="center"
        >
          <Illustration
            className={css(styles.illustration)}
            name="homePbModalFbwDiscount"
            alt={""}
          />
          <Heading className={css(styles.title)} variant="h1">
            Boost your sales by enabling 50% off ProductBoost campaigns
          </Heading>
          <Text className={css(styles.subtitle)} variant="bodyLStrong">
            Your products have arrived at the FBW warehouse, and earned 50%
            ProductBoost discounts
          </Text>
          {maxAllowedSpending != null && (
            <div className={css(styles.balance)}>
              <Text className={css(styles.balanceHeader)} variant="bodyLStrong">
                Available balance:
              </Text>
              <Text className={css(styles.balanceValue)} variant="bodyL">
                {formatCurrency(maxAllowedSpending, currencyCode)}
              </Text>
            </div>
          )}
          <Table
            className={css(styles.campaignsTable)}
            data={fbwCampaignsToEnable}
            overflowY="visible"
            highlightRowOnHover
            selectedRows={selectedRows}
            canSelectRow={() => true}
            onRowSelectionToggled={onResumeCampaignRowSelectionToggled}
            rowHeight={68}
          >
            <Table.Column
              _key={undefined}
              title={i`Campaign`}
              columnKey="campaign_name"
              align="left"
              width={150}
            >
              {({ row }: { row: BulkResumeCampaign }) =>
                renderCampaignName(row)
              }
            </Table.Column>
            <Table.Column
              _key={undefined}
              title={i`Start Date`}
              columnKey="start_date"
              align="left"
              width={150}
            />
            <Table.Column
              _key={undefined}
              title={i`End Date`}
              columnKey="end_date"
              align="left"
              width={150}
            />
            <Table.Column
              _key={undefined}
              title={i`Budget`}
              columnKey="max_budget"
              align="left"
              width={150}
            />
          </Table>
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

export default BulkEnableFBWCampaignModal;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        illustration: {
          // eslint-disable-next-line local-rules/no-frozen-width
          width: "300px",
          height: "220px",
          // eslint-disable-next-line local-rules/no-complex-styling
          marginBottom: "-30px",
          // eslint-disable-next-line local-rules/no-complex-styling
          marginTop: "-50px",
        },
        title: {
          marginBottom: 16,
          textAlign: "center",
        },
        subtitle: {
          marginBottom: 16,
          textAlign: "center",
        },
        balance: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        },
        balanceHeader: {
          marginLeft: "24px",
        },
        balanceValue: {
          margin: "0 24px",
        },
        campaignsTable: {
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
