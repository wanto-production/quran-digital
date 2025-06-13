import React from 'react'
import { RegisterForm } from './_components/form'
import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new account to get started',
}

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })  
    
    if (session?.user) redirect('/');   

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted px-4">
        <RegisterForm/>
    </div>
  )
}
