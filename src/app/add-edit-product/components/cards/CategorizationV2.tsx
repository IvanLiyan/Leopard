import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { Token, TextInput, Field, Markdown } from "@ContextLogic/lego";
import { KEYCODE_ENTER } from "@core/toolkit/dom";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { useToastStore } from "@core/stores/ToastStore";
import { Maybe } from "@schema";
import Section, { SectionProps } from "./Section";
import BrandCardItem from "@add-edit-product/components/brand/BrandCard";
import BrandSearch from "@add-edit-product/components/brand/BrandSearch";
import { zendeskURL } from "@core/toolkit/url";
import { merchFeUrl } from "@core/toolkit/router";
import { ci18n } from "@core/toolkit/i18n";
import { Stack } from "@ContextLogic/atlas-ui";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const MAX_TAGS = 20;

const CategorizationV2: React.FC<Props> = (props: Props) => {
  const { className, style, state, ...sectionProps } = props;
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const attributesLearnMoreLink = zendeskURL("1260805100070");

  const tags = state.tags || [];
  const { requestedBrand, isSubmitting } = state;
  const [tagInput, setTagInput] = useState("");
  const [brandName, setBrandName] = useState(requestedBrand?.displayName || "");
  const [numBrands, setNumBrands] = useState<number | null>();

  return (
    <Section
      style={[className, style]}
      title={i`Categorization`}
      {...sectionProps}
    >
      <Stack direction="row" sx={{ gap: "8px" }}>
        <Field
          title={ci18n("Field name", "Brand or brand ID")}
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
            text={brandName}
            onTextChange={({ text }) => setBrandName(text)}
            onBrandChanged={(brand) => {
              state.requestedBrand = brand;
              setBrandName("");
            }}
            validateBrand={() => undefined}
            setNumBrands={setNumBrands}
            inputProps={{
              height: 40,
            }}
          />
          {requestedBrand && (
            <BrandCardItem
              style={styles.brandCard}
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
          title={ci18n("Field name", "Tags")}
          style={styles.field}
          description={
            i`Tags are descriptive keywords or terms assigned to each product in your ` +
            i`feed, allowing them to be categorized and discovered by browsing or ` +
            i`searching on Wish.com. The more accurate tags you add, the easier it is ` +
            i`for our users to find your products. You may add up to 20 tags per ` +
            i`product, comma separated. [Learn more](${attributesLearnMoreLink})`
          }
        >
          <TextInput
            onChange={({ text }) => setTagInput(text)}
            onKeyUp={(keyCode) => {
              if (keyCode != KEYCODE_ENTER) {
                return;
              }

              if (tags.length == MAX_TAGS) {
                toastStore.info(i`Can't add more than ${MAX_TAGS} tags`);
                return;
              }

              const tagsUpper = tags.map((t: string) => t.toUpperCase());
              const newTag = tagInput.trim();

              if (newTag.length == 0) {
                return;
              }

              if (tagsUpper.includes(newTag.toUpperCase())) {
                toastStore.info(i`"${newTag}" has already been added`);
                return;
              }

              state.tags = [newTag, ...tags];
              setTagInput("");
            }}
            placeholder={i`Enter up to ${MAX_TAGS} tags`}
            height={40}
            value={tagInput}
            disabled={tags.length >= MAX_TAGS || isSubmitting}
            data-cy="input-tag"
          />
          <Stack
            direction="row"
            alignItems="center"
            sx={{ flexWrap: "wrap", marginTop: "10px" }}
          >
            {tags.map((tag: Maybe<string>) => (
              <Token
                key={tag}
                style={styles.tag}
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
          </Stack>
        </Field>
      </Stack>
    </Section>
  );
};

export default observer(CategorizationV2);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
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
          flex: 1,
        },
      }),
    [],
  );
