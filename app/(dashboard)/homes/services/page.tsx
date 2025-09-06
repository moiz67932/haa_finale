"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useServiceProviders } from "@/hooks/use-service-providers";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Mail, MapPin, Wrench, ArrowLeft } from "lucide-react";

/**
 * Common Home Services directory
 * Hierarchy: Location (inside/outside) -> Type (repairs / improvements) -> Service
 * After selecting a service, list matching service providers (mapped via providerCategories)
 * Data source: service_providers table (via useServiceProviders hook) using provider.category field.
 */

type ServiceNode = {
  key: string;
  label: string;
  providerCategories: string[]; // categories from service_providers.category that qualify
};

interface ServiceGroup {
  label: string;
  services: ServiceNode[];
}

interface LocationBlock {
  label: string;
  groups: { repairs: ServiceGroup; improvements: ServiceGroup };
}

// Utility to build a slug-ish key
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Mapping provider categories already in the system (see service-providers page):
// Plumber, Electrician, HVAC, Contractor, Landscaper, Painter, Roofer, Mechanic, Other

const DIRECTORY: Record<"inside" | "outside", LocationBlock> = {
  inside: {
    label: "Inside the Home",
    groups: {
      repairs: {
        label: "Repairs / Maintenance",
        services: [
          { label: "Plumbing", providerCategories: ["Plumber" ] },
          { label: "Electrical", providerCategories: ["Electrician"] },
          { label: "HVAC", providerCategories: ["HVAC"] },
          { label: "Appliance Repair", providerCategories: ["Contractor", "Other"] },
          { label: "Flooring Repair", providerCategories: ["Contractor"] },
          { label: "Painting", providerCategories: ["Painter"] },
          { label: "Lighting Install / Repair", providerCategories: ["Electrician"] },
          { label: "Drywall Repair / Patching", providerCategories: ["Contractor"] },
          { label: "Pest Control", providerCategories: ["Other"] },
          { label: "Cleaning Services", providerCategories: ["Other"] },
        ].map(s => ({ ...s, key: key(s.label) })),
      },
      improvements: {
        label: "Improvements / Installations",
        services: [
          { label: "Kitchen Remodel", providerCategories: ["Contractor"] },
          { label: "Bathroom Remodel", providerCategories: ["Contractor"] },
          { label: "Flooring Installation", providerCategories: ["Contractor"] },
          { label: "Smart Home Devices", providerCategories: ["Electrician", "Other"] },
          { label: "Furniture Assembly / Installation", providerCategories: ["Contractor", "Other"] },
          { label: "Interior Design / Decorating", providerCategories: ["Other"] },
        ].map(s => ({ ...s, key: key(s.label) })),
      },
    },
  },
  outside: {
    label: "Outside the Home",
    groups: {
      repairs: {
        label: "Repairs / Maintenance",
        services: [
          { label: "Lawn Care", providerCategories: ["Landscaper"] },
            { label: "Tree & Bush Trimming / Removal", providerCategories: ["Landscaper"] },
            { label: "Irrigation System Install / Repair", providerCategories: ["Landscaper", "Contractor"] },
            { label: "Gutter Cleaning & Repair", providerCategories: ["Roofer", "Contractor", "Other"] },
            { label: "Power Washing", providerCategories: ["Other", "Contractor"] },
            { label: "Roof Repair / Inspection", providerCategories: ["Roofer"] },
            { label: "Fence Repair / Maintenance", providerCategories: ["Contractor"] },
            { label: "Pest Control (Yard)", providerCategories: ["Other"] },
        ].map(s => ({ ...s, key: key(s.label) })),
      },
      improvements: {
        label: "Improvements / Installations",
        services: [
          { label: "Deck / Patio Build or Repair", providerCategories: ["Contractor"] },
          { label: "Fence Installation", providerCategories: ["Contractor"] },
          { label: "Exterior Painting / Siding Work", providerCategories: ["Painter", "Contractor"] },
          { label: "Outdoor Lighting Install", providerCategories: ["Electrician"] },
          { label: "Driveway / Concrete Work", providerCategories: ["Contractor"] },
          { label: "Landscaping", providerCategories: ["Landscaper"] },
          { label: "Outdoor Furniture Assembly", providerCategories: ["Contractor", "Other"] },
          { label: "Pool Install / Maintenance", providerCategories: ["Contractor", "Other"] },
        ].map(s => ({ ...s, key: key(s.label) })),
      },
    },
  },
};

