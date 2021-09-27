import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import faker from "faker/locale/en";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import _ from "lodash";

/* Lego Components */
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import {
  Field,
  FormSelect,
  TextInput,
  Layout,
  Banner,
  Markdown,
  LoadingIndicator,
  Link,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  RequiredValidator,
  EmailValidator,
  PhoneNumberValidator,
} from "@toolkit/validators";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import {
  CountryCode,
  EuComplianceResponsiblePersonCountriesAndRegionsCode,
  ProductComplianceSchemaLinkCountArgs,
  ProductComplianceSchema,
  Country,
} from "@schema/types";
import ResponsiblePersonState from "@merchant/model/products/ResponsiblePersonState";

const LINK_COUNT_QUERY = gql`
  query LinkCount_ResponsiblePersonModalForm(
    $responsiblePersonIds: [ObjectIdType!]
  ) {
    policy {
      productCompliance {
        linkCount(
          complianceTypes: [EU_REGULATION_20191020_MSR]
          responsiblePersonIds: $responsiblePersonIds
          states: []
        )
        rpValidCountries {
          name
          code
        }
      }
    }
  }
`;

type RequestData = Pick<
  ProductComplianceSchemaLinkCountArgs,
  "responsiblePersonIds"
>;
type ResponseData = {
  readonly policy: {
    readonly productCompliance: Pick<ProductComplianceSchema, "linkCount"> & {
      readonly rpValidCountries: ReadonlyArray<Pick<Country, "name" | "code">>;
    };
  };
};

export type Props = BaseProps & {
  readonly onClose: () => unknown;
  readonly isNew: boolean;
  readonly state: ResponsiblePersonState;
};

