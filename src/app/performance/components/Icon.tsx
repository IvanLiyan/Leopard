import { forwardRef } from "react";
import UnwrappedIcon, { IconProps } from "@core/components/Icon";

const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => (
  // extra div because Icon does not currently forward refs, changes required at the Zeus level
  <span ref={ref}>
    <UnwrappedIcon {...props} />
  </span>
));
Icon.displayName = "Icon";

export default Icon;
