const Config = {
  salesforceCN: {
    customSalesforceUrl: process.env.NEXT_PUBLIC_SALESFORCE_CN_CUSTOM_URL,
    customWishUrl: process.env.NEXT_PUBLIC_SALESFORCE_CN_CUSTOM_WISH_URL,
    regionId: process.env.NEXT_PUBLIC_SALESFORCE_CN_REGION_ID,
    apiName: process.env.NEXT_PUBLIC_SALESFORCE_CN_API_NAME,
    baseLiveAgentContentURL:
      process.env.NEXT_PUBLIC_SALESFORCE_CN_BASE_LIVE_AGENT_CONTENT_URL,
    deploymentId: process.env.NEXT_PUBLIC_SALESFORCE_CN_DEPLOYMENT_ID,
    buttonId: process.env.NEXT_PUBLIC_SALESFORCE_CN_BUTTON_ID,
    baseLiveAgentURL: process.env.NEXT_PUBLIC_SALESFORCE_CN_BASE_LIVE_AGENT_URL,
    eswBaseLiveAgentDevName:
      process.env.NEXT_PUBLIC_SALESFORCE_CN_ESW_LIVE_AGENT_DEV_NAME,
  },
  salesforceUS: {
    customSalesforceUrl: process.env.NEXT_PUBLIC_SALESFORCE_US_CUSTOM_URL,
    customWishUrl: process.env.NEXT_PUBLIC_SALESFORCE_US_CUSTOM_WISH_URL,
    regionId: process.env.NEXT_PUBLIC_SALESFORCE_US_REGION_ID,
    apiName: process.env.NEXT_PUBLIC_SALESFORCE_US_API_NAME,
    baseLiveAgentContentURL:
      process.env.NEXT_PUBLIC_SALESFORCE_US_BASE_LIVE_AGENT_CONTENT_URL,
    deploymentId: process.env.NEXT_PUBLIC_SALESFORCE_US_DEPLOYMENT_ID,
    buttonId: process.env.NEXT_PUBLIC_SALESFORCE_US_BUTTON_ID,
    baseLiveAgentURL: process.env.NEXT_PUBLIC_SALESFORCE_US_BASE_LIVE_AGENT_URL,
    eswBaseLiveAgentDevName:
      process.env.NEXT_PUBLIC_SALESFORCE_US_ESW_LIVE_AGENT_DEV_NAME,
  },
};

export default Config;
