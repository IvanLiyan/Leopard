import React from "react";

import Error403 from "@merchant/component/errors/Error403";
import Error404 from "@merchant/component/errors/Error404";
import Error500 from "@merchant/component/errors/Error500";

type Props = {
  readonly status: 403 | 404 | 500;
};

const HttpError: React.FC<Props> = ({ status }: Props) => {
  if (status == 403) {
    return <Error403 />;
  }

  if (status == 404) {
    return <Error404 />;
  }

  if (status == 500) {
    return <Error500 />;
  }

  return null;
};

export default HttpError;
