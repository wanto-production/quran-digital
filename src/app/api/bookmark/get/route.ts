import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const bookmarkId = searchParams.get('id')
  const userId = searchParams.get('userId') as string

  if (!bookmarkId) {
    return NextResponse.json({ error: 'Bookmark ID is required' }, { status: 400 })
  }

  try {
    const bookmark = await db.query.bookmark.findFirst({
      where: (bookmark, { eq, and }) =>
        and(eq(bookmark.id, bookmarkId), eq(bookmark.userId, userId)),
      with: {
        user: false,
      },
    })

    if (!bookmark) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
    }

    return NextResponse.json({ data: bookmark })
  } catch (error) {
    console.error('Error fetching bookmark:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
