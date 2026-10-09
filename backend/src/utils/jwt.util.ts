import jwt from "jsonwebtoken";
export interface JwtPayload {
  userId: string;
  role: "DRIVER" | "RIDER";
  deviceId: string;
  iat: number;
  exp: number;
}

export const generateAccessToken = ( payload: Omit<JwtPayload, "iat" | "exp">) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (payload: Omit<JwtPayload, "iat" | "exp">) => { 
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "30d",
  });
}
