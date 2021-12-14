//
//  component/modal/Modal.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 10/31/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable no-console */
import React, { Component, ReactNode } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, runInAction, action } from "mobx";

/* External Libraries */
import ReactDOM from "react-dom";
import { EventEmitter } from "fbemitter";
import { ApolloProvider } from "@apollo/client";

/* Lego Components */
import Toast from "@merchant/component/core/Toast";
import { StaggeredFadeIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Relative Imports */
import ModalHeader from "./ModalHeader";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ModalHeaderProps } from "./ModalHeader";
import DeviceStore from "@stores/DeviceStore";
import ToastStore from "@stores/ToastStore";
import ThemeStore, { ThemeWrapper } from "@stores/ThemeStore";
import ApolloStore from "@stores/ApolloStore";

export type OnDismissFn = () => unknown;
export type OnCloseFn = () => unknown;
export type RenderFn = (onClose: OnCloseFn) => ReactNode;

export const MODAL_Z_INDEX = 999999;

type ModalContainerProps = BaseProps & {
  readonly header: null | ModalHeaderProps | undefined;
  readonly onClose: OnCloseFn;
  readonly emitter: EventEmitter | undefined;
  readonly widthPerc: number;
  readonly topPerc: number;
  readonly noBackground: boolean;
  readonly noMaxHeight: boolean;
  readonly maxHeight: number | undefined;
  readonly overflowY: CSSProperties["overflowY"];
  readonly renderFooter: undefined | (() => ReactNode);
  readonly contentOverflow: null | CSSProperties["overflow"];
};

@observer
class ModalContainer extends Component<ModalContainerProps> {
  legoTheme = ThemeStore.instance().currentLegoTheme();

  @observable
  exiting = false;

  @observable
  contentVisible = true;

  timeoutID: undefined | ReturnType<typeof setTimeout>;

  contentRef: undefined | HTMLDivElement | null;

  subscription: undefined | any;

  componentDidMount() {
    const { emitter } = this.props;
    window.addEventListener("keyup", this.handleKeyUp, false);
    this.subscription = emitter?.addListener("willclose", () => {
      this.exiting = true;
    });
  }

  componentWillUnmount() {
    const { timeoutID } = this;
    if (timeoutID != null) {
      clearTimeout(timeoutID);
    }

    window.removeEventListener("keyup", this.handleKeyUp, false);
    if (this.subscription != null) {
      this.subscription.remove();
    }
  }

  handleKeyUp = (e: KeyboardEvent) => {
    const { onClose } = this.props;
    if (e.keyCode === 27) {
      e.preventDefault();
      onClose();
    }
  };

  handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {
      props: { onClose },
      contentRef,
    } = this;
    if (contentRef == null) {
      return;
    }

    const target = e.target as HTMLElement;

    // close this modal when clicking the root of the modal,
    // which is covered on the back drop, and beneath the modal content
    if (target.getAttribute("dataid") == "modalroot") {
      onClose();
    }
  };

  @computed
  get styles() {
    const contentKeyframes = {
      from: {
        opacity: 0.6,
        transform: "scale3d(1.03, 1.03, 1.03)",
      },

      to: {
        opacity: 1,
        transform: "scale3d(1, 1, 1)",
      },
    };

    const contentExitKeyframes = {
      from: {
        opacity: 1,
        transform: "scale3d(1, 1, 1)",
      },

      to: {
        opacity: 0,
        transform: "scale3d(1.03, 1.03, 1.03)",
      },
    };

    const {
      widthPerc,
      topPerc,
      noBackground,
      noMaxHeight,
      maxHeight,
      overflowY,
      contentOverflow,
    } = this.props;

    const deviceStore = DeviceStore.instance();

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "fixed",
        top: `${Math.round(topPerc * 100)}%`,
        left: 0,
        right: 0,
        bottom: 0,
        fontFamily: fonts.proxima,
        zIndex: MODAL_Z_INDEX,
      },
      modalContent: {
        display: "flex",
        margin: deviceStore.isSmallScreen ? "0" : "0px 15px",
        position: "relative",
        flexDirection: "column",
        alignItems: "stretch",
        backgroundColor: !noBackground ? this.legoTheme.textWhite : undefined,
        borderRadius: !noBackground ? 6 : undefined,
        overflow: contentOverflow || "hidden",
        animationDuration: "200ms",
        animationFillMode: "forwards",
        width: `${Math.round(widthPerc * 100)}%`,
      },
      toastContainer: {
        position: "relative",
        alignSelf: "stretch",
      },
      body: {
        // A scrollbar will flash out because the StaggeredFadeIn
        // Passing in overflowY="hidden" fixes it.
        overflowY: overflowY != null ? overflowY : "auto",
        maxHeight: (!noMaxHeight && (maxHeight || 670)) || undefined,
      },
      contentEntrance: {
        animationDuration: "350ms",
        animationName: [contentKeyframes],
      },
      contentExit: {
        animationDuration: "350ms",
        animationName: [contentExitKeyframes],
      },
      footer: {},
    });
  }

  render() {
    const { children, className } = this.props;
    const {
      props: { header, onClose, renderFooter },
      contentVisible,
      exiting,
    } = this;

    if (!contentVisible) {
      return null;
    }

    return (
      <ThemeWrapper>
        <div
          className={css(this.styles.root, className)}
          onClick={this.handleOutsideClick}
          // @ts-ignore dataid is here so we can identify this node
          // in handleOutsideClick.
          // TODO: use ref instead
          dataid="modalroot"
        >
          <div
            className={css(
              this.styles.modalContent,
              exiting ? this.styles.contentExit : this.styles.contentEntrance,
            )}
            ref={(_) => (this.contentRef = _)}
          >
            <ModalHeader {...header} onClose={onClose} />
            <div className={css(this.styles.toastContainer)}>
              <Toast insideModal />
            </div>
            <div className={css(this.styles.body)}>
              <StaggeredFadeIn
                animationDurationMs={150}
                animationDelayMs={100}
                deltaY={5}
              >
                {children}
              </StaggeredFadeIn>
            </div>
            {renderFooter && renderFooter()}
          </div>
        </div>
      </ThemeWrapper>
    );
  }
}

