/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const devcert = require("devcert");
const fs = require("fs");

devcert
  .certificateFor("leopard.wish.com", { getCaPath: true })
  .then(({ key, cert, caPath }) => {
    fs.writeFileSync("./certs/devcert.key", key);
    fs.writeFileSync("./certs/devcert.cert", cert);
    fs.writeFileSync("./certs/.capath", caPath);
  })
  .catch(console.error);
