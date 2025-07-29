import { BrowserRouter, Route, Routes } from 'react-router'

import { Toaster } from './components/ui/sonner'
import { AuthenticatedLayout } from './layouts/authenticated'
import { ROUTES } from './lib/constants'
import { CanvasPage } from './pages/canvas'
import { LoginPage } from './pages/login'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route element={<AuthenticatedLayout />}>
          <Route path={ROUTES.canvas} element={<CanvasPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
