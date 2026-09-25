const TONES = ["#F1DCC9", "#D9EAE6", "#EFE4CE", "#E8C7B0", "#EAD9E0"];

export function toneForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return TONES[hash % TONES.length];
}