const ResponsiblePersonModalForm = (props: Props) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDimenStore();
  const { onClose, state, isNew } = props;
  const [actionButtonLoading] = useState(state.isSubmitting);
  const [isValid, setIsValid] = useState(false);
  const responsiblePersonIds =
    state.responsiblePersonId != null ? [state.responsiblePersonId] : [];

  const { data, loading } = useQuery<ResponseData, RequestData>(
    LINK_COUNT_QUERY,
    {
      variables: {
        responsiblePersonIds,
      },
    }
  );

  const euCountries = useMemo(
    () =>
      _.sortBy(
        data?.policy.productCompliance.rpValidCountries,
        (country) => country.name
      ),
    [data]
  );

  const phoneNumberValidator = useMemo(
    () =>
      new PhoneNumberValidator({
        countryCode: state.countryCode as CountryCode,
      }),
    [state.countryCode]
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (data == null) {
    return null;
  }

  const productCount = data.policy.productCompliance.linkCount || 0;

  const sendButtonProps = {
    isDisabled: !isValid || !state.isValid,
    text: isNew ? i`Submit` : i`Resubmit`,
    isLoading: actionButtonLoading,
    onClick: async () => {
      await state.submit();
      onClose();
    },
  };

  const cancelButtonProps = {
    disabled: actionButtonLoading,
    onClick: () => onClose(),
  };

  const requiredValidator = new RequiredValidator();
  const emailValidator = new EmailValidator();

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <div className={css(styles.content)}>
        {!isNew && productCount > 0 && (
          <Banner
            sentiment="warning"
            text={
              <Markdown
                text={i`Updating this responsible person will impact **${productCount}** products`}
              />
            }
            className={css(styles.row)}
          />
        )}
        <Layout.GridRow className={css(styles.row)}>
          <Field title={i`Individual or Entity Name`}>
            <TextInput
              validators={[requiredValidator]}
              onValidityChanged={(isValid) => {
                setIsValid(isValid);
              }}
              value={state.name}
              placeholder={i`Full name of individual or entity`}
              onChange={({ text }) => {
                state.name = text;
              }}
              debugValue={`${faker.name.firstName()} ${faker.name.lastName()}`}
            />
          </Field>
        </Layout.GridRow>
        <Layout.GridRow className={css(styles.row)}>
          <Field title={i`Responsible Person Address`}>
            <TextInput
              validators={[requiredValidator]}
              onValidityChanged={(isValid) => {
                setIsValid(isValid);
              }}
              placeholder={i`Street address`}
              value={state.streetAddress1}
              onChange={({ text }) => {
                state.streetAddress1 = text;
              }}
              debugValue={faker.address.streetAddress()}
            />
          </Field>
        </Layout.GridRow>
        <Layout.GridRow className={css(styles.row)}>
          <Field title={i`Address Line 2 (Optional)`}>
            <TextInput
              placeholder={i`Apartment, suite, etc.`}
              value={state.streetAddress2}
              onChange={({ text }) => {
                state.streetAddress2 = text;
              }}
            />
          </Field>
        </Layout.GridRow>
        <Layout.GridRow
          templateColumns="1fr 1fr"
          gap={16}
          className={css(styles.row)}
        >
          <Field title={i`City or Town`}>
            <TextInput
              validators={[requiredValidator]}
              value={state.city}
              onValidityChanged={(isValid) => {
                setIsValid(isValid);
              }}
              placeholder={i`Enter city or town`}
              onChange={({ text }) => {
                state.city = text;
              }}
              debugValue={faker.address.city()}
            />
          </Field>
          <Field title={i`State or Region`}>
            <TextInput
              validators={[requiredValidator]}
              value={state.state}
              onValidityChanged={(isValid) => {
                setIsValid(isValid);
              }}
              placeholder={i`Enter state or region`}
              onChange={({ text }) => {
                state.state = text;
              }}
              debugValue={faker.address.state()}
            />
          </Field>
        </Layout.GridRow>
        <Layout.GridRow
          templateColumns="1fr 1fr"
          gap={16}
          className={css(styles.row)}
        >
          <Field title={i`Postal Code`}>
            <TextInput
              validators={[requiredValidator]}
              onValidityChanged={(isValid) => {
                setIsValid(isValid);
              }}
              value={state.zipcode}
              placeholder={i`Enter postal code`}
              onChange={({ text }) => {
                state.zipcode = text;
              }}
              debugValue={faker.address.zipCode()}
            />
          </Field>
          <Field title={i`Country/Region`}>
            <FormSelect
              options={euCountries.map((country) => ({
                value: country.code,
                text: country.name,
              }))}
              placeholder={i`Select country/region`}
              selectedValue={state.countryCode}
              onSelected={(value: string) => {
                state.countryCode = value as EuComplianceResponsiblePersonCountriesAndRegionsCode;
              }}
            />
          </Field>
        </Layout.GridRow>
        <Layout.GridRow
          templateColumns="1fr 1fr"
          gap={16}
          className={css(styles.row)}
        >
          <Field title={i`Email Address`}>
            <TextInput
              validators={[requiredValidator, emailValidator]}
              onValidityChanged={(isValid) => {
                setIsValid(isValid);
              }}
              value={state.email}
              placeholder={i`Enter email address`}
              onChange={({ text }) => {
                state.email = text;
              }}
              debugValue={faker.internet.email()}
            />
          </Field>
          <Field title={i`Phone Number`}>
            <TextInput
              validators={[requiredValidator, phoneNumberValidator]}
              onValidityChanged={(isValid) => {
                setIsValid(isValid);
              }}
              value={state.phoneNumber}
              placeholder={i`Enter phone number`}
              onChange={({ text }) => {
                state.phoneNumber = text;
              }}
              debugValue={faker.phone.phoneNumber()}
            />
          </Field>
        </Layout.GridRow>
      </div>
      <ModalFooter
        layout={isSmallScreen ? "vertical" : "horizontal"}
        action={sendButtonProps}
        extraFooterContent={
          <Link className={css(styles.cancelButton)} {...cancelButtonProps}>
            Cancel
          </Link>
        }
      />
    </Layout.FlexColumn>
  );
};

export default observer(ResponsiblePersonModalForm);

const useStylesheet = () => {
  const { textBlack, negative } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
        },
        content: {
          color: textBlack,
          padding: 24,
        },
        row: {
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
        checkbox: {
          marginTop: 12,
        },
        tosError: {
          color: negative,
          ":nth-child(1n) > *": {
            ":not(:last-child)": {
              marginRight: 8,
            },
          },
        },
        li: {
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
        cancelButton: {
          ":not(:last-child)": {
            marginRight: 24,
          },
        },
      }),
    [textBlack, negative]
  );
};
