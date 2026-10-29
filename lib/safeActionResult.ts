import { flattenValidationErrors, isNavigationError } from "next-safe-action"

/** Throw on server/validation errors; return data on success. */
export function unwrapSafeActionResult<T>(result: {
  data?: T
  serverError?: string
  validationErrors?: unknown
}): T {
  if (result.serverError) {
    throw new Error(result.serverError)
  }

  if (result.validationErrors) {
    try {
      const flat = flattenValidationErrors(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result.validationErrors as any,
      )
      const first =
        flat.formErrors[0] ??
        Object.values(flat.fieldErrors).flat().find(Boolean) ??
        "Invalid input"
      throw new Error(String(first))
    } catch (err) {
      if (err instanceof Error && err.message !== "Invalid input") throw err
      throw new Error("Invalid input")
    }
  }

  if (result.data === undefined) {
    throw new Error("Action returned no data")
  }

  return result.data
}

export { isNavigationError }
