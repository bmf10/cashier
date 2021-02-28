export const generateId = (prefix?: string): string => {
  const date = new Date()
  return prefix ? `${prefix}-${date.getTime()}` : `${date.getTime()}`
}
