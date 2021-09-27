import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

/* Lego */
import { css } from "@toolkit/styling";
import { useBoolQueryParam } from "@toolkit/url";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import LanguageSettings from "@plus/component/settings/language-settings/LanguageSettings";

/* Merchant Stores */
import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

import {
  ChangeLocaleMutation,
  UserMutationChangeLocaleArgs,
  PlatformConstants,
} from "@schema/types";

const CHANGE_LOCALE = gql`
  mutation PlusLanguageSettingsScreen_ChangeLocale($input: ChangeLocaleInput!) {
    currentUser {
      changeLocale(input: $input) {
        error
      }
    }
  }
`;

type ChangeLocaleResponseType = {
  readonly currentUser: {
    readonly changeLocale: Pick<ChangeLocaleMutation, "error">;
  };
};

type Props = {
  readonly initialData: {
    platformConstants: Pick<PlatformConstants, "availableLocales">;
  };
};

const PlusLanguageSettingsContainer: React.FC<Props> = ({
  initialData: {
    platformConstants: { availableLocales },
  },
}: Props) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { locale } = useLocalizationStore();
  const [isFromReload] = useBoolQueryParam("set", false);
  const [curLocale, setCurLocale] = useState(locale);
  const [loading, setLoading] = useState(false);
  const [changeLocale] = useMutation<
    ChangeLocaleResponseType,
    UserMutationChangeLocaleArgs
  >(CHANGE_LOCALE);

  /*
    We have deferred toasts to display a toast on reload
      ( `toastStore.positive(msg, { deferred: true })` )
    However, we can't do that here since the deferred toast is created in the
    old language. Please use deferred toasts if you need to replecate this
    behaviour elsewhere.
  */
  useEffect(() => {
    if (isFromReload) {
      toastStore.positive(
        i`Success! You have updated your preferred language settings`
      );
    }
  }, [toastStore, isFromReload]);

  const onChangeLocale = async () => {
    setLoading(true);
    const { data } = await changeLocale({
      variables: { input: { locale: curLocale } },
    });
    if (data == null) {
      toastStore.negative(i`Something went wrong. Please try again later.`);
      setLoading(false);
      return;
    }

    const {
      currentUser: {
        changeLocale: { error },
      },
    } = data;

    if (error) {
      toastStore.negative(error);
      setLoading(false);
      return;
    }

    navigationStore.navigate("?set=true", { fullReload: true });
  };

  const actions = (
    <>
      <Button
        onClick={() => {
          navigationStore.back();
        }}
        minWidth
      >
        Cancel
      </Button>
      <PrimaryButton
        onClick={async () => {
          onChangeLocale();
        }}
        isLoading={loading}
        isDisabled={locale === curLocale}
        minWidth
      >
        Confirm
      </PrimaryButton>
    </>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Language settings`}
        breadcrumbs={[
          { name: i`Settings`, href: "/plus/settings" },
          { name: i`Account`, href: "/plus/settings/account" },
          { name: i`Language`, href: "/plus/settings/account/language" },
        ]}
        actions={actions}
      />
      <PageGuide>
        <LanguageSettings
          className={css(styles.content)}
          selectedLocale={curLocale}
          availableLocales={[...(availableLocales || [])]}
          onSelected={(newLocale) => {
            setCurLocale(newLocale);
          }}
        />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          marginTop: 20,
        },
      }),
    []
  );

export default observer(PlusLanguageSettingsContainer);
