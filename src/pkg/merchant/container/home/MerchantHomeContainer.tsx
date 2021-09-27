import React from "react";
import { observer } from "mobx-react";

import MerchantHome from "@plus/component/home/merchant/MerchantHome";

import PageRoot from "@plus/component/nav/PageRoot";
import { HomeInitialData } from "@toolkit/home";

type Props = {
  readonly initialData: HomeInitialData;
};

const MerchantHomeContainer: React.FC<Props> = ({ initialData }: Props) => {
  return (
    <PageRoot>
      <MerchantHome initialData={initialData} />
    </PageRoot>
  );
};

export default observer(MerchantHomeContainer);
