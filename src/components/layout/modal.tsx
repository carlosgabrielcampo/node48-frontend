import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useWorkflowEditor } from "@/contexts/WorkflowEditorContext";
import { useNavigate } from "react-router-dom";

interface UnsavedChangesModalProps {
  onSave: () => Promise<void>;
  onDiscard: () => void;
}

export const UnsavedChangesModal = ({ onSave, onDiscard }: UnsavedChangesModalProps) => {
  const navigate = useNavigate();
  const { 
    showUnsavedModal, 
    setShowUnsavedModal, 
    pendingNavigation, 
    setPendingNavigation,
    clearDirty,
  } = useWorkflowEditor();

  const handleSave = async () => {
    await onSave();
    clearDirty();
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleDiscard = () => {
    onDiscard();
    clearDirty();
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleCancel = () => {
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  return (
    <AlertDialog open={showUnsavedModal} onOpenChange={setShowUnsavedModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Would you like to save before leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDiscard}>
            Discard
          </Button>
          <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
