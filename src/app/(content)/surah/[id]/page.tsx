import { SurahContainer, SurahHeader } from '@/components/spesific'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params
    
  return (
    <main className='w-full '>
        <SurahHeader/>
        <SurahContainer id={id} />
    </main>
  )
}
