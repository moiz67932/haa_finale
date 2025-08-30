"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatePostDialog } from "@/components/community/create-post-dialog";
import { PostCard } from "@/components/community/post-card";
import {
  usePosts,
  useSuggestedPosts,
  useTrendingPosts,
} from "@/hooks/use-supabase-query";
import { PageTransition } from "@/components/layout/page-transition";
import AuthGuard from "@/components/auth-guard";
import { TrendingUp, Users } from "lucide-react";

function CommunityContent() {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: suggestedPosts, isLoading: suggestedLoading } =
    useSuggestedPosts();
  const { data: trendingPosts, isLoading: trendingLoading } =
    useTrendingPosts();

  return (
    <PageTransition>
      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="glass-panel rounded-3xl p-8 border border-white/40 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-400">
              Community
            </h1>
            <p className="text-slate-600 mt-3 text-base md:text-lg max-w-2xl">
              Connect with other homeowners and vehicle enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Create Post */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <Card className="glass-panel rounded-2xl border-white/40 shadow-md">
                  <CardContent className="p-4">
                    <CreatePostDialog />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {postsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card
                        key={i}
                        className="glass-panel rounded-2xl border-white/40"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                          <Skeleton className="h-6 w-3/4 mb-3" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post: any, index: any) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <PostCard post={post} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="glass-panel rounded-2xl border-white/40">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No posts yet
                      </h3>
                      <p className="text-gray-600">
                        Be the first to share something with the community!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Sidebar - Suggested & Trending */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Suggested Posts */}
                <Card className="glass-panel rounded-2xl border-white/40 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Latest Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {suggestedLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        ))}
                      </div>
                    ) : suggestedPosts && suggestedPosts.length > 0 ? (
                      <div className="space-y-3">
                        {suggestedPosts.map((post: any) => (
                          <div
                            key={post.id}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              by {post.profiles?.full_name || "Anonymous"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No recent posts</p>
                    )}
                  </CardContent>
                </Card>

                {/* Trending Posts */}
                <Card className="glass-panel rounded-2xl border-white/40 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                      Trending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {trendingLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        ))}
                      </div>
                    ) : trendingPosts && trendingPosts.length > 0 ? (
                      <div className="space-y-3">
                        {trendingPosts.map((post: any) => (
                          <div
                            key={post.id}
                            className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
                          >
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">
                                by {post.profiles?.full_name || "Anonymous"}
                              </p>
                              <span className="text-xs font-medium text-orange-600">
                                {post.upvotes} ❤️
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No trending posts</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthGuard>
        <CommunityContent />
      </AuthGuard>
    </Suspense>
  );
}
