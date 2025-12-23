export function sampleRoute(
  route: [number, number][],
  step = 15
): [number, number][] {
  if (!route.length) return []

  const samples: [number, number][] = []

  for (let i = 0; i < route.length; i += step) {
    samples.push(route[i])
  }

  // always include last point
  samples.push(route[route.length - 1])

  return samples
}
