import { useQuery } from "@apollo/client";
import { H6, Layout, LoadingIndicator, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Icon } from "@ContextLogic/zeus";
import { ci18n } from "@core/toolkit/i18n";
import { useTheme } from "@core/stores/ThemeStore";
import { Constants, useTreeVersion } from "@add-edit-product/constants";
import {
  PickedCategory,
  PickedCategoryWithDetails,
  TaxonomyCategoryRequestData,
  TaxonomyCategoryResponseData,
  TAXONOMY_CATEGORY_QUERY,
} from "@core/taxonomy/toolkit";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly index: number;
  readonly parentCategory: number;
  readonly allowlist?: ReadonlyArray<Pick<PickedCategory, "id">>;
  readonly highlight?: ReadonlyArray<Pick<PickedCategory, "id">>;
  readonly onSelect?: (category: PickedCategoryWithDetails) => void;
  readonly overrideTreeVersion?: string;
};

const TaxonomyCategoryColumnItem: React.FC<Props> = ({
  className,
  style,
  index,
  parentCategory,
  allowlist,
  highlight,
  onSelect,
  overrideTreeVersion,
}: Props) => {
  const styles = useStylesheet();

  const { version: treeVersion, loading: treeVersionLoading } =
    useTreeVersion();

  const { data: queryData, loading: queryLoading } = useQuery<
    TaxonomyCategoryResponseData,
    TaxonomyCategoryRequestData
  >(TAXONOMY_CATEGORY_QUERY, {
    variables: {
      treeVersion:
        overrideTreeVersion || treeVersion || Constants.TAXONOMY.treeVersion,
      categoryId: parentCategory,
    },
    skip:
      overrideTreeVersion == null &&
      (treeVersion == null || treeVersionLoading),
  });

  const columnData = queryData?.taxonomy?.category?.categoryChildren?.filter(
    (category) =>
      !allowlist?.every((allowedCategory) => allowedCategory.id != category.id),
  );

  if (queryLoading) {
    return <LoadingIndicator />;
  }

  if (!columnData) {
    return null;
  }

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Layout.FlexColumn style={styles.headerContainer}>
        <H6 style={styles.headerText}>
          {ci18n(
            "Column header, shows all taxonomy categories that are a specific level down the hierarchy",
            "Level {%1=level number}",
            index + 1,
          )}
        </H6>
      </Layout.FlexColumn>
      <Layout.FlexColumn style={styles.columnContainer}>
        <Layout.GridRow
          style={[
            styles.columnPanel,
            {
              gridTemplateRows: `repeat(${columnData.length}, 52px)`,
              alignItems: "center",
            },
          ]}
          templateColumns={"1fr 24px"}
          smallScreenTemplateColumns={"1fr 24px"}
        >
          {columnData.map((node) => {
            return (
              <React.Fragment key={node.id}>
                <Layout.FlexRow
                  style={styles.nodeContainer}
                  onClick={() => {
                    onSelect && onSelect(node);
                  }}
                  data-cy={`column-${index + 1}-item-${node.id}`}
                >
                  <Text
                    weight="medium"
                    style={[
                      styles.nodeText,
                      highlight?.some((cat) => cat.id == node.id)
                        ? styles.selectedNodeText
                        : null,
                    ]}
                  >
                    {node.categoryChildren.length
                      ? `${node.name}`
                      : `${node.name} (${node.id})`}
                  </Text>
                </Layout.FlexRow>
                {node.categoryChildren?.length ? (
                  <Layout.FlexRow style={styles.chevron}>
                    <Icon name="chevronRightSmall" size={24} />
                  </Layout.FlexRow>
                ) : (
                  <div /> //don't show chevron in the grid cell if the category is leaf node
                )}
              </React.Fragment>
            );
          })}
        </Layout.GridRow>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { surfaceLight, borderPrimary, textLight, primary, textDark } =
    useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        headerContainer: {
          background: surfaceLight,
          borderBottom: `solid 1px ${borderPrimary}`,
          borderRadius: "4px 4px 0px 0px",
        },
        headerText: {
          margin: "16px 24px",
          color: textLight,
        },
        columnContainer: {
          height: 416,
        },
        columnPanel: {
          flexGrow: 1,
          display: "grid",
          overflow: "auto",
          alignItems: "center",
        },
        nodeContainer: {
          marginLeft: 24,
          cursor: "pointer",
          alignSelf: "center",
        },
        nodeText: {
          color: textDark,
        },
        chevron: {
          alignSelf: "center",
        },
        selectedNodeText: {
          color: primary,
        },
      }),
    [surfaceLight, borderPrimary, textDark, textLight, primary],
  );
};

export default observer(TaxonomyCategoryColumnItem);
