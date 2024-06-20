export const verifyOTP = (inputOTP: number, actualOTP: number, expiryTime: Date): { isValidOTP: boolean; isExpired: boolean } => {
    const isExpired = new Date() > expiryTime;
    return { isValidOTP: inputOTP === actualOTP, isExpired };
  };
  