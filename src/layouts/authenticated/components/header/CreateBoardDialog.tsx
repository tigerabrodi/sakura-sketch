import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CreateBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newBoardTitle: string;
  onNewBoardTitleChange: (title: string) => void;
  onCreate: () => void;
}

export const CreateBoardDialog = ({
  isOpen,
  onOpenChange,
  newBoardTitle,
  onNewBoardTitleChange,
  onCreate,
}: CreateBoardDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Board</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <Input
          value={newBoardTitle}
          onChange={(e) => onNewBoardTitleChange(e.target.value)}
          placeholder="Enter board name..."
          className="w-full"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={onCreate}
          disabled={!newBoardTitle.trim()}
          className="bg-gradient-to-r from-anime-purple to-anime-pink hover:opacity-90"
        >
          Create Board
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
