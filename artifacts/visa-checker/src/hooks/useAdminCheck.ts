import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/react";

export function useAdminCheck() {
  const { isLoaded, isSignedIn } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      const json = await res.json() as { isAdmin: boolean };
      return json;
    },
    enabled: isLoaded && isSignedIn === true,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isAdmin: data?.isAdmin ?? false,
    isLoading: !isLoaded || isLoading,
  };
}
