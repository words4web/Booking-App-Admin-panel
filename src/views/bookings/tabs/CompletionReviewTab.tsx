"use client";

import { useState } from "react";
import { Booking } from "@/src/types/booking.types";
import { BookingStatus } from "@/src/enums/booking.enum";
import { useReviewJobMutation } from "@/src/services/bookingManager/useBookingQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface CompletionReviewTabProps {
  booking: Booking;
}

export function CompletionReviewTab({ booking }: CompletionReviewTabProps) {
  const [adminNotes, setAdminNotes] = useState(
    booking.waitingTime?.adminNotes || "",
  );
  const [durationMinutes, setDurationMinutes] = useState(
    booking.waitingTime?.durationMinutes || 0,
  );
  const [confirmDialog, setConfirmDialog] = useState<{
    status: BookingStatus.COMPLETED | BookingStatus.JOB_REJECTED;
    title: string;
    description: string;
  } | null>(null);

  const mutation = useReviewJobMutation(booking._id);

  const handleReviewClick = (
    status: BookingStatus.COMPLETED | BookingStatus.JOB_REJECTED,
  ) => {
    if (status === BookingStatus.JOB_REJECTED && !adminNotes.trim()) {
      toast.error("Please provide a reason for rejection in admin notes.");
      return;
    }

    setConfirmDialog({
      status,
      title:
        status === BookingStatus.COMPLETED
          ? "Approve Job Completion"
          : "Reject Job Completion",
      description:
        status === BookingStatus.COMPLETED
          ? "Are you sure you want to approve this job completion? This will mark the booking as completed."
          : "Are you sure you want to reject this job completion? The driver will be notified.",
    });
  };

  const handleConfirmReview = async () => {
    if (!confirmDialog) return;

    mutation.mutate(
      {
        status: confirmDialog.status,
        adminNotes,
        durationMinutes,
      },
      {
        onSuccess: () => setConfirmDialog(null),
      },
    );
  };

  const isPendingReview = booking.status === BookingStatus.JOB_SUBMITTED;
  const isReviewed = [
    BookingStatus.COMPLETED,
    BookingStatus.JOB_REJECTED,
  ].includes(booking.status);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Photos Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-900">
              Job Completion Photos
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {booking.jobPhotos?.length > 0 ? (
              booking.jobPhotos.map((photo, index) => {
                return (
                  <div
                    key={index}
                    className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 transition-all shadow-sm">
                    <img
                      src={photo.url}
                      alt={`Completion ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white rounded-full text-slate-900 hover:bg-primary hover:text-white transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm font-medium">No photos submitted</p>
              </div>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-slate-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4" /> Waiting Time Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {isPendingReview ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-24 h-12 text-2xl font-semibold text-center rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                  />
                  <span className="text-slate-500 font-bold uppercase text-xs">
                    minutes
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-3xl font-black text-slate-900">
                    {booking.waitingTime?.durationMinutes || 0}
                  </span>
                  <span className="ml-1 text-slate-500 font-bold uppercase text-xs">
                    minutes
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="col-span-2">
          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-slate-50/50 w-full">
            <CardHeader className="pb-2 w-full">
              <CardTitle className="text-sm w-full font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Driver Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 font-medium leading-relaxed italic">
                "{booking.driverNotes || "No notes provided by driver."}"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Review Section */}
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-900">Admin Review</h3>
          </div>
          {isReviewed && (
            <Badge
              className={`rounded-xl px-4 py-1 h-auto font-bold ${booking.status === BookingStatus.COMPLETED ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}`}>
              {booking.status === BookingStatus.COMPLETED
                ? "Approved"
                : "Rejected"}
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">
              Review Notes / Feedback
            </label>
            <Textarea
              placeholder="Enter feedback for the driver (required if rejecting)..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              disabled={!isPendingReview || mutation.isPending}
              className="rounded-2xl border-slate-200 focus:ring-primary/20 focus:border-primary min-h-[120px] bg-white text-base"
            />
          </div>

          {isPendingReview && (
            <div className="flex gap-4">
              <Button
                type="button"
                variant="destructive"
                className="flex-1 rounded-xl h-12 font-bold shadow-lg border-red-600 border"
                onClick={() => handleReviewClick(BookingStatus.JOB_REJECTED)}
                disabled={mutation.isPending}>
                <XCircle className="h-4 w-4 mr-2" /> Reject Completion
              </Button>
              <Button
                type="button"
                className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-primary/20"
                onClick={() => handleReviewClick(BookingStatus.COMPLETED)}
                disabled={mutation.isPending}>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Approve & Complete
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmDialog}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
        title={confirmDialog?.title || "Confirm Action"}
        description={confirmDialog?.description || "Are you sure?"}
        confirmText={
          confirmDialog?.status === BookingStatus.COMPLETED
            ? "Approve"
            : "Reject"
        }
        cancelText="Cancel"
        onConfirm={handleConfirmReview}
        variant={
          confirmDialog?.status === BookingStatus.JOB_REJECTED
            ? "destructive"
            : "primary"
        }
        icon={
          confirmDialog?.status === BookingStatus.JOB_REJECTED
            ? XCircle
            : CheckCircle2
        }
        isLoading={mutation.isPending}
      />
    </div>
  );
}
