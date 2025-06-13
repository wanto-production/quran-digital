'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React, { useEffect, useMemo } from 'react'
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import { Switch, Match } from '@/lib/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'
import { fromAyah, toAyah, sortOrder, maxLength, pending } from '@/store'
import { HiBookmark, HiMapPin, HiOutlineBookmark, HiPaintBrush, HiPaperClip } from 'react-icons/hi2'
import { queryClient } from './providers'
import { authClient } from '@/lib/auth-client'
import { LucideAlignHorizontalJustifyStart } from 'lucide-react'
import Link from 'next/link'

export interface SurahResponse {
  code: number
  status: string
  message: string
  data: SurahData
}

export interface SurahData {
  number: number
  sequence: number
  numberOfVerses: number
  name: {
    short: string
    long: string
    transliteration: {
      en: string
      id: string
    }
    translation: {
      en: string
      id: string
    }
  }
  revelation: {
    arab: string
    en: string
    id: string
  }
  tafsir: {
    id: string
  }
  preBismillah: null | {
    text: {
      arab: string
      transliteration: {
        en: string
      }
      translation: {
        en: string
        id: string
      }
    }
    audio: {
      primary: string
      secondary: string[]
    }
  }
  verses: Verse[]
}

export interface Verse {
  number: {
    inQuran: number
    inSurah: number
  }
  meta: {
    juz: number
    page: number
    manzil: number
    ruku: number
    hizbQuarter: number
    sajda:
      | boolean
      | {
          recommended: boolean
          obligatory: boolean
        }
  }
  text: {
    arab: string
    transliteration: {
      en: string
    }
  }
  translation: {
    en: string
    id: string
  }
  audio: {
    primary: string
    secondary: string[]
  }
  tafsir: {
    id: {
      short: string
      long: string
    }
  }
}

