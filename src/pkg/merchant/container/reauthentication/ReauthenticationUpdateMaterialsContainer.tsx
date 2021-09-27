import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { BackButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import ImageViewer from "@merchant/component/core/modal/ImageViewer";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { usePathParams } from "@toolkit/url";
import { css } from "@toolkit/styling";

/* Merchant Components */
import UpdateMaterialOnePage from "@merchant/component/reauthentication/UpdateMaterialOnePage";

/* Merchant API */
import * as reauthApi from "@merchant/api/reauthentication";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import { useDimenStore } from "@merchant/stores/DimenStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useTheme } from "@merchant/stores/ThemeStore";

import { AttachmentInfo } from "@ContextLogic/lego";
import {
  ImageGroupProps,
  ImageViewerProps,
} from "@merchant/component/core/modal/ImageViewer";

const ReauthenticationUpdateMaterialsContainer = () => {
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const [imageMap, setImageMap] = useState(new Map());
  const [textMap, setTextMap] = useState(new Map());
  const [choiceMap, setChoiceMap] = useState(new Map());
  const [commentMap, setCommentMap] = useState(new Map());
  const [page, setPage] = useState(1);
  const [changed, setChanged] = useState(false);

  const { ticketId } = usePathParams(
    "/reauthentication-update-materials/:ticketId"
  );
  const [resp] = useRequest(reauthApi.requestRequiredMaterials({ ticketId }));
  const requiredMaterials = resp?.data?.requiredMaterials;

  const styles = useStyleSheet();

  const globalIdFn = (entityId: string, materialId: string) => {
    return `${entityId}_${materialId}`;
  };

  useEffect(() => {
    if (requiredMaterials == null || requiredMaterials.length == 0) {
      return;
    }

    // fill the image map
    for (const requiredMaterial of requiredMaterials) {
      const lastMat = requiredMaterial.lastMaterial;
      if (lastMat.type != "image") {
        continue;
      }
      if (lastMat.maxImageCount == 1) {
        continue;
      }

      const gid = globalIdFn(requiredMaterial.entityId, lastMat.id);
      const lastImageGroup = lastMat.images;
      if (lastImageGroup) {
        const attachments = lastImageGroup.images.map((image) => {
          return {
            url: image.src,
            ext: image.name.includes(".") ? image.name.split(".").pop() : "",
            isImage: true,
            fileName: image.name,
            serverParams: {
              url: image.src,
              original_filename: image.name,
            },
          };
        });
        imageMap.set(gid, attachments);
        setImageMap(new Map(imageMap));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredMaterials]);

  const handleImageMapChange = (
    globalId: string,
    value: ReadonlyArray<AttachmentInfo>
  ) => {
    if (value.length > 0) {
      imageMap.set(globalId, value);
    } else {
      imageMap.delete(globalId);
    }
    setImageMap(new Map(imageMap));
    setChanged(true);
  };

  const handleTextMapChange = (globalId: string, value: string) => {
    if (value) {
      textMap.set(globalId, value);
    } else {
      textMap.delete(globalId);
    }
    setTextMap(new Map(textMap));
    setChanged(true);
  };

  const handleChoiceMapChange = (globalId: string, value: string) => {
    if (value) {
      choiceMap.set(globalId, value);
    } else {
      choiceMap.delete(globalId);
    }
    setChoiceMap(new Map(choiceMap));
    setChanged(true);
  };

  const handleCommentMapChange = (globalId: string, value: string) => {
    if (value) {
      commentMap.set(globalId, value);
    } else {
      commentMap.delete(globalId);
    }
    setCommentMap(new Map(commentMap));
    setChanged(true);
  };

  const handlePrevPage = () => {
    if (page == 1) {
      confirmGoBack();
    } else {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (requiredMaterials == null) {
      return;
    }

    if (page == requiredMaterials.length) {
      confirmSubmit();
    } else {
      setPage(page + 1);
    }
  };

  const confirmGoBack = () => {
    if (!changed) {
      goBack();
      return;
    }

    const text = i`Your changes are not saved, are you sure to go back?`;
    const modal = new ConfirmationModal(text);
    modal
      .setHeader({ title: i`Confirm to go back` })
      .setIllustration("submitDispute")
      .setOverflowY("hidden")
      .setAction(i`Confirm`, goBack)
      .setCancel(i`Cancel`)
      .render();
  };

  const allMaterialsSubmitted = useMemo(() => {
    if (requiredMaterials == null) {
      return true;
    }

    for (const ent of requiredMaterials) {
      const lastMat = ent.lastMaterial;
      const globalId = globalIdFn(ent.entityId, lastMat.id);
      if (lastMat.type == "image" && !imageMap.get(globalId)) {
        return false;
      } else if (lastMat.type == "choice" && !choiceMap.get(globalId)) {
        return false;
      } else if (lastMat.type == "text" && !textMap.get(globalId)) {
        return false;
      }
    }

    return true;
  }, [requiredMaterials, imageMap, choiceMap, textMap]);

  const confirmSubmit = () => {
    if (!allMaterialsSubmitted) {
      toastStore.error(i`Please submit all materials`, { timeoutMs: 4000 });
      return;
    }

    const text = i`Are you sure to submit these materials?`;
    const modal = new ConfirmationModal(text);
    modal
      .setHeader({ title: i`Confirm to submit` })
      .setIllustration("submitDispute")
      .setOverflowY("hidden")
      .setAction(i`Confirm`, submit)
      .setCancel(i`Cancel`)
      .render();
  };

  const goBack = () => {
    navigationStore.navigate(`/reauthentication-detail/${ticketId}`);
  };

  const mapToStr = (m: Map<string, any>) => {
    const obj = {};
    m.forEach((v, k) => ((obj as any)[k] = v));
    return JSON.stringify(obj);
  };

  const submit = async () => {
    if (!allMaterialsSubmitted) {
      toastStore.error(i`Please submit all materials`, { timeoutMs: 4000 });
      return;
    }

    await reauthApi
      .updateMaterials({
        ticketId,
        imageMap: mapToStr(imageMap),
        choiceMap: mapToStr(choiceMap),
        textMap: mapToStr(textMap),
        commentMap: mapToStr(commentMap),
      })
      .call();

    goBack();
  };

  const handleViewAttachments = (
    attachments: ReadonlyArray<AttachmentInfo>,
    viewIndex: number
  ) => {
    const images = attachments.map((att, index) => ({
      imageId: index.toString(),
      name: att.fileName,
      src: att.url,
    }));
    const imageGroup: ImageGroupProps = {
      groupId: "1",
      images,
    };
    const imageViewerProps: ImageViewerProps = {
      imageGroups: [imageGroup],
      selectedImageId: viewIndex.toString(),
    };

    const imageViewer = new ImageViewer(imageViewerProps);
    imageViewer.render();
  };

  if (requiredMaterials == null) {
    return <LoadingIndicator />;
  }

  const material = requiredMaterials[page - 1];
  const isLastPage = page == requiredMaterials.length;
  const isFirstPage = page == 1;
  return (
    <>
      <Text weight="bold" className={css(styles.pageTitle)}>
        Update materials of re-authentication
      </Text>
      <Card style={styles.card}>
        <UpdateMaterialOnePage
          requiredMaterial={material}
          imageMap={imageMap}
          textMap={textMap}
          choiceMap={choiceMap}
          commentMap={commentMap}
          globalIdFn={globalIdFn}
          onViewAttachments={handleViewAttachments}
          onImageMapChange={handleImageMapChange}
          onTextMapChange={handleTextMapChange}
          onChoiceMapChange={handleChoiceMapChange}
          onCommentChange={handleCommentMapChange}
        />
        <div className={css(styles.buttonContainer)}>
          <BackButton
            style={{ padding: "7px 60px 7px 49px" }}
            onClick={handlePrevPage}
          >
            {isFirstPage ? i`Back` : i`Previous page`}
          </BackButton>
          <PrimaryButton onClick={handleNextPage}>
            {isLastPage ? i`Submit` : i`Next page`}
          </PrimaryButton>
        </div>
      </Card>
    </>
  );
};

const useStyleSheet = () => {
  const { pageGuideX, pageGuideBottom } = useDimenStore();
  const { textBlack, surfaceLightest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        pageTitle: {
          margin: `40px ${pageGuideX} 24px`,
          fontSize: 24,
          lineHeight: 1.25,
          color: textBlack,
        },
        card: {
          marginLeft: pageGuideX,
          marginRight: pageGuideX,
          marginBottom: pageGuideBottom,
          backgroundColor: surfaceLightest,
        },
        buttonContainer: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "16px 24px 24px 24px",
        },
        button: {
          display: "flex",
          alignItems: "center",
        },
      }),
    [pageGuideX, pageGuideBottom, textBlack, surfaceLightest]
  );
};

export default observer(ReauthenticationUpdateMaterialsContainer);
