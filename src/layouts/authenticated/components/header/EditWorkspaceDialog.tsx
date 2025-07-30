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

  // Update input when initialWorkspaceName changes
  useEffect(() => {
    setEditingWorkspaceName(initialWorkspaceName)
  }, [initialWorkspaceName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingWorkspaceName.trim()) return

    void onSave(editingWorkspaceName)
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
            <DialogTitle>Edit Workspace Name</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              value={editingWorkspaceName}
              onChange={(e) => setEditingWorkspaceName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter workspace name..."
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!editingWorkspaceName.trim()}
              className="from-anime-purple to-anime-pink bg-gradient-to-r hover:opacity-90"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
