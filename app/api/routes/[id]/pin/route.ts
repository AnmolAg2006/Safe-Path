import { auth } from "@clerk/nextjs/server"
import { getDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { id } = await context.params

  const db = await getDB()

  // 1️⃣ Find route first
  const route = await db.collection("routes").findOne({
    _id: new ObjectId(id),
    userId,
  })

  if (!route) {
    return new Response("Not Found", { status: 404 })
  }

  // 2️⃣ Toggle pin
  await db.collection("routes").updateOne(
    { _id: route._id },
    { $set: { pinned: !route.pinned } }
  )

  return Response.json({
    success: true,
    pinned: !route.pinned,
  })
}
