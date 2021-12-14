import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
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
  query CreateShippingProfileModal_GetShippingProfile(
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

export type CreateShippingProfileModalProps = {
  readonly sourceProfileId?: string | null;
  readonly onClose: () => unknown;
};

const CreateShippingProfileModalContent: React.FC<CreateShippingProfileModalProps> =
  observer(({ sourceProfileId, onClose }: CreateShippingProfileModalProps) => {
    const { data } = useQuery<
      GetShippingProfileResponseType,
      ShippingProfileCollectionSchemaShippingProfilesArgs
    >(GET_SHIPPING_PROFILE, {
      variables: {
        offset: 0,
        limit: 1,
        query: sourceProfileId || "",
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
      const { [0]: sourceShippingProfile } = shippingProfiles;
      const profileState = new ShippingProfileState({
        initialData: sourceShippingProfile,
        primaryCurrency,
        countriesWeShipTo,
      });
      if (sourceShippingProfile != null) {
        profileState.name = i`Copy of ${sourceShippingProfile.name}`;
      }
      return profileState;
    }, [data]);

    if (profileState == null) {
      return <LoadingIndicator />;
    }

    return <EditShippingProfile profileState={profileState} />;
  });

export default class CreateShippingProfileModal extends Modal {
  constructor(props: Omit<CreateShippingProfileModalProps, "onClose">) {
    super((onClose) => (
      <CreateShippingProfileModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Create shipping profile`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.55);
  }
}
