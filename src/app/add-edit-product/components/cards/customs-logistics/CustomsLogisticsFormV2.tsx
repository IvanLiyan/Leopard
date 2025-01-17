import React from "react";
import { observer } from "mobx-react";
import {
  CurrencyInput,
  Field,
  FormSelect,
  NumericInput,
  TextInput,
  Option,
  ErrorText,
} from "@ContextLogic/lego";
import AddEditProductState, {
  CustomsLogistics,
} from "@add-edit-product/AddEditProductState";
import { useTheme } from "@core/stores/ThemeStore";
import { CountryCode, PaymentCurrencyCode } from "@schema";
import {
  CustomsHsCodeValidator,
  MinMaxValueValidator,
  RequiredValidator,
} from "@core/toolkit/validators";
import {
  CustomsLogisticsWeightUnit,
  INVENTORY_ON_HAND_OPITONS,
  InventoryOnHandState,
  WeightUnitDisplayNames,
} from "@add-edit-product/toolkit";
import { zendeskURL } from "@core/toolkit/url";
import { Grid, Heading, Icon, Stack, Text } from "@ContextLogic/atlas-ui";
import { ci18n } from "@core/toolkit/i18n";
import Link from "@core/components/Link";
import ProductContents from "@add-edit-product/components/cards/ProductContents";

type Props = {
  readonly state: AddEditProductState;
  readonly disabled?: boolean;
  readonly useCalculatedShipping?: boolean;
  readonly customsCountryOptions: ReadonlyArray<Option<CountryCode>>;
  readonly currency: PaymentCurrencyCode;
  readonly onUpdate: (newProps: Partial<CustomsLogistics>) => void;
  readonly onUpdateAll?: (newProps: Partial<CustomsLogistics>) => void;
  readonly data: CustomsLogistics;
  readonly checkHasVariation?: boolean;
  readonly "data-cy"?: string;
};

