/* eslint-disable react/jsx-boolean-value */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { BackButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import ImageViewer from "@merchant/component/core/modal/ImageViewer";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import BeginPaymentFirstPage from "@merchant/component/reauthentication/BeginPaymentFirstPage";
import BeginPaymentSecondPage from "@merchant/component/reauthentication/BeginPaymentSecondPage";

/* Merchant API */
import * as reauthApi from "@merchant/api/reauthentication";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import { useDimenStore } from "@merchant/stores/DimenStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useTheme } from "@merchant/stores/ThemeStore";

import { AttachmentInfo } from "@ContextLogic/lego";
import { EntityProps } from "@toolkit/merchant-review/material-types";
import {
  ImageGroupProps,
  ImageViewerProps,
} from "@merchant/component/core/modal/ImageViewer";
import { OnTextChangeEvent } from "@ContextLogic/lego";

const ReauthenticationBeginPaymentContainer = () => {
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const { ticketId } = usePathParams(
    "/reauthentication-begin-payment/:ticketId"
  );

  const [imageMap, setImageMap] = useState<Map<string, AttachmentInfo[]>>(
    new Map()
  );
  const [choiceMap, setChoiceMap] = useState<Map<string, string>>(new Map());
  const [page, setPage] = useState(1);

  // letter of commitment
  const [canReachEveryone, setCanReachEveryone] = useState(true);
  const [letterImages, setLetterImages] = useState<
    ReadonlyArray<AttachmentInfo>
  >([]);
  const [ownershipImages, setOwnershipImages] = useState<
    ReadonlyArray<AttachmentInfo>
  >([]);
  const [includeCompany, setIncludeCompany] = useState(true);
  const [bizLicImages, setBizLicImages] = useState<
    ReadonlyArray<AttachmentInfo>
  >([]);
  const [comment, setComment] = useState<string | null>(null);

  const [resp] = useRequest(reauthApi.requestRequiredEntities({ ticketId }));
  const requiredEntities = resp?.data?.requiredEntities;

  const styles = useStyleSheet();

  const letterOfCommit = () => {
    return {
      canReachEveryone,
      letterImages,
      ownershipImages,
      includeCompany,
      bizLicImages,
      comment,
    };
  };

  const letterOfCommitToSubmitParam = useMemo(() => {
    const param: { [key: string]: any } = {};

    param.canReachEveryone = canReachEveryone ? "yes" : "no";

    if (canReachEveryone) {
      if (!letterImages || letterImages.length == 0) {
        return null;
      }
      param.letterImages = letterImages;
      param.includeCompany = includeCompany ? "yes" : "no";
      if (includeCompany) {
        if (!bizLicImages || bizLicImages.length == 0) {
          return null;
        }
        param.bizLicImages = bizLicImages;
      }
    } else {
      if (!ownershipImages || ownershipImages.length == 0) {
        return null;
      }
      param.ownershipImages = ownershipImages;
    }

    if (comment) {
      param.comment = comment;
    }

    return param;
  }, [
    canReachEveryone,
    letterImages,
    ownershipImages,
    includeCompany,
    bizLicImages,
    comment,
  ]);

  const materialsNotChanged = () => {
    return (
      imageMap.size == 0 &&
      choiceMap.size == 0 &&
      letterImages &&
      letterImages.length == 0 &&
      ownershipImages &&
      ownershipImages.length == 0 &&
      bizLicImages &&
      bizLicImages.length == 0 &&
      !comment
    );
  };

  const handlePrevPage = () => {
    if (page != 1) {
      setPage(1);
    } else {
      confirmGoBack();
    }
  };

  const handleNextPage = () => {
    if (page == 2 || !requiredEntities || requiredEntities.length == 0) {
      confirmSubmit();
    } else {
      setPage(2);
    }
  };

  const handleImageChange = (
    globalId: string,
    value: ReadonlyArray<AttachmentInfo>
  ) => {
    if (value.length == 0) {
      imageMap.delete(globalId);
    } else {
      imageMap.set(globalId, [...value]);
    }
    setImageMap(new Map(imageMap));
  };

  const handleChoiceChange = (globalId: string, value: string) => {
    if (value) {
      choiceMap.set(globalId, value);
    } else {
      choiceMap.delete(globalId);
    }
    setChoiceMap(new Map(choiceMap));
  };

  const handleCanReachEveryoneChange = (canReach: boolean) => {
    setCanReachEveryone(canReach);
  };

  const handleOwnershipImagesChange = (
    images: ReadonlyArray<AttachmentInfo>
  ) => {
    setOwnershipImages(images);
  };

  const handleLetterImagesChange = (images: ReadonlyArray<AttachmentInfo>) => {
    setLetterImages(images);
  };

  const handleIncludeCompanyChange = (include: boolean) => {
    setIncludeCompany(include);
  };

  const handleBizLicImagesChange = (images: ReadonlyArray<AttachmentInfo>) => {
    setBizLicImages(images);
  };

  const handleCommentChange = ({ text }: OnTextChangeEvent) => {
    setComment(text);
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
      groupId: "2",
      images,
    };
    const imageViewerProps: ImageViewerProps = {
      imageGroups: [imageGroup],
      selectedImageId: viewIndex.toString(),
    };

    const imageViewer = new ImageViewer(imageViewerProps);
    imageViewer.render();
  };

  const globalId = (entityId: string, materialId: string) => {
    return `${entityId}_${materialId}`;
  };

  const confirmGoBack = () => {
    if (materialsNotChanged()) {
      goBack();
      return;
    }

    const text = i`Your materials are not saved, are you sure to go back?`;
    const modal = new ConfirmationModal(text);
    modal
      .setHeader({ title: i`Confirm to go back` })
      .setIllustration("submitDispute")
      .setOverflowY("hidden")
      .setAction(i`Confirm`, goBack)
      .setCancel(i`Cancel`)
      .render();
  };

  const goBack = () => {
    navigationStore.navigate(`/reauthentication-detail/${ticketId}`);
  };

  const confirmSubmit = () => {
    if (requiredEntities) {
      const isValid = validateRequiredMaterials(requiredEntities);
      if (!isValid) {
        toastStore.error(i`Please submit all materials of payments`, {
          timeoutMs: 4000,
        });
        return;
      }
    }
    const letterOfCommitParam = letterOfCommitToSubmitParam;
    if (!letterOfCommitParam) {
      toastStore.error(i`Please submit all materials of letter of commitment`, {
        timeoutMs: 4000,
      });
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

  const mapToStr = (m: Map<string, any>) => {
    const obj = {};
    m.forEach((v, k) => ((obj as any)[k] = v));
    return JSON.stringify(obj);
  };

  const submit = async () => {
    if (requiredEntities) {
      const isValid = validateRequiredMaterials(requiredEntities);
      if (!isValid) {
        toastStore.error(i`Please submit all materials of payments`, {
          timeoutMs: 4000,
        });
        return;
      }
    }
    const letterOfCommitParam = letterOfCommitToSubmitParam;
    if (!letterOfCommitParam) {
      toastStore.error(i`Please submit all materials of letter of commitment`, {
        timeoutMs: 4000,
      });
      return;
    }

    await reauthApi
      .submitBeginPaymentInfo({
        ticketId,
        imageMap: mapToStr(imageMap),
        choiceMap: mapToStr(choiceMap),
        letterOfCommitParam: JSON.stringify(letterOfCommitParam),
      })
      .call();

    navigationStore.navigate(`/reauthentication-detail/${ticketId}`);
  };

  const validateRequiredMaterials = (
    requiredEntities: ReadonlyArray<EntityProps>
  ) => {
    for (const ent of requiredEntities) {
      const entId = ent.id;
      const materials = ent.materials || [];

      for (const mat of materials) {
        const matId = mat.id;
        let matValue: AttachmentInfo[] | string | null | undefined = null;
        const gid = globalId(entId, matId);
        if (mat.type == "choice") {
          matValue = choiceMap.get(gid);
        } else if (mat.type == "image") {
          matValue = imageMap.get(gid);
        }

        if (!matValue) {
          // some material is not uploaded
          return false;
        }
        if (mat.type == "image" && matValue.length == 0) {
          // some material is not uploaded
          return false;
        }
      }
    }

    return true;
  };

  if (requiredEntities == null) {
    return <LoadingIndicator />;
  }

  const showFirstPage = requiredEntities.length > 0;
  return (
    <>
      <Text weight="bold" className={css(styles.pageTitle)}>
        Provide materials of re-authentication
      </Text>
      <Card style={styles.card}>
        {page == 1 && showFirstPage ? (
          <BeginPaymentFirstPage
            requiredEntities={requiredEntities}
            imageMap={imageMap}
            choiceMap={choiceMap}
            onImageChange={handleImageChange}
            onChoiceChange={handleChoiceChange}
            onViewAttachments={handleViewAttachments}
            globalIdFn={globalId}
          />
        ) : (
          <BeginPaymentSecondPage
            onViewAttachments={handleViewAttachments}
            letterOfCommit={letterOfCommit()}
            onCanReachEveryoneChange={handleCanReachEveryoneChange}
            onOwnershipImagesChange={handleOwnershipImagesChange}
            onLetterImagesChange={handleLetterImagesChange}
            onIncludeCompanyChange={handleIncludeCompanyChange}
            onBizLicImagesChange={handleBizLicImagesChange}
            onCommentChange={handleCommentChange}
            globalIdFn={globalId}
          />
        )}
        <div className={css(styles.buttonContainer)}>
          <BackButton
            style={{ padding: "8px 60px 7px 49px" }}
            onClick={handlePrevPage}
          >
            {page == 1 ? i`Back` : i`Previous page`}
          </BackButton>
          <PrimaryButton onClick={handleNextPage}>
            {page == 2 || !showFirstPage ? i`Submit` : i`Next page`}
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
        card: {
          marginLeft: pageGuideX,
          marginRight: pageGuideX,
          marginBottom: pageGuideBottom,
          backgroundColor: surfaceLightest,
        },
        pageTitle: {
          margin: `40px ${pageGuideX} 24px`,
          fontSize: 25,
          lineHeight: 2.25,
          color: textBlack,
        },
        buttonContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "17px 24px 24px 24px",
        },
        button: {
          display: "flex",
          alignItems: "center",
        },
      }),
    [pageGuideX, pageGuideBottom, textBlack, surfaceLightest]
  );
};

export default observer(ReauthenticationBeginPaymentContainer);
