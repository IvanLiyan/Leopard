import React, { useMemo, ReactNode, useEffect, useState } from "react";
import { StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import moment from "moment/moment";

/* Lego Components */
import {
  Checkpoint,
  Layout,
  LoadingIndicator,
  Card,
  Text,
  Label,
  HorizontalField,
  HorizontalFieldProps,
  RichTextBanner,
  Ul,
} from "@ContextLogic/lego";

import Flag from "@merchant/component/core/Flag";
import ImageList from "@merchant/component/core/ImageList";

/* Merchant Components */
import SellerProfileSettingsBox from "@merchant/component/seller-profile-settings/SellerProfileSettingsBox";
import KYCVerificationBanner from "@merchant/component/seller-profile-settings/KYCVerificationBanner";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold, weightSemibold } from "@toolkit/fonts";
import { getDocName } from "@toolkit/seller-profile-verification/doc-type";

/* Merchant API */
import { reverifySellerProfile } from "@merchant/api/seller-profile-verification";

/* Merchant Stores */
import { useNavigationStore } from "@stores/NavigationStore";
import { useLocalizationStore } from "@stores/LocalizationStore";
import { useApolloStore } from "@stores/ApolloStore";

/* Types */
import {
  AddressSchema,
  Country,
  Datetime,
  FileDataSchema,
  KycProfileVerificationStatus,
  KycVerificationSchema,
  MerchantFileSchema,
  MerchantProofDocSchema,
  SellerProfileVerificationStatus,
  SellerVerificationFeedback,
  SellerVerificationAdminFeedback,
  SellerVerificationSchema,
  UserEntityType,
} from "@schema/types";

const { Li } = Ul;

const StateNameMap: { [s in SellerProfileVerificationStatus]: string } = {
  INCOMPLETE: i`Incomplete`,
  // "complete" is a temporary state before creating authentication ticket.
  // If profile stuck in this state, it means something wrong with creation.
  // And we will show "incomplete" to merchants and let them submit again.
  COMPLETE: i`incomplete`,
  REVIEWING: i`Pending Review`,
  APPROVED: i`Validated`,
  REJECTED: i`Rejected`,
};

const StateLabelBgColorMap: {
  [s in SellerProfileVerificationStatus]: string;
} = {
  INCOMPLETE: palettes.yellows.LightYellow,
  COMPLETE: palettes.yellows.LightYellow,
  REVIEWING: palettes.cyans.Cyan,
  APPROVED: palettes.coreColors.WishBlue,
  REJECTED: palettes.yellows.DarkerYellow,
};

const StateLabelColorMap: { [s in SellerProfileVerificationStatus]: string } = {
  INCOMPLETE: palettes.textColors.Ink,
  COMPLETE: palettes.textColors.Ink,
  REVIEWING: palettes.textColors.White,
  APPROVED: palettes.textColors.White,
  REJECTED: palettes.textColors.White,
};

const EntityTypeMap: { [t in UserEntityType]: string } = {
  INDIVIDUAL: i`Individual`,
  COMPANY: i`Company`,
};

// Unlike State, KYC State can be completed
const KYCStateLabelColorMap: { [s in KycProfileVerificationStatus]: string } = {
  INCOMPLETE: palettes.textColors.Ink,
  COMPLETE: palettes.textColors.White,
  REJECTED: palettes.textColors.White,
};

const KycStateLabelBgColorMap: {
  [s in KycProfileVerificationStatus]: string;
} = {
  INCOMPLETE: palettes.yellows.LightYellow,
  COMPLETE: palettes.coreColors.WishBlue,
  REJECTED: palettes.yellows.DarkerYellow,
};

const KycStateNameMap: { [s in KycProfileVerificationStatus]: string } = {
  INCOMPLETE: i`Incomplete`,
  COMPLETE: i`Complete`,
  REJECTED: i`Rejected`,
};

type AdminFeedbackPick = Pick<
  SellerVerificationFeedback,
  | "businessAddressIssue"
  | "companyNameIssue"
  | "countryOfDomicileIssue"
  | "dateOfBirthIssue"
  | "entityTypeIssue"
  | "firstNameIssue"
  | "lastNameIssue"
  | "middleNameIssue"
  | "phoneNumberIssue"
  | "proofOfIdDocTypeIssue"
  | "proofOfIdentificationIssue"
>;

