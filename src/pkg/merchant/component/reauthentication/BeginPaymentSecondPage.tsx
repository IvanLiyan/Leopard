import React, { ReactNode } from "react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";
import { RadioGroup } from "@ContextLogic/lego";

/* Relative Imports */
import {
  CardTitle,
  CardDescription,
  ReauthTip,
  ReauthRow,
  ReauthRowTitle,
  ReauthRowValue,
  Entity,
  ReauthTextArea,
} from "./ReauthComponents";

import { AttachmentInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { LetterOfCommitProps } from "@toolkit/reauthentication/reauth-types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type SecondPageProps = BaseProps & {
  readonly letterOfCommit: LetterOfCommitProps;
  readonly onViewAttachments: (
    attachments: ReadonlyArray<AttachmentInfo>,
    viewIndex: number
  ) => unknown;
  readonly onCanReachEveryoneChange: (canReach: boolean) => unknown;
  readonly onOwnershipImagesChange: (
    images: ReadonlyArray<AttachmentInfo>
  ) => unknown;
  readonly onLetterImagesChange: (
    images: ReadonlyArray<AttachmentInfo>
  ) => unknown;
  readonly onIncludeCompanyChange: (include: boolean) => unknown;
  readonly onBizLicImagesChange: (
    images: ReadonlyArray<AttachmentInfo>
  ) => unknown;
  readonly onCommentChange: (event: OnTextChangeEvent) => unknown;
  readonly globalIdFn: (entityId: string, materialId: string) => string;
};

const BeginPaymentSecondPage = (props: SecondPageProps) => {
  const renderFields = () => {
    const {
      letterOfCommit,
      onBizLicImagesChange,
      onIncludeCompanyChange,
      onLetterImagesChange,
      onOwnershipImagesChange,
      onViewAttachments,
    } = props;

    const letterImagesTitle =
      i`Photos of all account owners holding` +
      i` their own ID card and letter of commitment`;
    const letterImagesTip =
      "各支付账号所有者需在一式多份的承诺书上签名。" +
      "如所有者为公司，则还需加盖公司公章。";
    const ownershipTitle = i`Proof of ownership of your Wish Merchant account`;
    const includeCompanyTitle = i`Does the account include company account`;
    const includeCompanyTip = "您可以前往对应的账号后台查看账号类型。";
    const bizLicTitle = i`Photos of corresponding company's bussiness license`;

    const letterURL =
      "https://s3.cn-north-1.amazonaws.com.cn/" +
      "sweeper-production-merchantimage/" +
      "letter_of_commitment_template.docx";
    const letterImagesDiv = (
      <ReauthRowTitle>
        <div>{letterImagesTitle}</div>
        <Link href={letterURL}>
          Download the template of letter of commitment
        </Link>
      </ReauthRowTitle>
    );

    let fields: ReactNode = null;
    if (letterOfCommit.canReachEveryone) {
      fields = (
        <>
          <ReauthRow
            title={() => letterImagesDiv}
            titleWidth={301}
            popoverContent={() => <ReauthTip tipText={letterImagesTip} />}
            popoverPosition="right center"
          >
            <ReauthRowValue>
              <DEPRECATEDFileInput
                bucket="TEMP_UPLOADS"
                accepts=".jpeg,.jpg,.png"
                maxSizeMB={11}
                maxAttachments={11}
                attachments={letterOfCommit.letterImages || []}
                onAttachmentsChanged={onLetterImagesChange}
                onViewAttachments={onViewAttachments}
              />
            </ReauthRowValue>
          </ReauthRow>
          <ReauthRow
            title={includeCompanyTitle}
            titleWidth={301}
            popoverContent={() => <ReauthTip tipText={includeCompanyTip} />}
            popoverPosition="right center"
          >
            <RadioGroup
              onSelected={onIncludeCompanyChange}
              selectedValue={letterOfCommit.includeCompany}
            >
              <RadioGroup.Item value text={i`Yes`} />
              <RadioGroup.Item value={false} text={i`No`} />
            </RadioGroup>
          </ReauthRow>
          {letterOfCommit.includeCompany && (
            <ReauthRow title={bizLicTitle} titleWidth={301}>
              <ReauthRowValue>
                <DEPRECATEDFileInput
                  bucket="TEMP_UPLOADS"
                  accepts=".jpeg,.jpg,.png"
                  maxSizeMB={11}
                  maxAttachments={11}
                  attachments={letterOfCommit.bizLicImages || []}
                  onAttachmentsChanged={onBizLicImagesChange}
                  onViewAttachments={onViewAttachments}
                />
              </ReauthRowValue>
            </ReauthRow>
          )}
        </>
      );
    } else {
      fields = (
        <ReauthRow title={ownershipTitle} titleWidth={301}>
          <ReauthRowValue>
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              accepts=".jpeg,.jpg,.png"
              maxSizeMB={11}
              maxAttachments={11}
              attachments={letterOfCommit.ownershipImages || []}
              onAttachmentsChanged={onOwnershipImagesChange}
              onViewAttachments={onViewAttachments}
            />
          </ReauthRowValue>
        </ReauthRow>
      );
    }

    return fields;
  };

  const { letterOfCommit, onCanReachEveryoneChange, onCommentChange } = props;
  const canReachTitle =
    i`Are all account owners reachable and` +
    i` able to provide letter of commitment`;
  const commentPlaceholder =
    i`You can state changes you have made in the uploaded files here or` +
    i` leave a message about any doubts you have.`;

  return (
    <>
      <CardTitle hasDescription>Letter of Commitment</CardTitle>
      <CardDescription>
        Please have the account owner (individual or company) hold his/her own
        ID card and signed letter of commitment and take a photo of it. The
        letter of commitment will identify the final recipient. It has legal
        effect.
      </CardDescription>
      <Entity>
        <ReauthRow title={canReachTitle} titleWidth={301}>
          <RadioGroup
            onSelected={onCanReachEveryoneChange}
            selectedValue={letterOfCommit.canReachEveryone}
          >
            <RadioGroup.Item value text={i`Yes`} />
            <RadioGroup.Item value={false} text={i`No`} />
          </RadioGroup>
        </ReauthRow>
        {renderFields()}
        <ReauthRow title={i`Leave a message`} titleWidth={301}>
          <ReauthRowValue>
            <ReauthTextArea
              value={letterOfCommit.comment}
              placeholder={commentPlaceholder}
              onChange={onCommentChange}
            />
          </ReauthRowValue>
        </ReauthRow>
      </Entity>
    </>
  );
};

export default BeginPaymentSecondPage;
