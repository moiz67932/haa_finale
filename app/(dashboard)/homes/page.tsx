"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar, Home } from "lucide-react";
import { useHomes } from "@/hooks/use-homes";
import { Spinner } from "@/components/ui/spinner";
import { PageTransition } from "@/components/layout/page-transition";
import { CreateHomeDialog } from "@/components/dialogs/create-home-dialog";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: homes, isLoading } = useHomes();

  // Do not auto-open the create form. If there are no homes we'll highlight the Add button.

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PageTransition>
      <div className="w-full p-8 bg-white rounded-2xl shadow-sm">
        {/* Small homes carousel (add images under /public/carousels/homes-*.jpg) */}
        <div className="mb-6 h-[40vh] w-full">
          <Carousel className="w-full h-full">
            <CarouselPrevious />
            <CarouselContent className="flex h-full">
              {[
                "/carousels/homes-1.png",
                "/carousels/homes-2.png",
                "/carousels/homes-3.png",
              ].map((src, index) => (
                <CarouselItem key={index} className="h-full w-full">
                  <Image
                    src={src}
                    alt="Home image"
                    fill
                    className="object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
          </Carousel>
        </div>
        <div className="flex items-start justify-between mb-8 relative">
          <div className="pr-4">
            <h1 className="text-3xl font-bold text-gray-800">My Homes</h1>
            <p className="text-gray-500 mt-2">
              Manage your properties and keep track of everything
            </p>
          </div>
          <div className="relative">
            <CreateHomeDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
            />
          </div>
        </div>

        {homes && homes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homes.map((home, index) => (
              <motion.div
                key={home.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/homes/${home.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden bg-white border border-gray-200 rounded-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4 text-gray-800">
                        {home.nickname || "Unnamed Home"}
                      </h3>
                      <div className="aspect-video relative rounded-xl bg-gray-100 mb-4">
                        {home.image_url ? (
                          <Image
                            src={home.image_url || "/placeholder.svg"}
                            alt={home.nickname || "Home"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                              <Home className="w-8 h-8 text-blue-500" />
                            </div>
                          </div>
                        )}
                      </div>
                      {home.address && (
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{home.address}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Added {new Date(home.created_at).toLocaleDateString()}
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
              <Home className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No homes yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first home
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Home
            </Button>
          </div>
        )}

        {/* Inline form now lives in header above */}
      </div>
    </PageTransition>
  );
}
