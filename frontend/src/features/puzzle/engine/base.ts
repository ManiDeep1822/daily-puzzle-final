export function seededRandom(seed: number): () => number {
  let value = seed % 2147483647

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}
