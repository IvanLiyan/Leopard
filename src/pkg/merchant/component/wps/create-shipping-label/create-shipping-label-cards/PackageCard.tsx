/*
 * PackageCard.tsx
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useLazyQuery } from "@apollo/client";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import CardHeader from "@merchant/component/wps/create-shipping-label/CardHeader";
import PackageEditing from "./PackageEditing";
import PackageClosed from "./PackageClosed";
import { Illustration } from "@merchant/component/core";

/* Lego Components */
import { Card, Link, Spinner, Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Toolkit */
import {
  DefaultLengthUnit,
  DefaultWeightUnit,
  GetDimensionsInputType,
  GetDimensionsResponseType,
  GET_DIMENSIONS,
} from "@toolkit/wps/create-shipping-label";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const PackageCard: React.FC<Props> = ({ className, style, state }: Props) => {
  const styles = useStylesheet();

  const {
    packageState,
    onReopenPackage,
    initialData: {
      currentMerchant: { preferredLengthUnit, preferredWeightUnit },
      fulfillment: {
        order: {
          variation: { id: variationId },
        },
      },
    },
  } = state;

  const { cardState } = packageState;

  const [fetchInitialDimensions, { data, loading }] = useLazyQuery<
    GetDimensionsResponseType,
    GetDimensionsInputType
  >(GET_DIMENSIONS, {
    variables: {
      lengthUnit: preferredLengthUnit || DefaultLengthUnit,
      weightUnit: preferredWeightUnit || DefaultWeightUnit,
      variationId,
    },
  });

  useMountEffect(fetchInitialDimensions);

  const renderContent = () => {
    return cardState === "EDITING" ? (
      <PackageEditing
        className={css(styles.content, styles.packageEditing)}
        state={state}
        defaults={data}
      />
    ) : (
      <PackageClosed
        className={css(styles.content, styles.closedContent)}
        state={state}
      />
    );
  };

  return (
    <Card className={css(styles.root, className, style)}>
      <div className={css(styles.baseHeaderWrapper)}>
        <CardHeader
          icon="closedPackage"
          title={i`Package`}
          subtitle={i`What kind of package is it?`}
        />
        {loading && <Spinner size={24} />}
        {cardState === "CLOSED_EDITABLE" && (
          <Link onClick={onReopenPackage} className={css(styles.editLink)}>
            <Illustration
              className={css(styles.editIcon)}
              name="editWishBlue"
              alt=""
            />
            <Text>Edit</Text>
          </Link>
        )}
      </div>
      {renderContent()}
    </Card>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
        },
        baseHeaderWrapper: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        editLink: {
          display: "flex",
          alignItems: "center",
        },
        editIcon: {
          marginRight: 6,
          height: 16,
          width: 16,
        },
        content: {
          marginTop: 20,
        },
        closedContent: {
          marginLeft: 48,
        },
        packageEditing: {
          marginLeft: 48,
        },
      }),
    [],
  );
};

export default observer(PackageCard);
