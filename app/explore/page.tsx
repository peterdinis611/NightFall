import { GalleryClient } from "@/components/gallery/GalleryClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Explore — sealed stories",
  description: "Public horror stories sealed by other readers.",
}

export default function ExplorePage() {
  return <GalleryClient />
}
