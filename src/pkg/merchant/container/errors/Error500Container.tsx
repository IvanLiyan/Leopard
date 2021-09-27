import React from "react";
import { observer } from "mobx-react";

import Error500 from "@merchant/component/errors/Error500";

const Error500Container = () => <Error500 />;

export default observer(Error500Container);
