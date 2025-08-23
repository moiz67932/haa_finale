"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Car, Users, MessageSquare, Bell, Plus } from "lucide-react";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { Spinner } from "@/components/ui/spinner";
import { PageTransition } from "@/components/layout/page-transition";
import Link from "next/link";

const dashboardCards = [
  {
    title: "Home Profiles",
    icon: Home,
    color: "bg-blue-500",
    href: "/homes",
    key: "homes_count",
  },
  {
    title: "Vehicle Profiles",
    icon: Car,
    color: "bg-orange-500",
    href: "/vehicles",
    key: "vehicles_count",
  },
  {
    title: "Service Providers",
    icon: Users,
    color: "bg-green-500",
    href: "/service-providers",
    key: "service_providers_count",
  },
  {
    title: "Community",
    icon: MessageSquare,
    color: "bg-purple-500",
    href: "/community",
    key: "community_count",
  },
  {
    title: "Notifications",
    icon: Bell,
    color: "bg-red-500",
    href: "/notifications",
    key: "unread_notifications_count",
  },
];

const quickActions = [
  {
    title: "Add New Home",
    href: "/homes",
    action: "create",
  },
  {
    title: "Add New Vehicle",
    href: "/vehicles",
    action: "create",
  },
  {
    title: "Find Service Provider",
    href: "/service-providers",
  },
  {
    title: "Create Community Post",
    href: "/community",
    action: "create",
  },
];

export default function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PageTransition>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here&apos;s an overview of your home and auto
            management.
          </p>
        </div>

        {/* First-time user prompt: if no homes and no vehicles, prompt to add one */}
        {(summary?.homes_count || 0) === 0 &&
          (summary?.vehicles_count || 0) === 0 && (
            <div className="mb-6">
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-700">
                      Get started by adding your first home or vehicle
                    </h3>
                    <p className="text-sm text-orange-700/90 mt-1">
                      Add a home or vehicle now so HAA can start tracking
                      maintenance, reminders, and warranties for you.
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <Link href="/homes">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Add a Home
                      </Button>
                    </Link>
                    <Link href="/vehicles">
                      <Button
                        variant="outline"
                        className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Add a Vehicle
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200 h-40 flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {card.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {summary?.[card.key as keyof typeof summary] || 0}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 ${card.color} rounded-full flex items-center justify-center`}
                      >
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-center mt-4 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
                    >
                      View {card.title}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white border border-gray-200 text-gray-600">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border border-gray-200 hover:text-gray-900"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {action.title}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
