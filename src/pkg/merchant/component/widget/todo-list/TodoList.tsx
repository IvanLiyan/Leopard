import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { StaggeredFadeIn, Text, Layout, H5Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Relative Imports */
import TodoListItem from "./TodoListItem";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { ThemeWrapper } from "@merchant/stores/ThemeStore";

export type TodoListProps = BaseProps & {
  readonly useNewHomePage?: boolean;
};

@observer
export default class TodoList extends Component<TodoListProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        paddingLeft: 25,
        paddingBottom: 25,
      },
      heading: {
        color: palettes.textColors.Ink,
        fontSize: 24,
        lineHeight: "32px",
        marginBottom: 16,
      },
      headingV2: {
        margin: "5px 0px",
      },
      item: {
        boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
        marginBottom: 8,
      },
      loading: {
        marginLeft: 25,
        marginBottom: 25,
        maxWidth: 200,
      },
    });
  }

  render() {
    const { useNewHomePage = false, className, style } = this.props;

    const {
      todoStore: { fetchedItems, visibleTodoItems },
    } = AppStore.instance();
    if (!fetchedItems || visibleTodoItems.length == 0) {
      return null;
    }

    return (
      <ThemeWrapper>
        <StaggeredFadeIn deltaY={-10} animationDurationMs={350}>
          <Layout.FlexColumn
            className={css(
              !useNewHomePage && this.styles.root,
              className,
              style
            )}
            alignItems="stretch"
          >
            {useNewHomePage ? (
              <H5Markdown
                className={css(this.styles.headingV2)}
                text={`**Things to do**`}
              />
            ) : (
              <Text weight="bold" className={css(this.styles.heading)}>
                Things to do
              </Text>
            )}
            {visibleTodoItems.map((item) => {
              return (
                <TodoListItem
                  item={item}
                  key={item.id}
                  className={css(this.styles.item)}
                />
              );
            })}
          </Layout.FlexColumn>
        </StaggeredFadeIn>
      </ThemeWrapper>
    );
  }
}
