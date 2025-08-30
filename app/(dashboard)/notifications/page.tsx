"use client";

import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotifications,
  useMarkNotificationDone,
} from "@/hooks/use-supabase-query";
import { PageTransition } from "@/components/layout/page-transition";
import AuthGuard from "@/components/auth-guard";
import { createClient } from "@/lib/supabase";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Bell, Check, Home, Car, Calendar } from "lucide-react";
import { formatDistanceToNow, isBefore, addDays } from "date-fns";

function NotificationsContent() {
  const { data: notifications, isLoading, refetch } = useNotifications();
  const markNotificationDoneMutation = useMarkNotificationDone();
  const { user } = useSupabase();
  const supabase = createClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, supabase, refetch]);

  const handleMarkAsDone = async (notificationId: string) => {
    try {
      await markNotificationDoneMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error("Error marking notification as done:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "home_maintenance":
        return <Home className="w-5 h-5 text-blue-600" />;
      case "vehicle_maintenance":
        return <Car className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);

    if (isBefore(due, now)) {
      return "bg-red-50 border-red-200";
    } else if (isBefore(due, threeDaysFromNow)) {
      return "bg-orange-50 border-orange-200";
    } else {
      return "bg-blue-50 border-blue-200";
    }
  };

  const getBadgeColor = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);

    if (isBefore(due, now)) {
      return "bg-red-100 text-red-800";
    } else if (isBefore(due, threeDaysFromNow)) {
      return "bg-orange-100 text-orange-800";
    } else {
      return "bg-blue-100 text-blue-800";
    }
  };

  const activeNotifications = notifications?.filter((n) => !n.is_read) || [];
  const completedNotifications = notifications?.filter((n) => n.is_read) || [];

  return (
    <PageTransition>
      <div className="p-6 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="glass-panel rounded-3xl p-8 border border-white/40 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-400">
              Notifications
            </h1>
            <p className="text-slate-600 mt-3 text-base md:text-lg max-w-2xl">
              Stay on top of your maintenance schedules and important reminders
            </p>
          </div>

          {/* Active Notifications */}
          <Card className="glass-panel rounded-2xl border-white/40 shadow-md mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                Active Notifications
                {activeNotifications.length > 0 && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {activeNotifications.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="w-20 h-8" />
                    </div>
                  ))}
                </div>
              ) : activeNotifications.length > 0 ? (
                <div className="space-y-4">
                  {activeNotifications
                    .sort(
                      (a, b) =>
                        new Date(a.due_date || "").getTime() -
                        new Date(b.due_date || "").getTime()
                    )
                    .map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center space-x-4 p-4 border rounded-lg transition-colors ${
                          notification.due_date
                            ? getNotificationColor(notification.due_date)
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          {getNotificationIcon(notification.type || "")}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {notification.message}
                          </h3>
                          <div className="flex items-center space-x-3 mt-1">
                            {notification.due_date && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-gray-500" />
                                <span className="text-sm text-gray-500">
                                  Due{" "}
                                  {new Date(
                                    notification.due_date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {notification.due_date && (
                              <Badge
                                className={`text-xs ${getBadgeColor(
                                  notification.due_date
                                )}`}
                              >
                                {isBefore(
                                  new Date(notification.due_date),
                                  new Date()
                                )
                                  ? "Overdue"
                                  : formatDistanceToNow(
                                      new Date(notification.due_date),
                                      { addSuffix: true }
                                    )}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsDone(notification.id)}
                          disabled={markNotificationDoneMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Done
                        </Button>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    All caught up!
                  </h3>
                  <p className="text-gray-600">
                    You have no pending notifications
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Notifications */}
          {completedNotifications.length > 0 && (
            <Card className="glass-panel rounded-2xl border-white/40 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  Completed
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    {completedNotifications.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {completedNotifications
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .slice(0, 10)
                    .map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-700 text-sm">
                            {notification.message}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Completed{" "}
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthGuard>
        <NotificationsContent />
      </AuthGuard>
    </Suspense>
  );
}
