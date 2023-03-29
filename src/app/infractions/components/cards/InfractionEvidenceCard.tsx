import React, { useState } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import Card, { Props as CardProps } from "./Card";
import { useInfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";
import { MerchantWarningProofType } from "@schema";
import { wishProductURL } from "@core/toolkit/url";
import { CellInfo, Layout, PageIndicator, Table } from "@ContextLogic/lego";
import { MerchantWarningProofTypeDisplayText } from "@infractions/toolkit";
import { merchFeURL } from "@core/toolkit/router";

const getIdLink: {
  readonly [type in MerchantWarningProofType]: (props: {
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
  TICKET: ({ id }) => `[${id}](${merchFeURL(`/ticket/${id}`)})`,
  ORDER: ({ id }) => `[${id}](${merchFeURL(`/order/${id}`)})`,
};

const PAGE_SIZE = 10;

const InfractionEvidenceCard: React.FC<
  Omit<CardProps, "title" | "children">
> = (props) => {
  const {
    infraction: { infractionEvidence, product },
  } = useInfractionContext();
  const [page, setPage] = useState(0);

  if (infractionEvidence.length < 1) {
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
                <Markdown
                  text={MerchantWarningProofTypeDisplayText[row.type]}
                />
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
