import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import Skeleton from "@core/components/Skeleton";
import countries from "@core/toolkit/countries";
import { useStringQueryParam } from "@core/toolkit/url";
import FullPageError from "@core/components/FullPageError";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import { Card, Markdown } from "@ContextLogic/lego";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { zendeskURL } from "@core/toolkit/url";
import { dataMock } from "@product-compliance-center/api/eprQuery";
import EprCategoryCard from "@product-compliance-center/components/epr-page/EprCategoryCard";
import Image from "@core/components/Image";
import { ci18n } from "@core/toolkit/i18n";

const PageLayout = ({
  country,
  cards,
}: {
  country: keyof typeof countries;
  cards: ReadonlyArray<React.ReactNode>;
}) => {
  const { surfaceLighter } = useTheme();

  return (
    <PageRoot>
      <PageHeader
        relaxed
        title={i`Extended Producer Responsibility - ${countries[country]}`}
        breadcrumbs={[
          {
            name: i`Product Compliance Center`,
            href: "/product-compliance-center",
          },
          {
            name: i`Extended Producer Responsibility - ${countries[country]}`,
            href: window.location.href,
          },
        ]}
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
        <>
          <Markdown
            text={i`Please review our [EPR program](${zendeskURL(
              "4411082731931",
            )}) requirements for more information.`}
          />
          <style jsx>{`
            .outer {
              margin-top: 16px;
              display: flex;
              align-items: center;
              background-color: ${surfaceLighter};
              padding: 8px 8px 8px 16px;
              max-width: fit-content;
            }
            .inner {
              padding: 8px;
            }
          `}</style>
          <div className="outer">
            <Icon name="warning" />
            <div className="inner">
              Wish will block your product listings and/or impressions if you
              don&apos;t provide accurate EPR registration numbers. This may
              impact your sales in {countries[country]}.
            </div>
          </div>
        </>
      </PageHeader>
      <PageGuide relaxed>
        <Card
          style={{
            marginTop: "24px",
            padding: "24px",
          }}
        >
          <Heading variant="h3">Categories</Heading>
          <style jsx>{`
            div {
              margin-top: 16px;
              display: grid;
              grid-gap: 24px;
              grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
            }
          `}</style>
          <div>{cards}</div>
        </Card>
      </PageGuide>
    </PageRoot>
  );
};

const ProductComplianceCenterPage: NextPage<Record<string, never>> = () => {
  const [countryParam] = useStringQueryParam("country");
  const countryIntermediary = countryParam.toUpperCase();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  });
  const data = dataMock;

  if (!(countryIntermediary in countries)) {
    return <FullPageError error={"404"} />;
  }
  const country = countryIntermediary as keyof typeof countries; // guaranteed by above check

  if (data.policy?.productCompliance == null) {
    return <Text variant="bodyLStrong">Something went wrong.</Text>;
  }

  if (loading) {
    return (
      <PageLayout
        country={country}
        cards={[
          <Skeleton key={"0"} height={408} />,
          <Skeleton key={"1"} height={408} />,
          <Skeleton key={"2"} height={408} />,
          <Skeleton key={"3"} height={408} />,
          <Skeleton key={"4"} height={408} />,
          <Skeleton key={"5"} height={408} />,
          <Skeleton key={"6"} height={408} />,
          <Skeleton key={"7"} height={408} />,
          <Skeleton key={"8"} height={408} />,
          <Skeleton key={"9"} height={408} />,
          <Skeleton key={"10"} height={408} />,
          <Skeleton key={"11"} height={408} />,
          <Skeleton key={"12"} height={408} />,
          <Skeleton key={"13"} height={408} />,
          <Skeleton key={"14"} height={408} />,
          <Skeleton key={"15"} height={408} />,
          <Skeleton key={"16"} height={408} />,
          <Skeleton key={"17"} height={408} />,
          <Skeleton key={"18"} height={408} />,
          <Skeleton key={"19"} height={408} />,
        ]}
      />
    );
  }

  return (
    <PageLayout
      country={country}
      cards={data.policy?.productCompliance?.extendedProducerResponsibility.country.categories.map(
        (config, i) => (
          <EprCategoryCard
            key={i}
            id={config.id}
            category={config.category}
            categoryName={config.categoryName}
            uin={config.uin}
            responsibleEntityName={config.responsibleEntityName}
            status={config.status}
            country={country}
          />
        ),
      )}
    />
  );
};

export default observer(ProductComplianceCenterPage);
