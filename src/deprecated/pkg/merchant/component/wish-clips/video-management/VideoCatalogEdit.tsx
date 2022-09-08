import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";

/* Lego Components */
import {
  Layout,
  LoadingIndicator,
  Breadcrumbs,
  H4Markdown,
  SecondaryButton,
  PrimaryButton,
  Text,
  Divider,
  H5,
  Field,
  TextInput,
  Radio,
  Table,
  H6,
  AttachmentInfo,
  Alert,
} from "@ContextLogic/lego";

import SecureFileInput from "@merchant/component/core/SecureFileInput";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import Icon from "@merchant/component/core/Icon";
import PageGuide from "@merchant/component/core/PageGuide";
import Error404 from "@merchant/component/errors/Error404";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Relative Components */
import EditProductLinkModal from "./EditProductLinkModal";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  VIDEO_CATALOG_QUERY,
  VideoCatalogRequestData,
  VideoCatalogResponseData,
  PRODUCTS_QUERY,
  ProductsRequestData,
  ProductsResponseData,
  ProductsTableData as TableData,
  ACCEPTED_FORMATS,
  MAX_SIZE_MB,
} from "@toolkit/wish-clips/video-management";
import { VideoVisibility } from "@schema/types";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Model */
import VideoCatalogState from "@merchant/model/products/VideoCatalogState";

type Props = BaseProps & {
  readonly videoId: string;
};

const noDataMessage = "--";

