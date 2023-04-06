import React, { useEffect, useMemo, useReducer } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import Modal from "@core/components/modal/Modal";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import { useInfractionContext } from "@infractions/InfractionContext";
import { useMutation, useRequest } from "@core/toolkit/restApi";
import Skeleton from "@core/components/Skeleton";
import { css } from "@core/toolkit/styling";
import Markdown from "@infractions/components/Markdown";
import {
  CurrencyInput,
  HorizontalField as LegoHorizontalField,
  HorizontalFieldProps,
  TextInput,
} from "@ContextLogic/lego";
import SecureFileInput from "@core/components/SecureFileInput";
import { ProductEditRequestGetPreviousResponse } from "@infractions/api/productEditRequestGetPreviousResponseRequest";
import perStateReducer, {
  initialState,
  State,
} from "@infractions/reducers/perStateReducer";
import { useToastStore } from "@core/stores/ToastStore";

const getDataJson = (state: State) => {
  let removedImageCounter = -1;

  const addedImages = state.additionalImages.reduce(
    (acc, { fileName, url }) => {
      const alreadyAdded = state.currentProduct?.extra_photos?.includes(
        Number(fileName),
      );
      if (fileName == null || alreadyAdded) {
        return acc;
      }

      removedImageCounter += 1;
      return {
        ...acc,
        [`image-new-extra-${removedImageCounter}`]: url,
      };
    },
    {},
  );

  const existingFilenames = state.additionalImages.map(
    ({ fileName }) => fileName,
  );

  const removedImages = state.currentProduct?.extra_photos?.reduce(
    (acc, fileId) => {
      const fileExists = existingFilenames.includes(String(fileId));
      if (fileExists) {
        return acc;
      }

      return {
        ...acc,
        [`image-rm-extra-${fileId}`]: true,
      };
    },
    {},
  );

  return JSON.stringify({
    ...state.submissionJson,
    ...addedImages,
    ...removedImages,
  });
};

type EditYourProductListingModalContentProps = Required<
  Pick<ModalProps, "open" | "onClose">
>;

const HorizontalField: React.FC<
  Omit<HorizontalFieldProps, "titleWidth" | "centerTitleVertically">
> = (props) => (
  <LegoHorizontalField titleWidth={100} centerTitleVertically {...props} />
);

const EditYourProductListingModal: React.FC<
  EditYourProductListingModalContentProps
