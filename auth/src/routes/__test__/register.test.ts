import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful register", async () => {
  return request(app)
    .post("/api/users/register")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/register")
    .send({
      email: "testfefecom",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/register")
    .send({
      email: "testfefecom",
      password: "22",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/register")
    .send({ email: "pitong@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/register")
    .send({ password: "2345" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/register")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
  await request(app)
    .post("/api/users/register")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("sets a cookie after succesful register", async () => {
  const response = await request(app)
    .post("/api/users/register")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
