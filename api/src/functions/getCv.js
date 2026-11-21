const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

// Origins allowed to call the API from the browser (CORS). The SWA site itself is same-origin and needs no entry.
// Extra origins can be added without a code change via the CORS_ALLOWED_ORIGINS app setting (comma-separated).
const ALLOWED_ORIGINS = [
  "https://gyorgyp.github.io",
  ...(process.env.CORS_ALLOWED_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean)
];

function corsHeaders(request) {
  const origin = request.headers.get("origin");
  // Vary: Origin keeps caches from serving one origin's response to another.
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return { "Access-Control-Allow-Origin": origin, "Vary": "Origin" };
  }
  return { "Vary": "Origin" };
}

const REQUIRED_SETTINGS = ["COSMOS_ENDPOINT", "COSMOS_KEY", "COSMOS_DB_ID", "COSMOS_CONTAINER_ID"];

// Created lazily and cached at module level, so the connection is reused across invocations.
// Creating it at import time would make the whole function fail to register when a setting is missing.
let cachedContainer = null;

function getContainer() {
  if (cachedContainer) return cachedContainer;

  const missing = REQUIRED_SETTINGS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing app settings: ${missing.join(", ")}`);
  }

  const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
  });
  cachedContainer = client
    .database(process.env.COSMOS_DB_ID)
    .container(process.env.COSMOS_CONTAINER_ID);
  return cachedContainer;
}

app.http("getCv", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "cv",
  handler: async (request, context) => {
    const cors = corsHeaders(request);

    try {
      const container = getContainer();

      // Document reading (id = "cv", partitionKey = "cv")
      const { resource } = await container.item("cv", "cv").read();

      if (!resource) {
        return {
          status: 404,
          headers: cors,
          jsonBody: { error: "CV document is missing." }
        };
      }

      // If validated CV is in 'data' field, return it,
      // otherwise return the document itself (without Cosmos DB system fields)
      let cvPayload;
      if (resource.data) {
        cvPayload = resource.data;
      } else {
        const { id, cv1, updatedAt, _rid, _self, _etag, _attachments, _ts, ...cleanData } = resource;
        cvPayload = cleanData;
      }

      return {
        status: 200,
        headers: {
          ...cors,
          // Browsers and the SWA edge may reuse the response for 5 minutes, saving Cosmos DB reads.
          //"Cache-Control": "public, max-age=300"
          "Cache-Control": "no-cache"
        },
        jsonBody: cvPayload
      };
    } catch (error) {
      context.error("Failed to load the CV from Cosmos DB:", error);
      return {
        status: 500,
        headers: cors,
        jsonBody: { error: "Server issue occurred while loading the CV." }
      };
    }
  }
});
