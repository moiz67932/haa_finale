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
      <div className="space-y-8">
        <div className="glass-panel rounded-3xl p-8 border border-white/40 shadow-xl">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-400">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-3 text-base md:text-lg max-w-2xl">
            Welcome back! Here’s a concise snapshot of your homes, vehicles and
            service ecosystem.
          </p>
        </div>

        {/* First-time user prompt: if no homes and no vehicles, prompt to add one */}
        {(summary?.homes_count || 0) === 0 &&
          (summary?.vehicles_count || 0) === 0 && (
            <div className="mb-6">
              <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-orange-600">
                    Get started by adding your first home or vehicle
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-xl">
                    Add a home or vehicle now so HAA can begin proactive
                    reminders & warranty tracking.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-3">
                  <Link href="/homes">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30">
                      Add a Home
                    </Button>
                  </Link>
                  <Link href="/vehicles">
                    <Button
                      variant="outline"
                      className="bg-white/60 backdrop-blur border border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Add a Vehicle
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <Card className="glass-panel glass-card-hover transition-all cursor-pointer h-44 flex flex-col justify-between rounded-2xl">
                  <CardContent className="p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-1">
                          {card.title}
                        </p>
                        <p className="text-4xl font-bold text-slate-800">
                          {summary?.[card.key as keyof typeof summary] || 0}
                        </p>
                      </div>
                      <div
                        className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center shadow-inner shadow-black/10`}
                      >
                        <card.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-center mt-4 text-sm text-slate-600 hover:text-slate-900 bg-white/40 hover:bg-white/60 backdrop-blur rounded-lg"
                    >
                      View {card.title}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Charts & Quick Actions Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="xl:col-span-2"
          >
            <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Activity Overview (Coming Soon)
              </h3>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/50 backdrop-blur flex items-center justify-center text-slate-500 text-sm border border-white/60">
                  Chart Placeholder
                </div>
                <div className="rounded-xl bg-white/50 backdrop-blur flex items-center justify-center text-slate-500 text-sm border border-white/60">
                  Chart Placeholder
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-white/50 hover:bg-white border border-white/60 hover:text-slate-900 rounded-xl"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-xs font-medium text-center">
                        {action.title}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
