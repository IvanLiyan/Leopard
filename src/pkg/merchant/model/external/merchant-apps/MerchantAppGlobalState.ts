/* External Libraries */
import { computed, observable } from "mobx";

/* Lego Components */
import { AttachmentInfo } from "@ContextLogic/lego";
import { Option } from "@ContextLogic/lego";
import { OptionType } from "@ContextLogic/lego";

/* Lego Toolkit */
import { greenCheckmark, redX } from "@assets/icons";
import {
  RequiredValidator,
  CharacterLength,
  UrlValidator,
  SecureUrlValidator,
} from "@toolkit/validators";

/* Merchant API */
import { AppCategory } from "@merchant/api/merchant-apps";
import { ListingState, UpdateRequestState } from "@merchant/api/merchant-apps";
import { ClientSecret, ChangedData } from "@merchant/api/merchant-apps";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import LocalizationStore from "@merchant/stores/LocalizationStore";

/* Toolkit */
import { Locale, LocaleInfo } from "@toolkit/locales";

export const AllowedLocales: ReadonlyArray<Locale> = [
  "en",
  "zh",
  "pt",
  "es",
  "de",
  "fr",
];

export const translatedLocaleNames: { [key: string]: LocaleInfo } = {
  en: {
    name: i`English`,
    country: "US",
  },
  zh: {
    name: i`Chinese`,
    country: "CN",
  },
  de: {
    name: i`German`,
    country: "DE",
  },
  fr: {
    name: i`French`,
    country: "FR",
  },
  es: {
    name: i`Spanish`,
    country: "ES",
  },
  pt: {
    name: i`Portuguese`,
    country: "BR",
  },
};

export type CategoryOption = {
  readonly value: AppCategory;
  readonly title: string;
};

export const categoriesOptions: Array<CategoryOption> = [
  {
    value: "ERP",
    title: i`ERP`,
  },
  {
    value: "LOANS",
    title: i`Loans`,
  },
  {
    value: "INSURANCE",
    title: i`Insurance`,
  },
];

export const supportedLanguagesOptions: Array<OptionType> = Object.keys(
  translatedLocaleNames
).map((locale, _) => {
  return { value: locale, title: translatedLocaleNames[locale].name };
});

type DefaultLocaleFormStateProps = {
  readonly name?: string | null | undefined;
  readonly redirectUri?: string | null | undefined;
  readonly website?: string | null | undefined;
  readonly supportEmail?: string | null | undefined;
  readonly supportPhone?: string | null | undefined;
  readonly supportWechat?: string | null | undefined;
  readonly logoSource?: string | null | undefined;
  readonly supportedLanguages?: null | undefined | ReadonlyArray<Locale>;
};

export class DefaultLocaleFormState {
  @observable name: string | undefined;
  @observable redirectUri: string | undefined;
  @observable website: string | undefined;
  @observable supportEmail: string | undefined;
  @observable supportPhone: string | undefined;
  @observable supportWechat: string | undefined;
  @observable logoSource: string | undefined;
  @observable attachments: ReadonlyArray<Partial<AttachmentInfo>> = [];
  @observable supportedLanguages: ReadonlyArray<Locale> = [];

  @observable nameIsValid = false;
  @observable redirectUriIsValid = false;
  @observable websiteIsValid = false;
  @observable supportEmailIsValid = true;

  constructor(props: DefaultLocaleFormStateProps | null | undefined) {
    if (props) {
      if (props.name) {
        this.name = props.name;
        this.nameIsValid = true;
      }
      if (props.redirectUri) {
        this.redirectUri = props.redirectUri;
        this.redirectUriIsValid = true;
      }
      if (props.website) {
        this.website = props.website;
      }
      if (props.supportEmail) {
        this.supportEmail = props.supportEmail;
      }
      if (props.supportPhone) {
        this.supportPhone = props.supportPhone;
      }
      if (props.supportWechat) {
        this.supportWechat = props.supportWechat;
      }
      if (props.logoSource) {
        this.logoSource = props.logoSource;
      }
      if (props.supportedLanguages && props.supportedLanguages.length) {
        this.supportedLanguages = props.supportedLanguages;
      } else {
        const { locale } = LocalizationStore.instance();
        this.supportedLanguages = [locale];
      }
    }
  }

