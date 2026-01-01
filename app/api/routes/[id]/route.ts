import { auth } from "@clerk/nextjs/server"
import { getDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ auth() RETURNS A PROMISE IN YOUR SETUP
  const { userId } = await auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  // ✅ params must be awaited (Next.js 14+)
  const { id } = await context.params

  const db = await getDB()

  await db.collection("routes").deleteOne({
    _id: new ObjectId(id),
    userId,
  })

  return Response.json({ success: true })
}
