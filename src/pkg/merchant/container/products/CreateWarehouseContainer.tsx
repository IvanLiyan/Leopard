/*
 * CreateWarehouseContainer.tsx
 *
 * Created by Betty Chen on Mon May 7 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Button, PrimaryButton, Layout } from "@ContextLogic/lego";

/* Merchant Components */
import CreateWarehouseSection from "@merchant/component/products/warehouse-settings/CreateWarehouseSection";
import { PageGuide } from "@merchant/component/core";
import WelcomeHeader from "@merchant/component/core/WelcomeHeader";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import WarehouseSettingsState from "@merchant/model/products/WarehouseSettingsState";
import { WarehouseSettingsInitialData } from "@toolkit/products/warehouse-settings";

type Props = {
  readonly initialData: WarehouseSettingsInitialData;
};

const CreateWarehouseContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const state = useMemo(() => new WarehouseSettingsState(), []);

  const actions = (
    <>
      <Button href="/warehouse-overview" minWidth>
        Cancel
      </Button>
      <PrimaryButton
        onClick={async () => await state.submit()}
        isDisabled={state.isSubmitting || !state.formValid}
        minWidth
      >
        Save
      </PrimaryButton>
    </>
  );

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <WelcomeHeader
        title={i`Unsaved Warehouse`}
        actions={actions}
        breadcrumbs={[
          { name: i`Products`, href: "/product" },
          { name: i`Add warehouse`, href: "/product/create-warehouse" },
        ]}
        paddingY="32px"
      />
      <PageGuide>
        <CreateWarehouseSection
          state={state}
          className={css(styles.content)}
          initialData={initialData}
        />
      </PageGuide>
    </Layout.FlexColumn>
  );
};

export default observer(CreateWarehouseContainer);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
        },
        content: {
          marginTop: 64,
        },
      }),
    [pageBackground]
  );
};
