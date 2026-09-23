// Mã cốp khó đoán: sinh bằng crypto (không dùng Math.random).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ ký tự dễ nhầm: I O 0 1
const LENGTH = 10;

export function generateCopCode(): string {
  const bytes = new Uint8Array(LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < LENGTH; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
    if (i === 4) out += "-";
  }
  return `NGOC-${out}`;
}
