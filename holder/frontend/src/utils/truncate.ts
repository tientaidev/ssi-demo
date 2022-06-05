export const truncate = (string: string): string => {
  let array: string[] = string.split(':');
  const pubKey = array.pop() as string;
  const truncatedPubKey = `${pubKey.substring(0, 4)}...${pubKey.substring(pubKey.length - 4, pubKey.length)}`
  return array.concat(truncatedPubKey).join(':')
} 