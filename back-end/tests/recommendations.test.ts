import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";
import { createNewRecommendation } from "../tests/factories/recommendationFactory";

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

afterAll(async () => {
  await prisma.$disconnect();
});
