/*
 * DeviceMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment/moment";

/* Lego Components */
import {
  Select,
  DeleteButton,
  PageIndicator,
  OptionsButton,
  LoadingIndicator,
} from "@ContextLogic/lego";

import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightNormal, weightMedium } from "@toolkit/fonts";
import { useIntQueryParam } from "@toolkit/url";

/* Merchant Stores */
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Relative Imports */
import ClearDeviceHistoryModal from "./ClearDeviceHistoryModal";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";
import {
  UserSchemaCurrentDevicesArgs,
  UserSchema,
  DeviceSchema,
  DeleteDeviceMutation,
  DeleteAllDevicesMutation,
  UserMutationDeleteDeviceArgs,
} from "@schema/types";
import { formatDatetimeLocalized } from "@toolkit/datetime";

const GET_DEVICES = gql`
  query DeviceTable_GetDevices($limit: Int!, $skip: Int!) {
    currentUser {
      numCurrentDevices
      currentDevices(limit: $limit, skip: $skip) {
        location
        lastUsed
        userAgent
        status
        id
      }
    }
  }
`;

type GetDevicesRequestType = Pick<
  UserSchemaCurrentDevicesArgs,
  "limit" | "skip"
>;

type PickedDeviceProperties = Pick<
  DeviceSchema,
  "location" | "lastUsed" | "userAgent" | "status" | "id"
>;

type GetDevicesResponseType = {
  readonly currentUser: Pick<UserSchema, "numCurrentDevices"> & {
    readonly currentDevices: ReadonlyArray<PickedDeviceProperties>;
  };
};

const DELETE_DEVICE = gql`
  mutation DeviceTable_DeleteDevice($input: DeleteDeviceInput!) {
    currentUser {
      deleteDevice(input: $input) {
        error
      }
    }
  }
`;

type DeleteDeviceResponseType = {
  readonly currentUser: {
    readonly deleteDevice: Pick<DeleteDeviceMutation, "error">;
  };
};

const DELETE_ALL_DEVICES = gql`
  mutation DeviceTable_DeleteAllDevices {
    currentUser {
      deleteAllDevices {
        error
      }
    }
  }
`;

type DeleteAllDevicesResponseType = {
  readonly currentUser: {
    readonly deleteAllDevices: Pick<DeleteAllDevicesMutation, "error">;
  };
};

type DeviceTableProps = BaseProps;

type DeviceInfoCellProps = PickedDeviceProperties;
const DeviceInfoCell: React.FC<DeviceInfoCellProps> = ({
  userAgent,
  status,
}: DeviceInfoCellProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.cell, styles.userAgent)}>
      {userAgent}
      {status == "CURRENT" && (
        <div className={css(styles.current)}>current</div>
      )}
    </div>
  );
};

type LastUsedCellProps = PickedDeviceProperties;
const LastUsedCell: React.FC<LastUsedCellProps> = ({
  lastUsed,
}: LastUsedCellProps) => {
  const styles = useStylesheet();

  if (lastUsed == null) {
    return <div className={css(styles.noDataMessage)}>No Data</div>;
  }
  let timeString: string | null = null;
  const lastUsedMoment = moment(lastUsed);
  if (lastUsedMoment.isSame(moment(), "day")) {
    timeString = i`Today at ${formatDatetimeLocalized(
      lastUsedMoment,
      "h:mm a"
    )}`;
  } else if (lastUsedMoment.isSame(moment().subtract(1, "days"), "day")) {
    timeString = i`Yesterday at ${formatDatetimeLocalized(
      lastUsedMoment,
      "h:mm a"
    )}`;
  } else {
    timeString = formatDatetimeLocalized(lastUsedMoment, "lll"); // shows as "Sep 4, 1986 8:30 PM"
  }

  return <div className={css(styles.cell)}>{timeString}</div>;
};

