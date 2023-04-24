import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Accordion, Field, Layout, Markdown, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalFooter from "@core/components/modal/ModalFooter";
import AddEditProductState, {
  getVariationOptionValues,
  Variation,
} from "@add-edit-product/AddEditProductState";
import { useTheme } from "@core/stores/ThemeStore";
import AttributeInput from "@add-edit-product/components/cards/AttributeInput";
import { css, IS_LARGE_SCREEN, IS_SMALL_SCREEN } from "@core/toolkit/styling";
import ModalTitle from "@core/components/modal/ModalTitle";

type Props = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly state: AddEditProductState;
    readonly onClose: () => void;
  };

const TaxonomyAttributesModal: React.FC<Props> = ({
  open,
  state,
  onClose,
  style,
  className,
}) => {
  const styles = useStylesheet();
  const { surfaceLightest } = useTheme();
  const {
    variations,
    taxonomyAttributes,
    optionNames,
    forceValidation,
    isSubmitting,
    updateVariation,
  } = state;

  const [accordionOpen, setAccordionOpen] = useState<
    Partial<Record<string, boolean>>
  >({});

  const [editedAttributes, setEditedAttributes] = useState<
    Record<string, Variation["attributes"]>
  >(
    variations.reduce<Record<string, Variation["attributes"]>>((acc, cur) => {
      if (cur.enabled == false) {
        return acc;
      }
      return {
        ...acc,
        [cur.clientSideId]: cur.attributes,
      };
    }, {}),
  );

  const attributes = taxonomyAttributes.filter(
    (attr) => attr.isVariationAttribute && !optionNames.includes(attr.name), // filter out attributes that are used as variation options
  );

  return (
    <Modal open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ModalTitle
        title={ci18n(
          "Modal title, lets merchant input optional fashion taxonomy attributes on the variation level",
          "Variation Attributes",
        )}
        onClose={onClose}
      />
      <Layout.FlexColumn style={[style, className]} alignItems="stretch">
        <Layout.FlexColumn style={styles.content} alignItems="stretch">
          <Markdown
            openLinksInNewTab
            text={
              i`Enter or select values for each variation's attributes. ` +
              i`Only variations that are enabled will appear here. ` +
              i`To enable variations, go to the [View All Products](${"/md/products"}) page.`
            }
            style={styles.text}
          />
          {variations.map((variation) => {
            if (variation.enabled == false) {
              return null;
            }
            const optionValues = getVariationOptionValues(variation);
            const headerText = [
              ...optionValues,
              variation.size,
              variation.color,
              variation.sku,
            ]
              .filter((attribute) => attribute != null)
              .join(" / ");

            return (
              <Accordion
                key={variation.id}
                hideLines
                isOpen={accordionOpen[variation.clientSideId]}
                onOpenToggled={(isOpen) => {
                  setAccordionOpen((prev) => {
                    return {
                      ...prev,
                      [variation.clientSideId]: isOpen,
                    };
                  });
                }}
                chevronLocation="right"
                headerContainerStyle={styles.accordionHeader}
                backgroundColor={surfaceLightest}
                header={() => (
                  <Text weight="bold" style={styles.accordionHeaderText}>
                    {headerText}
                  </Text>
                )}
                data-cy={`accordion-variation-${
                  variation.sku ?? variation.clientSideId
                }`}
              >
                <div className={css(styles.fieldsContainer)}>
                  {attributes?.map((attribute) => {
                    const attrValue =
                      editedAttributes[variation.clientSideId]?.[
                        attribute.name
                      ];
                    return (
                      <Field
                        style={styles.field}
                        title={attribute.name}
                        description={attribute.description}
                        key={attribute.id}
                      >
                        <AttributeInput
                          style={styles.input}
                          attribute={attribute}
                          value={attrValue}
                          onChange={(value) =>
                            setEditedAttributes((prev) => {
                              return {
                                ...prev,
                                [variation.clientSideId]: {
                                  ...prev[variation.clientSideId],
                                  [attribute.name]: value,
                                },
                              };
                            })
                          }
                          forceValidation={forceValidation}
                          disabled={isSubmitting}
                          acceptNegative={false}
                        />
                      </Field>
                    );
                  })}
                </div>
              </Accordion>
            );
          })}
        </Layout.FlexColumn>

        <ModalFooter
          layout="horizontal"
          action={{
            text: ci18n("CTA text", "Save"),
            isDisabled: false,
            onClick: () => {
              Object.keys(editedAttributes).forEach((varId) => {
                updateVariation({
                  clientSideId: varId,
                  newProps: { attributes: editedAttributes[varId] },
                });
              });
              onClose();
            },
          }}
          cancel={{ text: ci18n("CTA text", "Cancel"), onClick: onClose }}
          data-cy="attributes-footer"
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

const useStylesheet = () => {
  const { surface, surfaceLighter, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: "24px 24px 40px",
          gap: 16,
        },
        fieldsContainer: {
          [`@media ${IS_SMALL_SCREEN}`]: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          },
          [`@media ${IS_LARGE_SCREEN}`]: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          },
        },
        field: {
          margin: 5,
          minWidth: 0,
          overflow: "auto",
        },
        input: {
          minWidth: 0,
        },
        accordionHeader: {
          border: `1px solid ${surface}`,
          borderRadius: 4,
          background: surfaceLighter,
          justifyContent: "space-between",
        },
        text: {
          color: textDark,
        },
        accordionHeaderText: {
          color: textDark,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      }),
    [surface, surfaceLighter, textDark],
  );
};

export default observer(TaxonomyAttributesModal);
