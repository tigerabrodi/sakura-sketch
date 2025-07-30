import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface CreateWorkspaceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (newWorkspaceName: string) => Promise<void>
  isCreatingWorkspace: boolean
}

export const CreateWorkspaceDialog = ({
  isOpen,
  onOpenChange,
  onCreate,
  isCreatingWorkspace,
}: CreateWorkspaceDialogProps) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState('')

  // Reset input when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setNewWorkspaceName('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkspaceName.trim() || isCreatingWorkspace) return

    try {
      await onCreate(newWorkspaceName)
    } catch {
      // Error is handled by the parent component
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit(e)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter workspace name..."
              className="w-full"
              disabled={isCreatingWorkspace}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreatingWorkspace}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newWorkspaceName.trim() || isCreatingWorkspace}
              className="from-anime-purple to-anime-pink bg-gradient-to-r hover:opacity-90"
              isLoading={isCreatingWorkspace}
              loadingText="Creating workspace..."
            >
              Create Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
