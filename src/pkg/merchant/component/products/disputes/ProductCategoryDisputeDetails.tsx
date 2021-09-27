/*
 * ProductCategoryDisputeDetails.tsx
 *
 * Created by Betty Chen on June 24 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";
import { wishURL, zendeskURL } from "@toolkit/url";

/* Lego Components */
import {
  Layout,
  Card,
  Link,
  Text,
  ThemedLabel,
  Table,
  CellInfo,
  Markdown,
  PageIndicator,
  FormSelect,
  Info,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import {
  PickedProductCategoryDisputeDetailsSchema,
  DisputeStatusLabel,
  DisputeStatusTheme,
  PickedOrder,
  getTopLevelTags,
  AdminDisputeUnchangedReason,
} from "@toolkit/products/product-category-dispute";

type Props = BaseProps & {
  readonly dispute: PickedProductCategoryDisputeDetailsSchema;
  readonly orders: ReadonlyArray<PickedOrder> | null | undefined;
};

const ProductCategoryDisputeDetails: React.FC<Props> = ({
  className,
  style,
  dispute,
  orders: ordersAll,
}: Props) => {
  const styles = useStylesheet();

  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const product = dispute.product;

  const learnMoreLink = zendeskURL("204531558");

  const orders: readonly PickedOrder[] = useMemo(
    () =>
      (ordersAll || []).filter(
        (order) =>
          order.oneoffPayment != null &&
          order.oneoffPayment.type === "REV_SHARE_ADJUSTMENT"
      ),
    [ordersAll]
  );

  const pageResults = useMemo(
    () => (orders || []).slice(offset, limit + offset),
    [orders, limit, offset]
  );

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  const renderOrdersTable = (
    orders: ReadonlyArray<PickedOrder> | null | undefined
  ) => {
    if (orders == null || orders.length === 0) {
      return null;
    }

    return (
      <Table data={orders}>
        <Table.Column
          columnKey="oneoffPayment.creationTime.formatted"
          title={i`Date`}
        />
        <Table.Column columnKey="oneoffPayment.orderId" title={i`Order ID`}>
          {({ row }: CellInfo<string, PickedOrder>) =>
            row.oneoffPayment?.orderId != null && (
              <Link href={`/order/${row.oneoffPayment.orderId}`} openInNewTab>
                {`...${row.oneoffPayment.orderId.slice(-5)}`}
              </Link>
            )
          }
        </Table.Column>
        <Table.Column columnKey="oneoffPayment.id" title={i`Payment Details`}>
          {({ row }: CellInfo<string, PickedOrder>) =>
            row.oneoffPayment != null && (
              <Link
                href={`/oneoff-payment-detail/${row.oneoffPayment.id}`}
                openInNewTab
              >
                {`...${row.oneoffPayment.id.slice(-5)}`}
              </Link>
            )
          }
        </Table.Column>
        <Table.Column
          columnKey="originalRevShare"
          title={i`Previous Revenue Share`}
        >
          {({ row }: CellInfo<string, PickedOrder>) =>
            row.originalRevShare && `${row.originalRevShare}%`
          }
        </Table.Column>
        <Table.Column columnKey="updatedRevShare" title={i`New Revenue Share`}>
          {({ row }: CellInfo<string, PickedOrder>) =>
            row.updatedRevShare && `${row.updatedRevShare}%`
          }
        </Table.Column>
        <Table.Column
          columnKey="oneoffPayment.amount.display"
          title={i`Adjustment`}
        />
      </Table>
    );
  };

  return (
    <Layout.GridRow
      templateColumns="2fr 1fr"
      smallScreenTemplateColumns="1fr"
      gap={32}
      className={css(className, style)}
    >
      <Layout.FlexColumn>
        <Card title={i`Status`} className={css(styles.card)}>
          <Layout.GridRow
            templateColumns="1fr 5fr"
            smallScreenTemplateColumns="1fr"
            gap={24}
            className={css(styles.row)}
          >
            <Text weight="semibold">Status</Text>
            <Layout.FlexRow>
              <ThemedLabel theme={DisputeStatusTheme[dispute.status]}>
                {DisputeStatusLabel[dispute.status]}
              </ThemedLabel>
            </Layout.FlexRow>
          </Layout.GridRow>
          {dispute.adminUnchangedReason && (
            <Layout.GridRow
              templateColumns="1fr 5fr"
              smallScreenTemplateColumns="1fr"
              gap={24}
              className={css(styles.row)}
            >
              <Text weight="semibold">Reason</Text>
              <Text>{`${
                AdminDisputeUnchangedReason[dispute.adminUnchangedReason]
              }${
                dispute.adminUnchangedOtherReasonDetails
                  ? ` - ${dispute.adminUnchangedOtherReasonDetails}`
                  : ""
              }`}</Text>
            </Layout.GridRow>
          )}
          {dispute.trueTagsApproved && dispute.trueTagsApproved.length > 0 && (
            <Layout.GridRow
              templateColumns="1fr 5fr"
              smallScreenTemplateColumns="1fr"
              gap={24}
              className={css(styles.row)}
            >
              <Text weight="semibold">Updated Category</Text>
              <Text>{getTopLevelTags(dispute.trueTagsApproved)}</Text>
            </Layout.GridRow>
          )}
          {orders != null && orders.length > 0 && (
            <Layout.FlexRow
              className={css(styles.row)}
              justifyContent="space-between"
            >
              <Layout.FlexRow>
                <Text weight="semibold" style={{ marginRight: 6 }}>
                  Revenue Share Adjustment
                </Text>
                <Info
                  size={16}
                  position="right center"
                  sentiment="info"
                  popoverMaxWidth={250}
                  popoverContent={
                    i`If a Product Category Dispute results in a revenue share adjustment,` +
                    i`the relevant payment information is included here. [Learn more]` +
                    i`(${learnMoreLink}).`
                  }
                  openContentLinksInNewTab
                />
              </Layout.FlexRow>
              <Layout.FlexRow>
                <PageIndicator
                  rangeStart={offset + 1}
                  rangeEnd={Math.min(
                    offset + pageResults.length,
                    offset + limit
                  )}
                  hasNext={limit + offset < orders.length}
                  hasPrev={offset > 0}
                  currentPage={Math.ceil(offset / limit)}
                  totalItems={orders.length}
                  onPageChange={onPageChange}
                  className={css(styles.tableControl)}
                />
                <FormSelect
                  options={[10, 50, 100].map((v) => ({
                    value: v.toString(),
                    text: v.toString(),
                  }))}
                  onSelected={(value: string) => setLimit(parseInt(value))}
                  selectedValue={limit.toString()}
                  className={css(styles.tableControl, styles.paginationSelect)}
                />
              </Layout.FlexRow>
            </Layout.FlexRow>
          )}
          {renderOrdersTable(orders)}
        </Card>
        <Card title={i`Details`} className={css(styles.card)}>
          <Layout.GridRow
            templateColumns="1fr 5fr"
            smallScreenTemplateColumns="1fr"
            gap={24}
            className={css(styles.row)}
          >
            <Text weight="semibold">Date submitted</Text>
            <Text>{dispute.lastUpdate.formatted}</Text>
          </Layout.GridRow>
          {dispute.source === "EU_COMPLIANCE" && dispute.reason && (
            <Layout.GridRow
              templateColumns="1fr 5fr"
              smallScreenTemplateColumns="1fr"
              gap={24}
              className={css(styles.row)}
            >
              <Text weight="semibold">Reason for dispute</Text>
              <Text>{dispute.reason.text}</Text>
            </Layout.GridRow>
          )}
          {dispute.merchantNote && (
            <Layout.GridRow
              templateColumns="1fr 5fr"
              smallScreenTemplateColumns="1fr"
              gap={24}
              className={css(styles.row)}
            >
              <Text weight="semibold">
                {dispute.source === "EU_COMPLIANCE"
                  ? i`Explanation`
                  : i`Reason for dispute`}
              </Text>
              <Text>{dispute.merchantNote}</Text>
            </Layout.GridRow>
          )}
          {dispute.trueTagsDisputed && dispute.trueTagsDisputed.length > 0 && (
            <Layout.GridRow
              templateColumns="1fr 5fr"
              smallScreenTemplateColumns="1fr"
              gap={24}
              className={css(styles.row)}
            >
              <Text weight="semibold">Disputed Category</Text>
              <Text>{getTopLevelTags(dispute.trueTagsDisputed)}</Text>
            </Layout.GridRow>
          )}
          {dispute.trueTagsProposed && (
            <Layout.GridRow
              templateColumns="1fr 5fr"
              smallScreenTemplateColumns="1fr"
              gap={24}
              className={css(styles.row)}
            >
              <Text weight="semibold">Proposed Category</Text>
              <Text>
                {dispute.trueTagsProposed
                  .map((tag) => tag.name)
                  .join(", ")
                  .trim()}
              </Text>
            </Layout.GridRow>
          )}
          {dispute.supportedFiles && dispute.supportedFiles.length > 0 && (
            <Layout.GridRow
              templateColumns="1fr 5fr"
              smallScreenTemplateColumns="1fr"
              gap={24}
              className={css(styles.row)}
            >
              <Text weight="semibold">Attached files</Text>
              <Layout.FlexColumn>
                {dispute.supportedFiles.map((file) => (
                  <Link href={file.fileUrl} openInNewTab>
                    {file.displayFilename}
                  </Link>
                ))}
              </Layout.FlexColumn>
            </Layout.GridRow>
          )}
        </Card>
      </Layout.FlexColumn>

      <Layout.FlexColumn>
        <Card
          title={i`Product`}
          contentContainerStyle={css(styles.cardContent)}
          className={css(styles.card)}
        >
          <Layout.GridRow templateColumns="1fr 4fr" gap={16}>
            <img src={product.mainImage.wishUrl} />
            <Layout.FlexColumn>
              <Link href={wishURL(`/c/${product.id}`)} openInNewTab>
                {product.name}
              </Link>
              <Markdown
                text={i`PID: ${product.id}`}
                className={css(styles.pid)}
              />
            </Layout.FlexColumn>
          </Layout.GridRow>
        </Card>
      </Layout.FlexColumn>
    </Layout.GridRow>
  );
};

export default observer(ProductCategoryDisputeDetails);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          ":not(:last-child)": {
            marginBottom: 28,
          },
        },
        cardContent: {
          padding: 24,
        },
        illustration: {
          width: 20,
          marginRight: 16,
        },
        pid: {
          marginTop: 8,
        },
        row: {
          padding: "14px 24px",
          ":not(:last-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
        },
        tableControl: {
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        paginationSelect: {
          maxWidth: 50,
          maxHeight: 30,
        },
      }),
    [borderPrimary]
  );
};
