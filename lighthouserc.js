// https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
module.exports = {
  ci: {
    collect: {
      url: ["http://leopard:8080/hello-world"],
      settings: { chromeFlags: "--no-sandbox" },
      numberOfRuns: 1,
    },
    upload: {
      target: "filesystem",
      reportFilenamePattern: "lighthouse.report.%%EXTENSION%%",
      outputDir: "lhcireport",
    },
  },
};
