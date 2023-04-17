import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import Skeleton from "@core/components/Skeleton";

const PageLayout = ({ cards }: { cards: ReadonlyArray<React.ReactNode> }) => {
  return (
    <PageRoot>
      <PageHeader relaxed title={i`Product Compliance Center`}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lectus
        mauris, tempor sed eros in, vestibulum aliquet mauris. Sed bibendum
        accumsan mi sed efficitur. Aenean in nulla non nibh malesuada imperdiet.
      </PageHeader>
      <PageGuide relaxed>
        <style jsx>{`
          div {
            display: grid;
            grid-gap: 24px;
            grid-template-columns: repeat(auto-fill, 364px);
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

  return (
    <PageLayout
      cards={[
        <div key={"1"} style={{ backgroundColor: "white" }}>
          test
        </div>,
        <div key={"2"} style={{ backgroundColor: "white" }}>
          Aliquam vel orci eu nulla rutrum vestibulum et a mi. Pellentesque
          condimentum a sem aliquam posuere. Vestibulum ut convallis lorem.
          Quisque a malesuada neque, vel maximus sapien. Duis molestie iaculis
          dolor, ac fringilla quam. Pellentesque at ex sit amet ligula efficitur
          aliquet. Aliquam mollis elit vitae rhoncus aliquet. Mauris
          sollicitudin, nisi id feugiat tincidunt, urna mauris tincidunt est, at
          volutpat sem metus sit amet justo. Pellentesque a ullamcorper ex.
          Mauris dolor purus, ultricies consequat venenatis quis, porta eget
          lectus. Curabitur at eros scelerisque, volutpat quam in, fringilla
          nisl. Donec in tellus vel est posuere ullamcorper. Interdum et
          malesuada fames ac ante ipsum primis in faucibus.
        </div>,
        <div key={"3"} style={{ backgroundColor: "white" }}>
          test
        </div>,
        <div key={"4"} style={{ backgroundColor: "white" }}>
          test
        </div>,
        <div key={"5"} style={{ backgroundColor: "white" }}>
          Aliquam interdum vel felis at ultricies. Donec ligula risus, luctus
          vitae orci vitae, ultrices aliquet tellus.
        </div>,
      ]}
    />
  );
};

export default observer(ProductComplianceCenterPage);
