import request from "supertest";
import app from "../src/app.js";
import { describe, test, expect } from "@jest/globals";
import Category from "../src/models/Category.js";
import mongoose from "mongoose";
import { createAdminToken,createLibrarianToken,createMemberToken } from "./helpers/authHelper.js";

describe("Category API", () => {

    test("Admin should create a category", async () => {

        // Arrange
        const token = await createAdminToken();

        // Act
        const res = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Programming"
            });

        // Assert
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Category created successfully");
        expect(res.body.data.name).toBe("Programming");

        // Verify database
        const category = await Category.findOne({
            name: "Programming"
        });

        expect(category).not.toBeNull();
        expect(category.name).toBe("Programming");

    });







    test("should not create duplicate category", async () => {

    // Arrange
    const token = await createAdminToken();

    // Create the category once
    await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    // Try creating the same category again
    const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    // Assert
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Category already exists");

    // Verify only one category exists
    const categories = await Category.find({
        name: "Programming"
    });

    expect(categories).toHaveLength(1);

});






test("should reject category creation when name is missing", async () => {

    // Arrange
    const token = await createAdminToken();

    // Act
    const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({});

    // Assert
    expect(res.status).toBe(400);

    expect(res.body.success).toBe(false);

    // Verify that no category was created
    const categories = await Category.find();

    expect(categories).toHaveLength(0);

});





test("should reject category creation when name is missing", async () => {

    // Arrange
    const token = await createAdminToken();

    // Act
    const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({});

    // Assert
    expect(res.status).toBe(400);

    expect(res.body.success).toBe(false);

    // Verify that no category was created
    const categories = await Category.find();

    expect(categories).toHaveLength(0);

});







test("should reject category name shorter than 2 characters", async () => {

    // Arrange
    const token = await createAdminToken();

    // Act
    const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "A"
        });

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

    const categories = await Category.find();

    expect(categories).toHaveLength(0);

});







test("should get all categories", async () => {

    // Arrange
    const token = await createAdminToken();

    await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Database"
        });

    // Act
    const res = await request(app)
        .get("/api/categories");

    // Assert
    expect(res.status).toBe(200);

    expect(res.body.success).toBe(true);

    expect(res.body.message)
        .toBe("Categories fetched successfully");

    expect(res.body.data).toHaveLength(2);

    expect(res.body.data[0]).toHaveProperty("name");

    expect(res.body.data[1]).toHaveProperty("name");

});








test("admin should get category by id", async () => {

    // Arrange
    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const categoryId = createRes.body.data._id;

    // Act
    const res = await request(app)
        .get(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(res.status).toBe(200);

    expect(res.body.success).toBe(true);

    expect(res.body.message)
        .toBe("Category fetched successfully");

    expect(res.body.data._id)
        .toBe(categoryId);

    expect(res.body.data.name)
        .toBe("Programming");

});





test("librarian should get category by id", async () => {

    const adminToken = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            name: "Programming"
        });

    const librarianToken = await createLibrarianToken();

    const res = await request(app)
        .get(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${librarianToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

});






test("member should get category by id", async () => {

    const adminToken = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            name: "Programming"
        });

    const memberToken = await createMemberToken();

    const res = await request(app)
        .get(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${memberToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

});





test("should reject request without jwt", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .get(`/api/categories/${createRes.body.data._id}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);

});




test("should reject invalid jwt", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .get(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", "Bearer invalid_token");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);

});



test("should reject invalid category id", async () => {

    const token = await createAdminToken();

    const res = await request(app)
        .get("/api/categories/invalid-id")
        .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

});






test("should return 404 when category does not exist", async () => {

    const token = await createAdminToken();

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
        .get(`/api/categories/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Category not found");

});





test("admin should update category", async () => {

    // Arrange
    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const categoryId = createRes.body.data._id;

    // Act
    const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Web Development"
        });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Category updated successfully");
    expect(res.body.data.name).toBe("Web Development");

    const updated = await Category.findById(categoryId);
    expect(updated.name).toBe("Web Development");

});





//1. Admin should update category

test("admin should update category", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const categoryId = createRes.body.data._id;

    const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Web Development"
        });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Category updated successfully");
    expect(res.body.data.name).toBe("Web Development");

    const updated = await Category.findById(categoryId);

    expect(updated.name).toBe("Web Development");

});


// 2. Librarian should update category

test("librarian should update category", async () => {

    const adminToken = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            name: "Programming"
        });

    const librarianToken = await createLibrarianToken();

    const res = await request(app)
        .put(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${librarianToken}`)
        .send({
            name: "Web Development"
        });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Web Development");

});


//3. Member should not update category
test("member should not update category", async () => {

    const adminToken = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            name: "Programming"
        });

    const memberToken = await createMemberToken();

    const res = await request(app)
        .put(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
            name: "Web Development"
        });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);

});

//4. Missing JWT
test("should reject update without jwt", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .put(`/api/categories/${createRes.body.data._id}`)
        .send({
            name: "Updated"
        });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);

});


// 5. Invalid JWT
test("should reject update with invalid jwt", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .put(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", "Bearer invalid_token")
        .send({
            name: "Updated"
        });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);

});

//6. Invalid Category ID

test("should reject invalid category id while updating", async () => {

    const token = await createAdminToken();

    const res = await request(app)
        .put("/api/categories/invalid-id")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Updated"
        });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

});

// 7. Duplicate Category Name
test("should reject duplicate category name", async () => {

    const token = await createAdminToken();

    await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Database"
        });

    const res = await request(app)
        .put(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);

}); 
// 8. Name Too Short
test("should reject update when name is shorter than 2 characters", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .put(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "A"
        });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

});
// 9. Name Too Long
test("should reject update when name is longer than 50 characters", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .put(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "A".repeat(51)
        });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

});


//10. Description Too Long
test("should reject update when description exceeds 300 characters", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .put(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            description: "A".repeat(301)
        });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

});

// 11. Category Not Found


test("should return 404 while updating non-existent category", async () => {

    const token = await createAdminToken();

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
        .put(`/api/categories/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Category not found");

});


// Admin should delete category
test("admin should delete category", async () => {

    // Arrange
    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const categoryId = createRes.body.data._id;

    // Act
    const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Category deleted successfully");

    const deleted = await Category.findById(categoryId);

    expect(deleted).toBeNull();

});




// 2. Librarian should not delete category
test("librarian should not delete category", async () => {

    const adminToken = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            name: "Programming"
        });

    const librarianToken = await createLibrarianToken();

    const res = await request(app)
        .delete(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${librarianToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Forbidden");

});


// 3.Member should not delete category
test("member should not delete category", async () => {

    const adminToken = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            name: "Programming"
        });

    const memberToken = await createMemberToken();

    const res = await request(app)
        .delete(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", `Bearer ${memberToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Forbidden");

});


//4. Missing JWT
test("should reject delete without jwt", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .delete(`/api/categories/${createRes.body.data._id}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized");

});

//5. Invalid JWT
test("should reject delete with invalid jwt", async () => {

    const token = await createAdminToken();

    const createRes = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Programming"
        });

    const res = await request(app)
        .delete(`/api/categories/${createRes.body.data._id}`)
        .set("Authorization", "Bearer invalid_token");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid Token");

});


// 6. Invalid Category ID
test("should reject invalid category id while deleting", async () => {

    const token = await createAdminToken();

    const res = await request(app)
        .delete("/api/categories/invalid-id")
        .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid resource id");

});


//7. Category Not Found


test("should return 404 while deleting non-existent category", async () => {

    const token = await createAdminToken();

    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
        .delete(`/api/categories/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Category not found");

});
});