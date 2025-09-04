"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { StarRating } from "@/components/ui/star-rating";
import { useCreateServiceProvider } from "@/hooks/use-service-providers";
import { useSupabase } from "@/components/providers/supabase-provider";
import { X } from "lucide-react";

import { SERVICE_PROVIDER_TOP_LEVEL_CATEGORIES, SERVICE_PROVIDER_CATEGORY_MAP } from "@/lib/constants";

const serviceProviderSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  service_type: z.string().min(1, "Service type is required"),
  service_subtype: z.string().optional(),
  service_area: z.string().min(1, "Service area is required"), // zip or city
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  reviews: z.string().optional(),
});

type ServiceProviderForm = z.infer<typeof serviceProviderSchema>;

interface CreateServiceProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateServiceProviderDialog({
  open,
  onOpenChange,
}: CreateServiceProviderDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [rating, setRating] = useState(5); // keep rating for future (not mandatory)
  const [selectedCategory, setSelectedCategory] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSupabase();
  const createProviderMutation = useCreateServiceProvider();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceProviderForm>({
    resolver: zodResolver(serviceProviderSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ServiceProviderForm) => {
    if (!user) return;

    try {
      await createProviderMutation.mutateAsync({
        name: data.name,
        category: data.service_type, // store top-level category in existing column
        tags: data.service_subtype ? [data.service_subtype] : null,
        address: data.service_area,
        image_url: imageUrl || null,
        website: data.website || null,
        reviews: data.reviews || null,
        rating,
        created_by: user.id,
      } as any);

      reset();
      setImageUrl("");
  setRating(5);
  setSelectedCategory("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating service provider:", error);
    }
  };

  const handleClose = () => {
    reset();
    setImageUrl("");
  setRating(5);
  setSelectedCategory("");
    onOpenChange(false);
  };

  // Close on Escape only (outside click handled via explicit overlay to avoid closing when interacting with portal-based selects)
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => onOpenChange(!open)}
        className={`relative focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${
          open ? "ring-2 ring-blue-400" : ""
        }`}
      >
        Add Provider
      </Button>

      {open && (
        <>
          {/* Clickable overlay – keeps clicks inside Radix Select portal from being misinterpreted as outside since we removed global listener */}
          <div
            className="fixed inset-0 z-40"
            onMouseDown={() => onOpenChange(false)}
            aria-hidden="true"
          />
          <motion.div
            ref={containerRef}
            className="absolute right-0 mt-2 w-[680px] max-h-[86vh] overflow-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-8"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Company Name *</Label>
                  <Input
                    {...register("name")}
                    placeholder="ABC Plumbing Services"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-blue-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Service Type *</Label>
                  {/* Hidden input to register with RHF */}
                  <input type="hidden" {...register("service_type")}/>
                  <Select
                    value={selectedCategory || undefined}
                    onValueChange={(val) => {
                      setSelectedCategory(val);
                      setValue("service_type", val, { shouldValidate: true });
                      setValue("service_subtype", "");
                    }}
                  >
                    <SelectTrigger className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&>span[data-placeholder]]:text-blue-500">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border border-gray-300 rounded-md max-h-72 overflow-auto">
                      {SERVICE_PROVIDER_TOP_LEVEL_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat} className="hover:bg-gray-100">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service_type && <p className="text-sm text-red-600">{errors.service_type.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Service Area (Zip/City) *</Label>
                  <Input
                    {...register("service_area")}
                    placeholder="90210 or Austin, TX"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-blue-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.service_area && <p className="text-sm text-red-600">{errors.service_area.message}</p>}
                </div>
              </div>

              {selectedCategory && SERVICE_PROVIDER_CATEGORY_MAP[selectedCategory] && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Sub-Category</Label>
                  <Select value={undefined} onValueChange={(val) => setValue("service_subtype", val, { shouldValidate: true })}>
                    <SelectTrigger className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&>span[data-placeholder]]:text-blue-500">
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border border-gray-300 rounded-md max-h-72 overflow-auto">
                      {SERVICE_PROVIDER_CATEGORY_MAP[selectedCategory].map(sub => (
                        <SelectItem key={sub} value={sub} className="hover:bg-gray-100">{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Website (Optional)</Label>
                  <Input
                    {...register("website")}
                    placeholder="https://provider.com"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-blue-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.website && <p className="text-sm text-red-600">{errors.website.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Logo (Optional)</Label>
                  <ImageUpload
                    value={imageUrl}
                    onChange={setImageUrl}
                    onRemove={() => setImageUrl("")}
                    disabled={createProviderMutation.isPending}
                    compact
                    small
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Customer Reviews (Optional)</Label>
                <Input
                  {...register("reviews")}
                  placeholder="e.g., 'Great service, very professional'"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-blue-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Rating (Optional)</Label>
                <div className="mt-1">
                  <StarRating rating={rating} interactive onChange={setRating} size="lg" />
                </div>
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
                  disabled={createProviderMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {createProviderMutation.isPending
                    ? "Adding..."
                    : "Add Provider"}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
}
