"use client"

import { toPng } from "html-to-image"

export default function RouteImageExport({
  targetId,
}: {
  targetId: string
}) {
  const downloadImage = async () => {
    const node = document.getElementById(targetId)
    if (!node) return

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
      })

      const link = document.createElement("a")
      link.download = "safepath-route.png"
      link.href = dataUrl
      link.click()
    } catch {
      alert("Failed to export image")
    }
  }

  return (
    <button
      onClick={downloadImage}
      className="flex-1 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
    >
      🖼️ Download Image
    </button>
  )
}
