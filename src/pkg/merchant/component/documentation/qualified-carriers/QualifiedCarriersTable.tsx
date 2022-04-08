import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Layout,
  Text,
  SecondaryButton,
  Table,
  CellInfo,
} from "@ContextLogic/lego";

/* Merchant Components */
import InstructionsModal from "@merchant/component/documentation/qualified-carriers/InstructionsModal";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Model */
import QualifiedCarriersState from "@merchant/model/documentation/QualifiedCarriersState";

/* Type Imports */
import { PickedTrackingFormats } from "@merchant/api/documentation/qualified-carriers";
import { CountryCode } from "@schema/types";

type TableData = {
  readonly id: number;
  readonly name: string;
  readonly providerUrl: string;
  readonly status: boolean;
  readonly trackingUrl: string;
  readonly trackingFormats?: ReadonlyArray<PickedTrackingFormats>;
  readonly qualifiedNote?: string;
  readonly ddpSupportedOriginCountries?: ReadonlyArray<CountryCode>;
};

export type Props = {
  readonly editState: QualifiedCarriersState;
};

const QualifiedCarriersTable: React.FC<Props> = ({ editState }: Props) => {
  const styles = useStylesheet();

  const suggestButton = (
    <SecondaryButton style={styles.button}>Suggest new carrier</SecondaryButton>
  );

  return (
    <Table
      style={styles.table}
      data={editState.qualifiedCarriersData}
      noDataMessage={() => (
        <Layout.FlexColumn
          style={styles.noDataContainer}
          justifyContent="center"
        >
          <Text style={styles.note}>No carriers found</Text>
          {editState.canSuggest === true && (
            <Layout.FlexRow
              style={styles.buttonContainer}
              justifyContent="center"
            >
              {suggestButton}
            </Layout.FlexRow>
          )}
        </Layout.FlexColumn>
      )}
    >
      <Table.LinkColumn
        title={
          (editState.destinationCountry != null &&
            (editState.euVatCountries || []).includes(
              editState.destinationCountry
            )) ||
          editState.destinationCountry == "GB"
            ? i`Qualified Carriers (PC-VAT)`
            : i`Qualified Carriers`
        }
        _key={undefined}
        columnKey="name"
        width={"50%"}
        href={({ row }) => row.providerUrl}
        text={({ row }) => row.name}
        noDataMessage="N/A"
        openInNewTab
      />
      <Table.Column
        title={i`Carrier Instructions`}
        _key={undefined}
        columnKey="trackingFormats"
        width={"50%"}
        noDataMessage="N/A"
      >
        {({ row }: CellInfo<string, TableData>) => {
          if (
            (row.ddpSupportedOriginCountries == null ||
              row.ddpSupportedOriginCountries.length === 0) &&
            row.qualifiedNote == null &&
            (row.trackingFormats == null ||
              row.trackingFormats?.length === 0) &&
            editState.note == null
          )
            return <Text style={styles.noDataMessage}>N/A</Text>;
          const {
            trackingFormats,
            name,
            qualifiedNote,
            ddpSupportedOriginCountries,
          } = row;
          return (
            <Layout.FlexColumn
              style={styles.tableInfo}
              onClick={() =>
                new InstructionsModal(
                  {
                    modalTitle: i`Carrier Instructions`,
                    name,
                    modalDetails: {
                      trackingFormats,
                      qualifiedNote,
                      ddpSupportedOriginCountries,
                    },
                  },
                  editState
                ).render()
              }
            >
              <Text style={styles.tableInfoText} weight="semibold">
                View instructions
              </Text>
            </Layout.FlexColumn>
          );
        }}
      </Table.Column>
    </Table>
  );
};

export default observer(QualifiedCarriersTable);

const useStylesheet = () => {
  const { textLight, borderPrimary, primary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        table: {
          marginTop: 20,
        },
        note: {
          color: textLight,
        },
        buttonContainer: {
          marginTop: 8,
        },
        button: {
          height: 42,
          maxWidth: 180,
          borderColor: borderPrimary,
        },
        noDataContainer: {
          margin: 16,
          width: "100%",
        },
        tableInfo: {
          ":hover": {
            cursor: "pointer",
          },
        },
        tableInfoText: {
          color: primary,
        },
        noDataMessage: {
          ":hover": {
            cursor: "none",
          },
        },
      }),
    [textLight, borderPrimary, primary]
  );
};