export function SurahHeader() {
  const [from, setFrom] = useAtom(fromAyah)
  const [to, setTo] = useAtom(toAyah)
  const [order, setOrder] = useAtom(sortOrder)
  const [range] = useAtom(maxLength)
  const [isPending] = useAtom(pending)

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value)
    if (val < 1) val = 1
    // Jika 'from' menjadi lebih besar dari 'to', sesuaikan 'from' ke 'to'
    if (val > to) val = to
    setFrom(val)
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value)
    if (val < 1) val = 1 // Minimal ayat 1
    setTo(val)
  }

  return (
    <header className="w-full shadow-md px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-semibold text-base sticky top-0 bg-white z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <label className="text-sm mb-1">Dari ayat:</label>
          <Input type="number" min={1} value={from} onChange={handleFromChange} className="w-32" />
        </div>
        <div className="flex flex-col">
          {isPending ? (
            <Skeleton className="w-32 h-8" />
          ) : (
            <>
              <label className="text-sm mb-1">Sampai ayat:</label>
              <Input
                type="number"
                min={1}
                max={range || 1}
                value={to}
                onChange={handleToChange}
                className="w-32"
              />
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Sort:</span>
        <Select value={order} onValueChange={(val) => setOrder(val as 'asc' | 'desc')}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}

export function SurahContainer({ id }: { id: number }) {
  const session = authClient.useSession()
  const {
    data: surah,
    isLoading: surahLoading,
    isError: surahError,
  } = useQuery<SurahResponse>({
    queryKey: ['surah', id],
    queryFn: () => fetch(`https://api.quran.gading.dev/surah/${id}`).then((res) => res.json()),
  })

  const {
    data: bookmark,
    isPending: bookmarkLoading,
    error: bookmarkError,
  } = useQuery({
    queryKey: ['bookmarks', id],
    queryFn: () =>
      fetch(`/api/bookmark/get?id=${surah?.data.number}.0&userId=${session.data?.user.id}`).then(
        (res) => res.json()
      ),
    enabled: !!surah?.data.number && !!session.data?.user.id,
  })

  const addBookmark = useMutation({
    mutationFn: async (props: { surah: string; id: number }) => {
      await fetch('/api/bookmark/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surah: props.surah,
          id: props.id,
        }),
      })

      queryClient.refetchQueries({ queryKey: ['bookmarks', id] })
    },
  })

  const deleteBookmark = useMutation({
    mutationFn: async (props: { id: string }) => {
      await fetch('/api/bookmark/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: props.id }),
      })

      queryClient.refetchQueries({ queryKey: ['bookmark', id] })
    },
  })

  const [from] = useAtom(fromAyah)
  const [to, setTo] = useAtom(toAyah)
  const [order] = useAtom(sortOrder)
  const [, setRange] = useAtom(maxLength)
  const [, setPending] = useAtom(pending)

  // Update to value based on number of verses
  useEffect(() => {
    if (surah?.data?.numberOfVerses && surah.data.numberOfVerses !== to) {
      setTo(surah.data.numberOfVerses)
    }
    if (surah?.data.verses) {
      setRange(surah.data.verses.length)
    }
    setPending(surahLoading)
  }, [surah, surahLoading])

  // Menggunakan useMemo untuk optimasi performa
  const filteredAyahs = useMemo(() => {
    if (!surah?.data?.verses) return []

    const verses = surah.data.verses
    // Pastikan range valid: from <= to
    const validFrom = Math.min(from, to)
    const validTo = Math.max(from, to)

    const filtered = verses.filter(
      (ayah) => ayah.number.inSurah >= validFrom && ayah.number.inSurah <= validTo
    )

    return filtered.sort((a, b) =>
      order === 'asc' ? a.number.inSurah - b.number.inSurah : b.number.inSurah - a.number.inSurah
    )
  }, [surah, from, to, order]) // Tambahkan dependencies

  return (
    <Switch>
      <Match when={surahLoading}>
        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-gray-600">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Sedang memuat Surah...</p>
        </div>
      </Match>
      <Match when={surahError}>
        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-red-600">
          <FiAlertCircle size={48} />
          <p className="text-lg font-semibold">Terjadi kesalahan saat memuat Surah.</p>
          <button
            onClick={() => queryClient.refetchQueries({ queryKey: ['surah', id] })}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white flex items-center space-x-2"
          >
            <FiRefreshCw />
            <span>Ulangi</span>
          </button>
        </div>
      </Match>
      <Match when={!!surah}>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-2">
            {surah?.data.name.transliteration.id} - {surah?.data.name.translation.id}
          </h1>
          <p className="mb-4 italic text-gray-600">
            {surah?.data.revelation.id} - {surah?.data.numberOfVerses} Ayat
          </p>
          <p className="mb-6 text-sm">{surah?.data.tafsir.id}</p>
          {/** button bookmark */}
          <Switch>
            <Match when={!session.isPending && !!session.data?.user}>
              <Switch>
                <Match when={bookmarkLoading}>
                  <Skeleton className="w-28 h-11 p-2 mb-5" />
                </Match>
                <Match when={!bookmark?.data}>
                  <button
                    disabled={addBookmark.isPending}
                    className="mb-5 flex gap-2 border-2 rounded-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() =>
                      addBookmark.mutate({
                        surah: surah?.data.name.transliteration.id!,
                        id: surah?.data.number!,
                      })
                    }
                  >
                    <HiOutlineBookmark size={25} />
                    <p>tambah</p>
                  </button>
                </Match>
                <Match when={bookmark?.data}>
                  <button
                    disabled={deleteBookmark.isPending}
                    className="mb-5 flex gap-2 border-2 rounded-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => deleteBookmark.mutate({ id: `${surah?.data.number}.0` })}
                  >
                    <HiBookmark size={25} />
                    <p>hapus</p>
                  </button>
                </Match>
              </Switch>
            </Match>
            <Match when={session.isPending}>
              <Skeleton className="w-28 h-11 p-2 mb-5" />
            </Match>
            <Match when={!session.data?.user}>
              <button className="mb-5 flex gap-2 border-2 rounded-sm p-2 items-center">
                <HiOutlineBookmark size={25} />
                <p>
                  <Link href="/login" className=" text-blue-600">
                    login
                  </Link>{' '}
                  to add bookmark
                </p>
              </button>
            </Match>
          </Switch>
          {/** button bookmark */}

          <div className="space-y-6">
            {filteredAyahs.map((ayah) => (
              <div key={ayah.number.inSurah} className="p-4 border rounded shadow-sm">
                <p className="text-right text-2xl font-arabic" dir="rtl">
                  {ayah.text.arab}
                </p>
                <p className="mt-2 text-gray-800">{ayah.translation.id}</p>
              </div>
            ))}
          </div>
        </div>
      </Match>
    </Switch>
  )
}
