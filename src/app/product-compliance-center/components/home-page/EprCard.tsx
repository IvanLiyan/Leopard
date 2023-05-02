import React from "react";
import { observer } from "mobx-react";
import ActionCard from "@core/components/ActionCard";
import { Button, Text } from "@ContextLogic/atlas-ui";
import { CountryCode } from "@schema";
import Link from "next/link";

export type Props = {
  readonly countryName: string;
  readonly countryCode: CountryCode;
  readonly isMerchantAuthorized: boolean;
  readonly categoriesWithEpr: number;
  readonly categoriesWithoutEpr: number;
};

const EprCard: React.FC<Props> = ({
  countryName,
  countryCode,
  isMerchantAuthorized,
  categoriesWithEpr,
  categoriesWithoutEpr,
}) => {
  const href = `/product-compliance-center/epr?country=${countryCode}`;

  void isMerchantAuthorized; // TODO: will add modal in future ticket, need to confirm copy

  return (
    <ActionCard
      title={i`Extended Producer Responsibility - ${countryName}`}
      ctaButtons={
        <Link href={href} passHref>
          <Button secondary href={href}>
            Enter
          </Button>
        </Link>
      }
    >
      <Text component="div">
        Categories with EPR Registration Number:{" "}
        <Text variant="bodyMStrong">{categoriesWithEpr}</Text>
      </Text>
      <Text component="div">
        Products without EPR Registration Number:{" "}
        <Text variant="bodyMStrong">{categoriesWithoutEpr}</Text>
      </Text>
    </ActionCard>
  );
};

export default observer(EprCard);
