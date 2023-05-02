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
import { Card } from "@ContextLogic/lego";
import { Heading } from "@ContextLogic/atlas-ui";

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
      >
        <>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lectus
          mauris, tempor sed eros in, vestibulum aliquet mauris. Sed bibendum
          accumsan mi sed efficitur. Aenean in nulla non nibh malesuada
          imperdiet.
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
              Integer metus dui, volutpat vel elit id, pellentesque consequat
              ante. Suspendisse eu accumsan augue. Duis justo neque, blandit ac
              placerat et, vulputate eget dolor.
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
              grid-template-columns: repeat(auto-fill, 310px);
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

  if (!(countryIntermediary in countries)) {
    return <FullPageError error={"404"} />;
  }
  const country = countryIntermediary as keyof typeof countries; // guaranteed by above check

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
      cards={[
        <div key={"1"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
        <div key={"2"} style={{ backgroundColor: "#EFF4F6" }}>
          Aliquam vel orci eu nulla rutrum vestibulum et a mi. Pellentesque
          condimentum a sem aliquam posuere. Vestibulum ut convallis lorem.
          Quisque a malesuada neque, vel maximus sapien. Duis molestie iaculis
          dolor, ac fringilla quam. Pellentesque at ex sit amet ligula efficitur
          aliquet. Aliquam mollis elit vitae rhoncus aliquet.
        </div>,
        <div key={"3"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
        <div key={"4"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
        <div key={"5"} style={{ backgroundColor: "#EFF4F6" }}>
          Aliquam interdum vel felis at ultricies. Donec ligula risus, luctus
          vitae orci vitae, ultrices aliquet tellus.
        </div>,
        <div key={"6"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
        <div key={"7"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
        <div key={"8"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
        <div key={"9"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
        <div key={"10"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
        <div key={"11"} style={{ backgroundColor: "#EFF4F6" }}>
          test
        </div>,
      ]}
    />
  );
};

export default observer(ProductComplianceCenterPage);
