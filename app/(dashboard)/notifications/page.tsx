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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
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
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-muted/50">
          <BellOff className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground font-medium">
            No notifications yet
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
              className={`p-6 rounded-xl border transition-all cursor-pointer group ${
                notification.isRead
                  ? "bg-background border-border"
                  : "bg-primary/5 border-primary/20 hover:bg-primary/10"
              }`}>
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.isRead
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold transition-colors ${
                        notification.isRead
                          ? "text-foreground/70"
                          : "text-foreground"
                      }`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(
                        new Date(notification.createdAt),
                        "MMM d, h:mm a",
                      )}
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      notification.isRead
                        ? "text-muted-foreground/80"
                        : "text-muted-foreground"
                    }`}>
                    {notification.body}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
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
