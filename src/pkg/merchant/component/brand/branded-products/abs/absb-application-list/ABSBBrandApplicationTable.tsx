import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import Flags from "@merchant/component/brand/branded-products/abs/absb-application-list/Flags";
import ABSBApplicationStatusDisplay from "./ABSBApplicationStatusDisplay";
import { renderABSBApplicationDetailModal } from "./ABSBApplicationDetailModal";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ABSBBrandApplication,
  ABSBApplication,
} from "@toolkit/brand/branded-products/abs";

type ABSBBrandApplicationTableProps = BaseProps & {
  readonly brandApp: ABSBBrandApplication;
};

const ABSBBrandApplicationTable = ({
  brandApp,
  style,
}: ABSBBrandApplicationTableProps) => {
  const styles = useStylesheet();

  const actions = [
    {
      key: "view",
      name: i`View details`,
      apply: ([row]: ReadonlyArray<ABSBApplication>) => {
        const appIndex = brandApp.applications.findIndex((app) => {
          return app.application_id === row.application_id;
        });

        renderABSBApplicationDetailModal(brandApp, appIndex);
      },
      canApplyToRow: () => true,
    },
  ];

  const wishWeb = `[wish.com](wish.com)`;

  return (
    <Table
      data={brandApp.applications}
      actions={actions}
      noDataMessage={i`No Authentic Brand Seller Applications Found`}
      rowHeight={65}
      highlightRowOnHover
      className={css(style, styles.table)}
    >
      <Table.DatetimeColumn
        title={i`Date`}
        columnKey={"date_submitted"}
        format={"YYYY-MM-DD"}
        description={i`The date you submitted your application`}
        align={"center"}
      />
      <Table.ObjectIdColumn
        title={i`Application ID`}
        columnKey={"application_id"}
        description={i`Application reference ID`}
        width={120}
        canCopyText
        align={"center"}
      />
      <Table.Column
        title={i`Application Status`}
        columnKey={"status"}
        description={i`The status of your application`}
        align={"center"}
      >
        {({ row }) => (
          <ABSBApplicationStatusDisplay
            status={row.status}
            style={styles.statusContainer}
          />
        )}
      </Table.Column>
      <Table.DatetimeColumn
        title={i`Expiration Date`}
        columnKey={"expiration_date"}
        format={"MM/DD/YYYY"}
        description={
          i`The date your Authentic Brand Product badge ` +
          i`expires for this brand and related region(s)`
        }
        noDataMessage={"N/A"}
        align={"center"}
      />
      <Table.Column
        title={i`Badge Region(s)`}
        columnKey={"confirmed_countries"}
        minWidth={170}
        description={
          i`The customers in the following region(s) will ` +
          i`see the Authentic Product Badge on your branded ` +
          i`listings in the Wish app or on ${wishWeb}`
        }
        noDataMessage={"N/A"}
        align={"center"}
      >
        {({ row }) => (
          <Flags
            countries={row.confirmed_countries}
            style={css(styles.flagContainer)}
            initialDisplay={1}
          />
        )}
      </Table.Column>
    </Table>
  );
};

export default observer(ABSBBrandApplicationTable);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        table: {
          textAlign: "center",
        },
        statusContainer: {
          display: "flex",
          justifyContent: "center",
        },
        flagContainer: {
          display: "flex",
          justifyContent: "center",
        },
      }),
    []
  );
};
