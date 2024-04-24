import { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@core/toolkit/styling";
import { Box, Button, Stack, Text } from "@ContextLogic/atlas-ui";
import { Layout, LoadingIndicator } from "@ContextLogic/lego";
import commonStyles from "@performance-cn/styles/common.module.css";
import Icon from "@core/components/Icon";
import { absExtURL } from "@core/toolkit/url";
import { useMutation } from "@apollo/client";
import Image from "@core/components/Image";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";
import PageRoot from "@core/components/PageRoot";
import SecureFileInput from "@core/components/SecureFileInput";
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import { merchFeUrl, useRouter } from "@core/toolkit/router";
import {
  FileInput,
  Datetime,
  MerchantVerificationStatusReason,
  BusinessDocTypes,
} from "@schema";
import {
  UploadTaxDocumentsMutation,
  UploadTaxDocumentsResponse,
  UploadTaxDocumentsRequest,
} from "@seller-identity/bank-documents/toolkit";
import {
  GET_MERCHANT_TAX_VERIFICATION_STATE,
  TaxStatusRequestData,
  TaxStatusResponseData,
  GET_SELLER_IDENTITY_REJECTREASONS,
  TaxRejectReasonRequestData,
  TaxRejectReasonResponseData,
  TaxRejectReasonObj,
} from "@seller-identity/bank-documents/getinfo";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { ci18n } from "@core/toolkit/i18n";
import { useQuery } from "@apollo/client";
import Link from "@deprecated/components/Link";
import { zendeskURL } from "@core/toolkit/url";
import { Heading } from "@ContextLogic/atlas-ui";
import Illustration from "@core/components/Illustration";
import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@core/components/Stepper";

const TaxDocumentsPage: NextPage<Record<string, never>> = () => {
  const styles = useStylesheet();
  const { textWhite, primary } = useTheme();
  const [attachment, setAttachment] = useState<FileInput | null>(null);
  const [countryCode, setCountryCode] = useState<string | null | undefined>("");
  const [formType, setFormType] = useState<string | null | undefined>("");
  const [entityType, setEntityType] = useState<string | null | undefined>("");
  const [proofOfBizDocType, setProofOfBizDocType] =
    useState<BusinessDocTypes>("TAX_FORM_W9");
  const [state, setState] = useState<string | undefined>(undefined);
  const [IrsLink, setIrsLink] = useState<string>("");
  const [TemplateLink, setTemplateLink] = useState<string>("");
  const LinkWhyINeed = zendeskURL("1260801395329");
  const [rejectReason, setRejectReason] =
    useState<ReadonlyArray<Maybe<MerchantVerificationStatusReason>>>();
  const [sellerIdentityRejectReasons, setSellerIdentityRejectReasons] =
    useState<TaxRejectReasonObj>();
  const [dueDate, setDueDate] = useState<Datetime | undefined | null>(
    undefined,
  );
  const [comment, setComment] = useState<string | null | undefined>("");

  const { data } = useQuery<TaxStatusResponseData, TaxStatusRequestData>(
    GET_MERCHANT_TAX_VERIFICATION_STATE,
    {
      variables: {
        verificationType: "TAX_FORM",
      },
    },
  );

  const { data: rejectData } = useQuery<
    TaxRejectReasonResponseData,
    TaxRejectReasonRequestData
  >(GET_SELLER_IDENTITY_REJECTREASONS, {
    variables: {
      verificationType: "TAX_FORM",
    },
  });

  useEffect(() => {
    const countryCode = data?.currentMerchant?.countryOfDomicile?.code;
    const entityType = data?.currentUser.entityType;

    if (countryCode === "US") {
      setIrsLink("https://www.irs.gov/forms-pubs/about-form-w-9");
      setTemplateLink("https://www.irs.gov/pub/irs-pdf/fw9.pdf");
      setFormType("W-9");
      setProofOfBizDocType("TAX_FORM_W9");
    } else if (entityType === "INDIVIDUAL") {
      setIrsLink("https://www.irs.gov/forms-pubs/about-form-w-8-ben");
      setTemplateLink("https://www.irs.gov/pub/irs-pdf/fw8ben.pdf");
      setFormType("W-8BEN");
      setProofOfBizDocType("TAX_FORM_W8_BEN");
    } else if (entityType === "COMPANY") {
      setIrsLink("https://www.irs.gov/forms-pubs/about-form-w-8-ben-e");
      setTemplateLink("https://www.irs.gov/pub/irs-pdf/fw8bene.pdf");
      setFormType("W-8BEN-E");
      setProofOfBizDocType("TAX_FORM_W8_BEN_E");
    }

    setState(data?.currentMerchant.merchantIdentityVerification?.state);
    setRejectReason(
      data?.currentMerchant.merchantIdentityVerification?.stateReason,
    );
    setCountryCode(countryCode);
    setEntityType(entityType);
    setDueDate(data?.currentMerchant.merchantIdentityVerification?.dueDate);
    setComment(
      data?.currentMerchant.merchantIdentityVerification
        ?.latestMerchantIdentityDocument?.comment,
    );
  }, [data]);

  useEffect(() => {
    const rejectReasonStringify = rejectData?.merchantIdentity?.rejectReasons;
    if (rejectReasonStringify) {
      const res = JSON.parse(rejectReasonStringify) as TaxRejectReasonObj;
      setSellerIdentityRejectReasons(res);
    }
  }, [rejectData]);

  const toastStore = useToastStore();
  const router = useRouter();
  const sellerProfile = "/settings#seller-profile";

  const steps = useMemo(() => {
    return [
      {
        label: i`Download Tax template`,
        description:
          entityType === "INDIVIDUAL"
            ? i`Based on your country of domicile (${countryCode}) and the information you submitted in the registration (individual seller), please download and submit ${formType} form.`
            : i`Based on your country of domicile (${countryCode}) and the information you submitted in the registration (business entities), please download and submit ${formType} form.`,
        content: (
          <Button
            secondary
            startIcon={<Icon name="download" color={primary} />}
            data-cy="button-download-template"
            sx={{ marginTop: "24px", fontSize: "14px" }}
          >
            <Link
              href={absExtURL(TemplateLink)}
              style={styles.templateLinkText}
              openInNewTab
            >
              {ci18n(
                "Button text, download tax form template",
                "Download tax form",
              )}
            </Link>
          </Button>
        ),
      },
      {
        label: i`Upload your tax form`,
        description: i`Make sure your information is correct and includes your signature.`,
        content: (
          <Box sx={{ mt: 3 }}>
            <SecureFileInput
              bucket="TEMP_UPLOADS_V2"
              accepts=".pdf"
              prompt={i`Upload tax form`}
              backgroundColor={textWhite}
              maxSizeMB={5}
              style={{ width: 200, color: primary, marginBottom: 10 }}
              onAttachmentsChanged={(attachments) => {
                if (attachments.length == 0) {
                  setAttachment(null);
                  return;
                }
                setAttachment({
                  fileName: attachments[0].fileName,
                  url: attachments[0].url,
                });
              }}
              data-cy="tax-document-file-input"
              maxAttachments={1}
            />
            <Text variant="bodyS">
              {ci18n(
                "description of the file limit",
                "Select a PDF smaller than 5MB.",
              )}
            </Text>
          </Box>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, countryCode]);

  const [upload] = useMutation<
    UploadTaxDocumentsResponse,
    UploadTaxDocumentsRequest
  >(UploadTaxDocumentsMutation);

  const onSubmit = async () => {
    if (attachment == null) {
      return;
    }

    const resp = await upload({
      variables: {
        input: {
          merchantIdentityDocFile: attachment,
          verificationType: "TAX_FORM",
          proofOfBizDocType: proofOfBizDocType,
        },
      },
    });
    const result =
      resp.data?.currentMerchant?.merchantIdentityVerification?.uploadDocument;
    if (!result) {
      return;
    }
    const { ok, message } = result;

    if (!ok) {
      toastStore.error(message || i`Something went wrong. Please try again.`);
      return;
    }

    toastStore.positive(i`Your document has been uploaded`);
    void router.push(merchFeUrl(sellerProfile));
  };

  return (
    <PageRoot style={styles.root}>
      <PageHeader
        className={css(styles.header)}
        title={ci18n("title of tax information module", "Tax Information")}
        relaxed
        illustration={() => (
          <Image
            src="/md/images/seller-identity/taxInfoBanner.svg"
            alt={ci18n("alt text for an image", "Tax information banner")}
            width={168}
            height={178}
          />
        )}
      >
        <Layout.FlexRow>
          <Text className={css(styles.headerText)}>
            Supporting documents are any documents issued by the government that
            verify your name and tax identification number.
          </Text>
        </Layout.FlexRow>
      </PageHeader>
      <PageGuide relaxed style={styles.guide}>
        {countryCode ? (
          <>
            {state === "REJECTED" &&
              dueDate &&
              sellerIdentityRejectReasons != null &&
              rejectReason != null &&
              rejectReason?.map((reason) => {
                return (
                  <Box className={css(styles.bannerInfo)} key={reason}>
                    <Illustration
                      name="bankInfoBannerBadge"
                      className={css(styles.icon)}
                      alt={i`Tax documents info`}
                    />
                    <div className={css(styles.bannerText)}>
                      <Text
                        sx={{
                          color: "textBlack",
                          fontWeight: "bold",
                          fontSize: "14px",
                          lineHeight: "18px",
                        }}
                      >
                        Resubmit tax information
                      </Text>
                      {reason && reason !== "OTHERS" ? (
                        <Text
                          sx={{
                            color: "textBlack",
                            fontSize: "14px",
                            lineHeight: "20px",
                          }}
                        >
                          {i`${sellerIdentityRejectReasons[reason]} ` +
                            i`Upload your tax form by ` +
                            i`${dueDate.formatted} ` +
                            i`to avoid payment withholding. `}
                        </Text>
                      ) : (
                        reason && (
                          <Text
                            sx={{
                              color: "textBlack",
                              fontSize: "14px",
                              lineHeight: "20px",
                            }}
                          >
                            {i`${sellerIdentityRejectReasons[reason]}. ` +
                              i`Comment: ${comment}. ` +
                              i`Upload your tax form by ` +
                              i`${dueDate.formatted} ` +
                              i`to avoid payment withholding. `}
                          </Text>
                        )
                      )}
                    </div>
                  </Box>
                );
              })}
            <div className={css(styles.contentBox)}>
              <Stepper orientation="vertical" sx={{ flex: 4 }}>
                {steps.map((step) => {
                  return (
                    <Step key={step.label} active>
                      <StepLabel>
                        <Heading variant="h3">{step.label}</Heading>
                      </StepLabel>
                      <StepContent sx={{ minHeight: "200px" }}>
                        <div>
                          <Text>{step.description}</Text>
                          <div>{step.content}</div>
                        </div>
                      </StepContent>
                    </Step>
                  );
                })}
              </Stepper>
              <Box
                sx={{
                  flex: 2,
                  borderLeft: "1px solid rgba(170, 170, 164, 1)",
                  paddingLeft: "36px",
                }}
              >
                <div style={{ height: "280px" }}>
                  <div className={css(styles.linkBox)}>
                    <Image
                      src="/md/images/seller-identity/linkIcon.svg"
                      alt={ci18n(
                        "alt text for an image",
                        "Tax information banner",
                      )}
                      width={24}
                      height={24}
                    />
                    <Link
                      href={LinkWhyINeed}
                      style={styles.linkText}
                      underline
                      openInNewTab
                    >
                      Why do I need to submit the {formType} form?
                    </Link>
                  </div>
                  <div className={css(styles.linkBox)}>
                    <Image
                      src="/md/images/seller-identity/linkIcon.svg"
                      alt={ci18n(
                        "alt text for an image",
                        "Tax information banner",
                      )}
                      width={24}
                      height={24}
                    />
                    <Link
                      href={absExtURL(IrsLink)}
                      style={styles.linkText}
                      underline
                      openInNewTab
                    >
                      Link to IRS {formType} form page
                    </Link>
                  </div>
                  <div className={css(styles.linkBox)}>
                    <Image
                      src="/md/images/seller-identity/linkIcon.svg"
                      alt={ci18n(
                        "alt text for an image",
                        "Tax information banner",
                      )}
                      width={"24px"}
                      height={"24px"}
                    />
                    <Link
                      href={`mailto:merchant_support@wish.com`}
                      style={styles.linkText}
                      underline
                      openInNewTab
                    >
                      {ci18n("Email to wish customer support", "Need support?")}
                    </Link>
                  </div>
                </div>
                <div>
                  <div className={css(styles.linkBox)}>
                    <Image
                      src="/md/images/seller-identity/linkIcon.svg"
                      alt={ci18n(
                        "alt text for an image",
                        "Tax information banner",
                      )}
                      width={"24px"}
                      height={"24px"}
                    />
                    <Link
                      href={merchFeUrl(sellerProfile)}
                      style={styles.linkText}
                      underline
                      openInNewTab
                    >
                      Link to seller profile to view status
                    </Link>
                  </div>
                </div>
              </Box>
            </div>
            <Box sx={{ mt: 2, pt: 4 }}>
              <Stack direction={"row"} spacing={1}>
                <Button
                  disabled={!attachment}
                  primary
                  onClick={() => {
                    void onSubmit();
                  }}
                >
                  {ci18n("Submit button copy", "Submit")}
                </Button>
              </Stack>
            </Box>
          </>
        ) : (
          <LoadingIndicator className={commonStyles.loading} />
        )}
      </PageGuide>
    </PageRoot>
  );
};

export default observer(TaxDocumentsPage);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          background: "#fff",
        },
        header: {
          display: "flex",
          alignItems: "center",
          fontSize: "34px",
          lineHeight: "40px",
          fontWeight: 700,
        },
        headerText: { fontSize: "16px", fontWeight: 400, lineHeight: "24px" },
        bannerInfo: {
          borderRadius: "8px",
          background: "#FFC72C",
          padding: "12px",
          display: "flex",
          marginTop: "14px",
        },
        bannerText: {
          display: "flex",
          flex: 1,
          flexDirection: "column",
        },
        icon: {
          width: 24,
          height: 24,
          margin: 10,
        },
        guide: {},
        uploadTitle: {
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: "24px",
          display: "flex",
        },
        uploadText: {
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          marginBottom: "40px",
        },
        contentBox: {
          display: "flex",
          marginTop: "40px",
        },
        linkBox: {
          display: "flex",
          lineHeight: "24px",
          marginBottom: "24px",
        },
        linkText: {
          fontSize: 16,
          fontWeight: 500,
          textDecorationLine: "underline",
          color: "#0E161C",
          marginLeft: "8px",
        },
        templateLinkText: {
          fontSize: 16,
          fontWeight: 500,
          textDecorationLine: "underline",
          color: "rgba(48, 91, 239, 1)",
          marginLeft: "8px",
        },
      }),
    [],
  );
};
