import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import Skeleton from "@core/components/Skeleton";
import { Text } from "@ContextLogic/atlas-ui";
import { dataMock } from "@product-compliance-center/api/pccQuery";
import EuResponsiblePersonsCards from "@product-compliance-center/components/home-page/EuResponsiblePersonsCard";
import EprCard from "@product-compliance-center/components/home-page/EprCard";
import Image from "@core/components/Image";
import { ci18n } from "@core/toolkit/i18n";

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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  });
  const data = dataMock;

  if (loading) {
    return (
      <PageLayout
        cards={[
          <Skeleton key={"1"} height={238} />,
          <Skeleton key={"2"} height={238} />,
          <Skeleton key={"3"} height={238} />,
          <Skeleton key={"4"} height={238} />,
          <Skeleton key={"5"} height={238} />,
          <Skeleton key={"6"} height={238} />,
        ]}
      />
    );
  }

  if (data.policy?.productCompliance == null) {
    return <Text variant="bodyLStrong">Something went wrong.</Text>;
  }

  return (
    <PageLayout
      cards={[
        <EuResponsiblePersonsCards
          key={-1}
          productsWithResponsiblePerson={
            data.policy.productCompliance.productsWithEuResponsiblePerson
          }
          productsWithoutResponsiblePerson={
            data.policy.productCompliance.productsWithoutEuResponsiblePerson
          }
        />,
        data.policy.productCompliance.extendedProducerResponsibility.countries.map(
          (config, i) => (
            <EprCard
              key={i}
              countryName={config.country.name}
              countryCode={config.country.code}
              isMerchantAuthorized={config.isMerchantAuthorized}
              categoriesWithEpr={config.categoriesWithEpr}
              categoriesWithoutEpr={config.categoriesWithoutEpr}
            />
          ),
        ),
      ]}
    />
  );
};

export default observer(ProductComplianceCenterPage);
