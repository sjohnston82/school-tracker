"use client"

import React from 'react'
import AuthWrapper from '../auth/AuthWrapper'

const Header = () => {
  return (
    <div className="h-16 bg-lightpurp flex justify-between items-center px-6">
      <h1 className="text-5xl font-extrabold">Elizabeth&apos;s School Tracker</h1>
      <AuthWrapper />
    </div>
  )
}

export default Header