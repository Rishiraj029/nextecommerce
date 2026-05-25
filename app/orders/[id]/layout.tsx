import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
