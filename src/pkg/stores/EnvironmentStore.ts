const merchantEnvs = [
  "dev",
  "stage",
  "testing",
  "fe_qa_staging",
  "fe_prod",
  "sandbox",
] as const;
type MerchantEnv = typeof merchantEnvs[number];

const _env = process.env.ENV || process.env.NEXT_PUBLIC_ENV;

if (
  typeof _env === "undefined" ||
  !merchantEnvs.includes(_env as MerchantEnv)
) {
  throw `Missing or incorrect ENV: check that .env file is complete (provided ${_env})`;
}

// note cast is safe: see above check
export const env: MerchantEnv = _env as MerchantEnv;
export const isDev = ["stage", "dev"].includes(env);
export const isTesting = ["testing"].includes(env);
export const isSandbox = ["sandbox"].includes(env);
export const isStaging = ["fe_qa_staging", "stage"].includes(env);
export const isProd = ["testing", "fe_prod"].includes(env);

type EnvironmentStore = {
  env: MerchantEnv;
  isDev: boolean;
  isTesting: boolean;
  isSandbox: boolean;
  isStaging: boolean;
  isProd: boolean;
};

export const useEnvironmentStore = (): EnvironmentStore => {
  return {
    env,
    isDev,
    isTesting,
    isSandbox,
    isStaging,
    isProd,
  };
};

const LegacyEnvironmentStoreMock = {
  instance: (): EnvironmentStore => {
    return {
      env,
      isDev,
      isTesting,
      isSandbox,
      isStaging,
      isProd,
    };
  },
};

export default LegacyEnvironmentStoreMock;
