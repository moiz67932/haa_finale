"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
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
import { useCreateVehicleRepair } from "@/hooks/use-supabase-query";
import { uploadPublicImage } from "@/lib/storage";
import { X } from "lucide-react";

const vehicleRepairSchema = z.object({
  repair_type: z.string().min(1, "Repair type is required"),
  service_date: z.string().min(1, "Service date is required"),
  mileage: z.number().min(0, "Mileage is required"),
  cost: z.number().min(0).optional(),
  repair_facility: z.string().optional(),
  finding: z.string().optional(),
  part_warranty: z.string().optional(),
  labor_warranty: z.string().optional(),
});

type VehicleRepairForm = z.infer<typeof vehicleRepairSchema>;

interface CreateVehicleRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
}

export function CreateVehicleRepairDialog({
  open,
  onOpenChange,
  vehicleId,
}: CreateVehicleRepairDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const createVehicleRepairMutation = useCreateVehicleRepair();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleRepairForm>({
    resolver: zodResolver(vehicleRepairSchema),
  });

  const onSubmit = async (data: VehicleRepairForm) => {
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(
          imageFile,
          "vehicle-repairs"
        );
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      await createVehicleRepairMutation.mutateAsync({
        vehicle_id: vehicleId,
        repair_type: data.repair_type,
        service_date: data.service_date,
        mileage: data.mileage,
        cost: data.cost || null,
        repair_facility: data.repair_facility || null,
        finding: data.finding || null,
        part_warranty: data.part_warranty || null,
        labor_warranty: data.labor_warranty || null,
        image_url: finalImageUrl || null,
      });

      reset();
      setImageFile(null);
      setImageUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating vehicle repair:", error);
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
                Add Repair Record
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
                htmlFor="repair_type"
                className="text-sm font-medium text-gray-700"
              >
                Repair Type *
              </Label>
              <Input
                id="repair_type"
                {...register("repair_type")}
                placeholder="Brake Pad Replacement"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.repair_type && (
                <p className="text-sm text-red-600">
                  {errors.repair_type.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="service_date"
                  className="text-sm font-medium text-gray-700"
                >
                  Service Date *
                </Label>
                <Input
                  id="service_date"
                  type="date"
                  {...register("service_date")}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.service_date && (
                  <p className="text-sm text-red-600">
                    {errors.service_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mileage"
                  className="text-sm font-medium text-gray-700"
                >
                  Mileage *
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  {...register("mileage", { valueAsNumber: true })}
                  placeholder="50000"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.mileage && (
                  <p className="text-sm text-red-600">
                    {errors.mileage.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="350.00"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="repair_facility"
                  className="text-sm font-medium text-gray-700"
                >
                  Repair Facility
                </Label>
                <Input
                  id="repair_facility"
                  {...register("repair_facility")}
                  placeholder="ABC Auto Repair"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="finding"
                className="text-sm font-medium text-gray-700"
              >
                Finding
              </Label>
              <Textarea
                id="finding"
                {...register("finding")}
                placeholder="What was found during inspection..."
                rows={2}
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="part_warranty"
                  className="text-sm font-medium text-gray-700"
                >
                  Part Warranty End Date
                </Label>
                <Input
                  id="part_warranty"
                  type="date"
                  {...register("part_warranty")}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="labor_warranty"
                  className="text-sm font-medium text-gray-700"
                >
                  Labor Warranty End Date
                </Label>
                <Input
                  id="labor_warranty"
                  type="date"
                  {...register("labor_warranty")}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
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
                disabled={createVehicleRepairMutation.isPending}
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
                disabled={createVehicleRepairMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {createVehicleRepairMutation.isPending
                  ? "Creating..."
                  : "Create Record"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
