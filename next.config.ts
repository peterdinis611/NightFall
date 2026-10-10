import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Avoid picking up a parent lockfile as the workspace root
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig
