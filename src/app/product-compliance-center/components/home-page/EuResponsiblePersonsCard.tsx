import React from "react";
import { observer } from "mobx-react";
import ActionCard from "@core/components/ActionCard";
import { Button, Text } from "@ContextLogic/atlas-ui";

export type Props = {
  readonly productsWithResponsiblePerson: Maybe<number>;
  readonly productsWithoutResponsiblePerson: Maybe<number>;
};

const EuResponsiblePersonsCard: React.FC<Props> = ({
  productsWithResponsiblePerson,
  productsWithoutResponsiblePerson,
}) => {
  return (
    <ActionCard
      title={i`European (EU) Responsible Persons`}
      ctaButtons={
        <Button secondary href={"/product/responsible-person"}>
          Enter
        </Button>
      }
    >
      {productsWithResponsiblePerson != null && (
        <Text component="div">
          Products with Responsible Person:{" "}
          <Text variant="bodyMStrong">{productsWithResponsiblePerson}</Text>
        </Text>
      )}
      {productsWithoutResponsiblePerson != null && (
        <Text component="div">
          Products without Responsible Person:{" "}
          <Text variant="bodyMStrong">{productsWithoutResponsiblePerson}</Text>
        </Text>
      )}
    </ActionCard>
  );
};

export default observer(EuResponsiblePersonsCard);
