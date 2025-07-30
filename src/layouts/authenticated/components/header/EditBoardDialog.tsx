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

  // Update input when initialBoardName changes
  useEffect(() => {
    setInput(initialBoardName)
  }, [initialBoardName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    void onSave(input)
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
            <DialogTitle>Edit Board Title</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter board title..."
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
              disabled={!input.trim()}
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
