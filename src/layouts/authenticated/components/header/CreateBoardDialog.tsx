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

interface CreateBoardDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (boardName: string) => Promise<void>
  isCreatingBoard: boolean
}

export const CreateBoardDialog = ({
  isOpen,
  onOpenChange,
  onCreate,
  isCreatingBoard,
}: CreateBoardDialogProps) => {
  const [input, setInput] = useState('')

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter board name..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onCreate(input)}
            disabled={!input.trim()}
            className="from-anime-purple to-anime-pink bg-gradient-to-r hover:opacity-90"
            isLoading={isCreatingBoard}
            loadingText="Creating board..."
          >
            Create Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
