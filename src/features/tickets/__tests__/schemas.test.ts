import { describe, it, expect } from "vitest";
import {
  ticketFormSchema,
  ticketResolutionSchema,
  updateTicketStatusSchema,
  assignEngineerSchema,
  ticketFeedbackSchema,
} from "../schemas";

describe("Ticket Validation Schemas", () => {
  describe("ticketFormSchema", () => {
    it("validates valid ticket input", () => {
      const validData = {
        title: "Network connectivity issue",
        equipmentType: "network",
        taskType: "incident",
        natureOfWork: "Repair network cable",
        client: "1",
        priority: "high" as const,
      };

      const result = ticketFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects when required fields are missing or empty", () => {
      const invalidData = {
        title: "",
        equipmentType: "",
        taskType: "",
        natureOfWork: "",
        client: "",
      };

      const result = ticketFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMap = result.error.flatten().fieldErrors;
        expect(errorMap.title).toBeDefined();
        expect(errorMap.equipmentType).toBeDefined();
        expect(errorMap.taskType).toBeDefined();
        expect(errorMap.natureOfWork).toBeDefined();
        expect(errorMap.client).toBeDefined();
      }
    });

    it("enforces priority enum constraint", () => {
      const invalidPriority = {
        title: "Printer offline",
        equipmentType: "printer",
        taskType: "service request",
        natureOfWork: "Fix spooler",
        client: "2",
        priority: "critical" as unknown, // not in enum
      };

      const result = ticketFormSchema.safeParse(invalidPriority);
      expect(result.success).toBe(false);
    });
  });

  describe("ticketResolutionSchema", () => {
    it("validates valid resolution input", () => {
      const validData = {
        defectsFound: "Damaged power cable",
        serviceRendered: "Replaced power cable and verified boot",
        serviceStatus: "resolved",
      };

      const result = ticketResolutionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects when required fields are missing", () => {
      const result = ticketResolutionSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("updateTicketStatusSchema", () => {
    it("accepts valid status enum values", () => {
      const validStatuses = ["open", "in_progress", "resolved", "closed", "cancelled"] as const;
      validStatuses.forEach((status) => {
        const result = updateTicketStatusSchema.safeParse({ serviceStatus: status });
        expect(result.success).toBe(true);
      });
    });

    it("rejects unknown status", () => {
      const result = updateTicketStatusSchema.safeParse({ serviceStatus: "unknown_status" });
      expect(result.success).toBe(false);
    });
  });

  describe("assignEngineerSchema", () => {
    it("validates positive integer for engineer id", () => {
      expect(assignEngineerSchema.safeParse({ serviceEngineerId: 5 }).success).toBe(true);
      expect(assignEngineerSchema.safeParse({ serviceEngineerId: 0 }).success).toBe(false);
      expect(assignEngineerSchema.safeParse({ serviceEngineerId: -1 }).success).toBe(false);
      expect(assignEngineerSchema.safeParse({ serviceEngineerId: 2.5 }).success).toBe(false);
    });
  });

  describe("ticketFeedbackSchema", () => {
    it("accepts ratings between 1 and 5", () => {
      [1, 2, 3, 4, 5].forEach((rating) => {
        expect(ticketFeedbackSchema.safeParse({ rating }).success).toBe(true);
      });
    });

    it("rejects ratings out of bounds", () => {
      expect(ticketFeedbackSchema.safeParse({ rating: 0 }).success).toBe(false);
      expect(ticketFeedbackSchema.safeParse({ rating: 6 }).success).toBe(false);
    });
  });
});
