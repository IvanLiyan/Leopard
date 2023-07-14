import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { Field, TextInput } from "@ContextLogic/lego";
import AddEditProductState, {
  createCustomsLogistics,
  CustomsLogistics,
  getVariationOptionValues,
  UniqueGtinValidator,
  Variation,
} from "@add-edit-product/AddEditProductState";
import { ci18n } from "@core/toolkit/i18n";
import ModalTitle from "@core/components/modal/ModalTitle";
import { Button, Grid, Heading, Stack } from "@ContextLogic/atlas-ui";
import AttributeField from "@add-edit-product/components/cards/AttributeField";
import { Divider } from "@mui/material";
import { GtinValidator } from "@core/toolkit/validators";
import CustomsLogisticsFormV2 from "@add-edit-product/components/cards/customs-logistics/CustomsLogisticsFormV2";
import Skeleton from "@core/components/Skeleton";

type AttributesModalProps = Pick<ModalProps, "open"> & {
  readonly state: AddEditProductState;
  readonly variation: Variation;
  readonly onClose: () => unknown;
};

const AttributesModal: React.FC<AttributesModalProps> = ({
  open,
  state,
  variation,
  onClose,
}) => {
  const {
    customsCountryOptions,
    primaryCurrency,
    updateAllCustomsLogistics,
    updateVariation,
    useCalculatedShipping,
    variationAttributes,
    forceValidation,
    isSubmitting,
    isUpdatingCustoms,
  } = state;

  const {
    customCustomsLogistics,
    size,
    color,
    options,
    attributes,
    gtin,
    clientSideId,
  } = variation;

  const initialCustomsData = useMemo(() => {
    if (customCustomsLogistics != null) {
      return createCustomsLogistics(customCustomsLogistics);
    }
    return createCustomsLogistics();
  }, [customCustomsLogistics]);

  const [editedCustoms, setEditedCustoms] =
    useState<CustomsLogistics>(initialCustomsData);
  const [editedAttributes, setEditedAttributes] =
    useState<Variation["attributes"]>(attributes);
  const [editedGtin, setEditedGtin] = useState<Variation["gtin"]>(gtin);

  const titleText = useMemo(() => {
    if (
      size == null &&
      color == null &&
      (options == null || Object.entries(options).length === 0)
    ) {
      return ci18n("Variation modal header", "Add/Edit attributes");
    }

    const optionValues = getVariationOptionValues(variation);
    const name = [...optionValues, color, size]
      .filter((part) => part != null)
      .join(" / ");
    return ci18n(
      "Variation modal header",
      "Add/Edit attributes: {%1=display name}",
      name,
    );
  }, [size, color, options, variation]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setEditedCustoms(initialCustomsData);
        setEditedAttributes(attributes);
        setEditedGtin(gtin);
        onClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <ModalTitle onClose={onClose} title={titleText} />
      <Stack direction="column" alignItems="stretch" key={clientSideId}>
        <Stack
          direction="column"
          alignItems="stretch"
          sx={{ padding: "20px", gap: "16px" }}
        >
          {variationAttributes.length > 0 && (
            <>
              <Heading variant="h4">
                {ci18n(
                  "Product add/edit form section title",
                  "Variation attributes",
                )}
              </Heading>
              <Grid container spacing={{ xs: 2 }}>
                {variationAttributes.map((attribute) => {
                  const attrValue =
                    editedAttributes && editedAttributes[attribute.name];
                  return (
                    <Grid item key={attribute.id} xs={6}>
                      <AttributeField
                        state={state}
                        attribute={attribute}
                        value={attrValue}
                        onChange={(value) =>
                          setEditedAttributes((prev) => {
                            return {
                              ...prev,
                              [attribute.name]: value,
                            };
                          })
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}

          {isUpdatingCustoms ? (
            <Skeleton height={160} />
          ) : (
            <CustomsLogisticsFormV2
              state={state}
              currency={primaryCurrency}
              data={editedCustoms}
              disabled={isSubmitting}
              useCalculatedShipping={useCalculatedShipping}
              customsCountryOptions={customsCountryOptions}
              onUpdate={(newProps: Partial<CustomsLogistics>) => {
                setEditedCustoms((prev) => {
                  return {
                    ...prev,
                    ...newProps,
                  };
                });
              }}
              onUpdateAll={(newProps) => {
                updateAllCustomsLogistics(newProps);
              }}
              data-cy="variation-customs"
              checkHasVariation
            />
          )}

          <Heading variant="h4">
            {ci18n("Product add/edit form section title", "Other")}
          </Heading>
          <Field
            title={ci18n("Product add/edit form field title", "GTIN")}
            description={
              i`${8} to ${14} digits GTIN (UPC, EAN, ISBN) contains no letters or ` +
              i`other characters. GTIN must be unique for each variation.`
            }
          >
            <TextInput
              value={editedGtin}
              onChange={({ text }) => setEditedGtin(text)}
              validators={[
                new GtinValidator(),
                new UniqueGtinValidator({ pageState: state }),
              ]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
              inputContainerStyle={{
                maxWidth: 250,
              }}
              data-cy="input-gtin"
            />
          </Field>
        </Stack>

        <Divider />
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ padding: "20px" }}
        >
          <Button
            primary
            onClick={() => {
              updateVariation({
                clientSideId,
                newProps: {
                  customCustomsLogistics: editedCustoms,
                  attributes: editedAttributes,
                  gtin: editedGtin,
                },
              });
              onClose();
            }}
            data-cy="attributes-modal-button-save"
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default observer(AttributesModal);