type AdminLatestFeedbackPick = Pick<
  SellerVerificationAdminFeedback,
  | "businessAddressIssue"
  | "countryOfDomicileIssue"
  | "dateOfBirthIssue"
  | "entityTypeIssue"
  | "firstNameIssue"
  | "middleNameIssue"
  | "lastNameIssue"
  | "isLegalRepAndConsentsToSigIssue"
  | "registeredBusinessNameIssue"
  | "registeredBusinessNumIssue"
  | "proofDocIssues"
>;

type FileDataSchemaPick = Pick<
  FileDataSchema,
  "merchantFileId" | "pictureType" | "fileUrl" | "fileName"
>;

type MerchantProofDocSchemaPick = Pick<
  MerchantProofDocSchema,
  "id" | "docName" | "docType" | "docName" | "idNumber"
> & {
  fileDataList?: ReadonlyArray<FileDataSchemaPick> | null;
  expDate?: Pick<Datetime, "unix"> | null;
};

type SellerVerificationSchemaPick = Pick<
  SellerVerificationSchema,
  | "status"
  | "canStart"
  | "firstName"
  | "middleName"
  | "lastName"
  | "phoneNumber"
  | "entityType"
  | "companyName"
  | "proofOfIdDocType"
  | "isKycVerification"
  | "regBusinessName"
  | "regBusinessNum"
  | "isLegalRepAndConsentToElectronicSig"
> & {
  readonly kycVerification?: Pick<
    KycVerificationSchema,
    "status" | "isMandatory" | "canStart" | "fromV2Flow"
  > | null;
  readonly adminFeedback?: AdminFeedbackPick | null;
  readonly adminLatestFeedback?: AdminLatestFeedbackPick | null;
  readonly lastUpdateTime?: Pick<Datetime, "unix"> | null;
  readonly dateOfBirth?: Pick<Datetime, "unix"> | null;
  readonly domicileCountry?: Pick<Country, "code"> | null;
  readonly businessAddress?: Pick<
    AddressSchema,
    "streetAddress1" | "streetAddress2" | "city" | "zipcode" | "state"
  > | null;
  readonly proofOfIdFiles?: ReadonlyArray<
    Pick<MerchantFileSchema, "fileUrl" | "displayFilename">
  > | null;
  readonly proofOfDocs?: ReadonlyArray<MerchantProofDocSchemaPick> | null;
};

type SellerProfileQueryResponseType = {
  readonly currentMerchant?: {
    readonly sellerVerification?: SellerVerificationSchemaPick | null;
  } | null;
};

const GET_SELLER_PROFILE_QUERY = gql`
  query SellerProfile_GetSellerProfile {
    currentMerchant {
      sellerVerification {
        status
        kycVerification {
          status
          isMandatory
          canStart
          fromV2Flow
        }
        isKycVerification
        canStart
        lastUpdateTime {
          unix
        }
        adminFeedback {
          businessAddressIssue
          companyNameIssue
          countryOfDomicileIssue
          dateOfBirthIssue
          entityTypeIssue
          firstNameIssue
          lastNameIssue
          middleNameIssue
          phoneNumberIssue
          proofOfIdDocTypeIssue
          proofOfIdentificationIssue
        }
        firstName
        middleName
        lastName
        phoneNumber
        domicileCountry {
          code
        }
        dateOfBirth {
          unix
        }
        businessAddress {
          streetAddress1
          streetAddress2
          city
          state
          zipcode
        }
        entityType
        companyName
        proofOfIdFiles {
          displayFilename
          fileUrl
        }
        proofOfIdDocType
        regBusinessName
        regBusinessNum
        isLegalRepAndConsentToElectronicSig
        adminLatestFeedback {
          entityTypeIssue
          countryOfDomicileIssue
          businessAddressIssue
          registeredBusinessNameIssue
          registeredBusinessNumIssue
          firstNameIssue
          lastNameIssue
          middleNameIssue
          dateOfBirthIssue
          isLegalRepAndConsentsToSigIssue
          proofDocIssues
        }
        proofOfDocs {
          id
          docType
          docName
          idNumber
          fileDataList {
            merchantFileId
            pictureType
            fileUrl
            fileName
          }
          expDate {
            unix
          }
        }
      }
    }
  }
`;

