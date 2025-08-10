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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCreateOutsideItem } from "@/hooks/use-supabase-query";
import { uploadPublicImage } from "@/lib/storage";
import { X } from "lucide-react";

const outsideItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  type: z.enum(["Fence", "Irrigation", "Lighting", "Lawn", "Other"]),
  notes: z.string().optional(),
});

type OutsideItemForm = z.infer<typeof outsideItemSchema>;

interface CreateOutsideItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeId: string;
}

export function CreateOutsideItemDialog({
  open,
  onOpenChange,
  homeId,
}: CreateOutsideItemDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const createOutsideItemMutation = useCreateOutsideItem();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OutsideItemForm>({
    resolver: zodResolver(outsideItemSchema),
  });

  const onSubmit = async (data: OutsideItemForm) => {
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(imageFile, "outside-items");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      await createOutsideItemMutation.mutateAsync({
        home_id: homeId,
        name: data.name,
        type: data.type,
        notes: data.notes || null,
        image_url: finalImageUrl || null,
      });

      reset();
      setImageFile(null);
      setImageUrl("");
      setSelectedType("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating outside item:", error);
    }
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImageUrl("");
    setSelectedType("");
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
                Add Outside Item
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
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Item Name *
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Front Yard Sprinkler System"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="type"
                className="text-sm font-medium text-gray-700"
              >
                Type *
              </Label>
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value);
                  setValue("type", value as any);
                }}
              >
                <SelectTrigger className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fence">Fence</SelectItem>
                  <SelectItem value="Irrigation">Irrigation</SelectItem>
                  <SelectItem value="Lighting">Lighting</SelectItem>
                  <SelectItem value="Lawn">Lawn</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
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
                placeholder="Additional details about this item..."
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
                disabled={createOutsideItemMutation.isPending}
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
                disabled={createOutsideItemMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {createOutsideItemMutation.isPending
                  ? "Creating..."
                  : "Create Item"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
