export default class CampaignRestrictions {
  maxAllowedSpending: number | null | undefined;
  isPayable: boolean | null | undefined;

  constructor(params?: {
    maxAllowedSpending?: number;
    isPayable?: boolean;
    defaultBid?: number;
    enrollmentFee?: number;
  }) {
    if (params) {
      this.maxAllowedSpending = params.maxAllowedSpending;
      this.isPayable = params.isPayable;
    }
  }
}
