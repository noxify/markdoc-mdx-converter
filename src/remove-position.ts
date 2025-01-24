export const removePosition = <T extends object>(
  obj: T,
  keys: Set<string>,
  visitedIn?: Set<unknown>,
): T => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (obj === null || typeof obj !== "object") return obj
  const visited = visitedIn ?? new Set()
  visited.add(obj)
  Object.entries(obj).forEach(([key, val]) => {
    if (keys.has(key)) {
      delete obj[key as keyof T]
    } else if (typeof val === "object" && !visited.has(val)) {
      removePosition(val, keys, visited)
    }
  })
  return obj
}
