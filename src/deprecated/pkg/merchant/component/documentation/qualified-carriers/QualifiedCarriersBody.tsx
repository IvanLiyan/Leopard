import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Layout,
  Card,
  Field,
  FormSelect,
  Text,
  SearchBox,
  SecondaryButton,
  Markdown,
  LoadingIndicator,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Merchant Components */
import QualifiedCarriersTable from "@merchant/component/documentation/qualified-carriers/QualifiedCarriersTable";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import ConditionalWrapper from "@merchant/component/ConditionalWrapper";
import { proxima } from "@toolkit/fonts";

/* Model */
import QualifiedCarriersState from "@merchant/model/documentation/QualifiedCarriersState";

/* Schema */
import { CountryCode } from "@schema/types";

export type Props = {
  readonly editState: QualifiedCarriersState;
};

const QualifiedCarriersBody: React.FC<Props> = ({ editState }: Props) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const learnMoreLink = zendeskURL("115005882948");

  const suggestButton = (
    <SecondaryButton style={styles.button}>Suggest new carrier</SecondaryButton>
  );

  return (
    <Card style={styles.root}>
      <ConditionalWrapper
        condition={isSmallScreen}
        wrapper={(children) => (
          <Layout.FlexColumn>{children}</Layout.FlexColumn>
        )}
        altWrapper={(children) => (
          <Layout.FlexRow
            style={styles.fieldsContainer}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            {children}
          </Layout.FlexRow>
        )}
      >
        <Field
          style={isSmallScreen ? styles.fieldMobile : styles.field}
          title={i`Destination country`}
        >
          <FormSelect
            style={styles.formSelect}
            options={editState.countriesOptions}
            placeholder={i`Select destination country`}
            onSelected={(value: CountryCode) => {
              editState.destinationCountry = value;
              editState.getShippingProviderPolicies();
            }}
            selectedValue={editState.destinationCountry}
            disabled={editState.isLoading === true}
            showArrow
          />
        </Field>
        {editState.isLoading && (
          <LoadingIndicator
            style={[
              isSmallScreen ? styles.loadingMobile : styles.loading,
              styles.field,
            ]}
          />
        )}
        {editState.destinationCountry != null &&
          editState.originCountries.size > 0 &&
          !editState.isLoading && (
            <Field
              style={isSmallScreen ? styles.fieldMobile : styles.field}
              title={i`Origin country`}
            >
              <FormSelect
                style={styles.formSelect}
                options={editState.originCountryOptions}
                placeholder={i`Select origin country`}
                onSelected={(value: string) => {
                  editState.originCountry = value;
                  editState.updateSelectedPolicy();
                }}
                selectedValue={editState.originCountry}
                showArrow
              />
            </Field>
          )}
        {editState.destinationCountry != null &&
          editState.originCountry != null &&
          editState.orderValueOptions.length > 0 &&
          !editState.isLoading && (
            <Field
              style={isSmallScreen ? styles.fieldMobile : styles.field}
              title={i`Order value`}
              description={() => (
                <Layout.FlexColumn style={styles.info}>
                  <Markdown
                    style={styles.infoText}
                    text={
                      i`Expected customer-paid product price for the order's expected arriving ` +
                      i`consignment value. [Learn more](${learnMoreLink})`
                    }
                    openLinksInNewTab
                  />
                </Layout.FlexColumn>
              )}
            >
              <FormSelect
                style={styles.formSelect}
                options={editState.orderValueOptions}
                placeholder={i`Select order value`}
                onSelected={(value: string) => {
                  editState.orderValue = value;
                  editState.updateSelectedPolicy();
                }}
                selectedValue={editState.orderValue}
                showArrow
              />
            </Field>
          )}
      </ConditionalWrapper>
      {editState.destinationCountry === "GB" && !editState.isLoading && (
        <Text style={styles.note}>
          United Kingdom bound orders require carriers with DAP+ services.
        </Text>
      )}
      {!editState.isLoading && (
        <Layout.FlexRow
          style={styles.searchContainer}
          justifyContent="space-between"
        >
          {editState.qualifiedCarriersData != null && (
            <SearchBox
              style={isSmallScreen ? styles.searchMobile : styles.search}
              placeholder={i`Search`}
              value={editState.search}
              onChange={({ text }) => (editState.search = text)}
            />
          )}
          {editState.canSuggest === true && !isSmallScreen && suggestButton}
        </Layout.FlexRow>
      )}
      {!editState.isLoading && <QualifiedCarriersTable editState={editState} />}
    </Card>
  );
};

export default observer(QualifiedCarriersBody);

const useStylesheet = () => {
  const { textLight, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
          border: "none",
          boxShadow: "none",
        },
        fieldsContainer: {
          flexWrap: "wrap",
        },
        field: {
          ":not(:last-child)": {
            marginRight: 24,
          },
          marginBottom: 8,
        },
        fieldMobile: {
          marginBottom: 16,
        },
        formSelect: {
          minWidth: 224,
        },
        info: { fontFamily: proxima, maxWidth: 300, padding: 16 },
        infoText: { fontSize: 14 },
        note: {
          color: textLight,
          marginBottom: 8,
        },
        searchContainer: {
          marginTop: 12,
        },
        loading: {
          maxWidth: 235,
          marginTop: 23,
        },
        loadingMobile: {
          marginTop: 8,
        },
        search: {
          minWidth: 235,
        },
        searchMobile: {
          width: "100%",
        },
        button: {
          height: 42,
          maxWidth: 180,
          borderColor: borderPrimary,
        },
      }),
    [textLight, borderPrimary]
  );
};
