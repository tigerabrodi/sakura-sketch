import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newWorkspaceName: string;
  onNewWorkspaceNameChange: (name: string) => void;
  onCreate: () => void;
}

export const CreateWorkspaceDialog = ({
  isOpen,
  onOpenChange,
  newWorkspaceName,
  onNewWorkspaceNameChange,
  onCreate,
}: CreateWorkspaceDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Workspace</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <Input
          value={newWorkspaceName}
          onChange={(e) => onNewWorkspaceNameChange(e.target.value)}
          placeholder="Enter workspace name..."
          className="w-full"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={onCreate}
          disabled={!newWorkspaceName.trim()}
          className="bg-gradient-to-r from-anime-purple to-anime-pink hover:opacity-90"
        >
          Create Workspace
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
