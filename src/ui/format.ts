export function formatBpm(bpm: number): string {
  return (Math.round(bpm * 10) / 10).toLocaleString('pt-BR')
}
