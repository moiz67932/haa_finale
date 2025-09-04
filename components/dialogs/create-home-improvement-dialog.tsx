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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCreateProject } from "@/hooks/use-supabase-query";
import { useServiceProviders } from "@/hooks/use-service-providers";
import { HOME_IMPROVEMENT_MATERIAL_CATEGORIES } from "@/lib/constants";
import { X } from "lucide-react";

const improvementSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  materials_category: z.string().optional(),
  contractor_id: z.string().optional(),
  contractor_name: z.string().optional(),
});

type ImprovementForm = z.infer<typeof improvementSchema>;

interface CreateHomeImprovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeId: string;
}

export function CreateHomeImprovementDialog({ open, onOpenChange, homeId }: CreateHomeImprovementDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const createImprovement = useCreateProject();
  const { data: providers } = useServiceProviders();

  const providerOptions = useMemo(() => {
    return (providers || []).map((p: any) => ({ id: p.id, name: p.name }));
  }, [providers]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ImprovementForm>({
    resolver: zodResolver(improvementSchema),
  });

  const onSubmit = async (data: ImprovementForm) => {
    try {
      await createImprovement.mutateAsync({
        home_id: homeId,
        project_name: data.project_name,
        notes: [
          data.description ? `Description: ${data.description}` : null,
          data.materials_category ? `Materials: ${data.materials_category}` : null,
          data.contractor_id ? `ContractorId: ${data.contractor_id}` : data.contractor_name ? `Contractor: ${data.contractor_name}` : null,
        ].filter(Boolean).join("\n"),
        image_url: imageUrl || null,
      } as any);
      reset();
      setImageUrl("");
      setInvoiceUrl("");
      onOpenChange(false);
    } catch (e) {
      console.error("Improvement create error", e);
    }
  };

  const handleClose = () => {
    reset();
    setImageUrl("");
    setInvoiceUrl("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-0 gap-0 border border-gray-200 shadow-lg">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">Add Home Improvement</DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full">
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4 bg-white">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Project Name *</Label>
              <Input {...register("project_name")} placeholder="Basement Remodel" className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              {errors.project_name && <p className="text-sm text-red-600">{errors.project_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Project Description *</Label>
              <Textarea {...register("description")} placeholder="Scope, goals, phases..." rows={3} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />
              {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Materials Category</Label>
                <select {...register("materials_category")} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select category</option>
                  {HOME_IMPROVEMENT_MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Vendor / Contractor</Label>
                <select {...register("contractor_id")} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select saved provider</option>
                  {providerOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Input {...register("contractor_name")} placeholder="Or enter new provider" className="mt-2 w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Upload Photo (Optional)</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} onRemove={() => setImageUrl("")} disabled={createImprovement.isPending} />
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={handleClose} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent rounded-md">Cancel</Button>
              <Button type="submit" disabled={createImprovement.isPending} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium">{createImprovement.isPending ? "Creating..." : "Add Improvement"}</Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
