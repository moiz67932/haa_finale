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
import { ImageUpload } from "@/components/ui/image-upload";
import { useCreateHome } from "@/hooks/use-homes";
import { useSupabase } from "@/components/providers/supabase-provider";
import { X } from "lucide-react";

const homeSchema = z.object({
  nickname: z.string().min(1, "Home nickname is required"),
  address: z.string().optional(),
  // Remove image_url from schema completely
});

type HomeForm = z.infer<typeof homeSchema>;

interface CreateHomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateHomeDialog({
  open,
  onOpenChange,
}: CreateHomeDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useSupabase();
  const createHomeMutation = useCreateHome();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HomeForm>({
    resolver: zodResolver(homeSchema),
  });

  const onSubmit = async (data: HomeForm) => {
    if (!user) return;

    try {
      await createHomeMutation.mutateAsync({
        ...data,
        image_url: imageUrl && imageUrl.trim() !== "" ? imageUrl : null,
        user_id: user.id,
      });

      reset();
      setImageUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating home:", error);
    }
  };

  const handleClose = () => {
    reset();
    setImageUrl("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Add New Home
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="nickname"
              className="text-sm font-medium text-gray-700"
            >
              Home Nickname
            </Label>
            <Input
              id="nickname"
              {...register("nickname")}
              placeholder="e.g., Main House, Vacation Home"
              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.nickname && (
              <p className="text-sm text-red-600">{errors.nickname.message}</p>
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
              placeholder="123 Main St, City, State"
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
              disabled={createHomeMutation.isPending}
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
              disabled={createHomeMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createHomeMutation.isPending ? "Adding..." : "Add Home"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
