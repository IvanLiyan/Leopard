import { NextPage } from "next";
import Head from "next/head";
import { observer } from "mobx-react";

import AddProductDemoContainer from "@merchant/container/products/AddProductDemoContainer";

const AddProductDemoPage: NextPage<Record<string, never>> = () => {
  return (
    <>
      <Head>
        <title>{"Wish For Merchants"}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AddProductDemoContainer />
    </>
  );
};

export default observer(AddProductDemoPage);