const VideoCatalogEdit = (props: Props) => {
  const { className, style, videoId } = props;
  const styles = useStylesheet();
  const { surfaceLightest, textWhite } = useTheme();

  const [state] = useState<VideoCatalogState>(
    () => new VideoCatalogState({ videoId })
  );
  const [attachments, setAttachments] = useState<ReadonlyArray<AttachmentInfo>>(
    []
  );

  const [videoVisibility, setVideoVisibility] =
    useState<VideoVisibility>("LIVE");

  const { data: videoData, loading: videoLoading } = useQuery<
    VideoCatalogResponseData,
    VideoCatalogRequestData
  >(VIDEO_CATALOG_QUERY, {
    variables: {
      limit: 1,
      searchType: "ID",
      query: videoId,
    },
  });

  const { data: linkedProductsData, loading: linkedProductsLoading } = useQuery<
    ProductsResponseData,
    ProductsRequestData
  >(PRODUCTS_QUERY, {
    variables: {
      videoId,
    },
  });

  useEffect(() => {
    if (
      !videoData?.productCatalog?.videoService.videos ||
      videoData?.productCatalog?.videoService.videos.length < 1
    ) {
      return;
    }

    const video = videoData?.productCatalog?.videoService.videos[0];
    state.videoTitle = video.title;
    state.videoDescription = video.description;
    state.videoFileName = video.preview?.url
      ? video.preview.url.split("/").pop()
      : null;
    state.linkedProducts = linkedProductsData?.productCatalog?.products || [];

    state.linkedProducts.forEach((product) =>
      state.linkedProductIds.add(product.id)
    );
  }, [videoData, linkedProductsData, state]);

  if (videoLoading || linkedProductsLoading) {
    return <LoadingIndicator style={[className, style]} />;
  }

  if (
    !videoData?.productCatalog?.videoService.videos ||
    videoData?.productCatalog?.videoService.videos.length < 1
  ) {
    return <Error404 />;
  }

  const video = videoData.productCatalog.videoService.videos[0];
  const videoDeclined = video.state === "REJECTED";

  const tableData: ReadonlyArray<TableData> = (state.linkedProducts || []).map(
    (product) => ({
      productId: product.id,
      productName: product.name,
      inventoryCount: product.totalInventory,
      productData: product,
    })
  );

  const editProduct = () => {
    new EditProductLinkModal({ state }).render();
  };

  const onSave = async () => {
    const previousLinkedProductIds = (
      linkedProductsData?.productCatalog?.products || []
    ).map((product) => product.id);
    const noNewLinks = previousLinkedProductIds.every((productId) =>
      state.linkedProductIds.has(productId)
    );

    if (
      state.videoTitle === video.title &&
      attachments.length === 0 &&
      noNewLinks
    ) {
      await state.upsertVideo();
      return;
    }

    new ConfirmationModal(() => (
      <Layout.FlexColumn style={styles.confirmation}>
        <Text>
          Updating this information will require an additional review by the
          Wish Content Moderation Team to ensure the video is still in
          compliance. Are you sure you want to proceed?
        </Text>
      </Layout.FlexColumn>
    ))
      .setHeader({ title: i`Update Video Information` })
      .setAction(i`Confirm`, async () => await state.upsertVideo())
      .setCancel(i`Cancel`)
      .setWidthPercentage(0.4)
      .setActionDisabled(() => state.isSubmitting)
      .render();
  };

  return (
    <PageGuide style={[className, style]}>
      <Layout.FlexColumn>
        {videoDeclined && (
          <Alert
            sentiment="negative"
            title={i`Video Declined`}
            text={i`The video doesn't match with the linked product`}
            style={styles.alert}
          />
        )}
        <Breadcrumbs
          style={styles.title}
          items={[
            {
              name: i`Video Catalog`,
              href: "/videos/management-hub/video-catalog",
            },
            {
              name: i`Edit Video - ${videoId}`,
              href: `/videos/management-hub/video-catalog?edit_video=${videoId}`,
            },
          ]}
        />
        <Layout.FlexRow justifyContent="space-between" style={styles.title}>
          <H4Markdown text={i`Edit Video`} />
          <Layout.FlexRow>
            <SecondaryButton
              padding="5px 25px"
              href="/videos/management-hub/video-catalog"
              style={styles.button}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={onSave}
              isDisabled={!state.videoDetailsFilled}
            >
              <Layout.FlexRow>
                <Icon
                  color={textWhite}
                  name="save"
                  size="medium"
                  style={styles.buttonIcon}
                />
                <Text>Save</Text>
              </Layout.FlexRow>
            </PrimaryButton>
          </Layout.FlexRow>
        </Layout.FlexRow>

        <Divider style={styles.divider} />

        <Layout.FlexColumn>
          <H5>Edit Video</H5>
          <Text style={styles.text}>Primary information about this video</Text>
          <Field title={i`Video File`} style={styles.input}>
            <TextInput value={state.videoFileName} disabled />
            <SecureFileInput
              bucket="TEMP_UPLOADS_V2"
              prompt={i`Drag or select a video file to upload`}
              accepts={ACCEPTED_FORMATS.join(",")}
              onAttachmentsChanged={(attachments) => {
                setAttachments(attachments);
                state.videoUrl = attachments[0].url;
                state.videoFileName = attachments[0].fileName;
              }}
              attachments={attachments}
              backgroundColor={surfaceLightest}
              maxSizeMB={MAX_SIZE_MB}
              maxAttachments={1}
              style={styles.upload}
            />
          </Field>
          <Field title={i`Title`} style={styles.input}>
            <TextInput
              value={state.videoTitle}
              onChange={({ text }) => (state.videoTitle = text)}
            />
          </Field>
          <Field title={i`Description`} style={styles.input}>
            <TextInput
              isTextArea
              canResize
              rows={4}
              placeholder={i`Tell viewers about your video`}
              value={state.videoDescription}
              onChange={({ text }) => (state.videoDescription = text)}
            />
          </Field>
        </Layout.FlexColumn>

        <Divider style={styles.divider} />

        <Layout.FlexColumn>
          <H5>Visibility</H5>
          <Text style={styles.text}>
            Choose when to publish and who can see your video
          </Text>
          <Layout.FlexColumn>
            <Layout.FlexRow
              alignItems="flex-start"
              onClick={() => setVideoVisibility("LIVE")}
              style={[
                styles.radioOption,
                videoVisibility === "LIVE" && styles.radioSelected,
              ]}
            >
              <Radio
                checked={videoVisibility === "LIVE"}
                style={styles.radioItem}
              />
              <Layout.FlexColumn justifyContent="flex-start">
                <H6>Live</H6>
                <Text>
                  Video will be made available on Wish Clips and other channels
                  once approved
                </Text>
              </Layout.FlexColumn>
            </Layout.FlexRow>
            <Layout.FlexRow
              alignItems="flex-start"
              // Disabled until feature is supported in the future
              // onClick={() => setVideoVisibility("UNLISTED")}
              style={[
                styles.radioOption,
                videoVisibility === "UNLISTED" && styles.radioSelected,
                // Disabled until feature is supported in the future
                styles.disabled,
              ]}
            >
              <Radio
                checked={videoVisibility === "UNLISTED"}
                style={styles.radioItem}
              />
              <Layout.FlexColumn justifyContent="flex-start">
                <H6>Unlisted</H6>
                <Text>
                  Video will be seen in the "Unlisted" tab of your Video Catalog
                  and will not be viewable by customers if approved
                </Text>
              </Layout.FlexColumn>
            </Layout.FlexRow>
          </Layout.FlexColumn>
        </Layout.FlexColumn>

        <Divider style={styles.divider} />

        <Layout.FlexRow
          justifyContent="space-between"
          style={styles.linkedProducts}
        >
          <H5>Linked Products</H5>
          <PrimaryButton onClick={editProduct}>
            <Layout.FlexRow>
              <Icon
                color={textWhite}
                name="edit"
                size="medium"
                style={styles.buttonIcon}
              />
              <Text>Edit Product</Text>
            </Layout.FlexRow>
          </PrimaryButton>
        </Layout.FlexRow>

        <Table data={tableData} noDataMessage={i`No products`}>
          <ProductColumn
            _key="productId"
            title={i`Product Info`}
            columnKey="productId"
            showFullName={false}
          />
          <Table.ObjectIdColumn
            _key="productIdString"
            columnKey="productId"
            title={i`Product ID`}
            showFull
            align="center"
          />
          <Table.Column
            _key="inventory"
            columnKey="inventoryCount"
            title={i`Inventory`}
            noDataMessage={noDataMessage}
            align="center"
          />
        </Table>
      </Layout.FlexColumn>
    </PageGuide>
  );
};

const useStylesheet = () => {
  const { primary, borderPrimary, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        alert: {
          marginBottom: 12,
        },
        button: {
          marginRight: 8,
        },
        buttonIcon: {
          marginRight: 10,
        },
        divider: {
          margin: "24px 0px",
        },
        title: {
          marginBottom: 16,
        },
        text: {
          size: 14,
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        input: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        upload: {
          marginTop: 12,
          maxWidth: 400,
        },
        radioItem: {
          marginRight: 12,
        },
        radioOption: {
          borderRadius: 4,
          border: `1px ${borderPrimary} solid`,
          backgroundColor: surfaceLightest,
          ":not(:last-child)": {
            marginBottom: 16,
          },
          padding: 16,
          ":hover": {
            cursor: "pointer",
          },
        },
        radioSelected: {
          border: `1px ${primary} solid`,
        },
        disabled: {
          opacity: 0.6,
          ":hover": {
            cursor: "not-allowed",
          },
        },
        linkedProducts: {
          marginBottom: 16,
        },
        confirmation: {
          padding: "24px 0px",
        },
      }),
    [primary, borderPrimary, surfaceLightest]
  );
};

export default observer(VideoCatalogEdit);
