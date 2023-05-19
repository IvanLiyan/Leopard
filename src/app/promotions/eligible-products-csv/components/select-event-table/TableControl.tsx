import { Button, ButtonGroup, FormSelect, Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Icon from "@core/components/Icon";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { Text } from "@ContextLogic/atlas-ui";

type Props = BaseProps & {
  readonly limit?: number;
  readonly offset?: number;
  readonly total?: number;
  readonly onLimitChange?: (limit: number) => void;
  readonly onOffsetChange?: (page: number) => void;
};

const TableControl: React.FC<Props> = ({
  className,
  style,
  limit,
  offset,
  total,
  onLimitChange,
  onOffsetChange,
}) => {
  const styles = useStylesheet();

  if (offset == null || limit == null || total == null) {
    return null;
  }

  const firstItem = offset + 1;
  const lastItem = Math.min(offset + limit, total);
  const page = Math.ceil(offset / limit);
  const maxPages = Math.ceil(total / limit);
  const pageNumList = [...Array(maxPages).keys()].map((x) => x + 1);

  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      justifyContent="space-between"
    >
      <Layout.FlexRow style={styles.tableControl}>
        <Text>
          {firstItem}-{lastItem} of {total} items
        </Text>
        <Layout.FlexRow style={styles.pageSizeControl}>
          <Text>Item per page</Text>
          <FormSelect
            data-cy="page-size-select"
            options={[10, 50, 100].map((value) => ({
              value: value.toString(),
              text: value.toString(),
            }))}
            selectedValue={limit.toString()}
            onSelected={(value: string) => {
              onLimitChange && onLimitChange(parseInt(value));
              onOffsetChange && onOffsetChange(0);
            }}
          />
        </Layout.FlexRow>
      </Layout.FlexRow>
      <Layout.FlexRow style={styles.tableControl}>
        <Layout.FlexRow style={styles.pageSizeControl}>
          <Text>The page you&apos;re on</Text>
          <FormSelect
            data-cy="page-number-select"
            options={pageNumList.map((value) => ({
              value: value.toString(),
              text: value.toString(),
            }))}
            selectedValue={`${page + 1}`}
            onSelected={(value: string) => {
              onOffsetChange && onOffsetChange((parseInt(value) - 1) * limit);
            }}
          />
        </Layout.FlexRow>
        <ButtonGroup>
          <Button
            onClick={() => {
              onOffsetChange && onOffsetChange((page - 1) * limit);
            }}
            disabled={offset == 0}
            data-cy="page-indicator-button-back"
          >
            <Icon name="arrowLeft" size={21} />
          </Button>
          <Button
            onClick={() => {
              onOffsetChange && onOffsetChange((page + 1) * limit);
            }}
            disabled={offset + limit >= total}
            data-cy="page-indicator-button-next"
          >
            <Icon name="arrowRight" size={21} />
          </Button>
        </ButtonGroup>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "18px 24px",
        },
        tableControl: {
          gap: 24,
        },
        pageSizeControl: {
          gap: 8,
        },
      }),
    [],
  );
};

export default observer(TableControl);
