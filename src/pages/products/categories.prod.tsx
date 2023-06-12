import PageGuide from "@core/components/PageGuide";
import PageRoot from "@core/components/PageRoot";
import PageHeader from "@core/components/PageHeader";
import AllCategories from "@categories/components/AllCategories";
import { observer } from "mobx-react";
import React from "react";
import Skeleton from "@core/components/Skeleton";
import { useDeciderKey } from "@core/stores/ExperimentStore";
import { merchFeUrl, useRouter } from "@core/toolkit/router";
import { NextPage } from "next";
import FullPageError from "@core/components/FullPageError";
import { Text } from "@ContextLogic/atlas-ui";

const CategoriesAttributesPage: NextPage<Record<string, never>> = () => {
  const { decision: showCsvRevamp, isLoading: isLoadingShowCsvRevamp } =
    useDeciderKey("show_csv_revamp_ui");
  const router = useRouter();

  if (isLoadingShowCsvRevamp) {
    return (
      <PageRoot style={{ padding: "20px" }}>
        <Skeleton height={100} sx={{ marginBottom: "20px" }} />
        <Skeleton height={800} />
      </PageRoot>
    );
  }

  if (!showCsvRevamp) {
    void router.push(merchFeUrl("/product/categories"));
    return <FullPageError error="403" />;
  }

  return (
    <PageRoot>
      <PageHeader title={i`Categories and Attributes`} relaxed>
        <Text variant="bodyLStrong">
          Navigate the category paths, or search for and select your product
          category, to view its attributes or download a CSV template (coming
          soon). You can provide these attributes when adding or editing
          products manually or via API, or you will have the option to do so via
          CSV soon.
        </Text>
      </PageHeader>
      <PageGuide relaxed>
        <AllCategories />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(CategoriesAttributesPage);