export default class Modal {
  renderFn: undefined | RenderFn;
  emitter: undefined | EventEmitter;
  container: undefined | HTMLDivElement;
  headerProps: undefined | null | ModalHeaderProps;
  widthPerc = 0.26;
  topPerc = 0.05;
  noMaxHeight = false;
  maxHeight = 670;
  noBackground = false;
  overflowY: CSSProperties["overflowY"] | undefined;
  contentOverflow: CSSProperties["overflow"] | undefined;
  renderFooter: undefined | (() => ReactNode);
  onDismiss: undefined | OnDismissFn;

  modalClosed = true;

  constructor(renderFn: RenderFn) {
    this.renderFn = renderFn;
    this.container = document.createElement("div");
    this.emitter = new EventEmitter();

    const { isSmallScreen } = DeviceStore.instance();
    if (isSmallScreen) {
      // Use as much space as possible on a small screen.
      this.setWidthPercentage(0.95);
    }
  }

  setHeader(headerProps: ModalHeaderProps): this {
    this.headerProps = headerProps;
    return this;
  }

  setWidthPercentage(widthPercentage: number): this {
    let widthPerc = widthPercentage;
    if (widthPerc > 1) {
      widthPerc = widthPerc / 100;
    }

    const { isSmallScreen } = DeviceStore.instance();
    if (isSmallScreen && widthPerc < 0.95) {
      // Use as much space as possible on a small screen.
      // Dont allow width to be set smaller.
      return this;
    }

    this.widthPerc = widthPerc;
    return this;
  }

  setTopPercentage(topPercentage: number): this {
    let topPerc = topPercentage;
    if (topPerc > 1) {
      topPerc = topPerc / 100;
    }

    this.topPerc = topPerc;
    return this;
  }

  setNoMaxHeight(noMaxHeight: boolean): this {
    this.noMaxHeight = noMaxHeight;
    return this;
  }

  setMaxHeight(maxHeight: number): this {
    this.maxHeight = maxHeight;
    return this;
  }

  setOverflowY(overflowY: CSSProperties["overflowY"]): this {
    this.overflowY = overflowY;
    return this;
  }

  setContentOverflow(overflow: CSSProperties["overflow"]): this {
    this.contentOverflow = overflow;
    return this;
  }

  setNoBackground(noBackground: boolean): this {
    this.noBackground = noBackground;
    return this;
  }

  setRenderFooter(renderFooter: () => ReactNode): this {
    this.renderFooter = renderFooter;
    return this;
  }

  setOnDismiss(onDismiss: OnDismissFn): this {
    this.onDismiss = onDismiss;
    return this;
  }

  renderContent() {
    const { renderFn } = this;
    if (!renderFn) {
      return null;
    }
    return renderFn(() => this.close());
  }

  @action
  render(): this {
    if (!this.modalClosed) {
      return this;
    }

    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    toastStore.modalOpen = true;
    this.modalClosed = false;

    const Content: React.FC = observer(() => <>{this.renderContent()}</>);

    if (this.container != null) {
      ReactDOM.render(
        (
          <ApolloProvider client={client}>
            <ModalContainer
              header={this.headerProps}
              widthPerc={this.widthPerc}
              topPerc={this.topPerc}
              noBackground={this.noBackground}
              noMaxHeight={this.noMaxHeight}
              maxHeight={this.maxHeight}
              overflowY={this.overflowY}
              contentOverflow={this.contentOverflow}
              onClose={() => this.close()}
              emitter={this.emitter}
              renderFooter={this.renderFooter}
            >
              <Content />
            </ModalContainer>
          </ApolloProvider>
        ) as any,
        this.container,
      );
    }

    if (this.container != null) {
      ($(this.container) as any).modal({
        fadeDuration: 800,
      });
    }

    const backdrop = document.getElementsByClassName("modal-backdrop");
    if (backdrop.length > 0) {
      backdrop[0].classList.add("lego-modal-backdrop");
    }

    return this;
  }

  hide() {
    if (this.container != null) {
      // jquery modal is an add-on library, not
      // part of core jquery
      ($(this.container) as any).modal("hide");
    }
  }

  show() {
    if (this.container != null) {
      // jquery modal is an add-on library, not
      // part of core jquery
      ($(this.container) as any).modal("show");
    }
    const backdrop = document.getElementsByClassName("modal-backdrop");
    if (backdrop.length > 0) {
      backdrop[0].classList.add("lego-modal-backdrop");
    }
  }

  close() {
    if (this.modalClosed) {
      return;
    }

    this.modalClosed = true;
    this.emitter?.emit("willclose");
    setTimeout(() => {
      const { container } = this;
      if (container != null) {
        ($(container) as any).modal("hide");
        ReactDOM.unmountComponentAtNode(container);
      }

      runInAction(() => {
        const toastStore = ToastStore.instance();
        toastStore.modalOpen = false;
      });
      if (typeof this.onDismiss === "function") {
        this.onDismiss();
      }
      this.emitter?.emit("didclose");
    }, 200);
  }
}
