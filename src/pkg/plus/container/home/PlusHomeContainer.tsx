import React from "react";
import { observer } from "mobx-react";

import StoreHome from "@plus/component/home/store/StoreHome";
import MerchantHome from "@plus/component/home/merchant/MerchantHome";

import PageRoot from "@plus/component/nav/PageRoot";
import { HomeInitialData } from "@toolkit/home";

type Props = {
  readonly initialData: HomeInitialData;
};

const PlusHomeContainer: React.FC<Props> = ({ initialData }: Props) => {
  const {
    currentMerchant: { isStoreMerchant },
  } = initialData;

  const renderHome = () => {
    if (isStoreMerchant) {
      return <StoreHome initialData={initialData} />;
    }

    return <MerchantHome initialData={initialData} />;
  };

  return <PageRoot>{renderHome()}</PageRoot>;
};

export default observer(PlusHomeContainer);
