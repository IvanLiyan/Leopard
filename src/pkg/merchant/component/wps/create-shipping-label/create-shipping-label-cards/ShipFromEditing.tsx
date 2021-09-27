/*
 * ShipFromEditing.tsx
 *
 * Created by Jonah Dlin on Fri Jan 29 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useMutation, useQuery } from "react-apollo";
import _ from "lodash";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import {
  Layout,
  Link,
  LoadingIndicator,
  PrimaryButton,
  Radio,
  Spinner,
  Text,
} from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { getCountryName } from "@toolkit/countries";
import {
  DeleteWarehouseInputType,
  DeleteWarehouseResponseType,
  DELETE_WAREHOUSE,
  GetWarehousesResponseType,
  GET_WAREHOUSES,
  WarehouseAddress,
} from "@toolkit/wps/create-shipping-label";
import { useToastStore } from "@merchant/stores/ToastStore";
import { Illustration } from "@merchant/component/core";

type Props = BaseProps & {
  readonly onAddEditAddress: (warehouse?: WarehouseAddress) => unknown;
  readonly onSubmit: (warehouse: WarehouseAddress) => unknown;
  readonly initialSelectedId?: string;
};

const ShipFromEditing: React.FC<Props> = ({
  className,
  style,
  onAddEditAddress,
  onSubmit,
  initialSelectedId,
}: Props) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const [isSaving, setIsSaving] = useState(false);
  const [warehouseBeingDeleted, setWarehouseBeingDeleted] = useState<
    string | null
  >(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId,
  );

  const { data, loading, refetch } = useQuery<GetWarehousesResponseType, {}>(
    GET_WAREHOUSES,
    {
      fetchPolicy: "no-cache",
    },
  );

  useEffect(() => {
    if (
      initialSelectedId == null &&
      selectedId == null &&
      data != null &&
      data.currentMerchant.senderAddresses.length > 0
    ) {
      const defaultWarehouse = data.currentMerchant.senderAddresses.find(
        ({ isDefault }) => isDefault,
      );
      if (defaultWarehouse == null) {
        setSelectedId(data.currentMerchant.senderAddresses[0].id);
        return;
      }
      setSelectedId(defaultWarehouse.id);
    }
  }, [data, selectedId, initialSelectedId]);

  const [deleteWarehouse] = useMutation<
    DeleteWarehouseResponseType,
    DeleteWarehouseInputType
  >(DELETE_WAREHOUSE);

  const warehouses = data?.currentMerchant.senderAddresses;

  const handleDeleteWarehouse = async (warehouse: WarehouseAddress) => {
    if (warehouseBeingDeleted != null) {
      return;
    }
    setWarehouseBeingDeleted(warehouse.id);
    const input: DeleteWarehouseInputType["input"] = {
      merchantSenderAddressId: warehouse.id,
    };

    const response = await deleteWarehouse({ variables: { input } });

    if (response.data == null) {
      toastStore.negative(i`Something went wrong`);
      return false;
    }
    const {
      currentMerchant: {
        merchantSenderAddress: {
          deleteMerchantSenderAddress: { ok, message },
        },
      },
    } = response.data;

    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }

    const {
      data: {
        currentMerchant: { senderAddresses: newSenderAddresses },
      },
    } = await refetch();

    toastStore.positive(i`${warehouse.warehouseName} successfully deleted`);

    if (warehouse.id == selectedId) {
      const defaultWarehouse = newSenderAddresses.find(
        ({ isDefault }) => isDefault,
      );
      if (defaultWarehouse == null) {
        setSelectedId(newSenderAddresses[0].id);
        return;
      }
      setSelectedId(defaultWarehouse.id);
      return;
    }

    setWarehouseBeingDeleted(null);
  };

  const handleSubmit = async () => {
    const selectedWarehouse = _.find(warehouses || [], ["id", selectedId]);
    if (selectedWarehouse == null) {
      return;
    }

    setIsSaving(true);
    await onSubmit(selectedWarehouse);
    setIsSaving(false);
  };

  const renderWarehouseList = () => (
    <div className={css(styles.warehouseList)}>
      {(warehouses || []).map((warehouse) => {
        const {
          streetAddress1,
          streetAddress2,
          city,
          state: addressState,
          zipcode,
          countryCode,
        } = warehouse.address;

        const { isDefault, id, warehouseName } = warehouse;

        const line1 =
          [
            ...(streetAddress1 != null ? [streetAddress1] : []),
            ...(streetAddress2 != null ? [streetAddress2] : []),
            ...(city != null ? [city] : []),
          ].join(", ") || null;

        const line2 =
          [
            ...(addressState != null ? [addressState] : []),
            ...(zipcode != null ? [zipcode] : []),
          ].join(", ") || null;

        const line3 =
          [...(countryCode != null ? [getCountryName(countryCode)] : [])].join(
            ", ",
          ) || null;

        const lines = [line1, line2, line3].filter((line) => line != null);

        const isSelected = id == selectedId;
        const canDelete = !isDefault;
        const isDeleting = id === warehouseBeingDeleted;

        return (
          <div
            key={id}
            className={css(
              styles.warehouse,
              isSelected
                ? styles.warehouseSelectedBorder
                : styles.warehouseUnselectedBorder,
            )}
            onClick={() => setSelectedId(id)}
          >
            <Radio checked={isSelected} />
            <div className={css(styles.warehouseInfo)}>
              <Text className={css(styles.warehouseName)} weight="semibold">
                {warehouseName}
              </Text>
              {lines.map((line, index) => (
                <Text key={line} className={css(styles.warehouseAddressLine)}>
                  {line}
                  {index != lines.length - 1 ? "," : ""}
                </Text>
              ))}
            </div>
            <div className={css(styles.actions)}>
              <Link
                className={css(styles.actionLinkContainer)}
                onClick={(event) => {
                  event.stopPropagation();
                  onAddEditAddress(warehouse);
                }}
              >
                <Illustration
                  className={css(styles.actionLinkIcon)}
                  name="editWishBlue"
                  alt=""
                />
                <Text>Edit</Text>
              </Link>
              {canDelete && (
                <Link
                  className={css(styles.actionLinkContainer)}
                  onClick={async (event) => {
                    event.stopPropagation();
                    await handleDeleteWarehouse(warehouse);
                  }}
                >
                  {isDeleting ? (
                    <Spinner className={css(styles.deleteSpinner)} size={16} />
                  ) : (
                    <Illustration
                      className={css(styles.actionLinkIcon)}
                      name="grayTrash"
                      alt=""
                    />
                  )}
                  <Text className={css(styles.delete)}>Delete</Text>
                </Link>
              )}
            </div>
          </div>
        );
      })}
      <div
        className={css(styles.addAddressContainer)}
        onClick={() => onAddEditAddress()}
      >
        <Link
          className={css(styles.addAddressLink)}
          onClick={() => onAddEditAddress()}
          fadeOnHover={false}
        >
          + Add a new address
        </Link>
      </div>
    </div>
  );

  return (
    <div className={css(styles.root, className, style)}>
      {loading ? (
        <Layout.FlexRow alignItems="center" justifyContent="center">
          <LoadingIndicator />
        </Layout.FlexRow>
      ) : (
        <>
          {renderWarehouseList()}
          <div className={css(styles.footer)}>
            <PrimaryButton isLoading={isSaving} onClick={handleSubmit}>
              Next
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
};

const useStylesheet = () => {
  const { textDark, textBlack, borderPrimary, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        warehouseList: {
          display: "flex",
          flexDirection: "column",
        },
        warehouse: {
          display: "flex",
          cursor: "pointer",
          padding: 16,
          borderRadius: 4,
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        warehouseSelectedBorder: {
          border: `1px solid ${primary}`,
        },
        warehouseUnselectedBorder: {
          border: `1px solid ${borderPrimary}`,
        },
        warehouseInfo: {
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: 20,
        },
        warehouseName: {
          color: textBlack,
          fontSize: 16,
          lineHeight: 1.5,
          marginBottom: 8,
        },
        warehouseAddressLine: {
          color: textDark,
          fontSize: 12,
          lineHeight: "16px",
        },
        actions: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          margin: "8px 0px",
        },
        actionLinkContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        actionLinkIcon: {
          marginRight: 4,
          maxWidth: 16,
        },
        deleteSpinner: {
          marginRight: 4,
        },
        delete: {
          color: textDark,
        },
        addAddressContainer: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 38,
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          ":not(:last-child)": {
            marginBottom: 16,
          },
          opacity: 1,
          transition: "opacity 0.3s linear 0s",
          ":hover": {
            opacity: 0.6,
          },
        },
        addAddressLink: {
          lineHeight: 1.5,
          fontSize: 16,
          width: "max-content",
        },
        footer: {
          marginTop: 20,
          display: "flex",
          justifyContent: "flex-end",
        },
      }),
    [textDark, textBlack, borderPrimary, primary],
  );
};

export default observer(ShipFromEditing);
