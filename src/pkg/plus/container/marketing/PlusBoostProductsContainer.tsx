import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";

import BoostProducts from "@plus/component/marketing/manage-boost/BoostProducts";

import { BoostProductsInitialData } from "@toolkit/marketing/boost-products";
import BoostProductsState from "@plus/model/BoostProductsState";

type Props = {
  readonly initialData: BoostProductsInitialData;
};

const PlusBoostProductsContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const [boostState] = useState(new BoostProductsState({ initialData }));

  const onSave = async () => {
    await boostState.submit();
  };

  const actions = (
    <>
      <Button href="/plus/marketing/boost">Discard</Button>
      <PrimaryButton onClick={onSave} isDisabled={!boostState.canSave} minWidth>
        Save
      </PrimaryButton>
    </>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Boost products`}
        actions={actions}
        className={css(styles.header)}
        breadcrumbs={[
          { name: i`Boosted products`, href: "/plus/marketing/boost" },
          { name: i`Boost products`, href: window.location.href },
        ]}
      />
      <PageGuide>
        <BoostProducts boostState={boostState} />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        headerText: {
          marginTop: 8,
        },
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
      }),
    []
  );
};

export default observer(PlusBoostProductsContainer);
