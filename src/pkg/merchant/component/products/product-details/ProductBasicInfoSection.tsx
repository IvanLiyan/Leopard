import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";

/* Merchant Model */
import ProductEditState from "@merchant/model/products/ProductEditState";
import { Markdown } from "@ContextLogic/lego";

type ProductBasicInfoSectionProps = BaseProps & {
  readonly name: string;
  readonly description: string;
  readonly parentSku: string;
  readonly tags: ReadonlyArray<string>;
  readonly editState: ProductEditState;
};

const ProductBasicInfoSection = (props: ProductBasicInfoSectionProps) => {
  const styles = useStylesheet();

  const { name, description, parentSku, tags, editState } = props;
  const initialTagsText = tags.map((tag) => tag || "").join(",");
  const [tagsText, setTagsText] = useState(initialTagsText);

  const nameTip = () => {
    return (
      <div className={css(styles.p)}>
        <Markdown
          text={
            i`Use the following template to build your product names: ` +
            i`Main brand + Sub-brand, family or product name + Up to ${3} ` +
            i`key attributes + Generic product type. Product Names must ` +
            i`be clear and concise and should also be descriptive of ` +
            i`the product being sold. This template will help consumers ` +
            i`identifying your product.`
          }
        />
      </div>
    );
  };

  const descriptionTip = () => {
    return (
      <div className={css(styles.p)}>
        <Markdown
          text={
            i`A detailed description of your product. Limit of ${4000} ` +
            i`characters, and only the first ${250} characters are displayed ` +
            i`on the initial search page. Do not include any HTML code, ` +
            i`details about store policies, other store-specific language ` +
            i`or multiple lines. 'New line' characters (such as ` +
            i`'enter' or 'return') will cause problems with your file. ` +
            i`Information about size, fit, and measurements are helpful ` +
            i`for apparel items.`
          }
        />
      </div>
    );
  };

  const parentSKUTip = () => {
    return (
      <div className={css(styles.p)}>
        <Markdown
          text={
            i`When defining a variation of a product we must know which ` +
            i`product to attach the variation to. 'Parent Unique Id' is ` +
            i`the 'Unique Id' of the product you wish to attach this ` +
            i`variant to. The 'Parent Unique Id' must already exist on ` +
            i`Wish or be included elsewhere in your upload. The 'Parent ` +
            i`Unique Id' is also called the 'Parent SKU'.`
          }
        />
      </div>
    );
  };

  const tagTip = () => {
    return (
      <div className={css(styles.p)}>
        <Markdown
          text={
            i`Non-hierarchical keyword or term assigned to each product in ` +
            i`your feed. This kind of metadata helps describe an item ` +
            i`and allows it to be categorized and found again by browsing ` +
            i`or searching on Wish.com. Tags should be comma separated, ` +
            i`but do NOT use commas in individual tags. The more tags you ` +
            i`add, and the more accurate your tags, the better the chances ` +
            i`our users will find your products. There is a maximum of ${10} ` +
            i`tags allowed per product, if you add more than ${10} we ignore ` +
            i`the extra tags.`
          }
        />
      </div>
    );
  };

  return (
    <div>
      <HorizontalField
        title={i`Name`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={nameTip}
      >
        <TextInput
          className={css(styles.textInput)}
          onChange={({ text }: OnTextChangeEvent) => {
            editState.setName({ name: text });
          }}
          defaultValue={name}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Description`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={descriptionTip}
      >
        <TextInput
          className={css(styles.textInput)}
          isTextArea
          onChange={({ text }: OnTextChangeEvent) => {
            editState.setDescription({ description: text });
          }}
          defaultValue={description}
          height={100}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Parent SKU`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={parentSKUTip}
      >
        <TextInput
          className={css(styles.textInput)}
          onChange={({ text }: OnTextChangeEvent) => {
            editState.setParentSKU({ parentSku: text });
          }}
          defaultValue={parentSku}
        />
      </HorizontalField>

      <HorizontalField
        title={i`Tags`}
        titleWidth={150}
        centerTitleVertically
        className={css(styles.verticalMargin)}
        popoverContent={tagTip}
      >
        <TextInput
          placeholder={i`Separate tags with a comma`}
          className={css(styles.textInput)}
          isTextArea
          tokenize
          value={tagsText}
          onChange={({ text }) => {
            setTagsText(text);
            editState.setTags({ tagsString: text });
          }}
          height={100}
        />
      </HorizontalField>
    </div>
  );
};

export default observer(ProductBasicInfoSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        verticalMargin: {
          margin: "10px 0",
        },
        textInput: {
          flex: 1,
          marginRight: 20,
        },
        p: {
          maxWidth: 480,
          margin: 10,
        },
      }),
    []
  );
};
