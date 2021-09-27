import React, { useMemo, useState, useEffect, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { usePathParams } from "@toolkit/url";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import { useLogger } from "@toolkit/logger";

/* Merchant Store */
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useUserStore } from "@merchant/stores/UserStore";

/* Merchant Components */
import CollectionBasics from "@merchant/component/collections-boost/edit-page/CollectionBasics";
import CollectionsProducts from "@merchant/component/collections-boost/edit-page/CollectionsProducts";

/* Merchant API */
import * as collectionsBoostApi from "@merchant/api/collections-boost";

/* Merchant Model */
import Collection from "@merchant/model/collections-boost/Collection";

type Section = "products" | "basicInfo";

const SectionNames: {
  readonly [T in Section]: string;
} = {
  products: i`Collection basics`,
  basicInfo: i`Products`,
};

const Sections: ReadonlyArray<Section> = ["basicInfo", "products"];

const CollectionsBoostEditCollectionContainer = () => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { pageBackground } = useTheme();

  const { collectionIdParam } = usePathParams(
    "/collection-boost/edit-collection/:collectionIdParam"
  );

  const [collection] = useState<Collection>(new Collection());

  const [initLoading, setInitLoading] = useState<boolean>(false);

  const [editLoading, setEditLoading] = useState<boolean>(false);

  const { merchantId } = useUserStore();

  const logger = useLogger("COLLECTIONS_BOOST_UI");

  const onInitPageLoaded = useCallback(() => {
    const setInitParam = async () => {
      try {
        const resp = await collectionsBoostApi
          .getCollectionsBoostCollection({
            collection_id: collectionIdParam || "",
          })
          .call();
        if (!resp || !resp.data || !resp.data.collection) {
          return;
        }

        const result = resp.data.collection;
        collection.name = result.name;
        collection.logoUrl = result.logo_url;
        collection.products = [...result.products];
        collection.searchQueries = result.search_queries
          .map((query) => query.search_term)
          .join(",");
        collection.relatedProducts = result.related_products
          .map((relatedProduct) => relatedProduct.product_id)
          .join(",");
        collection.state = result.state;
        collection.source = result.source;

        // Set original values
        collection.oldName = collection.name;
        collection.oldLogoUrl = collection.logoUrl;
        collection.oldProducts = collection.products;
        collection.oldSearchQueries = collection.searchQueries;

        setInitLoading(true);
      } catch (err) {
        return;
      }
    };
    setInitParam();
    // Log view
    logger.info({
      merchant_id: merchantId,
      action: "view edit collection page",
      collection_id: collectionIdParam || "",
    });
  }, [collectionIdParam, collection, merchantId, logger]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onInitPageLoaded, [collectionIdParam]);

  const [hiddenSections, setHiddenSections] = useState<Set<Section>>(new Set());

  const sectionContent: {
    readonly [T in Section]: () => JSX.Element;
  } = useMemo(
    () => ({
      basicInfo: () => <CollectionBasics collection={collection} />,
      products: () => (
        <CollectionsProducts
          products={collection.products}
          onProductsSelected={(newProducts) => {
            collection.products = [...newProducts];
          }}
          initLoading={initLoading}
          collectionSource={collection.source}
        />
      ),
    }),
    [collection, initLoading]
  );

  const saveCollection = async () => {
    try {
      const searchQueries = collection.searchQueries
        ? collection.searchQueries
            .split(",")
            .filter((sq) => sq != null && sq.trim().length > 0)
        : "";
      const relatedProducts = collection.relatedProducts
        ? collection.relatedProducts
            .split(",")
            .filter((rp) => rp != null && rp.trim().length > 0)
        : "";
      await collectionsBoostApi
        .editCollectionsBoostCollection({
          collection_id: collectionIdParam,
          collection_name: collection.name,
          products: JSON.stringify(collection.products),
          search_queries: JSON.stringify(searchQueries),
          related_products: JSON.stringify(relatedProducts),
          logo_url: collection.logoUrl,
        })
        .call()
        .then(() => {
          toastStore.positive(
            collectionIdParam
              ? i`Changes to the collection has been saved successfully.`
              : i`Collection has been successfully created. ` +
                  i`Please allow up to ${5} days to review and ` +
                  i`approve this collection.`,
            { timeoutMs: 50000 }
          );
          setEditLoading(true);
          navigationStore.navigate("/collection-boost/list/collections");
        });
    } catch (err) {
      toastStore.error(err.msg, { timeoutMs: 6000 });
    }
  };

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Create a Collection`}
        body={() => (
          <Markdown
            className={css(styles.textBody)}
            openLinksInNewTab
            text={
              i`Create your CollectionBoost collection. Upon its approval, your collection will ` +
              i`be eligible for you to create a campaign to boost the collection. By running ` +
              i`this campaign, your collection will be promoted with a premium placement in ` +
              i`the Wish app. [Learn more](${zendeskURL("360052936574")})`
            }
          />
        )}
        illustration="productBoostPhone"
        hideBorder
      />
      <div className={css(styles.sections)}>
        {Sections.map((section) => (
          <Card showOverflow style={{ border: "none" }} key={section}>
            <Accordion
              header={() => (
                <div className={css(styles.sectionHeader)}>
                  {SectionNames[section]}
                </div>
              )}
              isOpen={!hiddenSections.has(section)}
              onOpenToggled={(isOpen) => {
                const newHiddenSections = new Set(hiddenSections);
                if (isOpen) {
                  newHiddenSections.delete(section);
                } else {
                  newHiddenSections.add(section);
                }
                setHiddenSections(newHiddenSections);
              }}
              backgroundColor={pageBackground}
            >
              <div className={css(styles.sectionContent)}>
                {sectionContent[section]()}
              </div>
            </Accordion>
          </Card>
        ))}
      </div>
      <Card style={{ border: "none" }}>
        <div className={css(styles.buttons)}>
          <SecondaryButton
            type="default"
            text={i`Cancel`}
            onClick={() => {
              navigationStore.navigate("/collection-boost/list/collections");
            }}
          />
          <PrimaryButton
            onClick={() => {
              if (
                collection.state === "APPROVED" &&
                collection.requireResetState()
              ) {
                new ConfirmationModal(
                  i`Edit an Approved collection will make it back to Pending state. ` +
                    i`The review process will take up to ${5} days. Are you sure ` +
                    i`you want to proceed to edit?`
                )
                  .setHeader({
                    title: i`Confirm to edit`,
                  })
                  .setCancel(i`Cancel`)
                  .setAction(i`Yes`, async () => {
                    saveCollection();
                  })
                  .render();
              } else {
                saveCollection();
              }
            }}
            isDisabled={editLoading}
          >
            Save collection
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        textBody: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
          fontWeight: fonts.weightNormal,
          marginTop: 20,
        },
        btnBody: {
          backgroundColor: "#FFFFFF",
          paddingBottom: 10,
        },
        buttons: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 24,
          margin: "0 15%",
        },
        sections: {
          padding: `25px 15% 100px`,
        },
        sectionHeader: {
          fontSize: 16,
          fontWeight: fonts.weightSemibold,
          color: textBlack,
        },
        sectionContent: {
          padding: 24,
        },
      }),
    [pageBackground, textBlack]
  );
};

export default observer(CollectionsBoostEditCollectionContainer);
