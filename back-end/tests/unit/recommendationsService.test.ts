/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { createNewRecommendation } from "../factories/recommendationFactory";

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
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

    jest.spyOn(recommendationRepository, "create");

    const promise = recommendationService.insert(newRecommendation);

    expect(promise).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });

    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("upvote", () => {
  it("it should increase the score by 1", async () => {
    jest
      .spyOn(recommendationService, "getById")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    const id = 1;
    await recommendationService.upvote(id);

    expect(recommendationService.getById).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });
});

describe("downvote", () => {
  it("it should decrease the score by 1", async () => {
    const recommendation = {
      id: 1,
      name: "name",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y8",
      score: 1,
    };

    jest
      .spyOn(recommendationService, "getById")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);

    expect(recommendationService.getById).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalled();
  });

  it("it should decrease the score by 1 and delete the recomendation", async () => {
    const recommendation = {
      id: 1,
      name: "name",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y8",
      score: -6,
    };

    jest
      .spyOn(recommendationService, "getById")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);

    expect(recommendationService.getById).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("getById", () => {
  it("it should return the recommendation", async () => {
    const recommendation = {
      id: 1,
      name: "name",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y8",
      score: 0,
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    const result = await recommendationService.getById(recommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(result).toEqual(recommendation);
  });

  it("it should return notFoundError", async () => {
    const recommendation = null;

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });
    const id = 1;
    const promise = recommendationService.getById(id);

    expect(promise).rejects.toEqual({
      message: "",
      type: "not_found",
    });

    expect(recommendationRepository.find).toBeCalled();
  });
});

describe("get", () => {
  it("it should return the list of recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [];
      });

    const result = await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
    expect(result).toEqual([]);
  });
});

describe("getTop", () => {
  it("it should return the list of recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {
        return [];
      });

    const amount = 10;
    const result = await recommendationService.getTop(amount);

    expect(recommendationRepository.getAmountByScore).toBeCalled();
    expect(result).toEqual([]);
  });
});
