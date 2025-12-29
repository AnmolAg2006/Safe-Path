export const runtime = "nodejs"

import { auth } from "@clerk/nextjs/server"
import { getDB } from "@/lib/mongodb"

export async function GET() {
  console.log("➡️ /api/routes/list called")

  try {
    const { userId } = await auth()   // 🔥 FIX IS HERE

    console.log("UserId:", userId)

    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const db = await getDB()

    const routes = await db
      .collection("routes")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    const safeRoutes = routes.map((r) => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt?.toISOString(),
    }))

    return Response.json(safeRoutes)
  } catch (err) {
    console.error("🔥 Route list error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
