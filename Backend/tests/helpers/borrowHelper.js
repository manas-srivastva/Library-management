import request from "supertest";
import app from "../../src/app.js";

import { createBookCopy } from "./bookCopyHelper.js";
import { createMember } from "./authHelper.js";

export const createBorrow = async (
    issuer,
    data = {},
    dependencies = {}
) => {

    let memberEmail = dependencies.memberEmail;
    let barcode = dependencies.barcode;

    if (!memberEmail) {

        const member = await createMember();

        memberEmail = member.user.email;
    }

    if (!barcode) {

        const copy = await createBookCopy(issuer.token);

        barcode = copy.body.data.barcode;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    return await request(app)
        .post("/api/borrows")
        .set("Authorization", `Bearer ${issuer.token}`)
        .send({
            user: memberEmail,
            issuedBy: issuer.user.email,
            barcode,
            dueDate,
            ...data,
        });

};