import { env } from "../../../config/env";
import swaggerJsdoc from "swagger-jsdoc";

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
          required: ["traceId", "success", "error"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              required: ["code", "message"],
              properties: {
                code: { type: "string" },
                message: { type: "string" },
                details: {},
              },
            },
          },
        },
        User: {
          type: "object",
          required: ["id", "email", "name"],
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
          },
        },
        AuthData: {
          type: "object",
          required: ["accessToken", "tokenType", "user"],
          properties: {
            accessToken: { type: "string" },
            tokenType: { type: "string", example: "Bearer" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        AuthResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/AuthData" },
          },
        },
        AuthMeResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              required: ["user"],
              properties: {
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        HealthStatus: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", enum: ["ok"] },
          },
        },
        HealthResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/HealthStatus" },
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
        MeetingRecord: {
          type: "object",
          required: ["id", "title", "meetingDate", "transcript", "createdBy", "createdAt", "updatedAt", "deletedAt"],
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            meetingDate: { type: "string", format: "date-time" },
            transcript: {
              type: "array",
              items: { $ref: "#/components/schemas/TranscriptEntry" },
            },
            createdBy: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        MeetingView: {
          type: "object",
          required: ["id", "title", "meetingDate", "participants", "transcript"],
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            meetingDate: { type: "string", format: "date-time" },
            participants: {
              type: "array",
              items: { type: "string", format: "email" },
            },
            transcript: {
              type: "array",
              items: { $ref: "#/components/schemas/TranscriptEntry" },
            },
          },
        },
        Pagination: {
          type: "object",
          required: ["page", "limit", "total", "totalPages"],
          properties: {
            page: { type: "integer", minimum: 1 },
            limit: { type: "integer", minimum: 1 },
            total: { type: "integer", minimum: 0 },
            totalPages: { type: "integer", minimum: 0 },
          },
        },
        PaginatedMeetings: {
          type: "object",
          required: ["items", "pagination"],
          properties: {
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/MeetingView" },
            },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        MeetingCreateResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/MeetingRecord" },
          },
        },
        MeetingResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/MeetingView" },
          },
        },
        MeetingsListResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/PaginatedMeetings" },
          },
        },
        Citation: {
          type: "object",
          required: ["timestamp"],
          properties: {
            timestamp: { type: "string", example: "00:02" },
          },
        },
        AnalysisSummaryItem: {
          type: "object",
          required: ["text", "citations"],
          properties: {
            text: { type: "string" },
            citations: {
              type: "array",
              items: { $ref: "#/components/schemas/Citation" },
            },
          },
        },
        AnalysisActionItem: {
          type: "object",
          required: ["task", "assignee", "status", "citations"],
          properties: {
            task: { type: "string" },
            assignee: { type: "string", nullable: true },
            status: { $ref: "#/components/schemas/ActionItemStatus" },
            citations: {
              type: "array",
              items: { $ref: "#/components/schemas/Citation" },
            },
          },
        },
        AnalysisDecision: {
          type: "object",
          required: ["decision", "citations"],
          properties: {
            decision: { type: "string" },
            citations: {
              type: "array",
              items: { $ref: "#/components/schemas/Citation" },
            },
          },
        },
        AnalysisFollowUp: {
          type: "object",
          required: ["suggestion", "citations"],
          properties: {
            suggestion: { type: "string" },
            citations: {
              type: "array",
              items: { $ref: "#/components/schemas/Citation" },
            },
          },
        },
        MeetingAnalysisResponseData: {
          type: "object",
          required: ["summary", "actionItems", "decisions", "followUps"],
          properties: {
            summary: {
              type: "array",
              items: { $ref: "#/components/schemas/AnalysisSummaryItem" },
            },
            actionItems: {
              type: "array",
              items: { $ref: "#/components/schemas/AnalysisActionItem" },
            },
            decisions: {
              type: "array",
              items: { $ref: "#/components/schemas/AnalysisDecision" },
            },
            followUps: {
              type: "array",
              items: { $ref: "#/components/schemas/AnalysisFollowUp" },
            },
          },
        },
        MeetingAnalysisResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/MeetingAnalysisResponseData" },
          },
        },
        ActionItemStatus: {
          type: "string",
          enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
        },
        ActionItem: {
          type: "object",
          required: ["id", "meetingId", "title", "description", "assigneeId", "dueDate", "status", "createdBy", "createdAt", "updatedAt", "deletedAt"],
          properties: {
            id: { type: "string", format: "uuid" },
            meetingId: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            assigneeId: { type: "string", format: "uuid", nullable: true },
            dueDate: { type: "string", format: "date-time", nullable: true },
            status: { $ref: "#/components/schemas/ActionItemStatus" },
            createdBy: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
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
        ActionItemStatusInput: {
          type: "object",
          required: ["status"],
          properties: {
            status: { $ref: "#/components/schemas/ActionItemStatus" },
          },
        },
        ActionItemStatusUpdate: {
          type: "object",
          required: ["id", "status", "updatedAt"],
          properties: {
            id: { type: "string", format: "uuid" },
            status: { $ref: "#/components/schemas/ActionItemStatus" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ActionItemListData: {
          type: "object",
          required: ["items"],
          properties: {
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/ActionItem" },
            },
          },
        },
        ActionItemResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/ActionItem" },
          },
        },
        ActionItemListResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/ActionItemListData" },
          },
        },
        ActionItemStatusResponse: {
          type: "object",
          required: ["traceId", "success", "data"],
          properties: {
            traceId: { type: "string" },
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/ActionItemStatusUpdate" },
          },
        },
        EvaluationResponse: {
          type: "object",
          required: ["candidateName", "email", "repositoryUrl", "deployedUrl", "externalIntegration", "features"],
          properties: {
            candidateName: { type: "string" },
            email: { type: "string", format: "email" },
            repositoryUrl: { type: "string", format: "uri" },
            deployedUrl: { type: "string", format: "uri" },
            externalIntegration: { type: "string" },
            features: {
              type: "array",
              items: { type: "string" },
            },
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
            200: {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/HealthResponse" },
                },
              },
            },
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
            200: { description: "Authenticated user", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMeResponse" } } } },
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
            200: { description: "Meetings list", content: { "application/json": { schema: { $ref: "#/components/schemas/MeetingsListResponse" } } } },
            400: { description: "Invalid pagination", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
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
            201: { description: "Meeting created", content: { "application/json": { schema: { $ref: "#/components/schemas/MeetingCreateResponse" } } } },
            400: { description: "Invalid request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
            409: { description: "Meeting already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
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
            200: { description: "Meeting details", content: { "application/json": { schema: { $ref: "#/components/schemas/MeetingResponse" } } } },
            400: { description: "Missing meeting id", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
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
            200: { description: "Meeting analysis response", content: { "application/json": { schema: { $ref: "#/components/schemas/MeetingAnalysisResponse" } } } },
            400: { description: "Meeting transcript missing", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
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
            200: { description: "Action items list", content: { "application/json": { schema: { $ref: "#/components/schemas/ActionItemListResponse" } } } },
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
            201: { description: "Action item created", content: { "application/json": { schema: { $ref: "#/components/schemas/ActionItemResponse" } } } },
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
                schema: { $ref: "#/components/schemas/ActionItemStatusInput" },
              },
            },
          },
          responses: {
            200: { description: "Status updated", content: { "application/json": { schema: { $ref: "#/components/schemas/ActionItemStatusResponse" } } } },
            400: { description: "Invalid request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
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
            200: { description: "Overdue action items", content: { "application/json": { schema: { $ref: "#/components/schemas/ActionItemListResponse" } } } },
          },
        },
      },
      "/evaluation": {
        get: {
          tags: ["Evaluation"],
          summary: "Get evaluation info",
          responses: {
            200: { description: "Evaluation response", content: { "application/json": { schema: { $ref: "#/components/schemas/EvaluationResponse" } } } },
          },
        },
      },
    },
  },
  apis: [],
});
