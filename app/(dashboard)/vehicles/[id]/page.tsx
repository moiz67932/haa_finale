"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicle } from "@/hooks/use-vehicles";
import { useVehicleDetail } from "@/hooks/use-supabase-query";
import { PageTransition } from "@/components/layout/page-transition";
import AuthGuard from "@/components/auth-guard";
import { ArrowLeft, Plus, Wrench, AlertTriangle } from "lucide-react";
import Link from "next/link";

function VehicleDetailContent() {
  const params = useParams();
  const vehicleId = params.id as string;

  const {
    data: vehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicle(vehicleId);
  const { maintenance, repairs } = useVehicleDetail(vehicleId);

  // Calculate next service progress
  const getNextServiceProgress = () => {
    if (!vehicle?.mileage || !maintenance.data) return 0;

    const latestMaintenance = maintenance.data
      .filter((m) => m.next_service_mileage)
      .sort(
        (a, b) =>
          new Date(b.service_date || "").getTime() -
          new Date(a.service_date || "").getTime()
      )[0];

    if (!latestMaintenance?.next_service_mileage) return 0;

    const currentMileage = vehicle.mileage;
    const nextServiceMileage = latestMaintenance.next_service_mileage;
    const lastServiceMileage = latestMaintenance.mileage || 0;

    const totalInterval = nextServiceMileage - lastServiceMileage;
    const currentProgress = currentMileage - lastServiceMileage;

    return Math.min(Math.max((currentProgress / totalInterval) * 100, 0), 100);
  };

  if (vehicleLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/vehicles">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Vehicles</span>
              </Button>
            </Link>
          </div>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading vehicle...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (vehicleError || !vehicle) {
    console.error("Vehicle error:", vehicleError);
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/vehicles">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Vehicles</span>
              </Button>
            </Link>
          </div>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vehicle not found
              </h3>
              <p className="text-gray-600 mb-4">
                The vehicle you're looking for doesn't exist or you don't have
                access to it.
              </p>
              <p className="text-sm text-gray-500">Vehicle ID: {vehicleId}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const nextServiceProgress = getNextServiceProgress();

  return (
    <PageTransition>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/vehicles">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Vehicles</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {vehicle.nickname ||
                    `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                </h1>
                <p className="text-gray-600 mt-1">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                  {vehicle.mileage &&
                    ` • ${vehicle.mileage.toLocaleString()} miles`}
                </p>
              </div>
            </div>
          </div>

          {/* Service Progress */}
          <Card className="bg-white border border-gray-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-blue-600" />
                Next Service Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Service Progress
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(nextServiceProgress)}%
                  </span>
                </div>
                <Progress value={nextServiceProgress} className="h-3" />
                {nextServiceProgress > 80 && (
                  <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Service due soon
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="maintenance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger
                value="maintenance"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Wrench className="w-4 h-4" />
                <span>Maintenance</span>
              </TabsTrigger>
              <TabsTrigger
                value="repairs"
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Repairs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="maintenance" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Maintenance Records
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Maintenance
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
                      {maintenance.data.map((record, index) => (
                        <motion.div
                          key={record.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Wrench className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {record.service_type || "Service"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {record.service_date &&
                                `Date: ${new Date(
                                  record.service_date
                                ).toLocaleDateString()}`}
                              {record.mileage &&
                                ` • Mileage: ${record.mileage.toLocaleString()}`}
                              {record.cost && ` • Cost: $${record.cost}`}
                            </p>
                            {record.next_service_date && (
                              <p className="text-xs text-blue-600 mt-1">
                                Next service:{" "}
                                {new Date(
                                  record.next_service_date
                                ).toLocaleDateString()}
                              </p>
                            )}
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
                        No maintenance records yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start tracking your vehicle's maintenance history
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Maintenance
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="repairs" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Repair Records
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Repair
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {repairs.isLoading ? (
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
                  ) : repairs.data && repairs.data.length > 0 ? (
                    <div className="space-y-4">
                      {repairs.data.map((repair, index) => (
                        <motion.div
                          key={repair.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {repair.repair_type || "Repair"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {repair.service_date &&
                                `Date: ${new Date(
                                  repair.service_date
                                ).toLocaleDateString()}`}
                              {repair.mileage &&
                                ` • Mileage: ${repair.mileage.toLocaleString()}`}
                              {repair.cost && ` • Cost: $${repair.cost}`}
                            </p>
                            {(repair.part_warranty ||
                              repair.labor_warranty) && (
                              <div className="flex space-x-4 mt-1">
                                {repair.part_warranty && (
                                  <p className="text-xs text-green-600">
                                    Parts warranty until:{" "}
                                    {new Date(
                                      repair.part_warranty
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                                {repair.labor_warranty && (
                                  <p className="text-xs text-green-600">
                                    Labor warranty until:{" "}
                                    {new Date(
                                      repair.labor_warranty
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No repair records yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Track repairs and warranty information
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Repair
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

export default function VehicleDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthGuard>
        <VehicleDetailContent />
      </AuthGuard>
    </Suspense>
  );
}
