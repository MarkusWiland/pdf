import { FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import NavLink from './nav-link'

export default function Header() {
  const isLoggedIn = true
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
        {isLoggedIn && <Link href="/#dashboard">dashboard</Link>}
      </div>
      <div className="flex lg:justify-end lg:flex-1">
        {isLoggedIn ? (
          <div className="flex gap-2 items-center">
            <NavLink href="/upload">Ladda upp PDF</NavLink>
            <div>Pro</div>
            <Button>user</Button>
          </div>
        ) : (
          <div>
            <NavLink href="/sign-in">Logga In</NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}
