import { Hall } from "../Model/Hall/hall";

describe("Hall", () => {
  it("should be defined", () => {
    expect(new Hall(1)).toBeDefined();
  });

  it("should throw error", () => {
    expect(() => new Hall(-1)).toThrowError();
    expect(() => new Hall(null)).toThrowError();
  });
});
