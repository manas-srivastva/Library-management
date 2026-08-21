import User from "../models/User.js";
import Book from "../models/Book.js";
import BookCopy from "../models/BookCopy.js";
import BorrowRecord from "../models/BorrowRecord.js";
import Reservation from "../models/Reservation.js";
import Fine from "../models/Fine.js";

export const overview = async () => {
    const [users, books, borrows, reservations, fines] =
        await Promise.all([
            User.countDocuments(),
            Book.countDocuments(),
            BorrowRecord.countDocuments(),
            Reservation.countDocuments(),
            Fine.countDocuments(),
        ]);

    return {
        users,
        books,
        borrows,
        reservations,
        fines,
    };
};

export const popularBooks = () =>
    BorrowRecord.aggregate([
        {
            $group: {
                _id: "$bookCopy",
                borrowCount: {
                    $sum: 1,
                },
            },
        },
        {
            $lookup: {
                from: BookCopy.collection.name,
                localField: "_id",
                foreignField: "_id",
                as: "bookCopy",
            },
        },
        {
            $unwind: "$bookCopy",
        },
        {
            $lookup: {
                from: Book.collection.name,
                localField: "bookCopy.book",
                foreignField: "_id",
                as: "book",
            },
        },
        {
            $unwind: "$book",
        },
        {
            $project: {
                _id: "$book._id",
                title: "$book.title",
                author: "$book.authors",
                isbn: "$book.isbn",
                borrowCount: 1,
            },
        },
        {
            $sort: {
                borrowCount: -1,
            },
        },
        {
            $limit: 10,
        },
    ]);

export const activeMembers = () =>
    BorrowRecord.aggregate([
        {
            $group: {
                _id: "$user",
                totalBorrowed: {
                    $sum: 1,
                },
            },
        },
        {
            $lookup: {
                from: User.collection.name,
                localField: "_id",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$user",
        },
        {
            $project: {
                _id: "$user._id",
                name: "$user.name",
                email: "$user.email",
                role: "$user.role",
                totalBorrowed: 1,
            },
        },
        {
            $sort: {
                totalBorrowed: -1,
            },
        },
        {
            $limit: 10,
        },
    ]);

export const fineStats = () =>
    Fine.aggregate([
        {
            $group: {
                _id: "$status",
                total: {
                    $sum: "$amount",
                },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);

export const monthlyBorrows = async () => {
    const year = new Date().getFullYear();
    // LibraAI launched in August, so earlier months are not part of the live graph.
    const launchMonth = 7;
    const startOfLaunch = new Date(year, launchMonth, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);

    const data = await BorrowRecord.aggregate([
        {
            $match: {
                issueDate: {
                    $gte: startOfLaunch,
                    $lt: startOfNextYear,
                },
            },
        },
        {
            $group: {
                _id: {
                    month: {
                        $month: "$issueDate",
                    },
                },
                total: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                "_id.month": 1,
            },
        },
    ]);

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const monthlyData = monthNames.slice(launchMonth).map((month) => ({
        month,
        total: 0,
    }));

    data.forEach((item) => {
        monthlyData[item._id.month - launchMonth - 1].total = item.total;
    });

    return monthlyData;
};