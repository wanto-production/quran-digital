import { BookmarkList } from '@/components/bookmarklist'
import { db } from '@/db'
import { bookmark } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import * as schema from '@/db/schema'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'bookmark',
  description: 'Daftar bookmark ayat Al-Quran yang telah kamu simpan.',
}

export default async function BookmarkPage() {
  const getBookmarks = async () => {
    'use server'
    const session = await auth.api.getSession({ headers: await headers() })
    const result = await db
      .select()
      .from(bookmark)
      .where(eq(schema.bookmark.userId, session?.user.id ?? ''))
    return [result, session] as const
  }
  const [bookmarks, session] = await getBookmarks()

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-900">Bookmark Ayat</h1>
        <BookmarkList bookmarks={bookmarks} userId={session?.user.id} />
      </div>
    </main>
  )
}
