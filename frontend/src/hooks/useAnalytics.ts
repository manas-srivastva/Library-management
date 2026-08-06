import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const useOverview = () =>
    useQuery({
        queryKey: ["analytics", "overview"],
        queryFn: analyticsApi.getOverview,
    });

export const usePopularBooks = () =>
    useQuery({
        queryKey: ["analytics", "popular-books"],
        queryFn: analyticsApi.getPopularBooks,
    });

export const useActiveMembers = () =>
    useQuery({
        queryKey: ["analytics", "active-members"],
        queryFn: analyticsApi.getActiveMembers,
    });

export const useFineStats = () =>
    useQuery({
        queryKey: ["analytics", "fines"],
        queryFn: analyticsApi.getFineStats,
    });

export const useMonthlyBorrows = () =>
    useQuery({
        queryKey: ["analytics", "monthly-borrows"],
        queryFn: analyticsApi.getMonthlyBorrows,
    });