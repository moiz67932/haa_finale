"use client";

"use client";
// LEGACY: This dialog has been superseded by CreateHomeImprovementDialog.
// Retained temporarily for reference and potential migration of additional fields.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCreateProject } from "@/hooks/use-supabase-query";
import { uploadPublicImage } from "@/lib/storage";
import { X } from "lucide-react";

const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  start_date: z.string().optional(),
  completion_date: z.string().optional(),
  contractor: z.string().optional(),
  materials_paint: z.string().optional(),
  cost: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.number().min(0).optional()
  ),
  notes: z.string().optional(),
  notification_sms: z.boolean().optional(),
  notification_email: z.boolean().optional(),
  notification_calendar: z.boolean().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeId: string;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  homeId,
}: CreateProjectDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const createProjectMutation = useCreateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectForm) => {
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(imageFile, "projects");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const payload = {
        home_id: homeId,
        project_name: data.project_name,
        start_date: data.start_date || null,
        completion_date: data.completion_date || null,
        contractor: data.contractor || null,
        materials_paint: data.materials_paint || null,
        cost: data.cost ?? null,
        notes: data.notes || null,
        image_url: finalImageUrl || null,
        notification_sms: data.notification_sms ?? false,
        notification_email: data.notification_email ?? false,
        notification_calendar: data.notification_calendar ?? false,
      } as any;

      await createProjectMutation.mutateAsync(payload);

      reset();
      setImageFile(null);
      setImageUrl("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating project:", error);
      const message = error?.message || "Failed to create project";
      toast.error(message);
    }
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImageUrl("");
    onOpenChange(false);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      setImageUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-0 gap-0 border border-gray-200 shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add Project
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-4 space-y-4 bg-white"
          >
            <div className="space-y-2">
              <Label
                htmlFor="project_name"
                className="text-sm font-medium text-gray-700"
              >
                Project Name *
              </Label>
              <Input
                id="project_name"
                {...register("project_name")}
                placeholder="Kitchen Renovation"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.project_name && (
                <p className="text-sm text-red-600">
                  {errors.project_name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="start_date"
                  className="text-sm font-medium text-gray-700"
                >
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register("start_date")}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="completion_date"
                  className="text-sm font-medium text-gray-700"
                >
                  Completion Date
                </Label>
                <Input
                  id="completion_date"
                  type="date"
                  {...register("completion_date")}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="contractor"
                  className="text-sm font-medium text-gray-700"
                >
                  Contractor
                </Label>
                <Input
                  id="contractor"
                  {...register("contractor")}
                  placeholder="ABC Construction"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cost"
                  className="text-sm font-medium text-gray-700"
                >
                  Cost
                </Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  {...register("cost", { valueAsNumber: true })}
                  placeholder="5000.00"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="materials_paint"
                className="text-sm font-medium text-gray-700"
              >
                Materials & Paint
              </Label>
              <Input
                id="materials_paint"
                {...register("materials_paint")}
                placeholder="Sherwin Williams ProClassic, Oak cabinets"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-sm font-medium text-gray-700"
              >
                Notes
              </Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Project details, challenges, outcomes..."
                rows={3}
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Upload Image (Optional)
              </Label>
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                onRemove={() => {
                  setImageUrl("");
                  setImageFile(null);
                }}
                disabled={createProjectMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Notification Preferences
              </Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    {...register("notification_sms")}
                    className="mr-2"
                  />
                  SMS
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    {...register("notification_email")}
                    className="mr-2"
                  />
                  Email
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    {...register("notification_calendar")}
                    className="mr-2"
                  />
                  Calendar Reminder
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Choose how you'd like to be notified for project milestones.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProjectMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {createProjectMutation.isPending
                  ? "Creating..."
                  : "Create Project"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
