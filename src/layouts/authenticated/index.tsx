import { api } from '@convex/_generated/api'
import { useConvexAuth, useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { generatePath, Outlet, useNavigate } from 'react-router'

import { AppHeader } from './components/header/AppHeader'
import { Sidebar } from './components/Sidebar'
import { EditorWrapperProvider } from './providers/EditorProvider'

import { ROUTES } from '@/lib/constants'

export function AuthenticatedLayout() {
  const user = useQuery(api.users.queries.getCurrentUser)
  const state = useConvexAuth()
  const isLoading = user === undefined || state.isLoading
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      void navigate(generatePath(ROUTES.login))
    }
  }, [isLoading, user, navigate])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <EditorWrapperProvider>
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <div className="flex w-full flex-1">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </EditorWrapperProvider>
  )
}
