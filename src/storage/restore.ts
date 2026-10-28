// Ordem de restauração: a mesma em que os áudios foram carregados, para o primeiro voltar a definir o BPM da mesa.
export function restoreOrder<T extends { savedAt: number }>(records: readonly T[]): T[] {
  return [...records].sort((a, b) => a.savedAt - b.savedAt)
}
