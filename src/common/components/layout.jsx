
import React from 'react'
import Header from './header'
import Footer from './footer'

export default function Layout ({children}) {
  return (
    <div id="container">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
