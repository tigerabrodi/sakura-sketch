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

interface EditWorkspaceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialWorkspaceName: string
  onSave: (newWorkspaceName: string) => Promise<void>
}

export const EditWorkspaceDialog = ({
  isOpen,
  onOpenChange,
  initialWorkspaceName,
  onSave,
}: EditWorkspaceDialogProps) => {
  const [editingWorkspaceName, setEditingWorkspaceName] = useState(initialWorkspaceName)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Workspace Name</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            value={editingWorkspaceName}
            onChange={(e) => setEditingWorkspaceName(e.target.value)}
            placeholder="Enter workspace name..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(editingWorkspaceName)}
            disabled={!editingWorkspaceName.trim()}
            className="from-anime-purple to-anime-pink bg-gradient-to-r hover:opacity-90"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
