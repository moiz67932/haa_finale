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

const categories = [
  "Plumber",
  "Electrician",
  "HVAC",
  "Contractor",
  "Landscaper",
  "Painter",
  "Roofer",
  "Mechanic",
  "Other",
];

const serviceProviderSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  category: z.string().min(1, "Category is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  tags: z.string().optional(),
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
  const [rating, setRating] = useState(5);
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
  });

  const onSubmit = async (data: ServiceProviderForm) => {
    if (!user) return;

    try {
      const tags = data.tags
        ? data.tags.split(",").map((tag) => tag.trim())
        : [];

      await createProviderMutation.mutateAsync({
        ...data,
        rating: rating,
        tags: tags.length > 0 ? tags : null,
        image_url: imageUrl || null,
        created_by: user.id,
      });

      reset();
      setImageUrl("");
      setRating(5);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating service provider:", error);
    }
  };

  const handleClose = () => {
    reset();
    setImageUrl("");
    setRating(5);
    onOpenChange(false);
  };

  // Close on outside click / escape
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
        Add Provider
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" />
          <motion.div
            ref={containerRef}
            className="absolute right-0 mt-2 w-[680px] max-h-[86vh] overflow-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-8"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Business Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="ABC Plumbing Services"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ backgroundColor: "white" }}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700"
                  >
                    Category
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border border-gray-300 rounded-md">
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="hover:bg-gray-100"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone (Optional)
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ backgroundColor: "white" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="contact@business.com"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tags"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tags (Optional)
                  </Label>
                  <Input
                    id="tags"
                    {...register("tags")}
                    placeholder="licensed, insured, 24/7 service"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Separate tags with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Rating
                  </Label>
                  <div className="mt-2">
                    <StarRating
                      rating={rating}
                      interactive
                      onChange={setRating}
                      size="lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="col-span-2 space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address (Optional)
                  </Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="123 Business St, City, State"
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
                    disabled={createProviderMutation.isPending}
                    compact
                    small
                  />
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
