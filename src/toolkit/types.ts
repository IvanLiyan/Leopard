import React from "react";
import { Style } from "@toolkit/styling";

export type BaseProps = {
  readonly style?: Style;
  readonly children?: React.ReactNode;
};

export type BasePropsNoChildren = Omit<BaseProps, "children">;

export type HTMLNodeProps<T extends HTMLElement> = React.DetailedHTMLProps<
  React.HTMLAttributes<T>,
  T
>;
export type CleanedHTMLNodeProps<T extends HTMLElement> = Omit<
  HTMLNodeProps<T>,
  "ref" | "className" | "style" | "css" | "align"
>;

export type BaseDivProps = CleanedHTMLNodeProps<HTMLDivElement>;

export type BaseImageProps = HTMLNodeProps<HTMLImageElement>;
export type BaseAnchorProps = HTMLNodeProps<HTMLAnchorElement>;
export type BaseArticleProps = HTMLNodeProps<HTMLElement>;
export type BaseSelectProps = HTMLNodeProps<HTMLSelectElement>;

export type CleanedBaseDivProps = CleanedHTMLNodeProps<HTMLDivElement>;
export type CleanedBaseImageProps = CleanedHTMLNodeProps<HTMLImageElement>;
export type CleanedBaseAnchorProps = CleanedHTMLNodeProps<HTMLAnchorElement>;
export type CleanedBaseArticleProps = CleanedHTMLNodeProps<HTMLElement>;