  @computed
  get validators() {
    const requiredValidator = new RequiredValidator();
    const urlValidator = new UrlValidator();
    const secureUrlValidator = new SecureUrlValidator();
    const lengthValidator = new CharacterLength({ maximum: 50 });
    return {
      requiredValidator,
      urlValidator,
      secureUrlValidator,
      lengthValidator,
    };
  }
}

type LocalizedFormProps = {
  readonly description?: string | null | undefined;
  readonly intro?: string | null | undefined;
};

type LocalizedFormStateProps = {
  readonly locale: Locale;
  readonly localizedProps: LocalizedFormProps;
};

export class LocalizedFormState {
  @observable locale: Locale;
  @observable description: string | undefined;
  @observable intro: string | undefined;

  @observable introIsValid = true;
  @observable descriptionIsValid = false;

  constructor(props: LocalizedFormStateProps) {
    this.locale = props.locale;
    if (props.localizedProps.description) {
      this.description = props.localizedProps.description;
      this.descriptionIsValid = true;
    }
    if (props.localizedProps.intro) {
      this.intro = props.localizedProps.intro;
      this.introIsValid = true;
    }
  }

  @computed
  get isValid(): boolean {
    return this.introIsValid && this.descriptionIsValid;
  }
}

type MerchantAppGlobalStateProps = {
  readonly name: string;
  readonly redirect_uri?: string | null | undefined;
  readonly website: string;
  readonly descriptions: {};
  readonly intros: {};
  readonly support_email: string;
  readonly support_phone: string;
  readonly support_wechat: string;
  readonly logo_source: string;
  readonly supported_languages: ReadonlyArray<Locale>;
  readonly client_id: string;
  readonly client_secrets?: Array<ClientSecret>;
  readonly changed_data?: ChangedData;
  readonly listing_state_name?: ListingState;
  readonly update_request_state_name?: UpdateRequestState;
  readonly already_added?: boolean;
  readonly public?: boolean;
};

export default class MerchantAppGlobalState {
  mainForm: DefaultLocaleFormState;
  isAlreadyAdded = false;
  @observable localizedForms: Map<Locale, LocalizedFormState> = new Map();
  @observable isLoading = false;
  @observable isUploadHidden = true;

  constructor({
    props,
  }: { props?: Partial<MerchantAppGlobalStateProps> } = {}) {
    props = props || {};
    const mainFormProps = {
      name: props.name,
      redirectUri: props.redirect_uri,
      website: props.website,
      supportEmail: props.support_email,
      supportPhone: props.support_phone,
      supportWechat: props.support_wechat,
      logoSource: props.logo_source,
      supportedLanguages: props.supported_languages,
    };
    this.mainForm = new DefaultLocaleFormState(mainFormProps);

    const descriptions = props.descriptions || {};
    const intros = props.intros || {};
    AllowedLocales.forEach((code: Locale) => {
      const localizedFormsProps = {
        description: (descriptions as any)[code],
        intro: (intros as any)[code],
      };
      this.localizedForms.set(
        code,
        new LocalizedFormState({
          locale: code,
          localizedProps: localizedFormsProps,
        })
      );
    });

    this.isAlreadyAdded = props.already_added || this.isAlreadyAdded;
  }

  getLocaleOptions(
    locales: ReadonlyArray<Locale>
  ): ReadonlyArray<Option<Locale>> {
    const localeOptions: Option<Locale>[] = [];
    for (const code of locales) {
      const localeInfo = translatedLocaleNames[code];

      localeOptions.push({
        text: localeInfo.name,
        value: code,
      });
    }
    return localeOptions;
  }

  @computed
  get logoSourceValid(): boolean {
    const { attachments, logoSource } = this.mainForm;
    return !!(
      (this.isUploadHidden && logoSource) ||
      (attachments && attachments[0] && attachments[0].url)
    );
  }

