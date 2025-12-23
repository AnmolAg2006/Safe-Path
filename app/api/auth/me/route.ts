import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getAuthUser } from "@/lib/middleware";

export async function GET() {
    const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

  const decoded = getAuthUser(token);

  if (!decoded) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(decoded.id).select(
    "fullName email initials isAadhaarVerified trustScore createdAt"
  );

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