> = ({
  open,
  onClose: onCloseProp,
}: EditYourProductListingModalContentProps) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const {
    infraction: { id: infractionId, product: productFromContext },
    refetchInfraction,
  } = useInfractionContext();
  const [state, dispatch] = useReducer(perStateReducer, initialState);

  const { data, isLoading, error } =
    useRequest<ProductEditRequestGetPreviousResponse>(
      productFromContext
        ? {
            url: "/api/product-edit-request/get-previous",
            body: {
              cid: productFromContext?.productId,
              warning_id: infractionId,
            },
          }
        : null,
    );

  const currentProduct = data?.result;

  useEffect(() => {
    dispatch({ type: "RESET_STATE", currentProduct });
  }, [currentProduct]);

  const onClose = (...props: Parameters<typeof onCloseProp>) => {
    onCloseProp(...props);
    dispatch({ type: "RESET_STATE", currentProduct });
  };

  const { trigger: triggerEditRequest, isMutating } = useMutation({
    url: "/api/warning/edit-request",
  });

  const onSubmit = async () => {
    try {
      const response = await triggerEditRequest({
        cid: productFromContext?.productId,
        data_json: getDataJson(state),
        infraction_id: infractionId,
      });
      // BE returns 400 if something went wrong, and response is undefined
      if (response) {
        onClose({}, "backdropClick");
        toastStore.positive(
          i`You have successfully submitted a request to edit your product. Review will be completed within 5-7 business days.`,
        );
        refetchInfraction();
      } else {
        toastStore.negative(i`Something went wrong.`);
      }
    } catch (e) {
      toastStore.negative(i`Something went wrong.`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} fullWidth>
      <ModalTitle
        title={ci18n("modal header", "Edit Product Request")}
        onClose={(e) => {
          onClose(e, "backdropClick");
        }}
      />
      {!productFromContext || error || (!isLoading && !currentProduct) ? (
        <Text variant="bodyLStrong" sx={{ margin: "16px" }}>
          Something went wrong.
        </Text>
      ) : (
        <>
          <div className={css([styles.body, styles.column])}>
            {/* !product check is for TS, we already would have returned the above error case */}
            {isLoading || !currentProduct ? (
              <Skeleton height={580} />
            ) : (
              <>
                <Markdown
                  text={i`This product listing is infringing on intellectual property. Edit the product listing to remove brands from:${"\n\n"}* Title${"\n\n"}* Description${"\n\n"}* All images${"\n\n"}Note: the product cannot be changed to a completely new product.`}
                  style={{ marginBottom: 12 }}
                />
                <HorizontalField title={ci18n("field title", "Product ID")}>
                  <TextInput value={currentProduct.id} disabled />
                </HorizontalField>
                <HorizontalField title={ci18n("field title", "Parent SKU")}>
                  <TextInput value={currentProduct.parent_sku} disabled />
                </HorizontalField>
                <HorizontalField title={ci18n("field title", "Product Name")}>
                  <TextInput
                    value={state.name}
                    onChange={({ text }) => {
                      dispatch({ type: "UPDATE_PRODUCT_NAME", name: text });
                    }}
                    disabled={isMutating}
                  />
                </HorizontalField>
                <HorizontalField title={ci18n("field title", "Description")}>
                  <TextInput
                    value={state.description}
                    isTextArea
                    canResize
                    height={100}
                    onChange={({ text }) => {
                      dispatch({
                        type: "UPDATE_DESCRIPTION",
                        description: text,
                      });
                    }}
                    disabled={isMutating}
                  />
                </HorizontalField>
                <HorizontalField title={ci18n("field title", "Main Image")}>
                  <SecureFileInput
                    accepts=".jpeg,.jpg,.png"
                    maxSizeMB={5}
                    maxAttachments={1}
                    attachments={state.mainImages}
                    onAttachmentsChanged={(attachments) => {
                      dispatch({
                        type: "UPDATE_MAIN_IMAGES",
                        images: attachments,
                      });
                    }}
                    bucket="TEMP_UPLOADS_V2"
                    disabled={isMutating}
                  />
                </HorizontalField>
                <HorizontalField
                  title={ci18n("field title", "Additional Image(s)")}
                >
                  <SecureFileInput
                    accepts=".jpeg,.jpg,.png"
                    maxSizeMB={5}
                    attachments={state.additionalImages}
                    onAttachmentsChanged={(attachments) => {
                      dispatch({
                        type: "UPDATE_ADDITIONAL_IMAGES",
                        images: attachments,
                      });
                    }}
                    bucket="TEMP_UPLOADS_V2"
                    disabled={isMutating}
                  />
                </HorizontalField>
                {state.variations.map(
                  ({
                    id,
                    manufacturerId,
                    uploadDate,
                    currency,
                    price,
                    color,
                    size,
                  }) => (
                    <div key={id} className={css(styles.column)}>
                      <Heading variant="h4" sx={{ marginTop: "12px" }}>
                        Variation {manufacturerId}
                      </Heading>
                      <HorizontalField
                        title={ci18n("field title", "Upload Date")}
                      >
                        <TextInput value={uploadDate} disabled />
                      </HorizontalField>
                      <HorizontalField title={ci18n("field title", "Price")}>
                        <CurrencyInput
                          value={price}
                          currencyCode={currency || "USD"}
                          onChange={({ text }) => {
                            dispatch({
                              type: "UPDATE_VARIATION_PRICE",
                              variationId: id,
                              price: text,
                            });
                          }}
                          hideCheckmarkWhenValid
                          disabled={isMutating}
                        />
                      </HorizontalField>
                      <HorizontalField title={ci18n("field title", "Color")}>
                        <TextInput
                          value={color}
                          onChange={({ text }) => {
                            dispatch({
                              type: "UPDATE_VARIATION_COLOR",
                              variationId: id,
                              color: text,
                            });
                          }}
                          disabled={isMutating}
                        />
                      </HorizontalField>
                      <HorizontalField title={ci18n("field title", "Size")}>
                        <TextInput
                          value={size}
                          onChange={({ text }) => {
                            dispatch({
                              type: "UPDATE_VARIATION_SIZE",
                              variationId: id,
                              size: text,
                            });
                          }}
                          disabled={isMutating}
                        />
                      </HorizontalField>
                    </div>
                  ),
                )}
              </>
            )}
          </div>
          <ModalFooter
            cancel={{
              text: ci18n("CTA button", "Cancel"),
              onClick: () => {
                onClose({}, "backdropClick");
              },
              disabled: isMutating,
            }}
            action={{
              text: ci18n("CTA button", "Submit"),
              onClick: onSubmit,
              isDisabled: isMutating,
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default observer(EditYourProductListingModal);

export const useStylesheet = () => {
  return useMemo(() => {
    return StyleSheet.create({
      body: {
        padding: 25,
        maxHeight: "50vh",
        overflowY: "scroll",
      },
      column: {
        display: "grid",
        gridGap: 8,
        gridTemplateColumns: "1fr",
      },
    });
  }, []);
};