  otherLocalizedFormsValid(locale: Locale): boolean {
    return Array.from(this.includedLocales)
      .filter((code: Locale) => code != locale)
      .every((code: Locale) => {
        const localizedForm = this.localizedForms.get(code);
        return localizedForm && localizedForm.isValid;
      });
  }

  @computed
  get localizedFormsValid(): boolean {
    return Array.from(this.includedLocales).every((code: Locale) => {
      const localizedForm = this.localizedForms.get(code);
      return localizedForm && localizedForm.isValid;
    });
  }

  @computed
  get canSubmit(): boolean {
    const supportedLanguagesIsValid = !!this.mainForm.supportedLanguages.length;

    return (
      !this.isLoading &&
      this.mainForm.nameIsValid &&
      this.mainForm.redirectUriIsValid &&
      this.mainForm.websiteIsValid &&
      this.mainForm.supportEmailIsValid &&
      this.logoSourceValid &&
      supportedLanguagesIsValid &&
      this.localizedFormsValid
    );
  }

  @computed
  get isFromCN(): boolean {
    const { countryCodeByIp } = AppStore.instance();
    return countryCodeByIp == "CN";
  }

  get includedLocales(): Set<Locale> {
    const included: Set<Locale> = new Set();
    this.localizedForms.forEach((localizedForm, locale) => {
      if (localizedForm.description || localizedForm.intro) {
        included.add(locale);
      }
    });
    this.mainForm.supportedLanguages.forEach((locale) => included.add(locale));
    return included;
  }

  @computed
  get existingLocaleOptions(): ReadonlyArray<Option<Locale>> {
    return this.getLocaleOptions(Array.from(this.includedLocales));
  }

  get localesToAdd(): ReadonlyArray<Option<Locale>> {
    const localesToAdd = AllowedLocales.filter(
      (code) => !this.includedLocales.has(code)
    );
    return this.getLocaleOptions(localesToAdd);
  }

  get localeOptions(): ReadonlyArray<Option<Locale>> {
    const localeOptions = Array.from(this.includedLocales).map<Option<Locale>>(
      (code: Locale) => {
        const localeInfo = translatedLocaleNames[code];
        const localizedForm = this.localizedForms.get(code);
        let img = greenCheckmark;

        if (localizedForm) {
          if (!localizedForm.isValid) {
            img = redX;
          }
        }

        return {
          text: localeInfo.name,
          value: code,
          img,
        };
      }
    );
    return localeOptions;
  }
}

type MerchantAppPreviewStateProps = {
  merchantApp: MerchantAppGlobalStateProps;
  isDisabled: boolean;
};

export class MerchantAppPreviewState {
  listingState: ListingState | undefined;

  clientId = "";

  clientSecret: string | undefined;

  @observable clientSecrets: Array<ClientSecret> = [];

  updateRequestState: UpdateRequestState | undefined;

  isDisabled: boolean | undefined;

  changedData: ChangedData | undefined;

  @observable previewLocale: Locale | undefined;

  constructor(props?: MerchantAppPreviewStateProps) {
    if (props) {
      const { merchantApp, isDisabled } = props;
      const { locale } = LocalizationStore.instance();

      this.clientId = merchantApp.client_id;
      this.clientSecrets = merchantApp.client_secrets || [];
      this.listingState = merchantApp.listing_state_name || "HIDDEN";
      if (merchantApp.changed_data) {
        this.changedData = merchantApp.changed_data;
      }
      this.updateRequestState =
        merchantApp.update_request_state_name || "CANCELLED";

      this.isDisabled = isDisabled;
      this.previewLocale = locale;
    }
  }
}

type PrivateAppCreationStateProps = {};

export class PrivateAppCreationState {
  @observable name: string | typeof undefined;
  @observable redirectUri: string | typeof undefined;
  @observable termAgreed: boolean;
  @observable isNameValid: boolean;
  @observable isRedirectUriValid: boolean;

  constructor(props?: PrivateAppCreationStateProps) {
    this.termAgreed = false;
    this.isNameValid = false;
    this.isRedirectUriValid = false;
  }

  @computed
  get canSubmit(): boolean {
    return this.isNameValid && this.isRedirectUriValid && this.termAgreed;
  }
}
