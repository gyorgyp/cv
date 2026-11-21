const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

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
    try {
      const container = getContainer();

      // Document reading (id = "cv", partitionKey = "cv")
      const { resource } = await container.item("cv", "cv").read();

      if (!resource) {
        return {
          status: 404,
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
        jsonBody: { error: "Server issue occurred while loading the CV." }
      };
    }
  }
});
