import { auth } from "@clerk/nextjs/server"
import { getDB } from "@/lib/mongodb"

export async function POST(req: Request) {
  const { userId } =await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const db = await getDB()

  await db.collection("routes").insertOne({
    ...body,
    userId,
    createdAt: new Date(),
  })

  return Response.json({ success: true })
}
