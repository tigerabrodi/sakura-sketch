import { api } from '@convex/_generated/api'
import { Doc } from '@convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { ChevronDown, Edit3, FolderOpen, Layers, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { CreateBoardDialog } from './CreateBoardDialog'
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog'
import { EditBoardDialog } from './EditBoardDialog'
import { EditWorkspaceDialog } from './EditWorkspaceDialog'
import { useAppHeaderMutations } from './mutations'

import LogoPng from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage, handlePromise } from '@/lib/utils'

export const AppHeader = () => {
  const user = useQuery(api.users.queries.getCurrentUser)
  const selectedWorkspaceId = user?.selectedWorkspaceId
  const workspaces = useQuery(api.workspaces.queries.getUserWorkspaces)

  const currentWorkspace = useMemo(() => {
    return workspaces?.find((workspace) => workspace._id === selectedWorkspaceId) ?? null
  }, [workspaces, selectedWorkspaceId])

  const boards = useQuery(api.boards.queries.getUserBoardsByWorkspaceId, {
    workspaceId: selectedWorkspaceId ?? null,
  })

  const currentBoard = useMemo(() => {
    return boards?.find((board) => board._id === currentWorkspace?.selectedBoardId) ?? null
  }, [boards, currentWorkspace])

  const {
    switchWorkspace,
    createNewBoard,
    updateWorkspace,
    createWorkspace,
    switchBoard,
    updateBoard,
  } = useAppHeaderMutations({
    selectedWorkspaceId: selectedWorkspaceId ?? null,
  })

  // Edit Board Dialog State
  const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] = useState(false)

  // Create Board Dialog State
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] = useState(false)

  // Create Workspace Dialog State
  const [isCreateWorkspaceDialogOpen, setIsCreateWorkspaceDialogOpen] = useState(false)
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false)

  // Edit Workspace Dialog State
  const [isEditWorkspaceDialogOpen, setIsEditWorkspaceDialogOpen] = useState(false)

  const handleWorkspaceSwitch = async (workspace: Doc<'workspaces'>) => {
    const [error] = await handlePromise(
      switchWorkspace({
        workspaceId: workspace._id,
      })
    )

    if (error) {
      toast.error(getErrorMessage({ error }))
    }
  }

  const handleBoardSwitch = async (board: Doc<'boards'>) => {
    const [error] = await handlePromise(
      switchBoard({
        workspaceId: board.workspaceId,
        boardId: board._id,
      })
    )

    if (error) {
      toast.error(getErrorMessage({ error }))
    }
  }

  const handleSaveBoardTitle = async (newBoardName: string) => {
    if (!currentBoard?._id) {
      throw new Error('Current board not found')
    }

    const [error] = await handlePromise(
      updateBoard({
        boardId: currentBoard?._id,
        data: {
          name: newBoardName,
        },
      })
    )

    if (error) {
      toast.error(getErrorMessage({ error }))
    }

    setIsEditBoardDialogOpen(false)
  }

  const handleSaveNewBoard = async (boardName: string) => {
    if (!currentWorkspace?._id) {
      throw new Error('Current workspace not found')
    }

    setIsCreatingBoard(true)

    const [error] = await handlePromise(
      createNewBoard({
        workspaceId: currentWorkspace?._id,
        name: boardName,
      })
    )

    if (error) {
      toast.error('Failed to create new board.')
      setIsCreatingBoard(false)
      return
    }

    setIsCreateBoardDialogOpen(false)
    setIsCreatingBoard(false)
  }

  const handleSaveNewWorkspace = async (newWorkspaceName: string) => {
    setIsCreatingWorkspace(true)

    const [error] = await handlePromise(
      createWorkspace({
        name: newWorkspaceName,
      })
    )

    if (error) {
      toast.error('Failed to create new workspace.')
      setIsCreatingWorkspace(false)
      return
    }

    setIsCreateWorkspaceDialogOpen(false)
    setIsCreatingWorkspace(false)
  }

  const handleSaveWorkspaceName = async (newWorkspaceName: string) => {
    if (!currentWorkspace?._id) {
      throw new Error('Current workspace not found')
    }

    const [error] = await handlePromise(
      updateWorkspace({
        workspaceId: currentWorkspace?._id,
        name: newWorkspaceName,
      })
    )

    if (error) {
      toast.error('Failed to update workspace name.')
    }

    setIsEditWorkspaceDialogOpen(false)
  }

  return (
    <header className="bg-background border-border flex h-14 items-center justify-between border-b px-6">
      {/* Logo and App Name */}
      <div className="flex items-center gap-0.5">
        <img src={LogoPng} alt="Logo" className="mb-2.5 size-8 rotate-[10deg]" />
        <h1 className="text-xl font-medium italic">Sakura Sketch</h1>
      </div>

      {/* Workspace & Board Selector */}
      <div className="flex items-center gap-3">
        {/* Workspace Selector */}
        <div className="flex items-center gap-2">
          <FolderOpen className="text-muted-foreground h-4 w-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <span className="max-w-32 truncate">{currentWorkspace?.name}</span>
                <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[1000] w-64" align="center">
              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => handleWorkspaceSwitch(workspace)}
                  className={currentWorkspace?._id === workspace._id ? 'bg-anime-purple-light' : ''}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {workspace.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCreateWorkspaceDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Workspace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditWorkspaceDialogOpen(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-muted-foreground">/</div>

        {/* Board Selector */}
        <div className="flex items-center gap-2 pl-2">
          <Layers className="text-muted-foreground h-4 w-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                {currentBoard ? (
                  <span className="max-w-32 truncate">{currentBoard.name}</span>
                ) : (
                  <Skeleton className="h-5 w-24 rounded" />
                )}
                <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[1000] w-56" align="center">
              {boards?.map((board) => (
                <DropdownMenuItem
                  key={board._id}
                  onClick={() => handleBoardSwitch(board)}
                  className={currentBoard?._id === board._id ? 'bg-anime-purple-light' : ''}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  {board.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCreateBoardDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Board
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditBoardDialogOpen(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dummy div to center the dropdowns */}
      <div />

      {/* Dialogs */}
      <EditBoardDialog
        isOpen={isEditBoardDialogOpen}
        onOpenChange={setIsEditBoardDialogOpen}
        initialBoardName={currentBoard?.name ?? ''}
        onSave={handleSaveBoardTitle}
      />

      <CreateBoardDialog
        isOpen={isCreateBoardDialogOpen}
        onOpenChange={setIsCreateBoardDialogOpen}
        isCreatingBoard={isCreatingBoard}
        onCreate={handleSaveNewBoard}
      />

      <CreateWorkspaceDialog
        isOpen={isCreateWorkspaceDialogOpen}
        onOpenChange={setIsCreateWorkspaceDialogOpen}
        onCreate={handleSaveNewWorkspace}
        isCreatingWorkspace={isCreatingWorkspace}
      />

      <EditWorkspaceDialog
        isOpen={isEditWorkspaceDialogOpen}
        onOpenChange={setIsEditWorkspaceDialogOpen}
        initialWorkspaceName={currentWorkspace?.name ?? ''}
        onSave={handleSaveWorkspaceName}
      />
    </header>
  )
}
