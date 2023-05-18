import React, { useState } from "react";
import { observer } from "mobx-react";
import ActionCard from "@core/components/ActionCard";
import { Button, Text } from "@ContextLogic/atlas-ui";
import { CountryCode } from "@schema";
import Link from "next/link";
import TosModal from "@product-compliance-center/components/EprTosModal";
import { useRouter } from "@core/toolkit/router";

export type Props = {
  readonly countryName: string;
  readonly countryCode: CountryCode;
  readonly categoriesWithEpr: number;
  readonly categoriesWithoutEpr: number;
  readonly hasAcceptedTos: boolean;
};

const EprCard: React.FC<Props> = ({
  countryName,
  countryCode,
  categoriesWithEpr,
  categoriesWithoutEpr,
  hasAcceptedTos,
}) => {
  const [tosModalOpen, setTosModalOpen] = useState(false);
  const router = useRouter();
  const href = `/product-compliance-center/epr?country=${countryCode}`;

  return (
    <>
      <TosModal
        country={countryCode}
        open={tosModalOpen}
        onClose={() => {
          setTosModalOpen(false);
        }}
        onAccept={() => {
          void router.push(href);
        }}
      />
      <ActionCard
        title={i`Extended Producer Responsibility - ${countryName}`}
        ctaButtons={
          hasAcceptedTos ? (
            <Link href={href} passHref>
              <Button secondary href={href}>
                Enter
              </Button>
            </Link>
          ) : (
            <Button
              secondary
              onClick={() => {
                setTosModalOpen(true);
              }}
            >
              Enter
            </Button>
          )
        }
      >
        <Text component="div">
          Categories with EPR Registration Number:{" "}
          <Text variant="bodyMStrong">{categoriesWithEpr}</Text>
        </Text>
        <Text component="div">
          Categories without EPR Registration Number:{" "}
          <Text variant="bodyMStrong">{categoriesWithoutEpr}</Text>
        </Text>
      </ActionCard>
    </>
  );
};

export default observer(EprCard);
