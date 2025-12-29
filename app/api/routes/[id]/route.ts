import { auth } from "@clerk/nextjs/server"
import { getDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const db = await getDB()

  await db.collection("routes").deleteOne({
    _id: new ObjectId(params.id),
    userId,
  })

  return Response.json({ success: true })
}
