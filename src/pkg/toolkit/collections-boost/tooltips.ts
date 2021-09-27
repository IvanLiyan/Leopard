export const getRejectReasonDetail = (reason: string): string => {
  switch (reason) {
    case "INAPPROPRIATE_NAME":
      return i`Collection Name is inappropriate.`;
    case "INAPPROPRIATE_LOGO":
      return i`Collection Logo is inappropriate.`;
    case "INAPPROPRIATE_PRODUCTS":
      return i`Collection contains inappropriate products.`;
    case "INAPPROPRIATE_SEARCH_TERMS":
      return i`Collection contains inappropriate search terms.`;
  }
  return i`Unknown Reject Reason.`;
};

// Cancellation reason for campaigns
export const getCancelReasonDetail = (reason: string): string => {
  switch (reason) {
    case "INSUFFICIENT_PRODUCTS":
      return i`The campaign contains less than ${5} active products.`;
  }
  return i`Unknown Cancellation Reason`;
};
