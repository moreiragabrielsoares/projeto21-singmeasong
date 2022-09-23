import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";
import {
  createNewRecommendation,
  insertNewRecommendation,
} from "../tests/factories/recommendationFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
});

describe("POST /recommendations", () => {
  it("given a valid new recommendation body it should return 201", async () => {
    const newRecommendation = createNewRecommendation();

    const result = await supertest(app)
      .post("/recommendations")
      .send(newRecommendation);

    const createdRecommendation = await prisma.recommendation.findUnique({
      where: { name: newRecommendation.name },
    });

    expect(result.status).toEqual(201);
    expect(createdRecommendation).not.toBeNull();
  });

  it("given a valid new recommendation body with duplicated name it should return 409", async () => {
    const newRecommendation = createNewRecommendation();

    const firstTry = await supertest(app)
      .post("/recommendations")
      .send(newRecommendation);
    expect(firstTry.status).toEqual(201);

    const result = await supertest(app)
      .post("/recommendations")
      .send(newRecommendation);
    expect(result.status).toEqual(409);
  });

  it("given an invalid new recommendation body it should return 422", async () => {
    const invalidBody = {};

    const result = await supertest(app)
      .post("/recommendations")
      .send(invalidBody);

    expect(result.status).toEqual(422);
  });
});

describe("POST /recommendations/:id/upvote", () => {
  it("given a valid id it should return 200 and the score should be incremented by 1", async () => {
    const insertedNewRecommendation = await insertNewRecommendation();
    const { id, score } = insertedNewRecommendation;

    const result = await supertest(app).post(`/recommendations/${id}/upvote`);

    const { score: updatedScore } = await prisma.recommendation.findUnique({
      where: { id },
    });

    expect(result.status).toEqual(200);
    expect(updatedScore).toBe(score + 1);
  });

  it("given an invalid id it should return 404", async () => {
    const invalidId = -1;

    const result = await supertest(app).post(
      `/recommendations/${invalidId}/upvote`
    );

    expect(result.status).toEqual(404);
  });
});

describe("POST /recommendations/:id/downvote", () => {
  it.todo(
    "given a valid id it should return 200 and the score should be decremented by 1"
  );

  it.todo("given an invalid id it should return 404");

  it.todo(
    "given a recommendation id that its score reaches a value less than -5 it should return 200 and the recommendation should be deleted"
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});
