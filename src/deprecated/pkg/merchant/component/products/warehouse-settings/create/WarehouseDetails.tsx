import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

/* Lego Components */
import { Layout, Card, Checkpoint, Text, Markdown } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Relative Imports */
import EditWarehouseForm from "./EditWarehouseForm";

/* Model */
import WarehouseSettingsState from "@merchant/model/products/WarehouseSettingsState";

type Props = BaseProps & {
  readonly state: WarehouseSettingsState;
  // readonly initialData: TODO;
};

const WarehouseDetails: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const styles = useStylesheet();

  const faqLink = zendeskURL("115002117074");

  return (
    <Layout.GridRow
      templateColumns="2fr 1fr"
      alignItems="stretch"
      gap={32}
      className={css(className, style)}
    >
      <Card
        title={i`Warehouse details`}
        contentContainerStyle={css(styles.card)}
      >
        <EditWarehouseForm state={state} />
      </Card>
      <Card
        title={i`How to create a new warehouse`}
        contentContainerStyle={css(styles.card)}
      >
        <Checkpoint>
          <Checkpoint.Point>Enter your warehouse details</Checkpoint.Point>
          <Checkpoint.Point>
            Enable shipping destinations for your new warehouse.
          </Checkpoint.Point>
        </Checkpoint>
        <Text>
          In order to enable products in this warehouse for sale, you must have
          at least one shipping destination enabled here (as well as provide
          inventory, shipping price, and max delivery days for your products)
        </Text>
        <Markdown
          text={i`Still need help? [View our FAQ](${faqLink})`}
          openLinksInNewTab
        />
      </Card>
    </Layout.GridRow>
  );
};

export default observer(WarehouseDetails);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          padding: 24,
          ":nth-child(1n) > *": {
            ":not(:last-child)": {
              marginBottom: 24,
            },
          },
        },
      }),
    []
  );
};
