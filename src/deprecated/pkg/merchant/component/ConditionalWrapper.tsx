import React, { Fragment } from "react";
import { observer } from "mobx-react";

export type Props = {
  readonly condition: Boolean;
  readonly wrapper: React.FC;
  readonly altWrapper: React.FC;
  readonly children: React.ReactNode;
};

const ConditionalWrapper = ({
  condition,
  wrapper,
  altWrapper,
  children,
}: Props) =>
  condition === true && children != null
    ? wrapper(children || Fragment)
    : altWrapper(children || Fragment);

export default observer(ConditionalWrapper);
