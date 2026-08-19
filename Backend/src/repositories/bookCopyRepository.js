import BookCopy from "../models/BookCopy.js";

export const create = (data) =>
    BookCopy.create(data);

export const findAll = async ({
    page = 1,
    limit = 10,
    search = "",
    status
} = {}) => {

    const skip = (page - 1) * limit;

    const query = {};

    if (status) {
        query.status = status;
    }

    if (search) {
        query.barcode = {
            $regex: search,
            $options: "i"
        };
    }

    const [copies, total] = await Promise.all([

        BookCopy.find(query)
            .populate("book")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        BookCopy.countDocuments(query)

    ]);

    return {
        copies,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

export const findById = (id) =>
    BookCopy.findById(id)
        .populate("book");

export const findByBarcode = (barcode) =>
    BookCopy.findOne({
        barcode
    });

export const update = (id, data) =>
    BookCopy.findByIdAndUpdate(
        id,
        data,
        { new: true }
    )
        .populate("book");

export const remove = (id) =>
    BookCopy.findByIdAndDelete(id);