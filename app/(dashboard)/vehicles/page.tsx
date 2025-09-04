"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Car } from "lucide-react";
import { useVehicles } from "@/hooks/use-vehicles";
import { Spinner } from "@/components/ui/spinner";
import { PageTransition } from "@/components/layout/page-transition";
import { CreateVehicleDialog } from "@/components/dialogs/create-vehicle-dialog";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function VehiclesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: vehicles, isLoading } = useVehicles();
  // Do not auto-open create form; we'll keep the button on-page and highlight when empty

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PageTransition>
      <div className="w-full p-8 bg-white rounded-2xl shadow-sm">
        {/* Small vehicles carousel (add images under /public/carousels/vehicles-*.jpg) */}
        <div className="mb-6 h-[40vh] w-full">
          <Carousel className="w-full h-full ">
            <CarouselPrevious />
            <CarouselContent className="flex h-full rounded-md">
              {[
                "/carousels/vehicles-1.png", // Flat tire
                "/carousels/vehicles-2.png", // Check engine light
                "/carousels/vehicles-3.png", // Oil change
                "/carousels/vehicles-4.png", // Battery issue
                "/carousels/vehicles-5.png", // Brake service
                "/carousels/vehicles-6.png", // AC / Heating
                "/carousels/vehicles-7.png", // Overheating
                "/carousels/vehicles-8.png", // Headlight out
                "/carousels/vehicles-9.png", // Transmission issue
                "/carousels/vehicles-10.png", // Routine maintenance
              ].map((src, index) => (
                <CarouselItem key={index} className="h-full rounded-md w-full p-0">
                  <div className="relative rounded-md h-full w-full bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center p-4">
                    <Image
                      src={src}
                      alt="Vehicle image"
                      fill
                      className="object-cover rounded-md drop-shadow-md !p-4"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
          </Carousel>
        </div>
        <div className="flex items-start justify-between mb-8 relative">
          <div className="pr-4">
            <h1 className="text-3xl font-bold text-gray-800">My Vehicles</h1>
            <p className="text-gray-500 mt-2">
              Track maintenance, repairs, and keep your vehicles running
              smoothly
            </p>
          </div>
          <div className="relative">
            <CreateVehicleDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
            />
          </div>
        </div>

        {vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/vehicles/${vehicle.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden bg-white border border-gray-200 rounded-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4 text-gray-800">
                        {vehicle.nickname ||
                          `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      </h3>
                      <div className="aspect-video relative bg-gray-100 mb-4 rounded-xl overflow-hidden">
                        {vehicle.image_url ? (
                          <Image
                            src={vehicle.image_url || "/placeholder.svg"}
                            alt={vehicle.nickname || "Vehicle"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                              <Car className="w-8 h-8 text-blue-500" />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-500 mb-2">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      {vehicle.mileage && (
                        <p className="text-sm text-gray-500 mb-2">
                          {vehicle.mileage.toLocaleString()} miles
                        </p>
                      )}
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Added{" "}
                          {new Date(vehicle.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No vehicles yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first vehicle
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </div>
        )}

        {/* Inline create vehicle form now lives in header above */}
      </div>
    </PageTransition>
  );
}
