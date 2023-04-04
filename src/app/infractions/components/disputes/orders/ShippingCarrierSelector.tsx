import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";

/* Lego Components */
import { FormSelect, Spinner } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import {
  ORDER_SHIPPING_PROVIDERS,
  OrderShippingProvidersRequestData,
  OrderShippingProvidersResponseData,
} from "./order-disputes";
import { CountryCode } from "@schema";
import InfractionDisputeState from "./InfractionDisputeState";

type Props = BaseProps & {
  readonly state: InfractionDisputeState;
  readonly orderId: string;
  readonly countryCode?: CountryCode | null;
};

const ShippingCarrierSelector = (props: Props) => {
  const { className, style, countryCode, orderId, state } = props;

  const { data, loading } = useQuery<
    OrderShippingProvidersResponseData,
    OrderShippingProvidersRequestData
  >(ORDER_SHIPPING_PROVIDERS, {
    variables: {
      id: orderId,
      originCountryCode: countryCode || "US",
    },
    fetchPolicy: "no-cache",
    skip: countryCode == null,
  });

  const availableShippingProviders = useMemo(() => {
    if (!loading) {
      return data?.fulfillment.order.availableShippingProviders;
    }
    return null;
  }, [data, loading]);

  if (loading) {
    return <Spinner style={[className, style]} />;
  }

  const options = (availableShippingProviders || []).map((provider) => ({
    text: provider.name,
    value: provider.id.toString(),
  }));

  return (
    <FormSelect
      placeholder={i`Select carrier`}
      options={countryCode ? options : []}
      selectedValue={state.reportedShippingProviderId}
      onSelected={(value: string) => {
        state.reportedShippingProviderId = value;
        state.showFormErrors = true;
      }}
      error={state.showFormErrors && state.reportedShippingProviderId == null}
      style={[className, style]}
    />
  );
};

export default observer(ShippingCarrierSelector);
