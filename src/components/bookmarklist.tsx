'use client'

import Link from 'next/link'

type Bookmark = {
  id: string
  userId: string
  surah: number
  note: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

type Props = {
  bookmarks: Bookmark[]
  userId?: string | null
}

export function BookmarkList({ bookmarks, userId }: Props) {
  if (!userId) {
    return (
      <p className="text-center text-red-600 mt-10 italic">
        Kamu harus{' '}
        <a href="/login" className="text-indigo-600 underline">
          login
        </a>{' '}
        dulu untuk melihat bookmark.
      </p>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10 italic">Tidak ada bookmark yang disimpan.</p>
    )
  }

  return (
    <ul className="space-y-6">
      {bookmarks.map((bm) => (
        <li
          key={bm.id}
          className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <Link href={`/surah/${bm.id.replaceAll('.0', '')}`}>
            <p className="text-lg font-semibold text-indigo-700">Surah: {bm.surah}</p>
            {bm.note && <p className="mt-2 text-gray-700 italic">Note: {bm.note}</p>}
            <p className="mt-3 text-sm text-gray-500">
              Disimpan pada:{' '}
              {typeof bm.createdAt === 'string'
                ? new Date(bm.createdAt).toLocaleString()
                : bm.createdAt.toLocaleString()}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
