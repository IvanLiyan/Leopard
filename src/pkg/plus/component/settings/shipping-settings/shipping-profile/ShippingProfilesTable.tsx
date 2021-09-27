/*
 *
 * ShippingProfilesMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/25/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import numeral from "numeral";

import { Link } from "@ContextLogic/lego";
import { CellInfo } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import ShippingProfileSummary from "./ShippingProfileSummary";
import EditShippingProfileModal from "@plus/component/settings/shipping-settings/shipping-profile/EditShippingProfileModal";
import CreateShippingProfileModal from "@plus/component/settings/shipping-settings/shipping-profile/CreateShippingProfileModal";

import { PickedShippingProfileSchema } from "@toolkit/shipping-settings-v2";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import LinkedProductsModal from "./LinkedProductsModal";

type Props = BaseProps & {
  readonly shippingProfiles: ReadonlyArray<PickedShippingProfileSchema>;
};

const ShippingProfilesTable: React.FC<Props> = ({
  style,
  className,
  shippingProfiles,
}: Props) => {
  const tableActions = useMemo(() => {
    return [
      {
        key: "edit",
        name: i`Edit`,
        canApplyToRow: () => true,
        apply([shippingProfile]: ReadonlyArray<PickedShippingProfileSchema>) {
          new EditShippingProfileModal({
            profileId: shippingProfile.id,
          }).render();
        },
      },
      {
        key: "duplicate",
        name: i`Duplicate`,
        canApplyToRow: () => true,
        apply([shippingProfile]: ReadonlyArray<PickedShippingProfileSchema>) {
          new CreateShippingProfileModal({
            sourceProfileId: shippingProfile.id,
          }).render();
        },
      },
    ];
  }, []);

  return (
    <Table
      data={shippingProfiles}
      hideBorder
      rowHeight={60}
      actions={tableActions}
      className={css(style, className)}
      noDataMessage={i`No profiles found`}
    >
      <Table.Column
        title={i`Profile name`}
        width="50%"
        columnKey="name"
        handleEmptyRow
      >
        {({
          row: { name, description },
        }: CellInfo<
          PickedShippingProfileSchema["name"],
          PickedShippingProfileSchema
        >) => {
          return (
            <ShippingProfileSummary
              name={name}
              description={description}
              isExpress
            />
          );
        }}
      </Table.Column>
      <Table.Column
        title={i`Linked products`}
        columnKey="linkedProductCount"
        handleEmptyRow
        align="left"
      >
        {({
          row: { linkedProductCount, id },
        }: CellInfo<
          PickedShippingProfileSchema["linkedProductCount" | "id"],
          PickedShippingProfileSchema
        >) => {
          return (
            <Link
              onClick={() =>
                new LinkedProductsModal({
                  profileId: id,
                  linkedProductCount,
                }).render()
              }
            >
              {numeral(linkedProductCount).format("0,0").toString()}
            </Link>
          );
        }}
      </Table.Column>
    </Table>
  );
};

export default observer(ShippingProfilesTable);
