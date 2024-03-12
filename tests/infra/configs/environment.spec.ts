import { environment } from "@/infra/configs/environment";

describe("Environment", () => {
  it("should use the correct environment", () => {
    expect(environment.ENVIRONMENT).toBe("development");
  });
});
