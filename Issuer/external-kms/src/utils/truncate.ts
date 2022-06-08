export function truncate(str: string) {
  const length = str.length;
  return `${str.substring(0, 4)}...${str.substring(length-4, length)}`
}