import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CopyButton, Layout } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { RowSelectionArgs } from "@ContextLogic/lego";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { useToastStore } from "@core/stores/ToastStore";
import {
  BulkEnableAutomatedCampaignParams,
  BulkResumeCampaign,
  PB_ENABLE_CAMPAIGN_BULK_ENDPOINT,
} from "@home/toolkit/product-boost";
import { PaymentCurrencyCode } from "@schema";
import ModalTitle from "@core/components/modal/ModalTitle";
import Illustration from "@core/components/Illustration";
import { css } from "@core/toolkit/styling";
import ModalFooter from "@core/components/modal/ModalFooter";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { useMutation } from "@core/toolkit/restApi";
import { merchFeUrl } from "@core/toolkit/router";

export type BulkResumeCampaignModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly campaignsToResume?: ReadonlyArray<BulkResumeCampaign>;
    readonly maxAllowedSpending?: number;
    readonly onClose: () => unknown;
    readonly currencyCode: PaymentCurrencyCode;
  };

const BulkResumeCampaignModal: React.FC<BulkResumeCampaignModalProps> = ({
  campaignsToResume,
  maxAllowedSpending,
  onClose,
  open,
  currencyCode,
}) => {
  const styles = useStylesheet();

  const toastStore = useToastStore();

  const initalCampaignIds = (campaignsToResume ?? []).map(
    (campaign) => campaign.campaign_id,
  );

  const [selectedCampaignIds, setSelectedCampaignIds] =
    useState(initalCampaignIds);

  const selectedRows = (campaignsToResume ?? []).reduce(
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
        caller_source: "EnableCampaignModalBulkEnable",
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
            url: merchFeUrl(`/product-boost/history/list`),
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
    const url = merchFeUrl(`/product-boost/detail/${campaign.campaign_id}`);

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
          href={merchFeUrl(url)}
        >
          {campaignName}
        </Link>
      </CopyButton>
    );
  };

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle
        onClose={() => onClose()}
        title={i`Resume ProductBoost Campaigns`}
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
          <Heading className={css(styles.title)} variant="h1">
            Resume your paused ProductBoost campaigns
          </Heading>
          <Table
            className={css(styles.campaignsTable)}
            data={campaignsToResume}
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
            <Table.SwitchColumn
              _key={undefined}
              title={i`Auto Renew`}
              columnKey="is_evergreen"
              align="left"
              switchProps={(cell) => {
                return {
                  disabled: true,
                  isOn: cell.value,
                  onToggle: () => {
                    return;
                  },
                };
              }}
              width={150}
            />
            <Table.CurrencyColumn
              _key={undefined}
              title={i`Budget`}
              columnKey="max_budget"
              align="left"
              width={150}
              currencyCode={currencyCode}
            />
          </Table>
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

export default observer(BulkResumeCampaignModal);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        illustration: {
          width: "150px",
          height: "110px",
          marginBottom: 16,
        },
        title: {
          marginBottom: 16,
          textAlign: "center",
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
