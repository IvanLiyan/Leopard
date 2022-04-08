import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text, PrimaryButton, Table, H6, Ul } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { getCountryName } from "@toolkit/countries";

/* Merchant Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Model */
import QualifiedCarriersState from "@merchant/model/documentation/QualifiedCarriersState";

/* Type Imports */
import { PickedTrackingFormats } from "@merchant/api/documentation/qualified-carriers";
import { CountryCode } from "@schema/types";

type ModalData = {
  readonly modalTitle: string;
  readonly name: string;
  readonly modalDetails: {
    readonly trackingFormats?: ReadonlyArray<PickedTrackingFormats>;
    readonly qualifiedNote?: string;
    readonly ddpSupportedOriginCountries?: ReadonlyArray<CountryCode>;
  };
};

type InstructionsModalContentProps = BaseProps & {
  readonly modalData: ModalData;
  readonly editState: QualifiedCarriersState;
};

const InstructionsModalContent = observer(
  (props: InstructionsModalContentProps) => {
    const styles = useStyleSheet();

    const { modalData, editState } = props;
    const { note, wishpostChannels } = editState;
    const { name, modalDetails } = modalData;
    const { trackingFormats, qualifiedNote, ddpSupportedOriginCountries } =
      modalDetails;
    const country = getCountryName(editState.destinationCountry);

    const getText = () => {
      if (editState.destinationCountry == null) {
        return (
          i`Please use one of the following tracking ID formats when fulfilling ` +
          i`with ${name} for these destination countries.`
        );
      }
      return trackingFormats != null && trackingFormats.length > 1
        ? i`Please use one of the following tracking ID formats when fulfilling ` +
            i`with ${name} for destination country ${country}.`
        : i`When fulfilling with ${name} to ${country} tracking IDs ` +
            i`${
              trackingFormats != null && trackingFormats[0].format != null
                ? trackingFormats[0].format.charAt(0).toLowerCase() +
                  trackingFormats[0].format.slice(1)
                : ""
            }.`;
    };

    return (
      <Layout.FlexColumn style={styles.root}>
        <H6>
          {editState.originCountry == null
            ? i`Shipping `
            : `${editState.originCountry} `}
          to
          {editState.destinationCountry == null
            ? i` the following destination countries:`
            : ` ${country}:`}
        </H6>

        {qualifiedNote != null && (
          <Text style={styles.subtitle}>{qualifiedNote}</Text>
        )}

        {note != null && <Text style={styles.subtitle}>{editState.note}</Text>}
        {wishpostChannels != null && wishpostChannels.length > 0 && (
          <Layout.FlexColumn style={styles.marginTop}>
            <H6>Wishpost Channels</H6>
            <Ul style={styles.subtitle}>
              {wishpostChannels.map((channel) => (
                <Ul.Li>{channel}</Ul.Li>
              ))}
            </Ul>
          </Layout.FlexColumn>
        )}

        {ddpSupportedOriginCountries != null &&
          ddpSupportedOriginCountries.length > 0 && (
            <Layout.FlexColumn style={styles.marginTop}>
              <H6>DDP Supported Origin Countries</H6>
              <Ul style={styles.subtitle}>
                {ddpSupportedOriginCountries.map((country) => {
                  const name = getCountryName(country);
                  if (name) return <Ul.Li>{name}</Ul.Li>;
                  return <Ul.Li>{country}</Ul.Li>;
                })}
              </Ul>
            </Layout.FlexColumn>
          )}

        {trackingFormats != null && trackingFormats.length > 0 && (
          <Layout.FlexColumn style={styles.marginTop}>
            <Text>{getText()}</Text>
            <Table
              style={styles.marginTop}
              data={trackingFormats}
              noDataMessage="N/A"
            >
              <Table.Column
                title={i`Accepted Format`}
                _key={undefined}
                columnKey="format"
                noDataMessage="N/A"
                minWidth={200}
              />
              <Table.Column
                title={i`Example`}
                _key={undefined}
                columnKey="example"
                noDataMessage="N/A"
              >
                {({ value }) => value || "N/A"}
              </Table.Column>
              {editState.destinationCountry == null && (
                <Table.Column
                  title={i`Destination Country`}
                  _key={undefined}
                  columnKey="country"
                  noDataMessage="N/A"
                >
                  {({ value }) => value.name || ""}
                </Table.Column>
              )}
            </Table>
          </Layout.FlexColumn>
        )}
      </Layout.FlexColumn>
    );
  }
);

export default class InstructionsModal extends Modal {
  modalData: ModalData;
  editState: QualifiedCarriersState;

  constructor(modalData: ModalData, editState: QualifiedCarriersState) {
    super(() => null);
    this.modalData = modalData;
    this.setHeader({ title: modalData.modalTitle });
    this.setRenderFooter(() => (
      <Layout.FlexColumn
        style={{ minHeight: 80 }}
        justifyContent="center"
        alignItems="center"
      >
        <PrimaryButton style={{ width: 70 }} onClick={() => this.close()}>
          Close
        </PrimaryButton>
      </Layout.FlexColumn>
    ));
    this.setWidthPercentage(0.45);
    this.editState = editState;
  }

  renderContent() {
    return (
      <InstructionsModalContent
        modalData={this.modalData}
        editState={this.editState}
      />
    );
  }
}

const useStyleSheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
          borderBottom: `1px solid ${borderPrimary}`,
        },
        subtitle: {
          marginTop: 8,
        },
        marginTop: {
          marginTop: 24,
        },
      }),
    [borderPrimary]
  );
};
