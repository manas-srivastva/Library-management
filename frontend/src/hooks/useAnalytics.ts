import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";
import { useAuthContext } from "@/context/AuthContext";

const useAnalyticsAccess = () => {
  const { user } = useAuthContext();

  return (
    user?.role === "ADMIN" ||
    user?.role === "LIBRARIAN"
  );
};

export const useOverview = () => {
  const hasAccess = useAnalyticsAccess();

  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: analyticsApi.getOverview,
    enabled: hasAccess,
  });
};

export const usePopularBooks = () => {
  const hasAccess = useAnalyticsAccess();

  return useQuery({
    queryKey: ["analytics", "popular-books"],
    queryFn: analyticsApi.getPopularBooks,
    enabled: hasAccess,
  });
};

export const useActiveMembers = () => {
  const hasAccess = useAnalyticsAccess();

  return useQuery({
    queryKey: ["analytics", "active-members"],
    queryFn: analyticsApi.getActiveMembers,
    enabled: hasAccess,
  });
};

export const useFineStats = () => {
  const hasAccess = useAnalyticsAccess();

  return useQuery({
    queryKey: ["analytics", "fines"],
    queryFn: analyticsApi.getFineStats,
    enabled: hasAccess,
  });
};

export const useMonthlyBorrows = () => {
  const hasAccess = useAnalyticsAccess();

  return useQuery({
    queryKey: ["analytics", "monthly-borrows"],
    queryFn: analyticsApi.getMonthlyBorrows,
    enabled: hasAccess,
  });
};