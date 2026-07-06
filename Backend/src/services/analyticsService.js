import * as repo
from "../repositories/analyticsRepository.js";


export const getOverview = () =>

    repo.overview();


export const getPopularBooks = () =>

    repo.popularBooks();


export const getActiveMembers = () =>

    repo.activeMembers();


export const getFineStats = () =>

    repo.fineStats();


export const getMonthlyBorrows = () =>

    repo.monthlyBorrows();