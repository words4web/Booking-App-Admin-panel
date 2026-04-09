"use client";

import { useEffect, useRef, useState } from "react";
import { User, ShieldAlert, Send } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetChatMessages,
  useSendPublicMessage,
  useSendAdminMessage,
} from "../../services/chatManager/useChatQueries";
import { IChatMessage } from "../../types/chat.types";
import { format } from "date-fns";
import {
  CHAT_MAX_MESSAGE_LENGTH,
  CHAT_SEND_LIMIT_MAX,
} from "../../constants/chat.constants";

interface ChatWindowProps {
  token: string;
  isAdmin: boolean;
  className?: string;
  fullHeight?: boolean;
}

export default function ChatWindow({
  token,
  isAdmin,
  className = "",
  fullHeight = false,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // States to determine if we should stop polling
  const [isSessionInvalid, setIsSessionInvalid] = useState(false);

  // Poll for messages - dynamically disabled if session becomes invalid
  const { data, isLoading, isError, error } = useGetChatMessages(token, {
    enabled: !isSessionInvalid,
  });

  // Mutations
  const sendPublicMutation = useSendPublicMessage(token);
  const sendAdminMutation = useSendAdminMessage(token);

  const messages = data?.messages || [];
  const roomStatus = data?.roomStatus || "active";
  const isClosed = roomStatus === "closed";

  // Check if API responded with 410 (Expired)
  const isExpired = isError && (error as any)?.response?.status === 410;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (isClosed || isExpired) {
      setIsSessionInvalid(true);
    }
  }, [isClosed, isExpired]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText?.trim() || isClosed || isExpired) return;

    if (inputText.length > CHAT_MAX_MESSAGE_LENGTH) {
      toast.error(
        `Message too long (max ${CHAT_MAX_MESSAGE_LENGTH} characters)`,
      );
      return;
    }

    const mutation = isAdmin ? sendAdminMutation : sendPublicMutation;

    // Clear input instantly for Optimistic UI feel
    const currentText = inputText;
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    mutation.mutate(currentText, {
      onError: (err: any) => {
        // Restore input if sending failed completely
        setInputText(currentText);
        toast.error(err?.response?.data?.message || "Failed to send message");
      },
    });
  };

  if (isExpired) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border border-gray-200 h-full ${className}`}>
        <ShieldAlert className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-700">Chat Link Expired</h3>
        <p className="text-gray-500 text-center mt-2 max-w-sm">
          This chat session has securely expired. If you need further
          assistance, please contact support directly.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${fullHeight ? "h-full" : "h-[600px] max-h-[80vh]"} ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
        <div>
          <h3 className="font-semibold text-gray-800">
            {isAdmin ? "Customer Chat Support" : "RKB Kent Support"}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {isClosed ? (
              <span className="text-red-500 font-medium tracking-wide">
                ● CLOSED
              </span>
            ) : (
              <span className="text-green-500 font-medium animate-pulse">
                ● ACTIVE
              </span>
            )}
            Session
          </p>
        </div>
        {isAdmin && <ShieldAlert className="text-primary w-5 h-5 opacity-70" />}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6 custom-scrollbar">
        {isLoading && messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400 animate-pulse">
              Loading secure chat...
            </span>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <User className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-gray-500 text-sm">No messages yet.</p>
            <p className="text-gray-400 text-xs">
              Send a message to start the conversation.
            </p>
          </div>
        ) : (
          messages?.map((msg: IChatMessage) => {
            // "Me" means: if viewing as Admin and sender=admin, OR viewing as Customer and sender=user
            const isMe =
              (isAdmin && msg?.senderType === "admin") ||
              (!isAdmin && msg?.senderType === "user");

            return (
              <div
                key={msg?._id}
                className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl shadow-sm break-words overflow-hidden ${
                    isMe
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                  }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words [word-break:break-word]">
                    {msg?.message}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 mt-1 ml-1 cursor-default">
                  {format(new Date(msg?.createdAt), "HH:mm")}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Hidden if closed or expired */}
      {!isClosed && !isExpired && (
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <form onSubmit={handleSend} className="flex items-end gap-2 relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-60 disabled:bg-gray-100 resize-none custom-scrollbar"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e as unknown as React.FormEvent);
                }
              }}
            />
            <button
              type="submit"
              disabled={
                !inputText?.trim() ||
                inputText.length > CHAT_MAX_MESSAGE_LENGTH ||
                sendPublicMutation.isPending ||
                sendAdminMutation.isPending
              }
              className="h-[46px] w-[46px] flex items-center justify-center bg-primary text-white rounded-xl hover:opacity-90 active:scale-95 transition flex-shrink-0 disabled:opacity-50 mb-[1px]">
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
          <div className="flex justify-between items-center mt-1 px-1">
            {!isAdmin && (
              <p className="text-[10px] text-slate-400 font-medium italic select-none">
                * Avoid system abuse ({CHAT_SEND_LIMIT_MAX} msgs/min). Max{" "}
                {CHAT_MAX_MESSAGE_LENGTH.toLocaleString()} chars.
              </p>
            )}
            <span
              className={`text-[10px] font-bold tracking-tight ${
                inputText.length > CHAT_MAX_MESSAGE_LENGTH
                  ? "text-red-500"
                  : "text-slate-400"
              } ${isAdmin ? "ml-auto" : ""}`}>
              {inputText.length.toLocaleString()} /{" "}
              {CHAT_MAX_MESSAGE_LENGTH.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {(isClosed || isExpired) && (
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            This chat session has ended
          </p>
        </div>
      )}
    </div>
  );
}
