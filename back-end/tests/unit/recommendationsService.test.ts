/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { createNewRecommendation } from "../factories/recommendationFactory";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("insert", () => {
  it("it should insert a new recommendation", async () => {
    const newRecommendation = createNewRecommendation();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(newRecommendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it("it should not insert a duplicated recommendation", async () => {
    const newRecommendation = createNewRecommendation();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return newRecommendation;
      });

    const promise = recommendationService.insert(newRecommendation);

    expect(promise).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });

    expect(recommendationRepository.create).not.toBeCalled();
  });
});
