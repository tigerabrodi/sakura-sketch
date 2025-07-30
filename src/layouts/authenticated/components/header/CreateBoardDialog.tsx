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

  // Reset input when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInput('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isCreatingBoard) return

    try {
      await onCreate(input)
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
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter board name..."
              className="w-full"
              disabled={isCreatingBoard}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreatingBoard}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!input.trim() || isCreatingBoard}
              className="from-anime-purple to-anime-pink bg-gradient-to-r hover:opacity-90"
              isLoading={isCreatingBoard}
              loadingText="Creating board..."
            >
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
