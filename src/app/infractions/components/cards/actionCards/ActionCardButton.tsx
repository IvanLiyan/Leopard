/*
    This wraps Atas's <Button /> component and serves to disable the action
    if any action has already been taken on the given infraction.
*/

import React from "react";
import { observer } from "mobx-react";
import {
  Button as AtlasButton,
  ButtonProps,
  Tooltip,
  TooltipProps,
} from "@ContextLogic/atlas-ui";
import { useInfractionContext } from "@infractions/InfractionContext";

const ActionCardButton: React.FC<
  ButtonProps & {
    readonly tooltipTitle?: TooltipProps["title"];
  }
> = ({ tooltipTitle: titleProp, disabled: disabledProp, ...rest }) => {
  const {
    infraction: { actionsTaken, disputeDeadlineUnix },
  } = useInfractionContext();

  const hasTakenAction = actionsTaken.length > 0;
  const nowUnix = Date.now() / 1000;
  const disputeDeadlinePassed = nowUnix > disputeDeadlineUnix;
  const title = hasTakenAction
    ? i`You have already taken action on this infraction.`
    : disputeDeadlinePassed
    ? i`You cannot take this action because the dispute deadline has passed.`
    : titleProp;
  const disabled = disabledProp || hasTakenAction || disputeDeadlinePassed;

  const Button = () => <AtlasButton disabled={disabled} {...rest} />;

  return title ? (
    <Tooltip title={title} placement="bottom">
      {disabled ? (
        // excess div required since Mui disables tooltips wrapping disabled buttons
        <div>
          <Button />
        </div>
      ) : (
        <Button />
      )}
    </Tooltip>
  ) : (
    <Button />
  );
};

export default observer(ActionCardButton);