const CustomsLogisticsFormV2: React.FC<Props> = ({
  state,
  customsCountryOptions,
  currency,
  data,
  onUpdate,
  onUpdateAll,
  disabled,
  useCalculatedShipping,
  checkHasVariation,
  "data-cy": dataCy,
}: Props) => {
  const {
    countryOfOrigin,
    declaredName,
    declaredLocalName,
    customsDeclaredValue,
    customsHsCode,
    weight,
    effectiveWeight,
    hasPowder,
    hasLiquid,
    hasBattery,
    hasMetal,
    inventoryOnHand,
  } = data;
  const { showInventoryOnHand, isCnMerchant, forceValidation } = state;
  const { primary } = useTheme();
  const attributesLearnMoreLink = zendeskURL("1260805100070");
  const hsCodeLearnMoreLink =
    "https://www.wcotradetools.org/en/harmonized-system";
  const weightAbbr = WeightUnitDisplayNames[CustomsLogisticsWeightUnit].symbol;

  let displayWeight = weight;
  if (!weight && useCalculatedShipping && effectiveWeight) {
    displayWeight = effectiveWeight;
  }

  return (
    <Stack direction="column" alignItems="stretch" sx={{ gap: "16px" }}>
      {!checkHasVariation && (isCnMerchant || showInventoryOnHand) && (
        <>
          <Heading variant="h4">
            {ci18n(
              "Product add/edit form section title",
              "Logistics information",
            )}
          </Heading>
          <Grid container spacing={{ xs: 2 }}>
            {isCnMerchant && (
              <Grid item xs={6}>
                <Field
                  title={ci18n(
                    "Add/edit product form field title, product weight, the asterisk symbol means required field",
                    "Weight*",
                  )}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="stretch"
                    sx={{ gap: "8px" }}
                  >
                    <NumericInput
                      value={displayWeight}
                      onChange={({ valueAsNumber }) =>
                        onUpdate({
                          weight: valueAsNumber,
                        })
                      }
                      disabled={disabled}
                      validators={[
                        new RequiredValidator({
                          customMessage: i`This field is required`,
                        }),
                        new MinMaxValueValidator({
                          minAllowedValue: 0,
                          customMessage: i`Value cannot be negative`,
                          allowBlank: true,
                        }),
                      ]}
                      forceValidation={forceValidation}
                      data-cy={`${dataCy}-input-weight`}
                      style={{ width: "90%" }}
                    />
                    <Text variant="bodyM">{weightAbbr}</Text>
                  </Stack>
                </Field>
              </Grid>
            )}
            {showInventoryOnHand && (
              <Grid item xs={6}>
                <Field title={i`Inventory on hand`}>
                  <FormSelect
                    placeholder={ci18n("Dropdown placeholder text", "Select")}
                    options={INVENTORY_ON_HAND_OPITONS}
                    selectedValue={inventoryOnHand ?? "NOT_SET"}
                    onSelected={(option: InventoryOnHandState) => {
                      onUpdate({
                        inventoryOnHand: option,
                      });
                    }}
                    disabled={disabled}
                    data-cy={`${dataCy}-select-inventory-on-hand`}
                  />
                </Field>
              </Grid>
            )}
          </Grid>
        </>
      )}
      {checkHasVariation && (
        <>
          <Heading variant="h4">
            {ci18n("Product add/edit form section title", "Compliance")}
          </Heading>
          <ProductContents
            onUpdate={onUpdate}
            data={data}
            disabled={disabled}
            data-cy={dataCy}
          />
        </>
      )}
      {checkHasVariation && (
        <Link
          data-cy="button-apply-all-logistics"
          onClick={() => {
            onUpdateAll &&
              onUpdateAll({
                hasPowder,
                hasLiquid,
                hasBattery,
                hasMetal,
              });
          }}
        >
          <Stack direction="row" alignItems="center" sx={{ gap: "5px" }}>
            <Icon name="copy" color={primary} />
            <Text style={{ color: primary }}>
              Apply the value to all variations
            </Text>
          </Stack>
        </Link>
      )}

      <Heading variant="h4">
        {ci18n("Product add/edit form section title", "Customs")}
      </Heading>
      <Text variant="bodyM">
        Customs authorities use this information when shipping internationally
      </Text>
      <Grid container spacing={{ xs: 2 }}>
        {!checkHasVariation && (
          <Grid item xs={6}>
            <Field
              title={ci18n(
                "Add/edit product form field title, the asterisk symbol means the field is required",
                "Country of origin*",
              )}
              description={i`Country where the product is manufactured, produced, or grown. [Learn more](${attributesLearnMoreLink})`}
            >
              <FormSelect
                placeholder={i`Select a country or region`}
                options={customsCountryOptions}
                selectedValue={countryOfOrigin}
                onSelected={(cc: CountryCode) => {
                  onUpdate({ countryOfOrigin: cc });
                }}
                disabled={disabled}
                data-cy={`${dataCy}-select-country`}
                error={forceValidation && countryOfOrigin == null}
              />
            </Field>
            {forceValidation && countryOfOrigin == null && (
              <ErrorText style={{ marginTop: 8 }}>
                {i`This field is required`}
              </ErrorText>
            )}
          </Grid>
        )}
        <Grid item xs={6}>
          <Field
            title={i`Declared name`}
            description={
              i`Declared name of the product used for customs clearance. ` +
              i`This is often displayed on the product packaging. [Learn more](${attributesLearnMoreLink})`
            }
          >
            <TextInput
              value={declaredName}
              onChange={({ text }) => onUpdate({ declaredName: text })}
              disabled={disabled}
              data-cy={`${dataCy}-input-declared-name`}
            />
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field
            title={i`Declared local name`}
            description={
              i`Declared name in local language from original country. [Learn ` +
              i`more](${attributesLearnMoreLink})`
            }
          >
            <TextInput
              value={declaredLocalName}
              onChange={({ text }) => onUpdate({ declaredLocalName: text })}
              disabled={disabled}
              data-cy={`${dataCy}-input-declared-local-name`}
            />
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field
            title={i`Customs declared value`}
            description={
              i`The price of your product that will be declared to the customs. ` +
              i`This is often displayed on the product packaging. [Learn ` +
              i`more](${attributesLearnMoreLink})`
            }
          >
            <CurrencyInput
              currencyCode={currency}
              value={customsDeclaredValue}
              onChange={({ textAsNumber }) =>
                onUpdate({ customsDeclaredValue: textAsNumber })
              }
              disabled={disabled}
              data-cy={`${dataCy}-input-declared-value`}
            />
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field
            title={i`Customs HS code`}
            description={
              i`Harmonization System Code used for customs declaration. This is often displayed on the product packaging. ` +
              i`HS classification can be found here. [Learn more](${hsCodeLearnMoreLink})`
            }
          >
            <TextInput
              value={customsHsCode}
              onChange={({ text }) => onUpdate({ customsHsCode: text })}
              validators={[new CustomsHsCodeValidator({ allowBlank: true })]}
              disabled={disabled}
              data-cy={`${dataCy}-input-hs-code`}
            />
          </Field>
        </Grid>
      </Grid>
      {checkHasVariation && (
        <Link
          data-cy="button-apply-all-customs"
          onClick={() => {
            onUpdateAll &&
              onUpdateAll({
                declaredName,
                declaredLocalName,
                customsDeclaredValue,
                customsHsCode,
              });
          }}
        >
          <Stack direction="row" alignItems="center" sx={{ gap: "5px" }}>
            <Icon name="copy" color={primary} />
            <Text style={{ color: primary }}>
              Apply the value to all variations
            </Text>
          </Stack>
        </Link>
      )}
    </Stack>
  );
};

export default observer(CustomsLogisticsFormV2);
