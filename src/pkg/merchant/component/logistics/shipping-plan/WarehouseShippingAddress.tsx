import React, { Component } from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { ShippingAddress } from "@merchant/component/core";

import { WarehouseAddress } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type WarehouseShippingAddressProps = BaseProps & {
  readonly shippingDetails: WarehouseAddress;
  readonly disableCopy: boolean;
};

@observer
class WarehouseShippingAddress extends Component<
  WarehouseShippingAddressProps
> {
  render() {
    const { disableCopy, shippingDetails } = this.props;
    return (
      <ShippingAddress
        shippingDetails={{
          street_address1: shippingDetails.street_address1,
          city: shippingDetails.city,
          state: shippingDetails.state,
          zipcode: shippingDetails.zipcode,
          country_code: shippingDetails.country,
          country: shippingDetails.country,
        }}
        disableCopy={disableCopy}
      />
    );
  }
}

export default WarehouseShippingAddress;
