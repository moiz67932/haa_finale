"use client";

import { useState, useMemo } from "react";
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
import { WARRANTY_OPTIONS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCreatePurchase, usePurchases } from "@/hooks/use-supabase-query";
import { uploadPublicImage } from "@/lib/storage";
import { X } from "lucide-react";

const purchaseSchema = z.object({
  item_name: z.string().min(1, "Item name is required"),
  cost: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.number().min(0).optional()
  ),
  purchase_date: z.string().min(1, "Purchase date is required"),
  retailer: z.string().min(1, "Retailer is required"),
  sku: z.string().optional(),
  warranty_end_date: z.string().optional(),
});

type PurchaseForm = z.infer<typeof purchaseSchema>;

interface CreatePurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeId: string;
}

export function CreatePurchaseDialog({
  open,
  onOpenChange,
  homeId,
}: CreatePurchaseDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const createPurchaseMutation = useCreatePurchase();
  const { data: existingPurchases } = usePurchases(homeId);

  const retailerOptions = useMemo(() => {
    const set = new Set<string>();
    existingPurchases?.forEach((p: any) => {
      if (p.notes) {
        const lines = String(p.notes).split(/\n|\r/);
        lines.forEach((line) => {
          const m = line.match(/Retailer:\s*(.+)/i);
            if (m && m[1]) set.add(m[1].trim());
        });
      }
    });
    return Array.from(set).sort();
  }, [existingPurchases]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
  });

  const onSubmit = async (data: PurchaseForm) => {
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(imageFile, "purchases");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      // retailer/sku are not columns in the purchases table schema;
      // persist them into the `notes` column to avoid schema mismatch.
      const retailerSkuNotes = [
        data.retailer ? `Retailer: ${data.retailer}` : null,
        data.sku ? `SKU: ${data.sku}` : null,
      ]
        .filter(Boolean)
        .join(" \n");

      await createPurchaseMutation.mutateAsync({
        home_id: homeId,
        item_name: data.item_name,
        cost: data.cost || null,
        purchase_date: data.purchase_date || null,
        warranty_end_date: data.warranty_end_date || null,
        notes: retailerSkuNotes || null,
        image_url: finalImageUrl || null,
      });

      reset();
      setImageFile(null);
      setImageUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating purchase:", error);
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg p-0 gap-0 border border-gray-200 shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add Purchase
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
                htmlFor="item_name"
                className="text-sm font-medium text-gray-700"
              >
                Item Name / Description *
              </Label>
              <Input
                id="item_name"
                {...register("item_name")}
                placeholder="Kitchen Faucet"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.item_name && (
                <p className="text-sm text-red-600">
                  {errors.item_name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="cost"
                  className="text-sm font-medium text-gray-700"
                >
                  Cost
                </Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  {...register("cost", { valueAsNumber: true })}
                  placeholder="299.99"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="purchase_date"
                  className="text-sm font-medium text-gray-700"
                >
                  Purchase Date *
                </Label>
                <Input
                  id="purchase_date"
                  type="date"
                  {...register("purchase_date")}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="retailer"
                  className="text-sm font-medium text-gray-700"
                >
                  Retailer *
                </Label>
                <Input
                  id="retailer"
                  list="retailer-options"
                  {...register("retailer")}
                  placeholder={retailerOptions.length ? "Select or type" : "Home Depot"}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <datalist id="retailer-options">
                  {retailerOptions.map((r) => (
                    <option value={r} key={r} />
                  ))}
                </datalist>
                {errors.retailer && (
                  <p className="text-sm text-red-600">
                    {errors.retailer.message as string}
                  </p>
                )}
                {retailerOptions.length > 0 && (
                  <p className="text-xs text-gray-500">Previously used retailers listed above.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sku"
                  className="text-sm font-medium text-gray-700"
                >
                  SKU
                </Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="ABC123"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Warranty
              </Label>
              <select
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  // Quick heuristic: set warranty_end_date based on selection if date empty
                  if (val === "6 months") {
                    const d = new Date();
                    d.setMonth(d.getMonth() + 6);
                    (document.getElementById("warranty_end_date") as HTMLInputElement | null)?.setAttribute(
                      "value",
                      d.toISOString().slice(0, 10)
                    );
                  } else if (val === "1 year") {
                    const d = new Date();
                    d.setFullYear(d.getFullYear() + 1);
                    (document.getElementById("warranty_end_date") as HTMLInputElement | null)?.setAttribute(
                      "value",
                      d.toISOString().slice(0, 10)
                    );
                  } else if (val === "2 years") {
                    const d = new Date();
                    d.setFullYear(d.getFullYear() + 2);
                    (document.getElementById("warranty_end_date") as HTMLInputElement | null)?.setAttribute(
                      "value",
                      d.toISOString().slice(0, 10)
                    );
                  }
                }}
              >
                <option value="">Select warranty</option>
                {WARRANTY_OPTIONS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <Input
                id="warranty_end_date"
                type="date"
                {...register("warranty_end_date")}
                className="mt-2 w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Selecting a warranty will auto-suggest an end date which you can adjust.
              </p>
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
                disabled={createPurchaseMutation.isPending}
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
                disabled={createPurchaseMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {createPurchaseMutation.isPending
                  ? "Creating..."
                  : "Create Purchase"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
