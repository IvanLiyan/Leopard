import gql from "graphql-tag";
import { observable, action, computed } from "mobx";

import { SetStorePhotoMutation, StorePhotoInput } from "@schema/types";

import ToastStore from "@merchant/stores/ToastStore";
import ApolloStore from "@merchant/stores/ApolloStore";
import NavigationStore from "@merchant/stores/NavigationStore";

const SET_STORE_PHOTO_MUTATION = gql`
  mutation StorePhotoSettingsState_SetStorePhotoMutation(
    $input: StorePhotoInput!
  ) {
    localOnboarding {
      storePhoto(input: $input) {
        ok
        message
      }
    }
  }
`;

type SetStorePhotoResponseType = {
  readonly localOnboarding: {
    readonly storePhoto: Pick<SetStorePhotoMutation, "ok" | "message">;
  };
};

export default class StorePhotoSettingsState {
  @observable
  isOnboarding: boolean = false;

  @observable
  photoUrl?: string;

  @observable
  isSubmitting: boolean = false;

  constructor(args: { readonly isOnboarding: boolean }) {
    const { isOnboarding } = args;
    this.isOnboarding = isOnboarding;
  }

  @computed
  private get asInput() {
    const { photoUrl } = this;
    return { photoUrl } as StorePhotoInput;
  }

  @action
  async submit() {
    const { asInput: input, isOnboarding } = this;
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    if (!input.photoUrl) {
      toastStore.negative(i`Could not find photo URL.`);
      return;
    }

    this.isSubmitting = true;

    const { data } = await client.mutate<
      SetStorePhotoResponseType,
      { input: StorePhotoInput }
    >({
      mutation: SET_STORE_PHOTO_MUTATION,
      variables: { input },
    });

    const ok = data?.localOnboarding.storePhoto.ok;
    const message = data?.localOnboarding.storePhoto.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not set store photo.`);
      return;
    }

    navigationStore.releaseNavigationLock();
    if (isOnboarding) {
      await navigationStore.navigate("/plus/home/onboarding-steps");
    }

    toastStore.positive(i`Success! Your store photo has been set.`, {
      timeoutMs: 7000,
    });
  }
}
