/* External Libraries */
import { observable, computed } from "mobx";

/* Lego Components */
import { LinkProps } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Merchant API */
import { logout } from "@merchant/api/authentication";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Merchant Stores */
import UserStore from "@stores/UserStore";
import ExperimentStore from "@stores/ExperimentStore";
import NavigationStore from "@stores/NavigationStore";

type Visibility =
  | "ALL"
  | "USER"
  | "NON_API_USER"
  | "API_USER"
  | "GUEST"
  | "NONE";

export type NavItem = {
  readonly url?: string;
  readonly text: string;
  readonly visibility: ReadonlyArray<Visibility>;
  readonly inverted?: boolean;
  readonly items?: ReadonlyArray<NavItem>;
  readonly experiment?: string;
  readonly linkPropsOverride?: LinkProps;
};

const loginUrl = "/login";
const signUpUrl = "/erp-partner/signup";
const logoutUrl = "/logout";

export default class PartnerDeveloperSiteNavBarStore {
  @observable
  navItems: Array<NavItem> | undefined;

  constructor() {
    this.navItems = [
      {
        text: i`Documentation`,
        url: "/documentation/api/v3/reference",
        visibility: ["ALL"],
      },
      {
        text: i`API Explorer`,
        url: "/documentation/api/v3/explorer",
        visibility: ["ALL"],
      },
      {
        text: i`Release Notes`,
        url: "/documentation/api/v3/release-notes",
        visibility: ["ALL"],
      },
      {
        visibility: ["ALL"],
        text: i`FAQ`,
        items: [
          {
            url: zendeskURL("360025301354"),
            text: i`Public App Tutorial`,
            visibility: ["ALL"],
          },
          {
            url: zendeskURL("360034132014"),
            text: i`Private App Tutorial`,
            visibility: ["ALL"],
          },
          {
            url: "/documentation/api/v3/oauth",
            text: i`OAuth Tutorial`,
            visibility: ["ALL"],
          },
          {
            url: "/documentation/webhooks",
            text: i`Webhooks Tutorial`,
            visibility: ["ALL"],
          },
        ],
      },
      {
        url: loginUrl,
        text: i`Login`,
        visibility: ["GUEST"],
      },
      {
        url: logoutUrl,
        text: i`Logout`,
        visibility: ["USER"],
      },
      {
        url: signUpUrl,
        text: i`Get Started`,
        visibility: ["GUEST", "NON_API_USER"],
        inverted: true,
      },
    ];
  }

  @computed
  get visibleNavItems(): Array<NavItem> | undefined {
    const { loggedInMerchantUser, isLoggedIn, isMerchant } =
      UserStore.instance();
    const experimentStore = ExperimentStore.instance();
    const { currentPath } = NavigationStore.instance();

    return this.navItems
      ?.filter(({ visibility, experiment }) => {
        if (
          experiment &&
          experimentStore.bucketForUser(experiment) === "control"
        ) {
          visibility = ["NONE"];
        }
        let show = false;
        if (visibility.includes("NONE")) {
          return show;
        }
        if (visibility.includes("ALL")) {
          show = true;
          return show;
        }
        if (visibility.includes("GUEST")) {
          show = show || !isLoggedIn;
        }
        if (visibility.includes("USER")) {
          show = show || isLoggedIn;
        }
        if (visibility.includes("NON_API_USER")) {
          show = show || isMerchant;
        }
        if (visibility.includes("API_USER")) {
          show = show || loggedInMerchantUser?.is_api_user;
        }
        return show;
      })
      .map((navItem) => {
        const { url } = navItem;
        let linkProps: LinkProps = {
          href: undefined,
          onClick: undefined,
        };

        if (isMerchant && url === signUpUrl) {
          linkProps = {
            ...linkProps,
            onClick: confirmLogoutModal,
          };
        } else if (url === loginUrl) {
          linkProps = {
            ...linkProps,
            href: `${url}?next=${encodeURIComponent(currentPath || "")}`,
          };
        } else {
          linkProps = {
            ...linkProps,
            href: url,
          };
        }

        return {
          ...navItem,
          linkPropsOverride: linkProps,
        };
      });
  }
}

export const confirmLogoutModal = () => {
  new ConfirmationModal(
    i`In order to sign up, we'll need to log you out of your account. ` +
      i`Would you like to continue?`,
  )
    .setHeader({
      title: i`Logout and Sign Up`,
    })
    .setCancel(i`Cancel`)
    .setAction(i`Continue`, async () => {
      await logout({}).call();
      NavigationStore.instance().navigate(signUpUrl);
    })
    .render();
};
