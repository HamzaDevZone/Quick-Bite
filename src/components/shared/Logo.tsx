import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center bg-primary rounded-full p-2 w-16 h-16", className)}>
        <span className="text-3xl font-bold text-primary-foreground">N</span>
    </div>
  );
}
