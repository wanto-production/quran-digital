import { Metadata } from 'next'
import React from 'react'
import { QuranContainer, SearchContainer } from '@/components/container'

export const metadata: Metadata = {
  title: "home",
  description: "home page of quran digital"
}

export default function Page() {
  return (
    <main
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
      className='w-full min-h-screen p-6'
    >
      <SearchContainer/>
      <QuranContainer/>
    </main>
  )
}