export default function HomeServicesDirectoryPage() {
  const { data: providers, isLoading } = useServiceProviders();

  const [location, setLocation] = useState<"" | "inside" | "outside">("");
  const [groupType, setGroupType] = useState<"" | "repairs" | "improvements">("");
  const [serviceKey, setServiceKey] = useState("");
  const [search, setSearch] = useState("");
  const [showOnlyWithContact, setShowOnlyWithContact] = useState(false);

  const serviceOptions = useMemo(() => {
    if (!location || !groupType) return [];
    return DIRECTORY[location].groups[groupType].services;
  }, [location, groupType]);

  const selectedService = serviceOptions.find(s => s.key === serviceKey);

  const filteredProviders = useMemo(() => {
    if (!selectedService) return [];
    const cats = new Set(selectedService.providerCategories.map(c => c.toLowerCase()));
    return (providers || [])
      .filter(p => p.category && cats.has(p.category.toLowerCase()))
      .filter(p => !search || (p.name?.toLowerCase().includes(search.toLowerCase()) || p.address?.toLowerCase().includes(search.toLowerCase())))
      .filter(p => !showOnlyWithContact || (p.phone || p.email));
  }, [providers, selectedService, search, showOnlyWithContact]);

  const triggerClass = "w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 px-3 text-sm";
  const labelClass = "text-xs font-medium text-gray-700";

  return (
    <PageTransition>
      <div className="w-full p-8 bg-white rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><Wrench className="w-6 h-6 text-blue-600"/>Home Services Directory</h1>
            <p className="text-gray-600 mt-2 text-sm">Browse common home services and quickly find matching providers you have saved.</p>
          </div>
          <Link href="/homes" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> Back to Homes</Link>
        </div>

        {/* Filters */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50/60 p-6">
          <div className="grid gap-5 md:grid-cols-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Location</label>
              <Select value={location} onValueChange={v => { setLocation(v as any); setGroupType(""); setServiceKey(""); }}>
                <SelectTrigger className={triggerClass}><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
                  <SelectItem value="inside">{DIRECTORY.inside.label}</SelectItem>
                  <SelectItem value="outside">{DIRECTORY.outside.label}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Type</label>
              <Select disabled={!location} value={groupType} onValueChange={v => { setGroupType(v as any); setServiceKey(""); }}>
                <SelectTrigger className={triggerClass}><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
                  {location && (
                    <>
                      <SelectItem value="repairs">{DIRECTORY[location].groups.repairs.label}</SelectItem>
                      <SelectItem value="improvements">{DIRECTORY[location].groups.improvements.label}</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Service</label>
              <Select disabled={!groupType} value={serviceKey} onValueChange={v => setServiceKey(v)}>
                <SelectTrigger className={triggerClass}><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent className="max-h-72 bg-white text-gray-900 border border-gray-200 shadow-lg">
                  {serviceOptions.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Search Providers</label>
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or area" className="bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 text-sm" />
              <label className="flex items-center gap-2 pt-1">
                <input type="checkbox" checked={showOnlyWithContact} onChange={e => setShowOnlyWithContact(e.target.checked)} className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-[11px] text-gray-600">Only with phone or email</span>
              </label>
            </div>
          </div>
          {selectedService && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-gray-600">Showing providers in:</span>
              {selectedService.providerCategories.map(c => (
                <Badge key={c} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[11px] font-medium px-2 py-0.5">{c}</Badge>
              ))}
            </div>
          )}
        </div>

        {isLoading && <Spinner />}
        {!isLoading && !selectedService && (
          <p className="text-sm text-gray-600">Select a service to view matching providers. You can add providers in the <Link href="/service-providers" className="text-blue-600 hover:underline">Service Providers</Link> section.</p>
        )}
        {!isLoading && selectedService && filteredProviders.length === 0 && (
          <div className="text-sm text-gray-600">No providers found for this service yet. <Link href="/service-providers" className="text-blue-600 hover:underline">Add one</Link> so it appears here.</div>
        )}

        {filteredProviders.length > 0 && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((p, idx) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: idx * 0.05 }}>
                <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white rounded-xl">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">{p.name || 'Unnamed Provider'}</h3>
                      {p.category && <Badge variant="outline" className="mt-2 text-[11px] border-blue-200 text-blue-700 bg-blue-50 font-medium px-2 py-0.5">{p.category}</Badge>}
                    </div>
                    {p.address && (
                      <div className="flex items-center text-gray-600 text-xs">
                        <MapPin className="w-3.5 h-3.5 mr-1" /> {p.address}
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      {p.phone && (
                        <Button size="sm" variant="outline" className="h-9 text-xs flex-1 border-gray-300" asChild>
                          <a href={`tel:${p.phone}`}><Phone className="w-3.5 h-3.5 mr-1"/>Call</a>
                        </Button>
                      )}
                      {p.email && (
                        <Button size="sm" variant="outline" className="h-9 text-xs flex-1 border-gray-300" asChild>
                          <a href={`mailto:${p.email}`}><Mail className="w-3.5 h-3.5 mr-1"/>Email</a>
                        </Button>
                      )}
                    </div>
                    {p.website && (
                      <Button size="sm" variant="ghost" className="h-7 text-[11px] px-1 text-blue-600 hover:underline" asChild>
                        <a href={p.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
