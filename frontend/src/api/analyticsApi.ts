import client from "./client";
import {
    ApiResponse,
    Overview,
    PopularBook,
    ActiveMember,
    FineStat,
    MonthlyBorrow,
} from "../types/analytics";

export const analyticsApi = {
    async getOverview() {
        const { data } =
            await client.get<ApiResponse<Overview>>(
                "/analytics/overview"
            );





        return data.data;
    },

    async getPopularBooks() {
        const { data } =
            await client.get<ApiResponse<PopularBook[]>>(
                "/analytics/popular-books"
            );

        return data.data;
    },

    async getActiveMembers() {
        const { data } =
            await client.get<ApiResponse<ActiveMember[]>>(
                "/analytics/active-members"
            );

        return data.data;
    },

    async getFineStats() {
        const { data } =
            await client.get<ApiResponse<FineStat[]>>(
                "/analytics/fines"
            );

        return data.data;
    },

    async getMonthlyBorrows() {
        const { data } =
            await client.get<ApiResponse<MonthlyBorrow[]>>(
                "/analytics/monthly-borrows"
            );

        return data.data;
    },
};