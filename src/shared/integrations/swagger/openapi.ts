import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../../config/env";

export const openApiSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MIS API",
      version: "1.0.0",
      description: "Meeting intelligence backend API documentation.",
    },
    servers: [
      {
        url: env.apiPrefix,
        description: "Current API prefix",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiError: {
          type: "object",
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                accessToken: { type: "string" },
                tokenType: { type: "string", example: "Bearer" },
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
          },
        },
        TranscriptEntry: {
          type: "object",
          required: ["timestamp", "speaker", "text"],
          properties: {
            timestamp: { type: "string", example: "00:02" },
            speaker: { type: "string", example: "Sarah" },
            text: { type: "string" },
          },
        },
        MeetingInput: {
          type: "object",
          required: ["title", "participants", "meetingDate", "transcript"],
          properties: {
            title: { type: "string", example: "Product Roadmap Review - Q3 2026" },
            participants: {
              type: "array",
              items: { type: "string", format: "email" },
            },
            meetingDate: { type: "string", format: "date-time" },
            transcript: {
              type: "array",
              items: { $ref: "#/components/schemas/TranscriptEntry" },
            },
          },
        },
        ActionItemInput: {
          type: "object",
          required: ["meetingId", "title", "assigneeId", "dueDate"],
          properties: {
            meetingId: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            assigneeId: { type: "string", format: "uuid" },
            dueDate: { type: "string", format: "date-time" },
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Check service health",
          responses: {
            200: { description: "Service is healthy" },
          },
        },
      },
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "name", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    name: { type: "string" },
                    password: { type: "string", minLength: 5 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User registered", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
            409: { description: "Email already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Log in",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
            401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Authenticated user" },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/meetings": {
        get: {
          tags: ["Meetings"],
          summary: "List meetings",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1 } },
          ],
          responses: {
            200: { description: "Meetings list" },
          },
        },
      },
      "/meeting": {
        post: {
          tags: ["Meetings"],
          summary: "Create a meeting",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MeetingInput" },
              },
            },
          },
          responses: {
            201: { description: "Meeting created" },
            400: { description: "Invalid request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/meeting/{id}": {
        get: {
          tags: ["Meetings"],
          summary: "Get a meeting",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: { description: "Meeting details" },
            404: { description: "Meeting not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/meetings/{id}/analyze": {
        post: {
          tags: ["Meetings"],
          summary: "Analyze a meeting transcript with AI",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: { description: "Meeting analysis response" },
            404: { description: "Meeting not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/action-items": {
        get: {
          tags: ["Action Items"],
          summary: "List action items",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED"] } },
            { name: "assigneeId", in: "query", schema: { type: "string", format: "uuid" } },
            { name: "meetingId", in: "query", schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: { description: "Action items list" },
          },
        },
        post: {
          tags: ["Action Items"],
          summary: "Create an action item",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ActionItemInput" },
              },
            },
          },
          responses: {
            201: { description: "Action item created" },
            400: { description: "Invalid request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/action-items/{id}/status": {
        patch: {
          tags: ["Action Items"],
          summary: "Update action item status",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED"] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Status updated" },
            404: { description: "Action item not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/action-items/overdue": {
        get: {
          tags: ["Action Items"],
          summary: "List overdue action items",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Overdue action items" },
          },
        },
      },
    },
  },
  apis: [],
});
