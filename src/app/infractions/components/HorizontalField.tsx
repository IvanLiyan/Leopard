import React from "react";
import { observer } from "mobx-react";
import { Text, TextProps, Tooltip } from "@ContextLogic/atlas-ui";
import Icon from "@core/components/Icon";
import {
  HorizontalField as LegoHorizontalField,
  HorizontalFieldProps,
} from "@ContextLogic/lego";

export type Props = Omit<HorizontalFieldProps, "title"> & {
  readonly title: TextProps["children"];
  readonly info?: string;
};

const HorizontalField: React.FC<Props> = ({
  title,
  info,
  titleAlign = "start",
  ...props
}) => {
  return (
    <LegoHorizontalField
      title={() => (
        <>
          <Text variant="bodyMStrong">{title}</Text>
          {info && (
            <Tooltip title={info} placement="bottom">
              {/* extra div required for ref */}
              <div>
                <Icon
                  name="info"
                  size="small"
                  style={{ alignSelf: "center", marginLeft: "6px" }}
                />
              </div>
            </Tooltip>
          )}
        </>
      )}
      titleAlign={titleAlign}
      {...props}
    />
  );
};

export default observer(HorizontalField);
