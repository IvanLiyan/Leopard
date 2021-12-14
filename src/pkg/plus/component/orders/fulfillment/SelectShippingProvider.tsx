/*
 *
 * SelectShippingProvider.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/5/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";

import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

import { Option } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { FormSelect, FormSelectProps } from "@ContextLogic/lego";

import {
  CountryCode,
  ShippingProviderSchema,
  OrderSchemaAvailableShippingProvidersArgs,
} from "@schema/types";

const GET_SHIPPING_PROVIDERS_ACTION_REQUIRED_QUERY = gql`
  query SelectShippingProvider_GetShippingProvidersActionRequiredQuery(
    $orderId: String!
    $originCountryCode: CountryCode!
  ) {
    fulfillment {
      actionRequiredOrders(query: $orderId, searchType: ORDER_ID) {
        availableShippingProviders(originCountryCode: $originCountryCode) {
          id
          name
        }
      }
    }
  }
`;

const GET_SHIPPING_PROVIDERS_ORDER_QUERY = gql`
  query SelectShippingProvider_GetShippingProvidersOrderQuery(
    $orderId: String!
    $originCountryCode: CountryCode!
  ) {
    fulfillment {
      order(id: $orderId) {
        availableShippingProviders(originCountryCode: $originCountryCode) {
          id
          name
        }
      }
    }
  }
`;

type ShippingProviderType = Pick<ShippingProviderSchema, "id" | "name">;

type ActionRequiredResponseType = {
  readonly fulfillment: {
    readonly actionRequiredOrders: ReadonlyArray<{
      readonly availableShippingProviders: ReadonlyArray<ShippingProviderType>;
    }>;
  };
};

type OrderResponseType = {
  readonly fulfillment: {
    readonly order: {
      readonly availableShippingProviders: ReadonlyArray<ShippingProviderType>;
    };
  };
};

type RequestType = {
  readonly orderId: string;
  readonly originCountryCode: OrderSchemaAvailableShippingProvidersArgs["originCountryCode"];
};

type Props = Omit<FormSelectProps<string>, "options"> & {
  readonly orderId: string;
  readonly originCountryCode: CountryCode;
  readonly isWps?: boolean;
};

const SelectShippingProvider: React.FC<Props> = ({
  originCountryCode,
  orderId,
  isWps,
  className,
  style,
  ...props
}: Props) => {
  const { data: actionRequiredData, loading: actionRequiredLoading } = useQuery<
    ActionRequiredResponseType,
    RequestType
  >(GET_SHIPPING_PROVIDERS_ACTION_REQUIRED_QUERY, {
    variables: {
      originCountryCode,
      orderId,
    },
    skip: originCountryCode == null || isWps,
  });

  const { data: orderData, loading: orderLoading } = useQuery<
    OrderResponseType,
    RequestType
  >(GET_SHIPPING_PROVIDERS_ORDER_QUERY, {
    variables: {
      originCountryCode,
      orderId,
    },
    skip: !isWps,
  });

  const availableShippingProviders = useMemo(() => {
    if (isWps) {
      return orderData?.fulfillment.order.availableShippingProviders;
    }
    const actionRequiredOrders =
      actionRequiredData?.fulfillment.actionRequiredOrders;
    if (
      originCountryCode == null ||
      actionRequiredOrders == null ||
      actionRequiredOrders.length == 0
    ) {
      return;
    }

    const [order] = actionRequiredOrders;
    return order.availableShippingProviders;
  }, [actionRequiredData, orderData, isWps, originCountryCode]);

  if (actionRequiredLoading || orderLoading) {
    return (
      <LoadingIndicator
        type="spinner"
        size={20}
        className={className}
        style={style}
      />
    );
  }

  if (availableShippingProviders == null) {
    return null;
  }

  const shippingProviderOptions: ReadonlyArray<Option<string>> =
    availableShippingProviders.map((provider) => ({
      value: provider.id.toString(),
      text: provider.name,
    }));

  return (
    <FormSelect
      options={shippingProviderOptions}
      {...props}
      className={className}
      style={style}
    />
  );
};

export default observer(SelectShippingProvider);
