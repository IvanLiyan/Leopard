import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";
import EprNonCompliantHub from "@product-compliance-center/components/epr-non-compliant/EprNonCompliantHub";

const EPRNonCompliantPage: NextPage<Record<string, never>> = () => {
  return (
    <PageRoot>
      <PageHeader
        relaxed
        title={i`EPR Products Requiring Attention`}
        breadcrumbs={[
          {
            name: i`Product Compliance Center`,
            href: "/product-compliance-center",
          },
          {
            name: i`EPR Products Requiring Attention`,
            href: window.location.href,
          },
        ]}
      />
      <PageGuide relaxed>
        <EprNonCompliantHub />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(EPRNonCompliantPage);
