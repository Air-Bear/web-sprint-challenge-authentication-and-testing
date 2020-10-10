const request = require("supertest");
const server = require("./server");
const db = require("../database/dbConfig");
const testUser = {username: "test", password: "test"};

describe("server.js", () => {
    describe("get request tests", () => {
        it("should return status code 400 when not authenticated", async () => {
            const res = await request(server).get("/api/jokes")
            expect(res.status).toBe(401);
        });

        it("should return json", async() => {
            const res = await request(server).get("/api/jokes");
            expect(res.type).toBe("application/json");
        })
    });

    describe("register new user", () => {
        it("should return status code 201 when register", async() => {
            await db("users").truncate();
            const res = await request(server).post("/api/auth/register").send(testUser);
            expect(res.status).toBe(201);
        });
        it("should return 500 for invalid user", async() => {
            const res = await request(server).post("/api/auth/register").send({doesntExist: "test", alsoDoesnt: "test"});
            expect(res.status).toBe(500);
        }); 
    });

    describe("login with user", () => {
        it("should return a status code of 200 with test user", async() => {
            const res = await request(server).post("/api/auth/login").send(testUser);
            expect(res.status).toBe(200);
        });
        it("should return with a status of 401 for invalid user", async() => {
            const res = await request(server).post("/api/auth/login").send({username: "doesnt exist", password: "doesnt exist"})
        });
    });
});