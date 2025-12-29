import { auth } from "@clerk/nextjs/server"
import { getDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const db = await getDB()

  const route = await db.collection("routes").findOne({
    _id: new ObjectId(params.id),
    userId,
  })

  await db.collection("routes").updateOne(
    {
      _id: new ObjectId(params.id),
      userId,
    },
    {
      $set: { pinned: !route?.pinned },
    }
  )

  return Response.json({ success: true })
}
