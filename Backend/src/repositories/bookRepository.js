import Book from "../models/Book.js";


export const create = (data) =>

    Book.create(data);


export const findByISBN = (isbn) =>

    Book.findOne({ isbn });


export const findById = (id) =>

    Book.findById(id)

        .populate("authors")

        .populate("publisher")

        .populate("category");


export const findAll = async ({
    page = 1,
    limit = 10,
    search = ""
}) => {

    const skip = (page - 1) * limit;

    const query = {};

    if (search) {

        query.$or = [

            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                isbn: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }

    const [books, total] = await Promise.all([

        Book.find(query)

            .populate("authors")

            .populate("publisher")

            .populate("category")

            .sort({ createdAt: -1 })

            .skip(skip)

            .limit(limit),

        Book.countDocuments(query)

    ]);

    return {

        books,

        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit)

    };

};


export const update = (id, data) =>

    Book.findByIdAndUpdate(

        id,

        data,

        {
            new: true,
            runValidators: true
        }

    )

        .populate("authors")

        .populate("publisher")

        .populate("category");


export const remove = (id) =>

    Book.findByIdAndDelete(id);