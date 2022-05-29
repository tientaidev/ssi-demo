export const truncate = (string: string): string => {
  let array: string[] = string.split(':');
  const pubKey: string = array.pop();
  const truncatedPubKey = `${pubKey.substring(0, 4)}...${pubKey.substring(pubKey.length - 4, pubKey.length)}`
  return array.concat(truncatedPubKey).join(':')
} 