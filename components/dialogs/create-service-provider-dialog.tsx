"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg p-0 gap-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <style>
          {`
            /* Custom scrollbar styling */
            .scrollbar-thin::-webkit-scrollbar {
              width: 8px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
              background: transparent;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background-color: #d1d5db; /* Light gray */
              border-radius: 4px;
            }
          `}
        </style>
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Add Service Provider
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-black" />
            </Button>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-4 space-y-4 bg-white"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
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
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Category
            </Label>
            <Select onValueChange={(value) => setValue("category", value)}>
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
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="website"
              className="text-sm font-medium text-gray-700"
            >
              Website (Optional)
            </Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://www.business.com"
              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.website && (
              <p className="text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
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
            <Label className="text-sm font-medium text-gray-700">Rating</Label>
            <div className="mt-2">
              <StarRating
                rating={rating}
                interactive
                onChange={setRating}
                size="lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Tags (Optional)
            </Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="licensed, insured, 24/7 service"
              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500">Separate tags with commas</p>
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
              disabled={createProviderMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createProviderMutation.isPending ? "Adding..." : "Add Provider"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
