import React from 'react'
import Link from 'next/link'

export default function page() {
  // TODO: stub
  return (
    <div>login
      <form>
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <Link href="/dashboard">Login</Link>
      </form>
    </div>
  )
}
