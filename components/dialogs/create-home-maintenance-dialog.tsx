"use client";

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
import { useCreateHomeMaintenance } from "@/hooks/use-supabase-query";
import { HOME_MAINTENANCE_SYSTEMS, LABOR_PART_WARRANTY } from "@/lib/constants";
import { uploadPublicImage } from "@/lib/storage";
import { X } from "lucide-react";

const homeMaintenanceSchema = z.object({
  task_name: z.string().min(1, "Item / System serviced is required"),
  service_company: z.string().min(1, "Service provider is required"),
  service_date: z.string().min(1, "Date of service is required"),
  findings: z.string().optional(),
  labor_warranty: z.string().optional(),
  part_warranty: z.string().optional(),
  cost: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.number().min(0).optional()
  ),
  notes: z.string().optional(),
});

type HomeMaintenanceForm = z.infer<typeof homeMaintenanceSchema>;

interface CreateHomeMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeId: string;
}

export function CreateHomeMaintenanceDialog({
  open,
  onOpenChange,
  homeId,
}: CreateHomeMaintenanceDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const createHomeMaintenanceMutation = useCreateHomeMaintenance();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(homeMaintenanceSchema),
  });

  const onSubmit = async (data: HomeMaintenanceForm) => {
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(
          imageFile,
          "home-maintenance"
        );
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const payload = {
        home_id: homeId,
        task_name: data.task_name,
        service_company: data.service_company,
        service_date: data.service_date,
        cost: data.cost ?? null,
        // Consolidate optional structured fields into notes JSON-ish text for now (DB schema limited)
        notes: [
          data.findings ? `Findings: ${data.findings}` : null,
          data.labor_warranty ? `Labor Warranty: ${data.labor_warranty}` : null,
          data.part_warranty ? `Part Warranty: ${data.part_warranty}` : null,
          data.notes ? `Notes: ${data.notes}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        image_url: finalImageUrl || null,
      } as any;

      await createHomeMaintenanceMutation.mutateAsync(payload);

      reset();
      setImageFile(null);
      setImageUrl("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating maintenance task:", error);
      const message = error?.message || "Failed to create maintenance task";
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg p-0 gap-0 border border-gray-200 shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add Maintenance Task
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
              <Label className="text-sm font-medium text-gray-700">
                Item / System Serviced *
              </Label>
              <div className="flex gap-2">
                <select
                  {...register("task_name")}
                  className="w-1/2 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select system</option>
                  {HOME_MAINTENANCE_SYSTEMS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Custom / details"
                  className="w-1/2 px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register("notes")}
                />
              </div>
              {errors.task_name && (
                <p className="text-sm text-red-600">
                  {errors.task_name.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Service Provider / Company *
                </Label>
                <Input
                  id="service_company"
                  {...register("service_company")}
                  placeholder="ABC HVAC Services"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.service_company && (
                  <p className="text-sm text-red-600">
                    {errors.service_company.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Date of Service *
                </Label>
                <Input
                  id="service_date"
                  type="date"
                  {...register("service_date")}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.service_date && (
                  <p className="text-sm text-red-600">
                    {errors.service_date.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <Label className="text-sm font-medium text-gray-700">
                  Cost (Optional)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  {...register("cost", { valueAsNumber: true })}
                  placeholder="150.00"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Labor Warranty
                </Label>
                <select
                  {...register("labor_warranty")}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">None</option>
                  {LABOR_PART_WARRANTY.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Part Warranty
                </Label>
                <select
                  {...register("part_warranty")}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">None</option>
                  {LABOR_PART_WARRANTY.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Findings (Optional)
              </Label>
              <Textarea
                id="findings"
                {...register("findings")}
                placeholder="Inspection findings, recommendations..."
                rows={3}
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Upload Receipt / Report (Optional)
              </Label>
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                onRemove={() => {
                  setImageUrl("");
                  setImageFile(null);
                }}
                disabled={createHomeMaintenanceMutation.isPending}
              />
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
                disabled={createHomeMaintenanceMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {createHomeMaintenanceMutation.isPending
                  ? "Creating..."
                  : "Create Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
