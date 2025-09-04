"use client";

import { useState, useRef, useEffect } from "react";
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
import { VEHICLE_MAKES, VEHICLE_MODELS } from "@/lib/constants";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 35 }, (_, i) => currentYear + 1 - i); // Next year + past 34

const vehicleSchema = z.object({
  year: z.string().min(1, "Year is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSupabase();
  const createVehicleMutation = useCreateVehicle();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    mode: "onChange",
  });

  const selectedMake = watch("make");
  const modelOptions = selectedMake ? VEHICLE_MODELS[selectedMake] || [] : [];

  const onSubmit = async (data: VehicleForm) => {
    if (!user) return;

    try {
      await createVehicleMutation.mutateAsync({
        ...data,
        year: parseInt(data.year, 10),
        image_url: imageUrl || null,
        user_id: user.id,
      } as any);

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

  // Close on outside click and escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => onOpenChange(!open)}
        className={`relative focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${
          open ? "ring-2 ring-blue-400" : ""
        }`}
      >
        Add New Vehicle
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" />
          <motion.div
            ref={containerRef}
            className="absolute right-0 mt-2 w-[520px] max-h-[84vh] overflow-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-6"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Year *</Label>
                  <select
                    {...register("year")}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {errors.year && <p className="text-sm text-red-600">{errors.year.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Make *</Label>
                  <select
                    {...register("make")}
                    onChange={(e) => {
                      setValue("make", e.target.value, { shouldValidate: true });
                      // Reset model when make changes
                      setValue("model", "", { shouldValidate: true });
                    }}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select make</option>
                    {VEHICLE_MAKES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {errors.make && <p className="text-sm text-red-600">{errors.make.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Model *</Label>
                  <select
                    {...register("model")}
                    onChange={(e) => setValue("model", e.target.value, { shouldValidate: true })}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedMake}
                    value={watch("model") || ""}
                  >
                    <option value="">{selectedMake ? "Select model" : "Select make first"}</option>
                    {modelOptions.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  {errors.model && <p className="text-sm text-red-600">{errors.model.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
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
                  <Label htmlFor="mileage" className="text-sm font-medium text-gray-700">Mileage (Optional)</Label>
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
                <Label className="text-sm font-medium text-gray-700">
                  Upload Image (Optional)
                </Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  onRemove={() => setImageUrl("")}
                  disabled={createVehicleMutation.isPending}
                  compact
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
                  {createVehicleMutation.isPending
                    ? "Adding..."
                    : "Add Vehicle"}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
}
