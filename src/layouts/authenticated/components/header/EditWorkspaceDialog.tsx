import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EditWorkspaceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingWorkspaceName: string;
  onEditingWorkspaceNameChange: (name: string) => void;
  onSave: () => void;
}

export const EditWorkspaceDialog = ({
  isOpen,
  onOpenChange,
  editingWorkspaceName,
  onEditingWorkspaceNameChange,
  onSave,
}: EditWorkspaceDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Workspace Name</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <Input
          value={editingWorkspaceName}
          onChange={(e) => onEditingWorkspaceNameChange(e.target.value)}
          placeholder="Enter workspace name..."
          className="w-full"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!editingWorkspaceName.trim()}
          className="bg-gradient-to-r from-anime-purple to-anime-pink hover:opacity-90"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
