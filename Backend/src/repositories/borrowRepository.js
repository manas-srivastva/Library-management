import BorrowRecord from "../models/BorrowRecord.js";
import User from "../models/User.js";
import BookCopy from "../models/BookCopy.js";
import Fine from "../models/Fine.js";


export const create = (data) =>

    BorrowRecord.create(data);



export const findById = (id) =>

    BorrowRecord.findById(id)

        .populate("user")

        .populate("issuedBy")

        .populate({

            path: "bookCopy",

            populate: {

                path: "book"

            }

        });



/*
    Get borrow records with:

    - Pagination
    - Search
    - Status filter
    - Date filter
    - Total record count
*/
export const findAll = async ({

    page = 1,

    limit = 10,

    search = "",

    status = "",

    from = "",

    to = ""

} = {}) => {


    // Make sure pagination values are valid

    page = Math.max(Number(page) || 1, 1);

    limit = Math.min(

        Math.max(Number(limit) || 10, 1),

        100

    );


    const skip = (page - 1) * limit;



    /*
        Main BorrowRecord filter
    */

    const filter = {};



    /*
        STATUS FILTER
    */

    if (status) {

        filter.status = status;

    }



    /*
        DATE FILTER

        We use issueDate because this represents
        when the book was borrowed.
    */

    if (from || to) {

        filter.issueDate = {};

        if (from) {

            filter.issueDate.$gte = new Date(from);

        }

        if (to) {

            const endDate = new Date(to);

            // Include the complete "to" date

            endDate.setHours(

                23,

                59,

                59,

                999

            );

            filter.issueDate.$lte = endDate;

        }

    }



    /*
        SEARCH

        Search can match:

        - User name
        - User email
        - Book title
        - Book ISBN
        - Book copy barcode
    */

    if (search.trim()) {

        const searchRegex = {

            $regex: search.trim(),

            $options: "i"

        };


        const [

            users,

            books,

            copies

        ] = await Promise.all([

            User.find({

                $or: [

                    { name: searchRegex },

                    { email: searchRegex }

                ]

            }).select("_id"),


            (
                await import("../models/Book.js")

            ).default.find({

                $or: [

                    { title: searchRegex },

                    { isbn: searchRegex }

                ]

            }).select("_id"),


            BookCopy.find({

                barcode: searchRegex

            }).select("_id")

        ]);


        const userIds = users.map(

            (user) => user._id

        );


        const bookIds = books.map(

            (book) => book._id

        );


        const copyIds = copies.map(

            (copy) => copy._id

        );


        /*
            Find all copies belonging to
            matching books.
        */

        const bookCopies = await BookCopy.find({

            $or: [

                { _id: { $in: copyIds } },

                { book: { $in: bookIds } }

            ]

        }).select("_id");


        const allCopyIds = bookCopies.map(

            (copy) => copy._id

        );


        filter.$or = [

            { user: { $in: userIds } },

            { bookCopy: { $in: allCopyIds } }

        ];

    }



    /*
        Get total number of matching records
    */

    const totalRecordsPromise =

        BorrowRecord.countDocuments(filter);



    /*
        Get only the records required
        for the current page.
    */

    const borrowsPromise =

        BorrowRecord.find(filter)

            .populate("user")

            .populate("issuedBy")

            .populate({

                path: "bookCopy",

                populate: {

                    path: "book"

                }

            })

            .sort({

                issueDate: -1

            })

            .skip(skip)

            .limit(limit);



    const [

        totalRecords,

        borrows

    ] = await Promise.all([

        totalRecordsPromise,

        borrowsPromise

    ]);



    /*
        Get fines for the current page only.

        This avoids querying Fine separately
        for every borrow record.
    */

    const borrowIds = borrows.map(

        (borrow) => borrow._id

    );


    const fines = await Fine.find({

        borrowRecord: {

            $in: borrowIds

        }

    });



    const fineMap = new Map(

        fines.map(

            (fine) => [

                fine.borrowRecord.toString(),

                fine

            ]

        )

    );



    /*
        Attach fine to each borrow record
    */

    const borrowsWithFine = borrows.map(

        (borrow) => ({

            ...borrow.toObject(),

            fine:

                fineMap.get(

                    borrow._id.toString()

                ) || null

        })

    );



    return {

        borrows: borrowsWithFine,

        pagination: {

            page,

            limit,

            totalRecords,

            totalPages: Math.ceil(

                totalRecords / limit

            )

        }

    };

};



export const update = (id, data) =>

    BorrowRecord.findByIdAndUpdate(

        id,

        data,

        { new: true }

    );



export const findByUser = (userId) =>

    BorrowRecord.find({

        user: userId

    })

        .populate("bookCopy");



export const remove = (id) =>

    BorrowRecord.findByIdAndDelete(id);