import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { PageGuide } from "@merchant/component/core";

/* Merchant Components */
import SizeChart from "@merchant/component/products/size-chart/SizeChart";
import { useNavigationStore } from "@stores/NavigationStore";
import { Button, BackButton, Layout, H4, TextInput } from "@ContextLogic/lego";
import { useStringQueryParam } from "@toolkit/url";

const CreateSizeChartContainer = () => {
  const NextJSNavigationTestSection: React.FC = () => {
    const navStore = useNavigationStore();
    const [query, setQuery] = useStringQueryParam("q");
    const [query2, setQuery2] = useStringQueryParam("q2");

    return (
      <Layout.FlexColumn
        style={{
          borderStyle: "solid",
          padding: 10,
          margin: 10,
        }}
      >
        <H4 style={{ marginBottom: 10 }}>Testing Section</H4>
        <Layout.FlexRow>
          <BackButton>Back Via Default</BackButton>
          <Button
            onClick={() => {
              navStore.back();
            }}
          >
            Back Via onClick
          </Button>
          <Button
            onClick={() => {
              navStore.navigate("/demo/order-history-container");
            }}
          >
            To Order History
          </Button>
        </Layout.FlexRow>
        <TextInput
          placeholder="query 1"
          value={query}
          onChange={({ text }) => {
            setQuery(text);
          }}
        />
        <TextInput
          placeholder="query 2"
          value={query2}
          onChange={({ text }) => {
            setQuery2(text);
          }}
        />
      </Layout.FlexColumn>
    );
  };

  return (
    <PageGuide>
      <NextJSNavigationTestSection />
      <SizeChart isCreate />
    </PageGuide>
  );
};

export default observer(CreateSizeChartContainer);
