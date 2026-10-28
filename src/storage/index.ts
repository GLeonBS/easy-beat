import Dexie, { type EntityTable } from 'dexie'

// Repositório da mesa salva (IndexedDB via Dexie). Só este módulo conhece o Dexie.
export interface SavedSlot {
  index: number
  fileName: string
  blob: Blob
  bars: 4 | 8
  savedAt: number
}

export interface SavedPad {
  index: number
  fileName: string
  blob: Blob
  savedAt: number
}

const db = new Dexie('easybeat') as Dexie & {
  slots: EntityTable<SavedSlot, 'index'>
  pads: EntityTable<SavedPad, 'index'>
}
db.version(1).stores({ slots: 'index', pads: 'index' })

export async function saveSlot(record: SavedSlot): Promise<void> {
  await db.slots.put(record)
}

export async function saveSlotBars(index: number, bars: 4 | 8): Promise<void> {
  await db.slots.update(index, { bars })
}

export async function savePad(record: SavedPad): Promise<void> {
  await db.pads.put(record)
}

export async function loadSaved(): Promise<{ slots: SavedSlot[]; pads: SavedPad[] }> {
  const [slots, pads] = await Promise.all([db.slots.toArray(), db.pads.toArray()])
  return { slots, pads }
}

export async function deleteSlot(index: number): Promise<void> {
  await db.slots.delete(index)
}

export async function deletePad(index: number): Promise<void> {
  await db.pads.delete(index)
}

export async function clearAll(): Promise<void> {
  await db.transaction('rw', db.slots, db.pads, async () => {
    await db.slots.clear()
    await db.pads.clear()
  })
}