const DeviceTable: React.FC<DeviceTableProps> = (props: DeviceTableProps) => {
  const DEFAULT_PAGE_SIZE = 10;

  const { className, style } = props;
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const [rawPageSize, setPageSize] = useIntQueryParam("page-size");
  const [rawPage, setPage] = useIntQueryParam("page");
  const pageSize = rawPageSize || DEFAULT_PAGE_SIZE;
  const page = rawPage || 0;
  const { data, loading: dataLoading, refetch: refetchDevices } = useQuery<
    GetDevicesResponseType,
    GetDevicesRequestType
  >(GET_DEVICES, {
    variables: {
      skip: page * pageSize,
      limit: pageSize,
    },
  });
  const numDevices = data?.currentUser.numCurrentDevices || 0;
  const devices = data?.currentUser.currentDevices || [];

  const [deleteDevice, { loading: deleteDeviceLoading }] = useMutation<
    DeleteDeviceResponseType,
    UserMutationDeleteDeviceArgs
  >(DELETE_DEVICE);
  const [deleteAllDevices, { loading: deleteAllDevicesLoading }] = useMutation<
    DeleteAllDevicesResponseType,
    void
  >(DELETE_ALL_DEVICES);
  const [deletingDeviceId, setDeletingDeviceId] = useState<
    string | undefined
  >();

  const onDeleteDevice = async (deviceId: string) => {
    let data: DeleteDeviceResponseType | undefined = undefined;
    try {
      const resp = await deleteDevice({
        variables: { input: { deviceId } },
      });
      data = resp.data;
    } catch {
      toastStore.negative(i`Something went wrong. Please try again later.`);
      return;
    }

    if (data?.currentUser.deleteDevice.error) {
      toastStore.negative(i`Something went wrong. Please try again later.`);
      return;
    }

    // no errors - device has been successfully logged out
    toastStore.positive(i`Device has been logged out!`);
    refetchDevices();
  };

  const onDeleteAllDevices = async (
    onComplete: (success: boolean) => unknown
  ) => {
    let data: DeleteAllDevicesResponseType | undefined = undefined;
    try {
      const resp = await deleteAllDevices();
      data = resp.data;
    } catch {
      onComplete(false);
      return;
    }

    if (data?.currentUser.deleteAllDevices.error) {
      onComplete(false);
      return;
    }

    // no errors - devices has been successfully logged out
    onComplete(true);
    refetchDevices();
  };

  const actions = [
    {
      key: "remove",
      name: i`Remove`,
      apply([device]: ReadonlyArray<PickedDeviceProperties>) {
        setDeletingDeviceId(device.id);
        onDeleteDevice(device.id);
      },
      isLoading([device]: ReadonlyArray<PickedDeviceProperties>) {
        return (
          deleteAllDevicesLoading ||
          (deleteDeviceLoading && device.id == deletingDeviceId)
        );
      },
      canApplyToRow: ({ status }: PickedDeviceProperties) =>
        !(status == "CURRENT"),
    },
  ];

  const showOptionsButton = numDevices > 1 || devices[0]?.status !== "CURRENT";
  const optionsButton = showOptionsButton && (
    <OptionsButton
      className={css(styles.controlsItem)}
      type="RECTANGULAR"
      popoverPosition="bottom right"
      padding="10px"
      options={[
        {
          title: i`Clear Device History`,
          onClick: () => {
            new ClearDeviceHistoryModal({
              onDelete: onDeleteAllDevices,
            }).render();
          },
          disabled: deleteAllDevicesLoading,
        },
      ]}
    />
  );

  return (
    <>
      <div className={css(styles.controlsRow)}>
        <PageIndicator
          isLoading={dataLoading}
          totalItems={numDevices}
          rangeStart={page * pageSize + 1}
          rangeEnd={page * pageSize + devices.length}
          hasNext={(page + 1) * pageSize <= numDevices}
          hasPrev={page > 0}
          currentPage={page}
          onPageChange={(newPage: number) => {
            setPage(Math.max(0, newPage));
          }}
        />
        <Select
          className={css(styles.controlsItem)}
          options={[10, 20, 50].map((v) => ({ value: v, text: v.toString() }))}
          onSelected={(newPageSize: number) => {
            setPage(0); // the new page size might be beyond the data available, so reset to the top
            setPageSize(newPageSize);
          }}
          selectedValue={pageSize}
          disabled={dataLoading}
        />
        {optionsButton}
      </div>
      <LoadingIndicator loadingComplete={data !== undefined}>
        <Table
          className={css(className, style)}
          data={devices}
          actions={actions}
          renderRowActions={({ actions: [action], apply }) => {
            return (
              <DeleteButton
                onClick={() => apply(action)}
                popoverContent={i`Log out of device`}
              />
            );
          }}
          actionColumnWidth={100}
        >
          <Table.Column title={i`Device`} columnKey="userAgent">
            {({
              row,
            }: CellInfo<
              PickedDeviceProperties["userAgent"],
              PickedDeviceProperties
            >) => <DeviceInfoCell {...row} />}
          </Table.Column>
          <Table.Column title={i`Time`} columnKey="lastUsed">
            {({
              row,
            }: CellInfo<
              PickedDeviceProperties["lastUsed"],
              PickedDeviceProperties
            >) => <LastUsedCell {...row} />}
          </Table.Column>
          <Table.Column
            title={i`Location`}
            columnKey="location"
            noDataMessage={i`Unknown`}
          />
        </Table>
      </LoadingIndicator>
    </>
  );
};

export default observer(DeviceTable);

const useStylesheet = () => {
  const { primary, textLight, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        noDataMessage: {
          color: textLight,
        },
        controlsRow: {
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        },
        controlsItem: {
          marginLeft: 12,
        },
        icon: {
          height: 24,
          width: 24,
          marginRight: 16,
        },
        cell: {
          display: "flex",
          alignItems: "center",
          color: textBlack,
        },
        userAgent: {
          fontWeight: weightMedium,
        },
        current: {
          color: primary,
          backgroundColor: `${primary}1A`,
          fontSize: 12,
          fontWeight: weightNormal,
          height: 18,
          borderRadius: 16,
          padding: "0px 8px",
          display: "flex",
          alignItems: "center",
          marginLeft: 16,
        },
      }),
    [primary, textLight, textBlack]
  );
};
