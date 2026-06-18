import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const MOCK_API_BASE_URL = "https://api.mock.com";

const handlers = [
  http.get(`${MOCK_API_BASE_URL}/json`, () =>
    HttpResponse.json({
      id: "123",
      name: "Mock User",
    }),
  ),
  http.get(`${MOCK_API_BASE_URL}/text`, () =>
    HttpResponse.text("Hello, world!"),
  ),
];

export const server = setupServer(...handlers);