const SellerProfile = () => {
  const navigationStore = useNavigationStore();
  const { locale } = useLocalizationStore();
  const { client } = useApolloStore();
  const styles = useStyleSheet();

  const [data, setData] = useState<SellerVerificationSchemaPick>();

  useEffect(() => {
    (async (): Promise<void> => {
      const response = await client.query<SellerProfileQueryResponseType, void>(
        {
          query: GET_SELLER_PROFILE_QUERY,
        }
      );

      if (response.data?.currentMerchant?.sellerVerification) {
        setData(response.data?.currentMerchant?.sellerVerification);
      }
    })();
  }, [client]);

  if (!data) {
    return <LoadingIndicator />;
  }

  const stateName: SellerProfileVerificationStatus =
    data.status || "INCOMPLETE";

  const {
    adminFeedback,
    canStart,
    kycVerification,
    firstName,
    middleName,
    lastName,
    phoneNumber,
    businessAddress,
    entityType,
    domicileCountry,
    companyName,
    proofOfIdFiles,
    proofOfIdDocType,
    lastUpdateTime,
    dateOfBirth,
    isKycVerification,
    regBusinessName,
    regBusinessNum,
    isLegalRepAndConsentToElectronicSig,
    proofOfDocs,
    adminLatestFeedback,
  } = data;

  const isNewFlow = proofOfDocs && proofOfDocs.length > 0;

  const feedback = isNewFlow ? adminLatestFeedback : adminFeedback;

  const getProofDocIssuesObj = (): Record<string, string> => {
    try {
      return JSON.parse(adminLatestFeedback?.proofDocIssues || "{}");
    } catch (err) {
      return {};
    }
  };

  const lastUpdateTimeFormatted =
    lastUpdateTime && moment.unix(lastUpdateTime.unix).utc().format("LLL");
  const dateOfBirthFormatted =
    dateOfBirth && moment.unix(dateOfBirth.unix).utc().format("LL");
  const countryCodeDomicile = domicileCountry?.code;

  const kycStatus = kycVerification?.status;
  const kycMandatory = !!kycVerification?.isMandatory;
  const canStartKyc = !!kycVerification?.canStart;
  const fromV2Flow = !!kycVerification?.fromV2Flow;

  const getName = () => {
    if (firstName == null || lastName == null) {
      return null;
    }
    if (countryCodeDomicile == "CN") {
      return `${lastName}${firstName}`;
    }
    if (middleName) {
      return `${firstName} ${middleName} ${lastName}`;
    }
    return `${firstName} ${lastName}`;
  };

  const handleReverify = async () => {
    if (!isKycVerification) {
      await reverifySellerProfile({}).call();
    }
    const url = isKycVerification
      ? "/kyc-verification"
      : "/seller-profile-verification";
    navigationStore.navigate(url);
  };

  const renderBusinessAddress = () => {
    if (!businessAddress) {
      return null;
    }

    if (countryCodeDomicile == "CN") {
      return (
        <>
          <div>
            {businessAddress.state}, {businessAddress.city}
          </div>
          <div>{businessAddress.streetAddress1}</div>
          {businessAddress.streetAddress2 && (
            <div>{businessAddress.streetAddress2}</div>
          )}
          <div>{businessAddress.zipcode}</div>
        </>
      );
    }
    return (
      <>
        <div>{businessAddress.streetAddress1}</div>
        {businessAddress.streetAddress2 && (
          <div>{businessAddress.streetAddress2}</div>
        )}
        <div>
          {businessAddress.state}, {businessAddress.city}
        </div>
        <div>{businessAddress.zipcode}</div>
      </>
    );
  };

  const renderFieldTitle = (text: ReactNode) => {
    return <div className={css(styles.fieldTitle)}>{text}</div>;
  };

  const renderNotSubmitted = () => {
    return <div className={css(styles.notSubmitted)}>Not Submitted</div>;
  };

  const renderImagesOld = () => {
    return (
      proofOfIdFiles &&
      proofOfIdFiles.map((file) => (
        <ImageList.Image
          key={file.displayFilename}
          src={file.fileUrl}
          name={file.displayFilename}
          imageId={file.displayFilename}
          onClick={() => window.open(file.fileUrl)}
        />
      ))
    );
  };

  const renderImagesNew = (
    files?: ReadonlyArray<FileDataSchemaPick> | null
  ) => {
    return (
      files &&
      files.map((file) => (
        <ImageList.Image
          key={file.merchantFileId}
          src={file.fileUrl}
          name={file.fileName}
          imageId={file.merchantFileId}
          onClick={() => window.open(file.fileUrl)}
        />
      ))
    );
  };

  const horizontalFieldProps: Partial<HorizontalFieldProps> = {
    className: css(styles.space, styles.field),
    titleAlign: "start",
    popoverPosition: "right center",
    popoverSentiment: "warning",
    titleWidth: 220,
  };

  const rejectReason = () => {
    if (stateName != "REJECTED") {
      return null;
    }
    if (!feedback) {
      return null;
    }

    const commentsNode = Object.entries(feedback).flatMap(
      ([field, comment]) => {
        if (!comment || field[0] == "_") {
          return [];
        }
        if (field === "proofDocIssues") {
          const proofDocIssues = getProofDocIssuesObj();
          return Object.values(proofDocIssues).map((comment) => {
            return <Li key={comment}>{comment}</Li>;
          });
        }
        return <Li key={comment}>{comment}</Li>;
      }
    );

    return (
      <div className={css(styles.rejectReason)}>
        <p>
          Here is a list of items that did not meet the criteria for successful
          validation:
        </p>
        <Ul>{commentsNode}</Ul>
        <p>Please validate your store again.</p>
      </div>
    );
  };

  const getPopoverText = (
    fieldNames: Array<keyof (AdminFeedbackPick & AdminLatestFeedbackPick)>,
    docType?: string
  ) => {
    if (stateName != "REJECTED") {
      return null;
    }

    if (!feedback) {
      return null;
    }

    const comments: string[] = [];
    for (const name of fieldNames) {
      if (isNewFlow && name === "proofDocIssues" && docType) {
        const proofDocIssues = getProofDocIssuesObj();
        if (proofDocIssues[docType]) {
          comments.push(proofDocIssues[docType]);
        }
        continue;
      }
      const comment = (feedback as AdminLatestFeedbackPick & AdminFeedbackPick)[
        name
      ];
      if (comment) {
        comments.push(comment);
      }
    }

    if (comments.length == 0) {
      return null;
    }

    return () => (
      <div className={css(styles.tip)}>
        {comments.map((c) => (
          <p key={c}>{c}</p>
        ))}
      </div>
    );
  };

  const renderBanner = () => {
    if (isKycVerification) {
      return (
        <KYCVerificationBanner
          handleReverify={handleReverify}
          canStartKyc={canStartKyc}
          isMandatory={kycMandatory}
          enableNonVerifificationFlow={!entityType || !countryCodeDomicile}
          stateName={stateName}
          fromV2Flow={fromV2Flow}
        />
      );
    } else if (stateName == "REJECTED") {
      return (
        <RichTextBanner
          title={i`Your store validation is rejected`}
          description={rejectReason}
          sentiment="warning"
          contentAlignment="left"
          iconVerticalAlignment="top"
          buttonText={i`Validate store again`}
          onClick={handleReverify}
        />
      );
    }
  };

  const renderProofOfDoc = (doc: MerchantProofDocSchemaPick) => {
    const { docName, docType, idNumber, expDate, fileDataList } = doc;
    const idNum = idNumber && <Text>{`ID number: ${idNumber}`}</Text>;
    const expiryDate = expDate ? (
      <Text>{`Expiry date: ${moment
        .unix(expDate.unix)
        .utc()
        .format("LL")}`}</Text>
    ) : (
      <Layout.FlexRow alignItems="center">
        <Text style={styles.expiryDate}>Expiry date:</Text>
        {renderNotSubmitted()}
      </Layout.FlexRow>
    );
    return (
      <HorizontalField
        title={() => renderFieldTitle(docName)}
        popoverContent={getPopoverText(["proofDocIssues"], docType)}
        {...horizontalFieldProps}
      >
        {idNum ? (
          <Checkpoint>
            {idNum}
            {expiryDate}
            <ImageList locale={locale}>
              {renderImagesNew(fileDataList)}
            </ImageList>
          </Checkpoint>
        ) : (
          <Checkpoint>
            {expiryDate}
            <ImageList locale={locale}>
              {renderImagesNew(fileDataList)}
            </ImageList>
          </Checkpoint>
        )}
      </HorizontalField>
    );
  };

  const showSettingsBox = !canStartKyc && canStart;

  return (
    <div className={css(styles.column)}>
      <div className={css(styles.pageTitle)}>Seller Profile</div>
      {showSettingsBox && (
        <SellerProfileSettingsBox
          className={css(styles.banner)}
          status={stateName}
          onReverify={handleReverify}
        />
      )}
      <Card className={css(styles.card)}>
        {renderBanner()}
        <div className={css(styles.column, styles.cardContent)}>
          {(canStart || canStartKyc || stateName != "INCOMPLETE") && (
            <>
              <div className={css(styles.cardTitle)}>Store validation</div>
              <HorizontalField
                title={() => renderFieldTitle(i`Validation status`)}
                {...horizontalFieldProps}
              >
                <Label
                  text={StateNameMap[stateName]}
                  textColor={StateLabelColorMap[stateName]}
                  fontSize={12}
                  backgroundColor={StateLabelBgColorMap[stateName]}
                  width={112}
                  fontWeight="regular"
                />
              </HorizontalField>
              <HorizontalField
                title={() => renderFieldTitle(i`Submitted on`)}
                {...horizontalFieldProps}
              >
                {stateName == "INCOMPLETE"
                  ? renderNotSubmitted()
                  : lastUpdateTimeFormatted}
              </HorizontalField>
              <div className={css(styles.dotLine, styles.space)} />
            </>
          )}
          <div className={css(styles.cardTitle, styles.space)}>
            You Provided
          </div>
          {isKycVerification ? (
            <>
              <HorizontalField
                title={() => renderFieldTitle(i`Country/region of domicile`)}
                popoverContent={getPopoverText(["countryOfDomicileIssue"])}
                {...horizontalFieldProps}
              >
                {countryCodeDomicile == null ? (
                  renderNotSubmitted()
                ) : (
                  <Flag
                    className={css(styles.flag)}
                    countryCode={countryCodeDomicile}
                    displayCountryName
                  />
                )}
              </HorizontalField>
              <HorizontalField
                title={() => renderFieldTitle(i`Account type`)}
                popoverContent={getPopoverText(["entityTypeIssue"])}
                {...horizontalFieldProps}
              >
                {entityType ? EntityTypeMap[entityType] : renderNotSubmitted()}
              </HorizontalField>
              {entityType && kycMandatory && kycStatus && (
                <HorizontalField
                  title={() =>
                    renderFieldTitle(
                      entityType == "INDIVIDUAL"
                        ? i`Proof of identity`
                        : i`KYC questionnaire`
                    )
                  }
                  {...horizontalFieldProps}
                >
                  <Label
                    text={KycStateNameMap[kycStatus]}
                    textColor={KYCStateLabelColorMap[kycStatus]}
                    fontSize={12}
                    backgroundColor={KycStateLabelBgColorMap[kycStatus]}
                    width={112}
                    fontWeight="regular"
                  />
                </HorizontalField>
              )}
            </>
          ) : (
            <>
              <HorizontalField
                title={() => renderFieldTitle(i`Full name`)}
                popoverContent={getPopoverText([
                  "firstNameIssue",
                  "lastNameIssue",
                ])}
                {...horizontalFieldProps}
              >
                {getName() || renderNotSubmitted()}
              </HorizontalField>
              <HorizontalField
                title={() => renderFieldTitle(i`Date of birth`)}
                popoverContent={getPopoverText(["dateOfBirthIssue"])}
                {...horizontalFieldProps}
              >
                {dateOfBirthFormatted || renderNotSubmitted()}
              </HorizontalField>
              {!isNewFlow && (
                <HorizontalField
                  title={() => renderFieldTitle(i`Phone number`)}
                  popoverContent={getPopoverText(["phoneNumberIssue"])}
                  {...horizontalFieldProps}
                >
                  {phoneNumber || renderNotSubmitted()}
                </HorizontalField>
              )}
              <HorizontalField
                title={() => renderFieldTitle(i`Country/region of domicile`)}
                popoverContent={getPopoverText(["countryOfDomicileIssue"])}
                {...horizontalFieldProps}
              >
                {countryCodeDomicile == null ? (
                  renderNotSubmitted()
                ) : (
                  <Flag
                    className={css(styles.flag)}
                    countryCode={countryCodeDomicile}
                    displayCountryName
                  />
                )}
              </HorizontalField>
              <HorizontalField
                title={() => renderFieldTitle(i`Business address`)}
                popoverContent={getPopoverText(["businessAddressIssue"])}
                {...horizontalFieldProps}
              >
                {renderBusinessAddress() || renderNotSubmitted()}
              </HorizontalField>
              <HorizontalField
                title={() => renderFieldTitle(i`Account type`)}
                popoverContent={getPopoverText(["entityTypeIssue"])}
                {...horizontalFieldProps}
              >
                {entityType ? EntityTypeMap[entityType] : renderNotSubmitted()}
              </HorizontalField>
              <HorizontalField
                title={() =>
                  renderFieldTitle(
                    isNewFlow ? i`Registered business name` : i`Company name`
                  )
                }
                popoverContent={getPopoverText(
                  isNewFlow
                    ? ["registeredBusinessNameIssue"]
                    : ["companyNameIssue"]
                )}
                {...horizontalFieldProps}
              >
                {(isNewFlow ? regBusinessName : companyName) ||
                  renderNotSubmitted()}
              </HorizontalField>
              {isNewFlow && (
                <HorizontalField
                  title={() => renderFieldTitle(i`Registered business number`)}
                  popoverContent={getPopoverText([
                    "registeredBusinessNumIssue",
                  ])}
                  {...horizontalFieldProps}
                >
                  {regBusinessNum || renderNotSubmitted()}
                </HorizontalField>
              )}
              {isNewFlow && isLegalRepAndConsentToElectronicSig != null && (
                <HorizontalField
                  title={() =>
                    renderFieldTitle(
                      i`Is legal representative and consent to electronic signature`
                    )
                  }
                  popoverContent={getPopoverText([
                    "isLegalRepAndConsentsToSigIssue",
                  ])}
                  {...horizontalFieldProps}
                >
                  {isLegalRepAndConsentToElectronicSig ? i`Yes` : i`No`}
                </HorizontalField>
              )}
              {isNewFlow ? (
                proofOfDocs?.map((doc) => (
                  <Layout.FlexColumn key={doc.id}>
                    {renderProofOfDoc(doc)}
                  </Layout.FlexColumn>
                ))
              ) : (
                <>
                  <HorizontalField
                    title={() => renderFieldTitle(i`Document Type`)}
                    popoverContent={getPopoverText(["proofOfIdDocTypeIssue"])}
                    {...horizontalFieldProps}
                  >
                    {proofOfIdDocType
                      ? getDocName(
                          proofOfIdDocType,
                          countryCodeDomicile == "CN"
                        )
                      : renderNotSubmitted()}
                  </HorizontalField>
                  <HorizontalField
                    title={() => renderFieldTitle(i`Proof of identity`)}
                    popoverContent={getPopoverText([
                      "proofOfIdentificationIssue",
                    ])}
                    {...horizontalFieldProps}
                  >
                    {proofOfIdFiles ? (
                      <ImageList locale={locale}>{renderImagesOld()}</ImageList>
                    ) : (
                      renderNotSubmitted()
                    )}
                  </HorizontalField>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SellerProfile;

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        column: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        pageTitle: {
          marginTop: 48,
          color: palettes.textColors.Ink,
          fontWeight: weightBold,
          fontSize: 24,
          lineHeight: "32px",
        },
        banner: {
          marginTop: 20,
        },
        card: {
          marginTop: 20,
        },
        rejectReason: {
          marginTop: 8,
        },
        cardContent: {
          padding: "28px 24px",
        },
        cardTitle: {
          fontSize: 20,
          lineHeight: "24px",
          fontWeight: weightSemibold,
          color: palettes.textColors.Ink,
        },
        field: {
          fontSize: 14,
          lineHeight: "20px",
        },
        fieldTitle: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          lineHeight: "20px",
          fontWeight: weightSemibold,
        },
        tip: {
          padding: "10px 10px 0 10px",
          fontSize: 14,
          maxWidth: 300,
        },
        space: {
          marginTop: 28,
        },
        dotLine: {
          height: 0,
          borderTop: `2px dotted ${palettes.greyScaleColors.Grey}`,
        },
        notSubmitted: {
          color: palettes.greyScaleColors.DarkGrey,
        },
        flag: {
          width: 24,
        },
        expiryDate: {
          marginRight: 4,
        },
      }),
    []
  );
};