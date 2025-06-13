import { db } from '@/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as schema from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export async function DELETE(request: NextRequest) {
  const data = await request.json()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return NextResponse.json(
      {
        error: 'Unautohorized',
      },
      { status: 401 }
    )

  await db
    .delete(schema.bookmark)
    .where(and(eq(schema.bookmark.id, data.id), eq(schema.bookmark.userId, session.user.id)))

  return NextResponse.json({ message: 'bookmark deleted' })
}
