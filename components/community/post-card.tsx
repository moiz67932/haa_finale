"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpvotePost } from "@/hooks/use-supabase-query";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    image_url?: string;
    social_link_url?: string;
    upvotes: number;
    created_at: string;
  category?: string;
    profiles?: {
      id: string;
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const upvotePostMutation = useUpvotePost();

  const handleUpvote = async () => {
    if (hasUpvoted) return;

    try {
      await upvotePostMutation.mutateAsync(post.id);
      setHasUpvoted(true);
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.profiles?.avatar_url || ""} />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
              {post.profiles?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {post.profiles?.full_name || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-start flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {post.title}
            </h3>
            {post.category && (
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium px-2 py-1 border border-blue-200">
                {post.category}
              </Badge>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed">{post.content}</p>

          {/* Image */}
          {post.image_url && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={post.image_url || "/placeholder.svg"}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Link Preview */}
          {post.social_link_url && (
            <a
              href={post.social_link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-blue-600 hover:text-blue-700 truncate">
                {post.social_link_url}
              </span>
            </a>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs px-2 py-1"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={hasUpvoted || upvotePostMutation.isPending}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                hasUpvoted
                  ? "text-red-600 bg-red-50"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${hasUpvoted ? "fill-current" : ""}`}
              />
              <span className="text-sm font-medium">{post.upvotes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">0</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
