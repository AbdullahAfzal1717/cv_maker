import jwt, { SignOptions } from "jsonwebtoken";

const expiresIn = (process.env.JWT_EXPIRE ?? "7d") as SignOptions["expiresIn"];

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn,
  });
}
