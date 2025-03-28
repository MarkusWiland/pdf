'use client'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import NavLink from './nav-link'
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default function Header() {
  const { isSignedIn } = useUser()
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
      <div className="flex lg:flex-1">
        <NavLink href="/" className="flex items-center gap-1 lg:gap2 shrink-0">
          <FileText className="w-5 h-5 lg:h-8 lg:w-8 text-muted-foreground hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-muted-foreground">
            Sommare
          </span>{' '}
        </NavLink>
      </div>
      <div>
        <NavLink href="/#price">Pris</NavLink>
      </div>
      <div className="flex lg:justify-end lg:flex-1">
        {isSignedIn ? (
          <div className="flex gap-2 items-center">
            <NavLink href="/upload">Ladda upp PDF</NavLink>
            <div>Pro</div>
            {isSignedIn && <Link href="/dashboard">dashboard</Link>}

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        ) : (
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Logga in</Button>
              </SignInButton>
            </SignedOut>
          </div>
        )}
      </div>
    </nav>
  )
}
