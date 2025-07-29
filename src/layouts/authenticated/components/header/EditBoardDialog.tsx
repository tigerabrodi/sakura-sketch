import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EditBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingBoardTitle: string;
  onEditingBoardTitleChange: (title: string) => void;
  onSave: () => void;
}

export const EditBoardDialog = ({
  isOpen,
  onOpenChange,
  editingBoardTitle,
  onEditingBoardTitleChange,
  onSave,
}: EditBoardDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Board Title</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <Input
          value={editingBoardTitle}
          onChange={(e) => onEditingBoardTitleChange(e.target.value)}
          placeholder="Enter board title..."
          className="w-full"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          className="bg-gradient-to-r from-anime-purple to-anime-pink hover:opacity-90"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
