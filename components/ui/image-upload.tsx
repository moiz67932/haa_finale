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
  compact?: boolean; // slightly smaller
  small?: boolean; // very small inline control
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  compact = false,
  small = false,
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

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) {
          // Fallback: data URL preview
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
      } catch (err) {
        console.error(err);
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
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxFiles: 1,
    disabled: disabled || uploading,
  });

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {value ? (
        <div className="relative">
          <img
            src={value || "/placeholder.svg"}
            alt="Upload"
            className={`${small ? "w-48 h-10" : "w-full"} ${
              !small && (compact ? "h-32" : "h-48")
            } object-cover rounded-lg border border-gray-200`}
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
          className={`border-2 border-dashed border-gray-300 rounded-lg ${
            compact ? "p-4" : "p-8"
          } ${
            small
              ? "inline-flex w-48 h-10 items-center justify-center"
              : "w-full text-center"
          } cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : "hover:border-gray-400 hover:bg-gray-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          {small ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Click to upload
              </div>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center ${
                compact ? "space-y-1" : "space-y-2"
              }`}
            >
              <div
                className={`${
                  compact ? "w-8 h-8" : "w-12 h-12"
                } bg-gray-100 rounded-full flex items-center justify-center`}
              >
                <ImageIcon
                  className={`${compact ? "w-4 h-4" : "w-6 h-6"} text-gray-400`}
                />
              </div>
              <div
                className={
                  compact ? "text-xs text-gray-600" : "text-sm text-gray-600"
                }
              >
                {uploading ? (
                  <span>Uploading...</span>
                ) : (
                  <>
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </>
                )}
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
