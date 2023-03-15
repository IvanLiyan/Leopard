import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import Card, { Props as CardProps } from "./Card";
import { useInfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";
import { MerchantWarningProofType } from "@schema";
import { wishProductURL } from "@core/toolkit/url";
import { CellInfo, Table } from "@ContextLogic/lego";
import { MerchantWarningProofTypeDisplayText } from "@infractions/toolkit";

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
  TICKET: ({ id }) => `[${id}](${`/ticket/${id}`})`,
  ORDER: ({ id }) => `[${id}](${`/order/${id}`})`,
};

const InfractionEvidenceCard: React.FC<
  Omit<CardProps, "title" | "children">
> = (props) => {
  const {
    infraction: { infractionEvidence, product },
  } = useInfractionContext();

  if (infractionEvidence.length < 1) {
    return null;
  }

  return (
    <Card title={ci18n("card title", "Infraction Evidence")} {...props}>
      <Table data={infractionEvidence}>
        <Table.Column
          title={ci18n("type of a piece of evidence", "Type")}
          _key="type"
          columnKey="type"
        >
          {({ row }: CellInfo<unknown, typeof infractionEvidence[0]>) => {
            return (
              <Markdown text={MerchantWarningProofTypeDisplayText[row.type]} />
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
    </Card>
  );
};

export default observer(InfractionEvidenceCard);
