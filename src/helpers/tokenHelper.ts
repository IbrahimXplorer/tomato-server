import jwt from "jsonwebtoken";

interface UserPayload {
  _id: string;
  role: string;
}

interface TokenResult {
  accessToken: string;
  refreshToken: string;
}

export const generateToken = (user: UserPayload): TokenResult => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
};
