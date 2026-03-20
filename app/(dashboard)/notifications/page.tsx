"use client";

import { useState } from "react";
import {
  useNotificationsQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} from "@/src/services/useNotificationQueries";
import { Notification } from "@/src/services/notification.service";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { CommonLoader } from "@/src/components/common/CommonLoader";

interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotificationsQuery(page);
  const markAllRead = useMarkAllReadMutation();
  const markRead = useMarkReadMutation();

  if (isLoading) {
    return <CommonLoader message="Loading notifications..." />;
  }

  const notifications: Notification[] = data?.notifications || [];
  const pagination: Pagination | undefined = data?.pagination as
    | Pagination
    | undefined;

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Notifications
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Stay updated with the latest activities.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            variant="outline"
            className="flex items-center gap-2">
            {markAllRead.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed rounded-2xl bg-slate-50 shadow-sm border-slate-200">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner pointer-events-none">
            <BellOff className="h-10 w-10 text-slate-300" />
          </div>
          <p className="text-xl font-bold text-slate-700 tracking-tight">
            No notifications yet
          </p>
          <p className="text-slate-500 mt-2 font-medium">
            When you get notifications, they'll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() =>
                !notification.isRead && markRead.mutate(notification._id)
              }
              className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md ${
                notification.isRead
                  ? "bg-white border-slate-100"
                  : "bg-primary/5 border-primary/20 hover:bg-primary/10"
              }`}>
              <div className="flex gap-4 sm:gap-5">
                <div
                  className={`mt-1 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner ${
                    notification.isRead
                      ? "bg-slate-100 text-slate-400"
                      : "bg-primary text-primary-foreground shadow-primary/20"
                  }`}>
                  <Bell className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 sm:mb-2 gap-1.5 sm:gap-2">
                    <h3
                      className={`text-base sm:text-lg font-bold tracking-tight transition-colors leading-tight ${
                        notification.isRead
                          ? "text-slate-700"
                          : "text-slate-900"
                      }`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap bg-slate-100 px-3 py-1 rounded-full w-fit text-red-600">
                      {format(
                        new Date(notification.createdAt),
                        "MMM d, h:mm a",
                      )}
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      notification.isRead
                        ? "text-slate-500"
                        : "text-slate-700 font-medium"
                    }`}>
                    {notification.body}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="h-3 w-3 rounded-full bg-primary mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)] border-2 border-white ring-2 ring-primary/20" />
                )}
              </div>
            </div>
          ))}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-9"
                      onClick={() => setPage(pageNum)}>
                      {pageNum}
                    </Button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.pages}
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
