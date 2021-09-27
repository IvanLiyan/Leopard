/* React, Mobx and Aphrodite */
import * as React from "react";

/* External Libraries */
import { observable, action } from "mobx";
import { observer } from "mobx-react";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type FetcherRenderProps<D> = {
  readonly loading: boolean;
  readonly data: D | null | undefined;
  readonly page: number;
  readonly loadPage: (newPage: number) => void;
};

type FetcherProps<B, D> = {
  readonly request: MerchantAPIRequest<B, D>;
  readonly children: (arg0: FetcherRenderProps<D>) => React.ReactNode;
};

// This is similar to Fetcher, but it has built-in support for pagination
// by passing a `loadPage` callback prop to the child.

@observer
class PaymentDetailsTableFetcher<B, D> extends React.Component<
  FetcherProps<B, D>
> {
  @observable
  page = 0;

  @observable
  request: MerchantAPIRequest<B, D> = this.props.request;

  @action
  loadPage = (newPage: number) => {
    this.page = newPage;
    this.request = new MerchantAPIRequest<B, D>(this.request.path, ({
      ...this.request.body,
      page: newPage,
    } as unknown) as B);
  };

  render() {
    const { children } = this.props;
    const loading = this.request?.response == null;

    return children({
      page: this.page,
      data: this.request?.response?.data || null,
      loading,
      loadPage: this.loadPage,
    });
  }
}
export default PaymentDetailsTableFetcher;
