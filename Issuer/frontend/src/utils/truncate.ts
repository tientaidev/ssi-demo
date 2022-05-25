export const truncate = (string: String): String => {
  let array: String[] = string.split(':');
  const pubKey: String = array.pop();
  const truncatedPubKey = `${pubKey.substring(0, 4)}...${pubKey.substring(pubKey.length - 4, pubKey.length)}`
  return array.concat(truncatedPubKey).join(':')
} 