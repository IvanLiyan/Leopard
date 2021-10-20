import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { RadioGroup } from "@ContextLogic/lego";
import { AttachmentServerParams } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { DEPRECATEDFileInput } from "@merchant/component/core";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";
import { useToastStore } from "@stores/ToastStore";
import { useTheme } from "@stores/ThemeStore";

/* Merchant API */
import * as troApi from "@merchant/api/brand/merchant-tro";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AttachmentInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";

export type SendTroUpdateFormModalContentProps = BaseProps & {
  readonly injunctionId: string;
  readonly onClose: () => unknown;
  readonly onUpdate: () => unknown;
};

type FormStatus = "LAWYER" | "RESOLVED" | "OTHER";

const SendTroUpdateFormModalContent = (
  props: SendTroUpdateFormModalContentProps,
) => {
  const styles = useStylesheet(props);
  const toastStore = useToastStore();
  const { isSmallScreen } = useDeviceStore();
  const { injunctionId, onClose, onUpdate } = props;
  const formOptions = [
    { value: "LAWYER", text: i`I hired a lawyer` },
    { value: "RESOLVED", text: i`My case is resolved` },
    { value: "OTHER", text: i`other` },
  ];
  const [formStatus, setFormStatus] = useState<FormStatus>("LAWYER");
  const [firmName, setFirmName] = useState("");
  const [agreedToToS, setAgreedToToS] = useState(false);
  const [lawyerName, setLawyerName] = useState("");
  const [lawyerEmail, setLawyerEmail] = useState("");
  const [message, setMessage] = useState("");

  const [actionButtonLoading, setSecondaryButtonLoading] = useState(false);

  const [screenshotFile, setScreenshotFile] =
    useState<AttachmentServerParams | null>(null);
  const [screenshotAttachments, setScreenshotAttachments] = useState<
    ReadonlyArray<AttachmentInfo>
  >([]);

  let isValid = false;
  switch (formStatus) {
    case "LAWYER":
      isValid =
        Boolean(lawyerName) &&
        Boolean(lawyerEmail) &&
        Boolean(firmName) &&
        Boolean(message) &&
        agreedToToS;
      break;
    case "RESOLVED":
      isValid = screenshotFile !== null && Boolean(message) && agreedToToS;
      break;
    case "OTHER":
      isValid = Boolean(message);
  }

  let submissionParams: troApi.SendTroUpdateParams | null = null;
  switch (formStatus) {
    case "LAWYER":
      submissionParams = {
        reply_type: "HIRED_LAWYER",
        injunction_id: injunctionId,
        firm_name: firmName,
        lawyer_email: lawyerEmail,
        lawyer_name: lawyerName,
        message,
      };
      break;
    case "RESOLVED":
      submissionParams = {
        reply_type: "RESOLVED",
        injunction_id: injunctionId,
        screenshot_file: JSON.stringify(screenshotFile),
        message,
      };
      break;
    case "OTHER":
      submissionParams = {
        reply_type: "NORMAL_REPLY",
        injunction_id: injunctionId,
        message,
      };
  }

  const sendButtonProps = {
    style: { flex: 1 },
    isDisabled: !isValid,
    text: i`Submit`,
    isLoading: actionButtonLoading,
    onClick: async () => {
      setSecondaryButtonLoading(true);
      const params = submissionParams;
      if (params) {
        const response = await troApi.sendTroUpdate(params).call();

        if (response.code === 0) {
          toastStore.positive(i`Message was added successfully!`);
          if (onUpdate) {
            onUpdate();
          }
          if (onClose) {
            onClose();
          }
        } else {
          setSecondaryButtonLoading(false);
          if (response.msg) {
            toastStore.error(response.msg);
          }
        }
      }
    },
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.question)}>
        Expedite the processing of your case by sending us an update.
      </div>
      <HorizontalField
        title={i`What is your update?`}
        className={css(styles.field)}
      >
        <RadioGroup
          onSelected={(value) => {
            setFormStatus(value);
            setMessage("");
          }}
          className={css(styles.radioGroupField)}
          selectedValue={formStatus}
        >
          {formOptions.map((option) => (
            <RadioGroup.Item
              key={option.text}
              value={option.value}
              text={option.text}
            />
          ))}
        </RadioGroup>
      </HorizontalField>
      {formStatus === "LAWYER" && (
        <div className={css(styles.section)}>
          <div className={css(styles.rightField, styles.border)}>
            Provide us with the details of your lawyer so we can ensure that
            your case is prioritized and processed as soon as possible.
          </div>
          <HorizontalField
            title={i`Law Firm Name`}
            centerTitleVertically
            className={css(styles.field)}
          >
            <TextInput
              validators={[]}
              disabled={actionButtonLoading}
              onChange={({ text }: OnTextChangeEvent) => {
                setFirmName(text);
              }}
              value={firmName}
            />
          </HorizontalField>
          <HorizontalField
            title={i`Lawyer Name`}
            centerTitleVertically
            className={css(styles.field)}
          >
            <TextInput
              validators={[]}
              disabled={actionButtonLoading}
              onChange={({ text }: OnTextChangeEvent) => {
                setLawyerName(text);
              }}
              value={lawyerName}
            />
          </HorizontalField>
          <HorizontalField
            title={i`Lawyer Email`}
            centerTitleVertically
            className={css(styles.field)}
          >
            <TextInput
              validators={[]}
              disabled={actionButtonLoading}
              onChange={({ text }: OnTextChangeEvent) => {
                setLawyerEmail(text);
              }}
              value={lawyerEmail}
            />
          </HorizontalField>
          <HorizontalField title={i`Message`} className={css(styles.field)}>
            <TextInput
              validators={[]}
              disabled={actionButtonLoading}
              onChange={({ text }: OnTextChangeEvent) => {
                setMessage(text);
              }}
              height={100}
              value={message}
              isTextArea
              placeholder={i`Enter a message`}
            />
          </HorizontalField>
          <div className={css(styles.rightField)}>
            <CheckboxField
              onChange={(checked) => setAgreedToToS(checked)}
              checked={agreedToToS}
            >
              I have obtained legal representation for case.*
            </CheckboxField>
          </div>
        </div>
      )}
      {formStatus === "RESOLVED" && (
        <div className={css(styles.section)}>
          <div className={css(styles.rightField, styles.border)}>
            To accelerate the resolution of your case, please submit your
            settlement agreement and/or letter of dismissal. Once Wish’s legal
            team verifies the information with the plaintiff, we will resolve
            your case and remove store restrictions, if any, as soon as
            possible.
          </div>
          <HorizontalField title={i`Document`} className={css(styles.field)}>
            <div className={css(styles.fileContainer)}>
              <DEPRECATEDFileInput
                bucket="TEMP_UPLOADS"
                disabled={actionButtonLoading}
                className={css(styles.fileInput)}
                accepts=".jpeg,.jpg,.png,.pdf"
                maxAttachments={1}
                onAttachmentsChanged={(
                  attachments: ReadonlyArray<AttachmentInfo>,
                ) => {
                  setScreenshotAttachments(attachments);
                  if (attachments.length > 0) {
                    setScreenshotFile(attachments[0].serverParams);
                  } else {
                    setScreenshotFile(null);
                  }
                }}
                maxSizeMB={2}
                attachments={screenshotAttachments}
              />
            </div>
          </HorizontalField>

          <HorizontalField title={i`Message`} className={css(styles.field)}>
            <TextInput
              validators={[]}
              disabled={actionButtonLoading}
              onChange={({ text }: OnTextChangeEvent) => {
                setMessage(text);
              }}
              height={100}
              value={message}
              isTextArea
              placeholder={i`Enter a message`}
            />
          </HorizontalField>
          <div className={css(styles.rightField)}>
            <CheckboxField
              onChange={(checked) => setAgreedToToS(checked)}
              checked={agreedToToS}
            >
              I certify that I have reached a settlement and/or was dismissed
              from the case.*
            </CheckboxField>
          </div>
        </div>
      )}
      {formStatus === "OTHER" && (
        <div className={css(styles.section, styles.borderAbove)}>
          <HorizontalField title={i`Message`} className={css(styles.field)}>
            <TextInput
              validators={[]}
              disabled={actionButtonLoading}
              onChange={({ text }: OnTextChangeEvent) => {
                setMessage(text);
              }}
              height={100}
              value={message}
              isTextArea
              placeholder={i`Enter a message`}
            />
          </HorizontalField>
          <div className={css(styles.rightField, styles.border)}>
            Send us an update of your settlement to expedite the restoration of
            your store.
          </div>
        </div>
      )}
      <ModalFooter
        layout={isSmallScreen ? "vertical" : "horizontal"}
        action={sendButtonProps}
        cancel={{
          disabled: actionButtonLoading,
          text: i`Cancel`,
          onClick: () => onClose(),
        }}
      />
    </div>
  );
};
export default SendTroUpdateFormModalContent;

const useStylesheet = (props: SendTroUpdateFormModalContentProps) => {
  const { isSmallScreen } = useDeviceStore();
  const { borderPrimaryDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "28px,10%,10px, 10%",
        },
        radioGroupField: {},
        fileInput: {
          flex: 1,
        },
        fileContainer: {
          display: "flex",
          flexDirection: "column",
        },
        field: {
          ":first-child": {
            paddingTop: 40,
          },
          ":not(:first-child)": {
            paddingTop: 20,
          },
          paddingBottom: 20,
          paddingRight: "5%",
        },
        rightField: {
          paddingLeft: !isSmallScreen ? 340 : undefined,
          paddingRight: "5%",
        },
        border: {
          paddingBottom: 10,
          borderBottom: `solid 1px ${borderPrimaryDark}`,
        },
        borderAbove: {
          borderTop: `solid 1px ${borderPrimaryDark}`,
        },
        question: {
          alignSelf: "center",
          textAlign: "center",
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.5,
          fontSize: "16px",
          fontFamily: fonts.proxima,
          paddingTop: "20px",
          paddingBottom: "20px",
        },
        section: {},
      }),
    [isSmallScreen, borderPrimaryDark],
  );
};
