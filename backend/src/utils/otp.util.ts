import crypto from "crypto";

export const generateOtp = (length = 6): string => {
  const min = 10 ** (length - 1);
  const max = 10 ** length;

  return crypto.randomInt(min, max).toString();
};
