import AppProvider from './app/context/AppProvider'
import Index from './index'
import { registerRootComponent } from 'expo'
import React from 'react'

export default function App() {
  return (
    <AppProvider>
      <Index />
    </AppProvider>
  )
}