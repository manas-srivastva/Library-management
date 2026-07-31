import  request  from "supertest";

import app from "../../src/app.js";


export const createCategory=async(
    token,
    data={}
)=>{


    const res=await request(app)
        .post("/api/categories")
        .set("Authorization",`Bearer ${token}`)
        .send({
            name: "Programming",
            description: "Programming books",
            ...data
        })

    return res.body.data;
}