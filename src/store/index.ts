import { atom } from 'jotai'

export const searchAtom = atom<string>('')
// Atoms
export const fromAyah = atom<number>(1)
export const toAyah = atom<number>(1) // Ubah dari 0 ke 1
export const sortOrder = atom<'asc' | 'desc'>('asc')
export const maxLength = atom<number | null>(null)
export const pending = atom<boolean>(false)
