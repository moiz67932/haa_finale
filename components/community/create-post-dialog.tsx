"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { useCreatePost } from "@/hooks/use-supabase-query"
import { uploadPublicImage } from "@/lib/storage"
import { Plus, X } from "lucide-react"

const COMMUNITY_CATEGORIES = ["Home", "Auto", "DIY", "Recommendations"] as const
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(COMMUNITY_CATEGORIES, { required_error: "Category is required" }),
  tags: z.string().optional(),
  social_link_url: z.string().url("Invalid URL").optional().or(z.literal("")),
})

type PostForm = z.infer<typeof postSchema>

export function CreatePostDialog() {
  const [open, setOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const createPostMutation = useCreatePost()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
  })

  const onSubmit = async (data: PostForm) => {
    try {
      let finalImageUrl = imageUrl

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(imageFile, "posts")
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl
        }
      }

      const tags = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .slice(0, 10)
        : []

      await createPostMutation.mutateAsync({
        title: data.title,
        content: data.content,
        tags: tags.length > 0 ? tags : undefined,
        image_url: finalImageUrl || undefined,
        social_link_url: data.social_link_url || undefined,
        category: data.category,
      } as any)

      reset()
      setImageFile(null)
      setImageUrl("")
      setOpen(false)
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleClose = () => {
    reset()
    setImageFile(null)
    setImageUrl("")
    setOpen(false)
  }

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
    } else {
      setImageUrl("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-medium shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg p-0 gap-0 border border-gray-200 shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">Create New Post</DialogTitle>
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

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4 bg-white">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title *
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="What's your post about?"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category *</Label>
              <select
                id="category"
                {...register("category")}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {COMMUNITY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                Content *
              </Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Share your thoughts, tips, or ask a question..."
                rows={4}
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
                Tags (Optional)
              </Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="home, maintenance, DIY (comma separated, max 10)"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">Separate tags with commas (maximum 10 tags)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_link_url" className="text-sm font-medium text-gray-700">
                Link (Optional)
              </Label>
              <Input
                id="social_link_url"
                {...register("social_link_url")}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.social_link_url && <p className="text-sm text-red-600">{errors.social_link_url.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Upload Image (Optional)</Label>
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                onRemove={() => {
                  setImageUrl("")
                  setImageFile(null)
                }}
                disabled={createPostMutation.isPending}
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
                disabled={createPostMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {createPostMutation.isPending ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
