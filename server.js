/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const { createServer } = require("https");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const hostname = "leopard.corp.contextlogic.com";
const port = 443;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync("./certs/devcert.key"),
  cert: fs.readFileSync("./certs/devcert.cert"),
};

app.prepare().then(() => {
  createServer(options, (req, res) => handle(req, res)).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${hostname}/md`);
    console.log(`> Log in through https://${hostname}/md/dev-login`);
  });
});
