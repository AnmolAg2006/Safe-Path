import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function getAuthUser(token?: string) {
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };
  } catch {
    return null;
  }
}
