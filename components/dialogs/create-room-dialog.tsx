"use client";

import { useState, useEffect } from "react";
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
import { useCreateRoom } from "@/hooks/use-supabase-query";
import { uploadPublicImage } from "@/lib/storage";
import { X } from "lucide-react";
import { ROOM_CATEGORY_MAP } from "@/lib/constants";

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  paint_color: z.string().optional(),
  flooring: z.string().optional(),
  installer: z.string().optional(),
  purchase_from: z.string().optional(),
  warranty_provider: z.string().optional(),
  warranty_start_date: z.string().optional(),
  warranty_end_date: z.string().optional(),
  warranty_notes: z.string().optional(),
});

type RoomForm = z.infer<typeof roomSchema>;

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeId: string;
}

export function CreateRoomDialog({
  open,
  onOpenChange,
  homeId,
}: CreateRoomDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [features, setFeatures] = useState({
    warranty: true,
    installer: true,
    purchase: true,
  });
  const createRoomMutation = useCreateRoom();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RoomForm>({
    resolver: zodResolver(roomSchema),
  });

  // Sync selected roomType into the name field (user can still override manually later)
  useEffect(() => {
    if (roomType) {
      setValue("name", roomType, { shouldDirty: true, shouldValidate: true });
    }
  }, [roomType, setValue]);

  const onSubmit = async (data: RoomForm) => {
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(imageFile, "rooms");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      // Build warranty JSON only if warranty feature is enabled
      let warranty_json = null;
      if (features.warranty) {
        if (
          data.warranty_provider ||
          data.warranty_start_date ||
          data.warranty_end_date ||
          data.warranty_notes
        ) {
          warranty_json = {
            provider: data.warranty_provider || null,
            start_date: data.warranty_start_date || null,
            end_date: data.warranty_end_date || null,
            notes: data.warranty_notes || null,
          };
        }
      }

      await createRoomMutation.mutateAsync({
        home_id: homeId,
        name: data.name,
        paint_color: data.paint_color || null,
        flooring: data.flooring || null,
        installer: features.installer ? data.installer || null : null,
        purchase_from: features.purchase ? data.purchase_from || null : null,
        warranty_json,
        image_url: finalImageUrl || null,
      });

      reset();
      setImageFile(null);
      setImageUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating room:", error);
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
                Add New Room
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setRoomType("");
                  }}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md cursor-pointer hover:border-transparent transition-colors"
                >
                  <option value="">Select category</option>
                  {Object.keys(ROOM_CATEGORY_MAP).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Room Type
                </Label>
                <select
                  value={roomType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRoomType(val);
                  }}
                  disabled={!category}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md disabled:opacity-50 cursor-pointer hover:border-transparent transition-colors"
                >
                  <option value="">{category ? "Select room type" : "Select category first"}</option>
                  {category &&
                    ROOM_CATEGORY_MAP[category].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Room Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Living Room"
                  defaultValue={roomType}
                  value={undefined}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={() => { /* allow manual override via react-hook-form */ }}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Paint Color
                </Label>
                <Input
                  id="paint_color"
                  {...register("paint_color")}
                  placeholder="Beige"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="flooring"
                  className="text-sm font-medium text-gray-700"
                >
                  Flooring
                </Label>
                <Input
                  id="flooring"
                  {...register("flooring")}
                  placeholder="Hardwood"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="installer"
                  className="text-sm font-medium text-gray-700"
                >
                  Installer
                </Label>
                <Input
                  id="installer"
                  {...register("installer")}
                  placeholder="ABC Flooring Co."
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Additional Fields
              </Label>
              <div className="flex flex-wrap items-center gap-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={features.warranty}
                    onChange={(e) =>
                      setFeatures({ ...features, warranty: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Warranty</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={features.installer}
                    onChange={(e) =>
                      setFeatures({ ...features, installer: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Installer</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={features.purchase}
                    onChange={(e) =>
                      setFeatures({ ...features, purchase: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Purchase</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="purchase_from"
                className="text-sm font-medium text-gray-700"
              >
                Purchased From
              </Label>
              <Input
                id="purchase_from"
                {...register("purchase_from")}
                placeholder="Home Depot"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Warranty / Installer / Purchase Sections (conditionally shown) */}
            {features.warranty && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900">
                  Warranty Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="warranty_provider"
                      className="text-sm font-medium text-gray-700"
                    >
                      Warranty Provider
                    </Label>
                    <Input
                      id="warranty_provider"
                      {...register("warranty_provider")}
                      placeholder="Manufacturer"
                      className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="warranty_start_date"
                      className="text-sm font-medium text-gray-700"
                    >
                      Warranty Start Date
                    </Label>
                    <Input
                      id="warranty_start_date"
                      type="date"
                      {...register("warranty_start_date")}
                      className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="warranty_end_date"
                      className="text-sm font-medium text-gray-700"
                    >
                      Warranty End Date
                    </Label>
                    <Input
                      id="warranty_end_date"
                      type="date"
                      {...register("warranty_end_date")}
                      className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="warranty_notes"
                      className="text-sm font-medium text-gray-700"
                    >
                      Warranty Notes
                    </Label>
                    <Textarea
                      id="warranty_notes"
                      {...register("warranty_notes")}
                      placeholder="Additional warranty details..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {features.installer && (
              <div className="space-y-2">
                <Label
                  htmlFor="installer"
                  className="text-sm font-medium text-gray-700"
                >
                  Installer
                </Label>
                <Input
                  id="installer"
                  {...register("installer")}
                  placeholder="Installer name"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {features.purchase && (
              <div className="space-y-2">
                <Label
                  htmlFor="purchase_from"
                  className="text-sm font-medium text-gray-700"
                >
                  Purchased From
                </Label>
                <Input
                  id="purchase_from"
                  {...register("purchase_from")}
                  placeholder="Store or vendor"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

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
                disabled={createRoomMutation.isPending}
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
                disabled={createRoomMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {createRoomMutation.isPending ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
