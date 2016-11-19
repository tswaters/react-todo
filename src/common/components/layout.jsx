
import React from 'react'
import Header from './header.jsx'
import Footer from './footer.jsx'

export default function Layout ({children}) {
  return (
    <div id="container">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
