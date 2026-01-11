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
import { CreateWorkflowDialogProps } from "@/types/workflows";
import { useToast } from "@/hooks/useToast";

const formSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateWorkflowDialog = ({ open, onOpenChange, isSubmitting, card, mode, setIsSubmitting, onSuccess }: CreateWorkflowDialogProps) => {
  const { toast } = useToast();
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

  const onCreate = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onSuccess({ name: data.name, description: data.description });
      toast({
        title: "Workflow created",
        description: "Your workflow has been created successfully.",
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onSuccess({ name: data.name, description: data.description });
      toast({
        title: "Workflow created",
        description: "Your workflow has been updated successfully.",
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to update workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = mode === 'create' ? onCreate : onUpdate
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Workflow" : "Update Workflow"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new workflow to start building your automation." : "Update workflow information"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
