import { observable, action } from "mobx";

/* Stores */
import ApolloStore from "@stores/ApolloStore";
import ToastStore from "@stores/ToastStore";

/* Types */
import {
  DeleteManualLinkRequestType,
  DeleteManualLinkResponseType,
  DELETE_MANUAL_LINK_MUTATION,
} from "@toolkit/manual-linking/delete-link";

/**
 * Manual linking - delete link state
 */
export default class DeleteLinkState {
  @observable
  merchant: string; // merchant email or username

  @observable
  displayName: string;

  @observable
  isDeleting: boolean = false;

  @observable
  isDeleted: boolean = false;

  constructor(merchant: string, displayName: string) {
    this.merchant = merchant;
    this.displayName = displayName;
  }

  /**
   * deleteLink - delete the current linked store
   */
  @action
  deleteLink = async () => {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();

    this.isDeleting = true;
    this.isDeleted = false;

    const input = {
      merchant: this.merchant,
    };

    const { data } = await client.mutate<
      DeleteManualLinkResponseType,
      DeleteManualLinkRequestType
    >({
      mutation: DELETE_MANUAL_LINK_MUTATION,
      variables: { input },
    });

    const ok = data?.currentUser?.manualLinkEntity.deleteManualLink?.ok;
    const message =
      data?.currentUser?.manualLinkEntity.deleteManualLink?.message;

    this.isDeleting = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`
      );
      return;
    }

    this.isDeleted = true;
  };
}
