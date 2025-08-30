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
import { useCreateHome } from "@/hooks/use-homes";
import { useSupabase } from "@/components/providers/supabase-provider";
import { X } from "lucide-react";

const homeSchema = z.object({
  nickname: z.string().min(1, "Home nickname is required"),
  address: z.string().optional(),
  image_url: z.string().optional(),
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
  const containerRef = useRef<HTMLDivElement | null>(null);
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
        image_url: imageUrl || null,
        user_id: user.id,
      });
      reset();
      setImageUrl("");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
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
        Add Home
      </Button>

      {open && (
        <>
          {/* Lightweight overlay to capture outside clicks */}
          <div className="fixed inset-0 z-40" />
          <motion.div
            ref={containerRef}
            className="absolute right-0 mt-2 w-[420px] max-h-[80vh] overflow-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-6"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label
                  htmlFor="nickname"
                  className="text-sm font-medium text-gray-700"
                >
                  Home nickname
                </Label>
                <Input
                  id="nickname"
                  {...register("nickname")}
                  placeholder="Lake House"
                  className="mt-1 w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.nickname && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.nickname.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Address
                </Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="123 Main St, City"
                  className="mt-1 w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Image (Optional)
                </Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  onRemove={() => setImageUrl("")}
                  disabled={createHomeMutation.isPending}
                  compact
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 text-white">
                  Add
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
}
