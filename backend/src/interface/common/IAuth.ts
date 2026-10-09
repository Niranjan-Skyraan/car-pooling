export interface IOtp {
  contactNumber: string;
  otp?: string;
  countryCode?: string;
  purpose: "SIGNUP" | "LOGIN";
}

export interface ISignupLogin extends IOtp {
  deviceId: string;
  deviceType: "ANDROID" | "IOS" | null;
  deviceToken: string | null;
  name?: string;
}
