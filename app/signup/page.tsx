import React from 'react'
import Link from 'next/link'

export default function page() {
  // TODO: stub
  return (
    <div>signup
      <form>
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <Link href="/login">Signup</Link>
      </form>
    </div>
  )
}
