#!/usr/bin/env node
/**
 * Generates JWT keys for @convex-dev/auth and sets Convex env vars.
 * Run: npm run auth:setup
 */
import { execSync } from "child_process"
import { mkdtempSync, writeFileSync, rmSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { exportJWK, exportPKCS8, generateKeyPair } from "jose"

function setEnvVar(name, value) {
  // `--` stops the CLI from treating PEM/header text as flags.
  const valueEscaped = value.replace(/"/g, '\\"')
  execSync(`npx convex env set -- ${name} "${valueEscaped}"`, {
    stdio: "inherit",
    shell: true,
  })
}

function setEnvVarFromFile(name, value) {
  const dir = mkdtempSync(join(tmpdir(), "nightfall-auth-"))
  const file = join(dir, name)
  try {
    writeFileSync(file, value, "utf8")
    execSync(`npx convex env set ${name} --from-file "${file}"`, {
      stdio: "inherit",
      shell: true,
    })
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const keys = await generateKeyPair("RS256")
const privateKey = await exportPKCS8(keys.privateKey)
const publicKey = await exportJWK(keys.publicKey)
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] })
const jwtPrivateKey = privateKey.trimEnd().replace(/\n/g, " ")

console.log("Setting Convex Auth environment variables…\n")

setEnvVarFromFile("JWT_PRIVATE_KEY", jwtPrivateKey)
setEnvVarFromFile("JWKS", jwks)
setEnvVar("SITE_URL", "http://localhost:3000")

console.log("\nDone. Restart `npm run convex:dev` if it is running, then try signing in again.")
