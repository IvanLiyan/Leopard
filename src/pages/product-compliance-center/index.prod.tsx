import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import Skeleton from "@core/components/Skeleton";
import { Button, Text } from "@ContextLogic/atlas-ui";
import {
  PCC_QUERY,
  PccQueryResponse,
} from "@product-compliance-center/api/pccQuery";
import EuResponsiblePersonsCards from "@product-compliance-center/components/home-page/EuResponsiblePersonsCard";
import EprCard from "@product-compliance-center/components/home-page/EprCard";
import Image from "@core/components/Image";
import { ci18n } from "@core/toolkit/i18n";
import { useQuery } from "@apollo/client";
import ActionCard from "@core/components/ActionCard";
import Link from "next/link";

const PageLayout = ({ cards }: { cards: ReadonlyArray<React.ReactNode> }) => {
  return (
    <PageRoot>
      <PageHeader
        relaxed
        title={i`Product Compliance Center`}
        illustration={() => (
          <Image
            src="/md/images/product-compliance-center/header-image.svg"
            alt={ci18n(
              "alt text for an image",
              "product compliance center icon",
            )}
            width={288}
            height={160}
          />
        )}
      >
        Please make sure your product compliance information is correct and up
        to date. Missing or inaccurate product compliance information may result
        in lower product impressions, products blocked in certain regions, or
        fines.
      </PageHeader>
      <PageGuide relaxed>
        <style jsx>{`
          div {
            display: grid;
            grid-gap: 24px;
            grid-template-columns: repeat(auto-fit, minmax(364px, 1fr));
            margin-top: 24px;
          }
        `}</style>
        <div>{cards}</div>
      </PageGuide>
    </PageRoot>
  );
};

const ProductComplianceCenterPage: NextPage<Record<string, never>> = () => {
  const { data, loading, error } = useQuery<PccQueryResponse>(PCC_QUERY);

  if (loading) {
    return (
      <PageLayout
        cards={[
          <Skeleton key={"1"} height={167.5} />,
          <Skeleton key={"2"} height={167.5} />,
          <Skeleton key={"3"} height={167.5} />,
          <Skeleton key={"4"} height={167.5} />,
          <Skeleton key={"5"} height={167.5} />,
          <Skeleton key={"6"} height={167.5} />,
        ]}
      />
    );
  }

  if (error || data?.policy?.productCompliance == null) {
    return <Text variant="bodyLStrong">Something went wrong.</Text>;
  }

  return (
    <PageLayout
      cards={[
        data.policy.productCompliance.euComplianceInScope ? (
          <EuResponsiblePersonsCards
            key={-1}
            productsWithResponsiblePerson={
              data.policy.productCompliance.productsWithEuResponsiblePerson
            }
            productsWithoutResponsiblePerson={
              data.policy.productCompliance.productsWithoutEuResponsiblePerson
            }
          />
        ) : null,
        data.policy.productCompliance.extendedProducerResponsibility.countries.map(
          (config, i) => (
            <EprCard
              key={i}
              countryName={config.country.name}
              countryCode={config.country.code}
              categoriesWithEpr={config.categoriesWithEpr}
              categoriesWithoutEpr={config.categoriesWithoutEpr}
              hasAcceptedTos={config.hasAcceptedTos}
            />
          ),
        ),
        <ActionCard
          key={-2}
          title={i`Discounted EPR Services`}
          ctaButtons={
            <Link href={"http://www.avaskgroup.com/wish"} passHref>
              <Button secondary>Enter</Button>
            </Link>
          }
        >
          <Text component="div">
            Avask offers EPR registration services, including a 50% off discount
            on obtaining EPR registration numbers
          </Text>
        </ActionCard>,
        data.policy.productCompliance.extendedProducerResponsibility.eprNonCompliantSummary.summaryRecords.some(
          (record) => record.nonCompliantProductCount > 0,
        ) ? (
          <ActionCard
            key={-3}
            title={i`EPR Products Requiring Attention`}
            ctaButtons={
              <Link
                href={"/product-compliance-center/epr-non-compliant"}
                passHref
              >
                <Button secondary>Enter</Button>
              </Link>
            }
          >
            <Text component="div">
              One or more of your products are missing an EPR registration
              number
            </Text>
          </ActionCard>
        ) : null,
      ]}
    />
  );
};

export default observer(ProductComplianceCenterPage);
