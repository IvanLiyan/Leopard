import React from "react";
import { observer } from "mobx-react";

import Error403 from "@merchant/component/errors/Error403";

const Error403Container = () => <Error403 />;

export default observer(Error403Container);
