import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { InfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";
import { MerchantWarningProofType } from "@schema";
import { wishProductURL } from "@core/toolkit/url";
import { CellInfo, Table } from "@ContextLogic/lego";
import { MerchantWarningProofTypeDisplayText } from "@infractions/toolkit";

const getIdLink: {
  readonly [type in MerchantWarningProofType]: (id: string) => string;
} = {
  MERCHANT: (id) => `[${id}](${"#TODO"})`,
  PRODUCT: (id) => `[${id}](${wishProductURL(id)})`,
  VARIATION: (id) => `[${id}](${"#TODO"})`,
  PRODUCT_RATING: (id) => `[${id}](${"#TODO"})`,
  TICKET: (id) => `[${id}](${`/ticket/${id}`})`,
  ORDER: (id) => `[${id}](${`/order/${id}`})`,
};

const InfractionEvidenceCard: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const {
    infraction: { infractionEvidence },
  } = useContext(InfractionContext);

  if (infractionEvidence.length < 1) {
    return null;
  }

  return (
    <Card
      title={ci18n("card title", "Infraction Evidence")}
      style={[className, style]}
    >
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
            return <Markdown text={getIdLink[row.type](row.id)} />;
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
