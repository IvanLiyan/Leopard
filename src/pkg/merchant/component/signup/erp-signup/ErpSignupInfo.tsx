import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import { configureAnchors } from "react-scrollable-anchor";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Merchant Components */
import SectionWrapper from "@merchant/component/signup/erp-signup/sections/SectionWrapper";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { white } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold } from "@toolkit/fonts";

/* Merchant API */
import { signupErpPartner } from "@merchant/api/erp-signup";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ErpSignupState from "@merchant/model/external/erp-signup/ErpSignupState";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

type ErpSignupInfoProps = BaseProps & {
  readonly state: ErpSignupState;
};

const tos = i`Wish API Partner Terms of Service`;
const tosLink = `[${tos}](/api-partner-terms-of-service)`;

const ErpSignupInfo = (props: ErpSignupInfoProps) => {
  const { className, state } = props;
  const navigationStore = useNavigationStore();
  const styles = useStylesheet();

  useEffect(() => {
    // offset anchor to adjust for fixed header
    configureAnchors({ offset: -60, scrollDuration: 200 });
  }, []);

  const signupErp = async () => {
    try {
      await signupErpPartner(state.requestParams).call();
      navigationStore.navigate("/");
    } catch (_) {
      // toast error automatically
    }
  };

  const onClick = async () => {
    new ConfirmationModal(
      i`Are you sure all the information you have provided is correct?`
    )
      .setHeader({ title: i`Confirmation` })
      .setAction(i`Yes, submit application`, () => {
        signupErp();
      })
      .setCancel(i`Cancel`)
      .setWidthPercentage(50)
      .render();
  };

  return (
    <div className={css(className, styles.root)}>
      <div className={css(styles.formWrapper)}>
        <div className={css(styles.title, styles.item)}>
          Become a Wish ERP partner
        </div>
        {state.sections.map(
          // ErpSignupSection is a component, should be PascalCase
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ({ sectionTitle, id, reactNode: ErpSignupSection }, index) => (
            <SectionWrapper
              title={sectionTitle}
              anchorId={id}
              className={css(styles.item)}
              key={id}
            >
              <ErpSignupSection state={state} />
            </SectionWrapper>
          )
        )}
      </div>
      <div className={css(styles.footer)}>
        <div className={css(styles.footerContent)}>
          <CheckboxField
            title={() => (
              <Markdown text={i`I agree to the ${tosLink}`} openLinksInNewTab />
            )}
            checked={state.termAgreed}
            onChange={(checked) => {
              state.termAgreed = checked;
            }}
          />
          <PrimaryButton onClick={onClick} isDisabled={!state.canSubmit}>
            Submit
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default observer(ErpSignupInfo);

const useStylesheet = () => {
  return StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    },
    formWrapper: {
      padding: "0px 48px",
      "@media (min-width: 1400px)": {
        maxWidth: 1024,
      },
      "@media (max-width: 1400px)": {
        alignSelf: "stretch",
      },
    },
    item: {
      marginTop: 32,
    },
    title: {
      fontSize: 24,
      fontWeight: weightBold,
      lineHeight: 1.33,
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      bottom: 0,
      overflowY: "hidden",
      marginTop: 36,
      zIndex: 2,
      boxShadow: "0 -2px 5px 0 rgba(63, 63, 68, 0.05)",
      padding: "24px 48px",
      backgroundColor: white,
    },
    footerContent: {
      display: "flex",
      justifyContent: "space-between",
      "@media (min-width: 1400px)": {
        maxWidth: 1024,
      },
      "@media (max-width: 1400px)": {
        alignSelf: "stretch",
      },
    },
  });
};
