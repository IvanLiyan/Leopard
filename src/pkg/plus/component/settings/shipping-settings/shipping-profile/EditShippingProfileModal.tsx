import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { Modal } from "@merchant/component/core/modal";

import EditShippingProfile from "./EditShippingProfile";

import { MerchantSchema } from "@schema/types";

import ShippingProfileState, {
  PickedCountryWeShipTo,
  PickedShippingProfileSchema,
} from "@plus/model/ShippingProfileState";
import { ShippingProfileCollectionSchemaShippingProfilesArgs } from "@schema/types";

const GET_SHIPPING_PROFILE = gql`
  query EditShippingProfileModal_GetShippingProfile(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: ShippingProfileSearchType
  ) {
    platformConstants {
      countriesWeShipTo {
        name
        code
        gmvRank
        wishExpress {
          supportsWishExpress
          expectedTimeToDoor
        }
      }
    }
    currentMerchant {
      primaryCurrency
    }
    shippingProfileCollection {
      shippingProfiles(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
      ) {
        id
        name
        shippingDetailsPerDestination {
          destination
          maxHoursToDoor
        }
      }
    }
  }
`;

type GetShippingProfileResponseType = {
  readonly shippingProfileCollection: {
    readonly shippingProfiles: ReadonlyArray<PickedShippingProfileSchema>;
  };
  readonly currentMerchant: Pick<MerchantSchema, "primaryCurrency">;
  readonly platformConstants: {
    readonly countriesWeShipTo: ReadonlyArray<PickedCountryWeShipTo>;
  };
};

export type EditShippingProfileModalProps = {
  readonly profileId: string;
  readonly onClose: () => unknown;
};

const EditShippingProfileModalContent: React.FC<EditShippingProfileModalProps> = observer(
  ({ profileId, onClose }: EditShippingProfileModalProps) => {
    const { data } = useQuery<
      GetShippingProfileResponseType,
      ShippingProfileCollectionSchemaShippingProfilesArgs
    >(GET_SHIPPING_PROFILE, {
      variables: {
        offset: 0,
        limit: 1,
        query: profileId,
        searchType: "PROFILE_ID",
      },
      fetchPolicy: "no-cache",
    });
    const profileState: ShippingProfileState | null = useMemo(() => {
      if (data == null) {
        return null;
      }
      const {
        shippingProfileCollection: { shippingProfiles },
        currentMerchant: { primaryCurrency },
        platformConstants: { countriesWeShipTo },
      } = data;
      const { [0]: shippingProfile } = shippingProfiles;
      if (shippingProfile == null) {
        return null;
      }
      return new ShippingProfileState({
        initialData: shippingProfile,
        primaryCurrency,
        countriesWeShipTo,
      });
    }, [data]);

    if (profileState == null) {
      return <LoadingIndicator />;
    }

    return <EditShippingProfile profileState={profileState} />;
  }
);

export default class EditShippingProfileModal extends Modal {
  constructor(props: Omit<EditShippingProfileModalProps, "onClose">) {
    super((onClose) => (
      <EditShippingProfileModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Edit a shipping profile`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.55);
  }
}
