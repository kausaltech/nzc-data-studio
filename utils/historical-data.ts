// Check if historical data would be available since the given baseline year
export function areHistoricalYearsAvailable(baselineYear: number) {
  return baselineYear < new Date().getFullYear() - 1;
}
