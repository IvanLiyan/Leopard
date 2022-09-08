// this component is imported instead of next/image due to next/image being
// incompatible with SSG: https://github.com/vercel/next.js/discussions/19065
// we'll re-evaluate image optimization in the future (https://jira.wish.site/browse/MKL-58502)
import React from "react";
type BaseImageProps = React.ComponentPropsWithoutRef<"img">;

const Image: React.FC<
  Omit<BaseImageProps, "alt"> & Required<Pick<BaseImageProps, "alt">>
> = ({ alt, ...rest }) => {
  // splitting out alt required to pass alt required linter
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} {...rest} />;
};

export default Image;
