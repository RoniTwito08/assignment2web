import request from "supertest";
import app , { connectDB } from "../server";
import Post , { PostInterface } from "../models/post_model";
import User , { UserInterface } from "../models/user_model";
import mongoose from "mongoose";

const testUser: UserInterface & {accessToken? : string} = {
    name: "Test User",
    email: "test@test.com",
    password: "testpassword",
}

let testPost: PostInterface;

beforeAll(async () => {
    console.log("Jest starting!");
    await connectDB();
    await Post.deleteMany();
    await User.deleteMany();

    await request(app).post("/api/auth/register").send(testUser);
    const response = await request(app).post("/api/auth/login").send(testUser);
    expect(response.status).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
    testUser._id = response.body.id;
    expect(testUser.accessToken).toBeDefined();
    expect(testUser.refreshToken).toBeDefined();
    testPost = {
        userId: response.body.id,
        content: "test content",
    }
});

afterAll(async () => {
    console.log("server closing");
    await mongoose.connection.close();
});

const baseUrl = "/api/post";

describe("Post Tests", () => {
    test("Create post success", async () => {
        console.log(testPost);
        const response = await request(app)
            .post(baseUrl + "/createPost")
            .set("Authorization", `Bearer ${testUser.accessToken}`)
            .send(testPost);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("success");
        testPost._id = response.body.data._id; 
    });
    

    test("Create post fail by missing content", async () => {
        const response = await request(app).post(baseUrl + "/createPost").send({...testPost , content: ""});
        expect(response.status).not.toBe(201);
        expect(response.body).not.toHaveProperty("success");
    });

    test("Create post fail by missing userId", async () => {
        const response = await request(app).post(baseUrl + "/createPost").send({...testPost , userId: ""});
        expect(response.status).not.toBe(201);
        expect(response.body).not.toHaveProperty("success");
    });

    test("Get all posts", async () => {
        const response = await request(app).get(baseUrl + "/getPosts");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success");
        expect(response.body.posts.length).toBe(1);
    });

    test("Get post by userId", async () => {
        const response = await request(app)
        .get(baseUrl + "/getPostByUserId")
        .set("Authorization", `Bearer ${testUser.accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success");
        expect(response.body.posts.length).toBe(1);
    });
        
    test("Get post by id", async () => {
        const response = await request(app).get(baseUrl + "/getPostById/" + testPost._id);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success");
    });
    
    test("Update post by id", async () => {
        const response = await request(app)
            .put(baseUrl + "/updatePostById/" + testPost._id)
            .set("Authorization", `Bearer ${testUser.accessToken}`)
            .send({ content: "updated content" });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    test("Delete post by id", async () => {
        const response = await request(app)
            .delete(baseUrl + "/deletePostById/" + testPost._id)
            .set("Authorization", `Bearer ${testUser.accessToken}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });
    

    test("Get all posts after delete", async () => {
        const response = await request(app).get(baseUrl + "/getPosts");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success");
        expect(response.body.posts.length).toBe(0);
    });

    test("Create post with invalid token", async () => {
        const response = await request(app)
            .post(baseUrl + "/createPost")
            .set("Authorization", "Bearer invalid_token")
            .send(testPost);
    
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Access Denied: Invalid token");
    });
    
});