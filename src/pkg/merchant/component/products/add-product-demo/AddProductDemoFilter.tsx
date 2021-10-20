/*
 * AddProductDemoFilter.tsx
 *
 * Created by Jonah Dlin on Mon Jan 18 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxGroupField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { useIntQueryParam, useStringEnumArrayQueryParam } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import { ProductVideoState } from "@schema/types";

type VideoStatus = "ACTIVE" | "REJECTED" | "PROCESSING" | "PENDING_REVIEW";
const StatusToStateMapping: {
  [status in VideoStatus]: ReadonlyArray<ProductVideoState>;
} = {
  ACTIVE: ["APPROVED", "PENDING_REVIEW"],
  REJECTED: ["REJECTED"],
  PROCESSING: ["PENDING_TRANSCODE", "FAILED_TRANSCODE"],
  PENDING_REVIEW: ["PENDING_AUTO_REVIEW", "FAILED_AUTO_REVIEW"],
};

const StateToStatusMapping: { [status in ProductVideoState]: VideoStatus } = {
  REJECTED: "REJECTED",
  APPROVED: "ACTIVE",
  PENDING_REVIEW: "ACTIVE",
  UNKNOWN_STATE: "PENDING_REVIEW",
  PENDING_AUTO_REVIEW: "PENDING_REVIEW",
  FAILED_AUTO_REVIEW: "PENDING_REVIEW",
  PENDING_TRANSCODE: "PROCESSING",
  FAILED_TRANSCODE: "PROCESSING",
  FAILED_OBJECT_DETECTION: "PROCESSING",
  PENDING_REKOGNITION: "PROCESSING",
  FAILED_REKOGNITION: "PROCESSING",
};

type Props = BaseProps & {};

const AddProductDemoFilter: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  const [states, setStates] =
    useStringEnumArrayQueryParam<ProductVideoState>("states");
  const [, setOffset] = useIntQueryParam("offset");

  const onCheckedStates = ({ value }: OptionType<string>) => {
    const typeSet = new Set(states || []);
    for (const state of StatusToStateMapping[value as VideoStatus]) {
      if (typeSet.has(state)) {
        typeSet.delete(state);
      } else {
        typeSet.add(state);
      }
    }
    setStates(Array.from(typeSet));
    setOffset(0);
  };

  const statuses: ReadonlyArray<VideoStatus> = useMemo(() => {
    return (states || []).map(
      (state) => StateToStatusMapping[state as ProductVideoState],
    );
  }, [states]);

  const stateOptions: ReadonlyArray<OptionType<VideoStatus>> = useMemo(() => {
    return [
      { value: "ACTIVE", title: i`Active` },
      { value: "REJECTED", title: i`Rejected` },
      { value: "PENDING_REVIEW", title: i`Pending Review` },
      { value: "PROCESSING", title: i`Processing` },
    ];
  }, []);

  return (
    <div className={css(styles.root, className, style)}>
      <section className={css(styles.title)}>Filter by</section>
      <CheckboxGroupField
        className={css(styles.filterGroup)}
        title={i`Video Status`}
        options={stateOptions}
        onChecked={onCheckedStates}
        selected={statuses}
      />
    </div>
  );
};

export default observer(AddProductDemoFilter);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
          width: "fit-content",
        },
        title: {
          color: textBlack,
          fontSize: 20,
          lineHeight: 1,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        filterGroup: {
          whiteSpace: "nowrap",
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
      }),
    [textBlack],
  );
};
