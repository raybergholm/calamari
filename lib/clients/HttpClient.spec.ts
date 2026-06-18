import { MOCK_API_BASE_URL } from "@/mocks/mockService";

import { HttpClient } from "./HttpClient";

describe("HttpClient", () => {
  describe("response modes", () => {
    it("should return json by default", async () => {
      const client = new HttpClient(MOCK_API_BASE_URL);
      const response = await client.get("json");
      expect(response).toEqual({
        id: "123",
        name: "Mock User",
      });
    });

    it("should return json when responseMode is undefined", async () => {
      const client = new HttpClient(MOCK_API_BASE_URL, {
        responseMode: undefined,
      });
      const response = await client.get("json");
      expect(response).toEqual({
        id: "123",
        name: "Mock User",
      });
    });

    it("should return json when set explicitly", async () => {
      const client = new HttpClient(MOCK_API_BASE_URL, {
        responseMode: "json",
      });
      const response = await client.get("json");
      expect(response).toEqual({
        id: "123",
        name: "Mock User",
      });
    });

    it("should return text when set explicitly", async () => {
      const client = new HttpClient(MOCK_API_BASE_URL, {
        responseMode: "text",
      });
      const response = await client.get("text");
      expect(response).toBe("Hello, world!");
    });

    it("should allow overriding responseMode on the call level", async () => {
      const client = new HttpClient(MOCK_API_BASE_URL, {
        responseMode: "text",
      });
      const response = await client.get("json", { responseMode: "json" });
      expect(response).toEqual({
        id: "123",
        name: "Mock User",
      });
    });
  });
});
