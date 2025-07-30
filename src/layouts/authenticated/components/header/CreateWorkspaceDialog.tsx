import { useState } from 'react'

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="Enter workspace name..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onCreate(newWorkspaceName)}
            disabled={!newWorkspaceName.trim()}
            className="from-anime-purple to-anime-pink bg-gradient-to-r hover:opacity-90"
            isLoading={isCreatingWorkspace}
            loadingText="Creating workspace..."
          >
            Create Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
