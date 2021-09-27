import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import Fuse from "fuse.js";

/* Toolkit */
import { css } from "@toolkit/styling";
import { CountryCode } from "@toolkit/countries";

/* Lego Components */
import {
  SearchBox,
  PageIndicator,
  CellInfo,
  Table,
  Layout,
  Text,
  Card,
  Button,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import { CountryLabel } from "@merchant/component/core";

/* Relative Imports */
import CountryLabelGroup from "@merchant/component/products/warehouse-settings/CountryLabelGroup";

import EditWarehouseModal from "@merchant/component/products/warehouse-settings/EditWarehouseModal";

/* Model */
import { AddressInput } from "@schema/types";
import WarehouseSettingsState from "@merchant/model/products/WarehouseSettingsState";
import { PickedWarehouseType } from "@toolkit/products/warehouse-overview";

type Props = BaseProps & {
  readonly warehouses: ReadonlyArray<PickedWarehouseType>;
};

type DataItem = {
  readonly id: string;
  readonly unitId: string;
  readonly enabledCountries: ReadonlyArray<CountryCode>;
  readonly address: PickedWarehouseType["address"];
};

const WarehouseSettings: React.FC<Props> = ({
  className,
  style,
  warehouses,
}: Props) => {
  const styles = useStylesheet();
  const [query, setQuery] = useState("");
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const fuse = useFuse(warehouses);

  const onPageChange = (nextPage: number) => {
    const newPage = Math.max(0, nextPage);
    setOffset(newPage * limit);
  };

  const onEdit = (row: DataItem) => {
    const state = new WarehouseSettingsState({
      address:
        row.address != null
          ? ({
              ...row.address,
              name: row.unitId,
            } as AddressInput)
          : undefined,
      id: row.id,
      name: row.unitId,
      enabledCountries: row.enabledCountries,
    });

    const modal = new EditWarehouseModal({ state });
    modal.render();
  };

  const results: ReadonlyArray<DataItem> = useMemo(() => {
    const results: ReadonlyArray<PickedWarehouseType> =
      query.trim().length > 0
        ? fuse.search(query.trim()).map((result) => result.item)
        : warehouses;

    const data: ReadonlyArray<DataItem> = results.map((warehouse) => {
      return {
        id: warehouse.id,
        unitId: warehouse.unitId,
        enabledCountries: warehouse.enabledCountries.map(
          (country) => country.code
        ),
        address: warehouse.address,
      };
    });

    return data;
  }, [query, warehouses, fuse]);

  return (
    <Card className={css(styles.root, className, style)}>
      <Layout.FlexRow
        justifyContent="space-between"
        className={css(styles.section, styles.tableControls)}
      >
        <SearchBox
          value={query}
          onChange={({ text }) => {
            setQuery(text);
            setOffset(0);
          }}
          placeholder={i`Search by destination`}
          height={30}
        />
        <PageIndicator
          rangeStart={offset + 1}
          rangeEnd={Math.min(results.length ?? 0, offset + limit)}
          hasNext={limit + offset < results.length}
          hasPrev={offset > 0}
          currentPage={Math.ceil(offset / limit)}
          totalItems={results.length}
          onPageChange={onPageChange}
        />
      </Layout.FlexRow>

      <Table
        data={results.slice(offset, limit + offset)}
        hideBorder
        rowHeight={60}
        noDataMessage={i`No countries found`}
      >
        <Table.Column title={i`Warehouse`} columnKey="unitId" handleEmptyRow />
        <Table.Column
          title={i`Address`}
          columnKey="address.streetAddress1"
          width={150}
          handleEmptyRow
        >
          {({ row }: CellInfo<DataItem, DataItem>) => {
            if (row.address == null) {
              return "--";
            }
            return (
              <Layout.FlexColumn className={css(styles.address)}>
                <Text>{row.address.streetAddress1}</Text>
                {row.address.streetAddress2 && (
                  <Text>{row.address.streetAddress2}</Text>
                )}
                <Text>
                  {row.address.city}
                  {row.address.state != null ? `, ${row.address.state}` : null}
                </Text>
                <Text>{row.address.zipcode}</Text>
                <Text>{row.address.country.name}</Text>
              </Layout.FlexColumn>
            );
          }}
        </Table.Column>
        <Table.Column
          title={i`Warehouse Country or Region`}
          columnKey="address.country.code"
          handleEmptyRow
        >
          {({ row }: CellInfo<DataItem, DataItem>) =>
            row.address?.country.code != null && (
              <CountryLabel countryCode={row.address.country.code} />
            )
          }
        </Table.Column>
        <Table.Column
          title={i`Destinations Enabled`}
          width={200}
          columnKey="enabledCountries"
          handleEmptyRow
        >
          {({ row }: CellInfo<DataItem, DataItem>) =>
            row.enabledCountries != null &&
            row.enabledCountries.length > 0 && (
              <CountryLabelGroup
                countryCodes={row.enabledCountries}
                className={css(styles.enabledCountries)}
              />
            )
          }
        </Table.Column>
        <Table.Column
          title={i`Action`}
          columnKey="id"
          width={150}
          align="center"
          handleEmptyRow
        >
          {({ row }: CellInfo<DataItem, DataItem>) => (
            <Button
              onClick={() => onEdit(row)}
              disabled={row.unitId === "STANDARD"}
            >
              Edit warehouse address
            </Button>
          )}
        </Table.Column>
      </Table>
    </Card>
  );
};

const useFuse = (
  warehouses: ReadonlyArray<PickedWarehouseType>
): Fuse<PickedWarehouseType, any> => {
  return useMemo((): Fuse<PickedWarehouseType, any> => {
    const documents: ReadonlyArray<PickedWarehouseType> = [...warehouses];
    const keys: ReadonlyArray<keyof PickedWarehouseType> = ["unitId"];
    const options = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      keys: keys as string[],
    };

    const index = Fuse.createIndex(keys as string[], documents);

    return new Fuse(documents, options, index);
  }, [warehouses]);
};

export default observer(WarehouseSettings);

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
        },
        section: {
          ":not(:last-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
        },
        tableControls: {
          padding: 24,
        },
        address: {
          margin: "12px 0",
        },
        enabledCountries: {
          margin: "12px 0",
        },
      }),
    [borderPrimary, textBlack]
  );
};
