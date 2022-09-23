import { faker } from "@faker-js/faker";

export function createNewRecommendation() {
  const newRecommendation = {
    name: faker.lorem.words(2),
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y8",
  };

  return newRecommendation;
}
