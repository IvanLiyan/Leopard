export const formatPhoneNumber = (num: string): string => {
  num = num.replace(/\D/g, "");
  if (num.length == 10) {
    return num.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (num.length == 11) {
    return num.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "($1) $2-$3-$4");
  }
  return num;
};
