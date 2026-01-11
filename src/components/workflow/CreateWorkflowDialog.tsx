import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { CreateWorkflowDialogProps } from "@/types/workflows";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateWorkflowDialog = ({ open, onOpenChange, onSubmit, isSubmitting, card, mode }: CreateWorkflowDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const setCardValues = ({name, description}) => {
    setValue("name", name)
    setValue("description", description)
  }
  setCardValues({name: card?.name, description: card?.description})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Workflow" : "Update Workflow"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new workflow to start building your automation." : "Update workflow information"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={() => handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="Enter workflow name" {...register("name")}/>
              { errors.name && ( <p className="text-sm text-destructive">{errors.name.message}</p> ) }
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter workflow description (optional)" rows={3} {...register("description")} />
              {errors.description && ( <p className="text-sm text-destructive">{errors.description.message}</p> )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{
                mode === "create" 
                  ? isSubmitting ? "Creating..." : "Create Workflow" 
                  : isSubmitting ? "Updating..." : "Update Workflow"
            }</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
