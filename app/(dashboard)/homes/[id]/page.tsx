"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHome } from "@/hooks/use-homes"; // Changed from useHomes to useHome
import { useHomeDetail } from "@/hooks/use-supabase-query";
import { PageTransition } from "@/components/layout/page-transition";
import AuthGuard from "@/components/auth-guard";
import {
  ArrowLeft,
  Plus,
  Home,
  TreePine,
  ShoppingCart,
  Wrench,
  Hammer,
} from "lucide-react";
import Link from "next/link";

function HomeDetailContent() {
  const params = useParams();
  const homeId = params.id as string;

  const {
    data: home,
    isLoading: homeLoading,
    error: homeError,
  } = useHome(homeId); // Use useHome hook
  const { rooms, outsideItems, purchases, maintenance, improvements } =
    useHomeDetail(homeId);

  if (homeLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/homes">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Homes</span>
              </Button>
            </Link>
          </div>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading home...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (homeError || !home) {
    console.error("Home error:", homeError);
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/homes">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Homes</span>
              </Button>
            </Link>
          </div>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Home not found
              </h3>
              <p className="text-gray-600 mb-4">
                The home you're looking for doesn't exist or you don't have
                access to it.
              </p>
              <p className="text-sm text-gray-500">Home ID: {homeId}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/homes">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Homes</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {home.nickname || "Unnamed Home"}
                </h1>
                {home.address && (
                  <p className="text-gray-600 mt-1">{home.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="rooms" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger
                value="rooms"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Home className="w-4 h-4" />
                <span>Rooms</span>
              </TabsTrigger>
              <TabsTrigger
                value="outside"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <TreePine className="w-4 h-4" />
                <span>Outside</span>
              </TabsTrigger>
              <TabsTrigger
                value="purchases"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Purchases</span>
              </TabsTrigger>
              <TabsTrigger
                value="maintenance"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Wrench className="w-4 h-4" />
                <span>Maintenance</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Hammer className="w-4 h-4" />
                <span>Projects</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rooms" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Rooms
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Room
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {rooms.isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <Skeleton className="w-16 h-16 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : rooms.data && rooms.data.length > 0 ? (
                    <div className="space-y-4">
                      {rooms.data.map((room, index) => (
                        <motion.div
                          key={room.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Home className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {room.name || "Unnamed Room"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {room.paint_color && `Paint: ${room.paint_color}`}
                              {room.flooring && ` • Flooring: ${room.flooring}`}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No rooms yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start by adding your first room
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Room
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outside" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Outside Items
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {outsideItems.isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <Skeleton className="w-16 h-16 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : outsideItems.data && outsideItems.data.length > 0 ? (
                    <div className="space-y-4">
                      {outsideItems.data.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                            <TreePine className="w-8 h-8 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {item.name || "Unnamed Item"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.type && `Type: ${item.type}`}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TreePine className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No outside items yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Track your outdoor equipment and features
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Purchases
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Purchase
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {purchases.isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <Skeleton className="w-16 h-16 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : purchases.data && purchases.data.length > 0 ? (
                    <div className="space-y-4">
                      {purchases.data.map((purchase, index) => (
                        <motion.div
                          key={purchase.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {purchase.item_name || "Unnamed Purchase"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {purchase.cost && `$${purchase.cost}`}
                              {purchase.purchase_date &&
                                ` • ${new Date(
                                  purchase.purchase_date
                                ).toLocaleDateString()}`}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No purchases yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Track your home-related purchases and warranties
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Purchase
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Maintenance
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {maintenance.isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <Skeleton className="w-16 h-16 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : maintenance.data && maintenance.data.length > 0 ? (
                    <div className="space-y-4">
                      {maintenance.data.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Wrench className="w-8 h-8 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {task.task_name || "Unnamed Task"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {task.due_date &&
                                `Due: ${new Date(
                                  task.due_date
                                ).toLocaleDateString()}`}
                              {task.is_completed && " • Completed"}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wrench className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No maintenance tasks yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Keep track of your home maintenance schedule
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Projects
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {improvements.isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <Skeleton className="w-16 h-16 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : improvements.data && improvements.data.length > 0 ? (
                    <div className="space-y-4">
                      {improvements.data.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Hammer className="w-8 h-8 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {project.project_name || "Unnamed Project"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {project.completion_date &&
                                `Completed: ${new Date(
                                  project.completion_date
                                ).toLocaleDateString()}`}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Hammer className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No projects yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Document your home improvement projects
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}

export default function HomeDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthGuard>
        <HomeDetailContent />
      </AuthGuard>
    </Suspense>
  );
}
