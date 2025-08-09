"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Try to upload to the images bucket, if it doesn't exist, create a simple data URL
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) {
          // If bucket doesn't exist, fall back to creating a data URL for preview
          console.warn(
            "Storage bucket not found, using local preview:",
            uploadError
          );
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              onChange(e.target.result as string);
              toast.success("Image selected (preview only)");
            }
          };
          reader.readAsDataURL(file);
          return;
        }

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
        onChange(data.publicUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        // Fallback to data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
            toast.success("Image selected (preview only)");
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setUploading(false);
      }
    },
    [onChange, supabase]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    disabled: disabled || uploading,
  });

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative">
          <img
            src={value || "/placeholder.svg"}
            alt="Upload"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <Button
            type="button"
            onClick={onRemove}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-blue-400 bg-blue-50"
                : "hover:border-gray-400 hover:bg-gray-50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600">
              {uploading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <span className="font-medium">Click to upload</span> or drag
                  and drop
                </>
              )}
            </div>
            <div className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</div>
          </div>
        </div>
      )}
    </div>
  );
}
