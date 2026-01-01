import { auth } from "@clerk/nextjs/server"
import { getDB } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const db = await getDB()

  const routes = await db
    .collection("routes")
    .find({ userId })
    .sort({ pinned: -1, createdAt: -1 })
    .toArray()

  // ✅ MAP DB → FRONTEND SHAPE
  const mappedRoutes = routes.map((r) => ({
    _id: r._id.toString(),

    from: r.origin,          // 🔥 FIX
    to: r.destination,       // 🔥 FIX

    distanceKm: r.distanceKm,
    riskZones: r.riskZones ?? 0,
    explanation: r.explanation,
    createdAt: r.createdAt,
    pinned: r.pinned ?? false,
  }))

  return NextResponse.json(mappedRoutes)
}
