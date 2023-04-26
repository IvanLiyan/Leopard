import React from "react";
import { observer } from "mobx-react";

import { useQuery } from "@apollo/client";
import { GET_HOME_INITIAL_DATA, HomeInitialData } from "@home/toolkit/home";
import PageRoot from "@core/components/PageRoot";
import MerchantHome from "@home/components/MerchantHome";
import FullPageError from "@core/components/FullPageError";
import { NextPage } from "next";

const MerchantHomeContainer: NextPage<Record<string, never>> = () => {
  const { data, loading } = useQuery<HomeInitialData>(GET_HOME_INITIAL_DATA);

  if (data == null && !loading) {
    return <FullPageError error="500" />;
  }

  return (
    <PageRoot>
      <MerchantHome initialData={data} />
    </PageRoot>
  );
};

export default observer(MerchantHomeContainer);
