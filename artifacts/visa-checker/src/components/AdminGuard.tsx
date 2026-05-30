import { useUser } from "@clerk/react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { ShieldAlert, Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isLoaded, isSignedIn } = useUser();
  const { isAdmin, isLoading } = useAdminCheck();

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Sign in required</h1>
        <p className="text-muted-foreground text-center max-w-sm">You need to sign in to access the admin panel.</p>
        <a
          href="/sign-in?redirect_url=/admin"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          Sign in
        </a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          You don't have admin privileges. Contact the site owner if you believe this is an error.
        </p>
        <a
          href="/"
          className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-colors text-sm"
        >
          Go home
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
