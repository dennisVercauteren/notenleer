import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainPage } from '@/features/trainer/MainPage'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<MainPage />} />
    </Routes>
  )
}
