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

interface EditBoardDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialBoardName: string
  onSave: (newBoardName: string) => Promise<void>
}

export const EditBoardDialog = ({
  isOpen,
  onOpenChange,
  initialBoardName,
  onSave,
}: EditBoardDialogProps) => {
  const [input, setInput] = useState(initialBoardName)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Board Title</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter board title..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(input)}
            className="from-anime-purple to-anime-pink bg-gradient-to-r hover:opacity-90"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
