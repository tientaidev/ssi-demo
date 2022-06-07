import * as u8a from 'uint8arrays'

export function bytesToBase64url(b: Uint8Array): string {
  return u8a.toString(b, 'base64url')
}

export function encodeBase64url(s: string): string {
  return bytesToBase64url(u8a.fromString(s))
}