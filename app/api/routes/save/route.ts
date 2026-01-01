import { auth } from "@clerk/nextjs/server"
import { getDB } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()

  // ✅ FIXED validation
  if (!body.origin || !body.destination) {
    return NextResponse.json(
      { error: "Invalid route data" },
      { status: 400 }
    )
  }

  const db = await getDB()

  const existing = await db.collection("routes").findOne({
    userId,
    origin: body.origin,
    destination: body.destination,
  })

  if (existing) {
    await db.collection("routes").updateOne(
      { _id: existing._id },
      {
        $set: {
          distanceKm: body.distanceKm,
          riskZones: body.riskZones,
          explanation: body.explanation,
          createdAt: new Date(),
        },
      }
    )

    return NextResponse.json({
      success: true,
      id: existing._id.toString(),
      updated: true,
    })
  }

  const result = await db.collection("routes").insertOne({
    origin: body.origin,
    destination: body.destination,
    distanceKm: body.distanceKm,
    riskZones: body.riskZones,
    explanation: body.explanation,
    userId,
    pinned: false,
    createdAt: new Date(),
  })

  return NextResponse.json({
    success: true,
    id: result.insertedId.toString(),
    created: true,
  })
}
