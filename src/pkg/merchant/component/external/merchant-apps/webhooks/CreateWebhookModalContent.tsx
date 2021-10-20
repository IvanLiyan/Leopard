import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import faker from "faker/locale/en";
import _ from "lodash";

/* Lego Components */
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Field, FormSelect, TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator, UrlValidator } from "@toolkit/validators";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import {
  PickedWebhookTopicSchema,
  MerchantAppWebhookTopicName,
  PickedWebhookSubscriptionSchema,
} from "@toolkit/external/webhook";
import MerchantAppWebhookState from "@merchant/model/external/merchant-apps/MerchantAppWebhookState";

export type CreateWebhookModalContentProps = BaseProps & {
  readonly onClose: () => unknown;
  readonly isNew: boolean;
  readonly topicOptions: ReadonlyArray<PickedWebhookTopicSchema>;
  readonly state: MerchantAppWebhookState;
  readonly subscription?: PickedWebhookSubscriptionSchema | undefined;
};

const CreateWebhookModalContent = (props: CreateWebhookModalContentProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();
  const { isNew, onClose, state, topicOptions, subscription } = props;
  const [actionButtonLoading] = useState(state.isSubmitting);
  const [isValid, setIsValid] = useState(false);
  const [topicId, setTopicId] = useState(
    subscription ? subscription.topic.id : topicOptions[0].id,
  );
  const [endpoint, setEndpoint] = useState(
    subscription ? subscription.endpoint : "",
  );

  const sendButtonProps = {
    style: { flex: 1 },
    isDisabled: !isValid,
    text: i`Save webhook`,
    isLoading: actionButtonLoading,
    onClick: async () => {
      await state.submit({
        topicId,
        endpoint,
        subscriptionId: subscription ? subscription.id : null,
      });
    },
  };

  const options = _.sortBy(
    topicOptions.map((topic: PickedWebhookTopicSchema) => ({
      value: topic.id,
      text: MerchantAppWebhookTopicName[topic.name],
    })),
    (topic) => topic.text,
  );

  const requiredValidator = new RequiredValidator();
  const urlValidator = new UrlValidator();

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.content)}>
        <div className={css(styles.fieldRow, styles.fieldRowTwo)}>
          <Field title={i`Event`}>
            <FormSelect
              options={options}
              onSelected={(value: string) => {
                setTopicId(value);
              }}
              selectedValue={topicId}
              disabled={!isNew}
            />
          </Field>
          <Field title={i`Format`}>
            <FormSelect
              options={[
                {
                  value: "JSON",
                  text: i`JSON`,
                },
              ]}
              onSelected={() => {}}
              selectedValue="JSON"
              disabled
            />
          </Field>
        </div>
        <div className={css(styles.fieldRow)}>
          <Field title={i`URL`}>
            <TextInput
              value={endpoint}
              validators={[requiredValidator, urlValidator]}
              onValidityChanged={(isValid) => {
                setIsValid(isValid);
              }}
              onChange={({ text }) => {
                setEndpoint(text);
              }}
              debugValue={faker.internet.url()}
            />
          </Field>
        </div>
        <div className={css(styles.fieldRow)}>
          <Field title={i`Webhook API Version`}>
            <FormSelect
              options={[
                {
                  value: "V3",
                  text: i`API 3.0`,
                },
              ]}
              onSelected={() => {}}
              selectedValue="V3"
              disabled
            />
          </Field>
        </div>
      </div>
      <ModalFooter
        className={css(styles.footer)}
        layout={isSmallScreen ? "vertical" : "horizontal-centered"}
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
export default observer(CreateWebhookModalContent);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        },
        fieldRow: {
          ":not(:last-child)": {
            marginBottom: 27,
          },
          display: "grid",
          gridTemplateColumns: "1fr",
        },
        fieldRowTwo: {
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        },
        content: {
          padding: "64px 58px",
        },
        footer: {
          width: "100%",
        },
      }),
    [],
  );
};
