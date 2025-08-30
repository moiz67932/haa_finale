"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Phone, Mail, MapPin, Filter } from "lucide-react";
import { useServiceProviders } from "@/hooks/use-service-providers";
import { Spinner } from "@/components/ui/spinner";
import { PageTransition } from "@/components/layout/page-transition";
import { CreateServiceProviderDialog } from "@/components/dialogs/create-service-provider-dialog";
import { StarRating } from "@/components/ui/star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "All Categories",
  "Plumber",
  "Electrician",
  "HVAC",
  "Contractor",
  "Landscaper",
  "Painter",
  "Roofer",
  "Mechanic",
  "Other",
];

export default function ServiceProvidersPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [openContact, setOpenContact] = useState<{
    providerId: string | null;
    kind: "phone" | "email" | null;
  }>({ providerId: null, kind: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { data: providers, isLoading } = useServiceProviders();

  const toggleContact = (providerId: string, kind: "phone" | "email") => {
    if (openContact.providerId === providerId && openContact.kind === kind) {
      setOpenContact({ providerId: null, kind: null });
    } else {
      setOpenContact({ providerId, kind });
    }
  };

  const filteredProviders = providers?.filter((provider) => {
    const matchesSearch =
      !searchQuery ||
      provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      provider.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <Spinner />;
  }

  const noProviders = !providers || providers.length === 0;

  return (
    <PageTransition>
      <div className="w-full p-8 bg-white rounded-2xl shadow-sm">
        <div className="flex items-start justify-between mb-8 relative">
          <div className="pr-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Service Providers
            </h1>
            <p className="text-gray-600 mt-2">
              Find trusted professionals for your home and vehicle needs
            </p>
          </div>
          <div className="relative flex flex-col items-end gap-3">
            <CreateServiceProviderDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
            />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-300">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border border-gray-300 rounded-lg">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="hover:bg-gray-100"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.slice(1).map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {filteredProviders && filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-300 rounded-lg">
                  <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1 text-gray-900">
                          {provider.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="mb-2 bg-gray-100 text-gray-600"
                        >
                          {provider.category}
                        </Badge>
                      </div>
                    </div>

                    {provider.rating && (
                      <div className="flex items-center mb-3">
                        <StarRating rating={provider.rating} size="sm" />
                        <span className="ml-2 text-sm text-gray-600">
                          {provider.rating.toFixed(1)} (0 reviews)
                        </span>
                      </div>
                    )}

                    {provider.address && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{provider.address}</span>
                      </div>
                    )}

                    <div className="flex gap-2 mb-4">
                      {provider.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleContact(provider.id, "phone")}
                          className="flex-1 bg-transparent border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      )}
                      {provider.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleContact(provider.id, "email")}
                          className="flex-1 bg-transparent border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      )}
                    </div>

                    <AnimatePresence>
                      {openContact.providerId === provider.id &&
                        openContact.kind === "phone" && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="absolute right-6 top-28 z-50 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-gray-800"
                          >
                            <div className="flex items-start justify-between">
                              <div className="text-sm font-medium">Phone</div>
                              <button
                                onClick={() =>
                                  setOpenContact({
                                    providerId: null,
                                    kind: null,
                                  })
                                }
                                className="text-gray-400 hover:text-gray-600 ml-2"
                                aria-label="Close"
                              >
                                ×
                              </button>
                            </div>
                            <div className="mt-2 text-sm break-words">
                              <a
                                href={`tel:${provider.phone}`}
                                className="text-sky-600 hover:underline"
                              >
                                {provider.phone}
                              </a>
                            </div>
                          </motion.div>
                        )}

                      {openContact.providerId === provider.id &&
                        openContact.kind === "email" && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="absolute right-6 top-28 z-50 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-gray-800"
                          >
                            <div className="flex items-start justify-between">
                              <div className="text-sm font-medium">Email</div>
                              <button
                                onClick={() =>
                                  setOpenContact({
                                    providerId: null,
                                    kind: null,
                                  })
                                }
                                className="text-gray-400 hover:text-gray-600 ml-2"
                                aria-label="Close"
                              >
                                ×
                              </button>
                            </div>
                            <div className="mt-2 text-sm break-words">
                              <a
                                href={`mailto:${provider.email}`}
                                className="text-sky-600 hover:underline"
                              >
                                {provider.email}
                              </a>
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>

                    {provider.tags && provider.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {provider.tags.slice(0, 3).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-gray-300 text-gray-600 hover:bg-gray-100"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedCategory !== "All Categories"
                ? "No providers found"
                : "No service providers yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== "All Categories"
                ? "Try adjusting your search or filters"
                : "Be the first to add a service provider"}
            </p>
            {!searchQuery && selectedCategory === "All Categories" && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service Provider
              </Button>
            )}
          </div>
        )}

        {/* Dialog lives in header above */}
      </div>
    </PageTransition>
  );
}
