import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export function createNewRecommendation() {
  const newRecommendation = {
    name: faker.lorem.words(2),
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y8",
  };

  return newRecommendation;
}

export async function insertNewRecommendation() {
  const newRecommendation = createNewRecommendation();

  await prisma.recommendation.create({
    data: newRecommendation,
  });

  const insertedNewRecommendation = await prisma.recommendation.findUnique({
    where: { name: newRecommendation.name },
  });

  return insertedNewRecommendation;
}
