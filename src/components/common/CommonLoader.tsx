import { Loader2 } from "lucide-react";

interface CommonLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export function CommonLoader({
  fullScreen = true,
  message = "Loading...",
}: CommonLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-h-[200px] items-center justify-center">
      {content}
    </div>
  );
}
