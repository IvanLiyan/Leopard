import React, { useState } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import Card, { Props as CardProps } from "./Card";
import { useInfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";
import { MerchantWarningProofType } from "@schema";
import { wishProductURL } from "@core/toolkit/url";
import { CellInfo, Layout, PageIndicator, Table } from "@ContextLogic/lego";
import { InfractionEvidenceTypeDisplayText } from "@infractions/copy";
import { merchFeUrl } from "@core/toolkit/router";

export type InfractionEvidenceType = MerchantWarningProofType | "INFRACTION";

const getIdLink: {
  readonly [type in InfractionEvidenceType]: (props: {
    id: string;
    productId?: string | undefined;
  }) => string;
} = {
  MERCHANT: ({ id }) => id,
  PRODUCT: ({ id }) => `[${id}](${wishProductURL(id)})`,
  VARIATION: ({ id, productId }) =>
    productId ? `[${id}](${wishProductURL(productId)})` : id,
  PRODUCT_RATING: ({ id, productId }) =>
    productId ? `[${id}](${wishProductURL(productId)})` : id,
  TICKET: ({ id }) => `[${id}](${merchFeUrl(`/ticket/${id}`)})`,
  ORDER: ({ id }) => `[${id}](${merchFeUrl(`/order/${id}`)})`,
  INFRACTION: ({ id }) => `[${id}](/warnings/warning?id=${id})`,
};

const PAGE_SIZE = 10;

const InfractionEvidenceCard: React.FC<
  Omit<CardProps, "title" | "children">
> = (props) => {
  const {
    infraction: { infractionEvidence, product, type },
  } = useInfractionContext();
  const [page, setPage] = useState(0);

  if (
    infractionEvidence.length < 1 ||
    type === "WAREHOUSE_FULFILLMENT_POLICY_VIOLATION" ||
    type === "FAKE_TRACKING" ||
    type === "MERCHANT_CANCELLATION_VIOLATION" ||
    type === "LATE_CONFIRMED_FULFILLMENT_VIOLATION" ||
    type === "UNFULFILLED_ORDER" ||
    type === "ORDER_NOT_DELIVERED" ||
    type === "PRODUCT_IS_INAPPROPRIATE" ||
    type === "FINE_FOR_COUNTERFEIT_GOODS" ||
    type === "CN_PROHIBITED_PRODUCTS" ||
    type === "PRODUCT_GEOBLOCK" ||
    type === "BRANDED_PRODUCT_GEOBLOCK" ||
    type === "MISLEADING_VARIATION" ||
    type === "LEGAL_TRO_TAKEDOWN"
  ) {
    return null;
  }

  const lastPage = Math.ceil(infractionEvidence.length / PAGE_SIZE) - 1;
  const rangeStart = page * PAGE_SIZE + 1;
  const rangeEnd = Math.min(infractionEvidence.length, (page + 1) * PAGE_SIZE);
  const data = infractionEvidence.slice(rangeStart - 1, rangeEnd);

  return (
    <Card title={ci18n("card title", "Infraction Evidence")} {...props}>
      <Layout.FlexColumn>
        <Table data={data}>
          <Table.Column
            title={ci18n("type of a piece of evidence", "Type")}
            _key="type"
            columnKey="type"
          >
            {({ row }: CellInfo<unknown, typeof infractionEvidence[0]>) => {
              return (
                <Markdown text={InfractionEvidenceTypeDisplayText[row.type]} />
              );
            }}
          </Table.Column>
          <Table.Column
            title={ci18n("id for a piece of evidence", "ID")}
            _key="id"
            columnKey="id"
          >
            {({ row }: CellInfo<unknown, typeof infractionEvidence[0]>) => {
              return (
                <Markdown
                  text={getIdLink[row.type]({
                    id: row.id,
                    productId: product?.productId,
                  })}
                />
              );
            }}
          </Table.Column>
          <Table.Column
            title={ci18n("note for a piece of evidence", "Note")}
            _key="note"
            columnKey="note"
          />
        </Table>
        {lastPage > 0 && (
          <PageIndicator
            currentPage={page}
            hasPrev={page != 0}
            hasNext={page < lastPage}
            onPageChange={(newPage) => {
              setPage(newPage);
            }}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalItems={infractionEvidence.length}
            style={{ marginTop: 10, alignSelf: "flex-end" }}
          />
        )}
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(InfractionEvidenceCard);
