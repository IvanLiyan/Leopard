/*
 * Categorization.tsx
 *
 * Created by Jonah Dlin on Tue Nov 02 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import { Token, TextInput, Field, Layout, Markdown } from "@ContextLogic/lego";

import { KEYCODE_ENTER } from "@core/toolkit/dom";

import faker from "faker/locale/en";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import AddEditProductState from "@add-edit-product/AddEditProductState";

/* Merchant Store */
import { useToastStore } from "@core/stores/ToastStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Schema */
import { Maybe } from "@schema";
import Section from "./Section";
import BrandCardItem from "@add-edit-product/components/brand/BrandCard";
import BrandSearch from "@add-edit-product/components/brand/BrandSearch";
import { zendeskURL } from "@core/toolkit/url";
import { merchFeUrl } from "@core/toolkit/router";

type Props = BaseProps & {
  readonly state: AddEditProductState;
};

const MAX_TAGS = 20;

const Categorization: React.FC<Props> = (props: Props) => {
  const { className, style, state } = props;
  const [input, setInput] = useState("");
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const attributesLearnMoreLink = zendeskURL("1260805100070");

  const tags = state.tags || [];
  const { requestedBrand } = state;
  const [text, setText] = useState(requestedBrand?.displayName || "");
  const [numBrands, setNumBrands] = useState<number | null>();

  const { isSubmitting } = state;

  return (
    <Section
      className={css(className, style)}
      title={i`Categorization`}
      alwaysOpen
    >
      <Field
        title={i`Brand or Brand ID (optional)`}
        style={styles.field}
        description={
          i`Provide the brand or brand ID of the product being sold. The product must be ` +
          i`authentic and directly manufactured by the brand owner. For example, Apple is ` +
          i`the Brand of iPhone or iPad but Apple is not the Brand of an iPhone case not ` +
          i`manufactured by Apple. Visit [Brand ` +
          i`Directory](${merchFeUrl(
            "/branded-products/brand-directory",
          )}) to view a list of brands ` +
          i`and brand IDs to select from or request a new brand to be added.`
        }
      >
        <BrandSearch
          placeholder={i`Enter the brand name`}
          text={text}
          onTextChange={({ text }) => setText(text)}
          onBrandChanged={(brand) => {
            state.requestedBrand = brand;
            setText("");
          }}
          validateBrand={() => undefined}
          setNumBrands={setNumBrands}
          inputProps={{
            height: 40,
          }}
        />
        {requestedBrand && (
          <BrandCardItem
            className={css(styles.brandCard)}
            brand_id={requestedBrand.id}
            brand_name={requestedBrand.displayName}
            logo_url={requestedBrand.logoUrl}
            onDelete={() => {
              state.requestedBrand = null;
            }}
          />
        )}
        {numBrands === 0 && (
          <Markdown
            style={styles.brandError}
            text={i`This brand does not exist in the Brand Directory. [View Brand Directory](${merchFeUrl(
              "/branded-products/brand-directory",
            )})`}
            openLinksInNewTab
          />
        )}
      </Field>
      <Field
        title={i`Tags (optional)`}
        style={styles.field}
        description={
          i`Non-hierarchical keyword or term assigned to each product in your feed. This ` +
          i`kind of metadata helps describe an item and allows it to be categorized and ` +
          i`found again by browsing or searching on Wish.com. Tags should be comma ` +
          i`separated, but do NOT use commas in individual tags. The more tags you add, ` +
          i`and the more accurate your tags, the better the chances our users will find ` +
          i`your products. There is a maximum of ${20} tags allowed per product, if you add ` +
          i`more than ${20} we ignore the extra tags. [Learn more](${attributesLearnMoreLink})`
        }
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

            state.tags = [newTag, ...tags];
            setInput("");
          }}
          placeholder={i`Enter up to ${MAX_TAGS} tags`}
          height={40}
          value={input}
          debugValue={faker.commerce.department()}
          disabled={tags.length >= 10 || isSubmitting}
          data-cy="input-tag"
        />
        <Layout.FlexRow style={styles.tagsContainer} alignItems="center">
          {tags.map((tag: Maybe<string>) => (
            <Token
              key={tag}
              className={css(styles.tag)}
              onDelete={
                isSubmitting
                  ? undefined
                  : () => {
                      state.tags = tags.filter((_tag: string) => _tag != tag);
                    }
              }
            >
              {tag}
            </Token>
          ))}
        </Layout.FlexRow>
      </Field>
    </Section>
  );
};

export default observer(Categorization);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        tagsContainer: {
          flexWrap: "wrap",
          marginTop: 10,
        },
        tag: {
          margin: 3,
        },
        brandCard: {
          marginTop: 16,
        },
        brandError: {
          marginTop: 8,
        },
        field: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
      }),
    [],
  );
