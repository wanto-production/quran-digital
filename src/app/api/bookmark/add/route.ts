import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import * as schema from '@/db/schema'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id)
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      { status: 401 }
    )

  await db.insert(schema.bookmark).values({
    id: data.id,
    userId: session.user.id,
    surah: data.surah!,
  })

  return NextResponse.json(
    {
      message: 'Bookmark added successfully',
    },
    { status: 200 }
  )
}
