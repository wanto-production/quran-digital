'use client'

import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import { useAtom } from 'jotai'
import { Switch, Match } from '@/lib/switch'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { searchAtom } from '@/store'

export interface SurahListResponse {
  code: number
  status: string
  message: string
  data: Surah[]
}

export interface Surah {
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
}

export function QuranContainer() {
  const {
    data: surahs,
    isLoading,
    error,
    isError,
  } = useQuery<SurahListResponse>({
    queryKey: ['surahs'],
    queryFn: () => fetch('https://api.quran.gading.dev/surah').then((res) => res.json()),
  })
  const [search] = useAtom(searchAtom)

  const filtered = useMemo(() => {
    if (!surahs?.data || !search) return surahs?.data
    return surahs.data.filter((surah) =>
      surah.name.transliteration.id.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, surahs])

  useEffect(() => {
    console.log(filtered)
  }, [filtered])

  return (
    <div className="w-[90%] max-w-6xl mx-auto p-6">
      <div className="flex flex-row p-2 items-center justify-between border-b-2 border-gray-300">
        <h1 className="text-2xl font-bold">length: {filtered?.length}</h1>
      </div>

      <div className="p-2 flex flex-wrap gap-3 max-h-[710px] overflow-y-auto justify-center">
        <Switch>
          <Match when={isLoading}>
            <p className="text-gray-500 text-center w-full">Memuat daftar surah...</p>
          </Match>
          <Match when={!isLoading && filtered?.length === 0}>
            <p className="text-gray-500 text-center w-full">data '{search}' tidak ditemukan</p>
          </Match>
          <Match when={!isLoading}>
            <AnimatePresence mode="popLayout">
              {filtered?.map((surah) => (
                <Link href={`/surah/${surah.number}`} key={surah.number} prefetch>
                  <Card key={surah.number} surah={surah} />
                </Link>
              ))}
            </AnimatePresence>
          </Match>
          <Match when={isError}>
            <p className="text-red-500 text-center w-full">Terjadi kesalahan: {error?.message}</p>
          </Match>
        </Switch>
      </div>
    </div>
  )
}

function Card({ surah }: { surah: Surah }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      style={{
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        borderColor: 'var(--border)',
      }}
      className="min-w-[250px] border rounded-lg p-2 hover:shadow-xl transition-shadow cursor-pointer flex flex-row items-center gap-4"
    >
      <div
        style={{ backgroundImage: 'url(/frame.svg)' }}
        className="w-[35px] h-[40px] grid place-content-center text-sm font-bold"
      >
        {surah.number}
      </div>
      <div className="h-full flex flex-col gap-2 items-start justify-evenly">
        <p className="text-md font-semibold">{surah.name.transliteration.id}</p>
        <p className="text-sm text-gray-500">
          {surah.revelation.id} | {surah.numberOfVerses} ayat
        </p>
      </div>
    </motion.div>
  )
}

export function SearchContainer() {
  const [search, setSearch] = useAtom(searchAtom)
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundImage: 'url(/bg-quran.png)' }}
      className="w-full h-[400px] bg-cover bg-center rounded-lg p-6 gap-7 flex flex-col items-center justify-center"
    >
      <Image src="/lafaz_logo.png" alt="" width={200} height={200} />
      <div className="max-w-[700px] w-full flex gap-2 items-center justify-center">
        <FaSearch className="text-white" size={20} />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white"
          placeholder="cari surah"
        />
      </div>
    </motion.div>
  )
}
