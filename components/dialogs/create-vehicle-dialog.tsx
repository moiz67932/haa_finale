"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCreateVehicle } from "@/hooks/use-vehicles";
import { useSupabase } from "@/components/providers/supabase-provider";
import { X } from "lucide-react";

const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      if (typeof v === "number") return Number.isNaN(v) ? undefined : v;
      if (typeof v === "string") {
        const n = parseInt(v, 10);
        return Number.isNaN(n) ? undefined : n;
      }
      return v;
    },
    z
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 1)
  ),
  nickname: z.string().optional(),
  mileage: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    if (typeof v === "number") return Number.isNaN(v) ? undefined : v;
    if (typeof v === "string") {
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }
    return v;
  }, z.number().optional()),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

interface CreateVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateVehicleDialog({
  open,
  onOpenChange,
}: CreateVehicleDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useSupabase();
  const createVehicleMutation = useCreateVehicle();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
  });

  const onSubmit = async (data: VehicleForm) => {
    if (!user) return;

    try {
      await createVehicleMutation.mutateAsync({
        ...data,
        image_url: imageUrl || null,
        user_id: user.id,
      });

      reset();
      setImageUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };

  const handleClose = () => {
    reset();
    setImageUrl("");
    onOpenChange(false);
  };

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => onOpenChange(!open)}
        className={`relative focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          open ? "ring-2 ring-blue-400" : ""
        }`}
      >
        Add New Vehicle
      </Button>

      {open && (
        <motion.div className="absolute right-0 mt-2 w-[420px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="make"
                  className="text-sm font-medium text-gray-700"
                >
                  Make
                </Label>
                <Input
                  id="make"
                  {...register("make")}
                  placeholder="Toyota"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.make && (
                  <p className="text-sm text-red-600">{errors.make.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="model"
                  className="text-sm font-medium text-gray-700"
                >
                  Model
                </Label>
                <Input
                  id="model"
                  {...register("model")}
                  placeholder="Camry"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.model && (
                  <p className="text-sm text-red-600">{errors.model.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="year"
                  className="text-sm font-medium text-gray-700"
                >
                  Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  {...register("year", { valueAsNumber: true })}
                  placeholder="2020"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.year && (
                  <p className="text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mileage"
                  className="text-sm font-medium text-gray-700"
                >
                  Mileage (Optional)
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  {...register("mileage", { valueAsNumber: true })}
                  placeholder="50000"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="nickname"
                className="text-sm font-medium text-gray-700"
              >
                Nickname (Optional)
              </Label>
              <Input
                id="nickname"
                {...register("nickname")}
                placeholder="e.g., Daily Driver, Weekend Car"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Upload Image (Optional)
              </Label>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                onRemove={() => setImageUrl("")}
                disabled={createVehicleMutation.isPending}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createVehicleMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
