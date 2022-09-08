/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type CancelCurrencyConversionParams = {};
export type RequestCurrencyConversionParams = {
  readonly currency_code: string;
  readonly currency_rate: number;
  readonly effective_date: string;
};
export type FetchCurrencyInformationParams = {};

export type CancelCurrencyConversionResponse = {};
export type RequestCurrencyConversionResponse = {};
export type FetchCurrencyInformationResponse = {
  readonly current_currency: string;
  readonly pending_currency: string | null | undefined;
  readonly allowed_migration_code: string | null | undefined;
  readonly conversion_rate: number | null | undefined;
  readonly start_date: string | null | undefined;
  readonly end_date: string | null | undefined;
};

export const cancelCurrencyConversion = (
  args: CancelCurrencyConversionParams
): MerchantAPIRequest<
  CancelCurrencyConversionParams,
  CancelCurrencyConversionResponse
> => new MerchantAPIRequest("currency/cancel-conversion", args);

export const requestCurrencyConversion = (
  args: RequestCurrencyConversionParams
): MerchantAPIRequest<
  RequestCurrencyConversionParams,
  RequestCurrencyConversionResponse
> => new MerchantAPIRequest("currency/request-conversion", args);

export const fetchCurrencyInformation = (
  args: FetchCurrencyInformationParams
): MerchantAPIRequest<
  FetchCurrencyInformationParams,
  FetchCurrencyInformationResponse
> => new MerchantAPIRequest("currency/get-info", args);
