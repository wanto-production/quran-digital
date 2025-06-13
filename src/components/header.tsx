'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const session = authClient.useSession()
  const navigate = useRouter()

  return (
    <header className="w-full bg-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-wide hover:opacity-90 transition-opacity"
        >
          Quran Digital
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-gray-200 transition-colors" prefetch>
            Home
          </Link>
          <Link href="/bookmark" className="hover:text-gray-200 transition-colors">
            Bookmarks
          </Link>
        </nav>

        {/* Desktop Auth */}
        {!session.data?.user && !session.isPending ? (
          <div className="hidden md:flex space-x-3">
            <Link
              href="/login"
              className="px-3 py-1 rounded hover:bg-white hover:text-green-700 transition-colors"
              prefetch
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-3 py-1 rounded bg-white text-green-700 hover:bg-green-100 transition-colors"
              prefetch
            >
              Register
            </Link>
          </div>
        ) : (
          <Button
            className=" max-md:hidden text-green-800 bg-white p-2 rounded-md"
            onClick={() => authClient.signOut()}
          >
            signOut
          </Button>
        )}
      </div>

      {/* SMOOTH Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="overflow-hidden md:hidden bg-green-600 px-4"
          >
            <nav className="flex flex-col py-4 space-y-2">
              <Link href="/" className="hover:text-gray-200 transition-colors">
                Home
              </Link>
              <Link href="/bookmark" className="hover:text-gray-200 transition-colors">
                Bookmarks
              </Link>
              {!session.data?.user && !session.isPending ? (
                <>
                  <Link href="/login" className="hover:text-gray-200 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="hover:text-gray-200 transition-colors">
                    Register
                  </Link>
                </>
              ) : (
                <button
                  className=" text-green-800 bg-white p-2 rounded-md"
                  onClick={() => authClient.signOut().then(() => navigate.push('/login'))}
                >
                  signOut
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
