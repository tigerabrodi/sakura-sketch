import { ChevronDown, Edit3, FolderOpen, Layers, Plus } from 'lucide-react'
import { useState } from 'react'

import { CreateBoardDialog } from './CreateBoardDialog'
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog'
import { EditBoardDialog } from './EditBoardDialog'
import { EditWorkspaceDialog } from './EditWorkspaceDialog'

import LogoPng from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const workspaces = [
  {
    id: 1,
    name: 'Main Character Designs',
    boards: ['Hero Concepts', 'Villains', 'Side Characters'],
  },
  {
    id: 2,
    name: 'Fantasy Project',
    boards: ['Elves & Fae', 'Dragons', 'Warriors'],
  },
  {
    id: 3,
    name: 'Modern Slice of Life',
    boards: ['School Characters', 'Adults', 'Background NPCs'],
  },
]

export const AppHeader = () => {
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0])
  const [currentBoard, setCurrentBoard] = useState(workspaces[0].boards[0])

  // Edit Board Dialog State
  const [editingBoardTitle, setEditingBoardTitle] = useState('')
  const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] = useState(false)

  // Create Board Dialog State
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] = useState(false)

  // Create Workspace Dialog State
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [isCreateWorkspaceDialogOpen, setIsCreateWorkspaceDialogOpen] = useState(false)

  // Edit Workspace Dialog State
  const [editingWorkspaceName, setEditingWorkspaceName] = useState('')
  const [isEditWorkspaceDialogOpen, setIsEditWorkspaceDialogOpen] = useState(false)

  const handleWorkspaceSwitch = (workspace: (typeof workspaces)[0]) => {
    console.log('Switching to workspace:', workspace.name)
    setCurrentWorkspace(workspace)
    setCurrentBoard(workspace.boards[0])
  }

  const handleBoardSwitch = (boardName: string) => {
    console.log('Switching to board:', boardName)
    setCurrentBoard(boardName)
  }

  // Edit Board Handlers
  const handleEditBoard = () => {
    setEditingBoardTitle(currentBoard)
    setIsEditBoardDialogOpen(true)
  }

  const handleSaveBoardTitle = () => {
    console.log('Saving board title:', editingBoardTitle)
    setCurrentBoard(editingBoardTitle)
    setIsEditBoardDialogOpen(false)
  }

  // Create Board Handlers
  const handleCreateBoard = () => {
    setNewBoardTitle('')
    setIsCreateBoardDialogOpen(true)
  }

  const handleSaveNewBoard = () => {
    console.log('Creating new board:', newBoardTitle)
    // Mock: Add to current workspace boards
    setIsCreateBoardDialogOpen(false)
    setNewBoardTitle('')
  }

  // Create Workspace Handlers
  const handleCreateWorkspace = () => {
    setNewWorkspaceName('')
    setIsCreateWorkspaceDialogOpen(true)
  }

  const handleSaveNewWorkspace = () => {
    console.log('Creating new workspace:', newWorkspaceName)
    // Mock: Add to workspaces
    setIsCreateWorkspaceDialogOpen(false)
    setNewWorkspaceName('')
  }

  // Edit Workspace Handlers
  const handleEditWorkspace = () => {
    setEditingWorkspaceName(currentWorkspace.name)
    setIsEditWorkspaceDialogOpen(true)
  }

  const handleSaveWorkspaceName = () => {
    console.log('Saving workspace name:', editingWorkspaceName)
    // Mock: Update current workspace name
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
                <span className="max-w-32 truncate">{currentWorkspace.name}</span>
                <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="center">
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => handleWorkspaceSwitch(workspace)}
                  className={currentWorkspace.id === workspace.id ? 'bg-anime-purple-light' : ''}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {workspace.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCreateWorkspace}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Workspace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditWorkspace}>
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
                <span className="max-w-32 truncate">{currentBoard}</span>
                <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="center">
              {currentWorkspace.boards.map((board) => (
                <DropdownMenuItem
                  key={board}
                  onClick={() => handleBoardSwitch(board)}
                  className={currentBoard === board ? 'bg-anime-purple-light' : ''}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  {board}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCreateBoard}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Board
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditBoard}>
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
        editingBoardTitle={editingBoardTitle}
        onEditingBoardTitleChange={setEditingBoardTitle}
        onSave={handleSaveBoardTitle}
      />

      <CreateBoardDialog
        isOpen={isCreateBoardDialogOpen}
        onOpenChange={setIsCreateBoardDialogOpen}
        newBoardTitle={newBoardTitle}
        onNewBoardTitleChange={setNewBoardTitle}
        onCreate={handleSaveNewBoard}
      />

      <CreateWorkspaceDialog
        isOpen={isCreateWorkspaceDialogOpen}
        onOpenChange={setIsCreateWorkspaceDialogOpen}
        newWorkspaceName={newWorkspaceName}
        onNewWorkspaceNameChange={setNewWorkspaceName}
        onCreate={handleSaveNewWorkspace}
      />

      <EditWorkspaceDialog
        isOpen={isEditWorkspaceDialogOpen}
        onOpenChange={setIsEditWorkspaceDialogOpen}
        editingWorkspaceName={editingWorkspaceName}
        onEditingWorkspaceNameChange={setEditingWorkspaceName}
        onSave={handleSaveWorkspaceName}
      />
    </header>
  )
}
