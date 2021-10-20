import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import { Token, TextInput } from "@ContextLogic/lego";

import { KEYCODE_ENTER } from "@toolkit/dom";

import faker from "faker/locale/en";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import RightCard from "@plus/component/products/edit-product/RightCard";
import ProductEditState from "@plus/model/ProductEditState";

/* Merchant Store */
import { useToastStore } from "@stores/ToastStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Schema */
import { Maybe } from "@schema/types";

type Props = BaseProps & {
  readonly editState: ProductEditState;
};

const MAX_TAGS = 10;

const TagsCard: React.FC<Props> = (props: Props) => {
  const { className, style, editState } = props;
  const [input, setInput] = useState("");
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const tags = editState.tags || [];

  const { isSubmitting } = editState;
  return (
    <RightCard
      className={css(className, style)}
      title={ci18n(
        "meaning tags to attach to your product for categorization",
        "Tags",
      )}
      isOptional
    >
      <TextInput
        onChange={({ text }) => setInput(text)}
        onKeyUp={(keyCode) => {
          if (keyCode != KEYCODE_ENTER) {
            return;
          }

          if (tags.length == MAX_TAGS) {
            toastStore.info(i`Can't add more than ${MAX_TAGS} tags`);
            return;
          }

          const tagsUpper = tags.map((t: string) => t.toUpperCase());
          const newTag = input.trim();

          if (newTag.length == 0) {
            return;
          }

          if (tagsUpper.includes(newTag.toUpperCase())) {
            toastStore.info(i`"${newTag}" has already been added`);
            return;
          }

          editState.tags = [newTag, ...tags];
          setInput("");
        }}
        placeholder={i`Enter up to ${MAX_TAGS} tags`}
        height={40}
        value={input}
        debugValue={faker.commerce.department()}
        disabled={tags.length >= 10 || isSubmitting}
      />
      <div className={css(styles.tagsContainer)}>
        {tags.map((tag: Maybe<string>) => (
          <Token
            key={tag}
            className={css(styles.tag)}
            onDelete={
              isSubmitting
                ? undefined
                : () => {
                    editState.tags = tags.filter((_tag: string) => _tag != tag);
                  }
            }
          >
            {tag}
          </Token>
        ))}
      </div>
    </RightCard>
  );
};

export default observer(TagsCard);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        tagsContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: 10,
        },
        tag: {
          margin: 3,
        },
      }),
    [],
  );
