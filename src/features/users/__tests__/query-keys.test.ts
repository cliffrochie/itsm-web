import { describe, it, expect } from "vitest";
import { userKeys } from "../api/query-keys";
import { ticketKeys } from "@/features/tickets/api/query-keys";
import { clientKeys } from "@/features/clients/api/query-keys";
import { notificationKeys } from "@/features/notifications/api/query-keys";

describe("Query Key Factories", () => {
  describe("userKeys", () => {
    it("generates deterministic root and list keys", () => {
      expect(userKeys.all).toEqual(["users"]);
      expect(userKeys.lists()).toEqual(["users", "list"]);
      expect(userKeys.list({ role: "admin" })).toEqual([
        "users",
        "list",
        { role: "admin" },
      ]);
    });

    it("generates deterministic detail and stats keys", () => {
      expect(userKeys.details()).toEqual(["users", "detail"]);
      expect(userKeys.detail(42)).toEqual(["users", "detail", 42]);
      expect(userKeys.totalUserRoles()).toEqual(["users", "stats", "user-roles"]);
    });
  });

  describe("ticketKeys", () => {
    it("generates structured ticket keys", () => {
      expect(ticketKeys.all).toEqual(["tickets"]);
      expect(ticketKeys.requested()).toEqual(["tickets", "requested"]);
      expect(ticketKeys.assigned(7)).toEqual(["tickets", "assigned", 7]);
      expect(ticketKeys.closed(7)).toEqual(["tickets", "closed", 7]);
      expect(ticketKeys.totalServiceStatus()).toEqual(["tickets", "stats", "service-status"]);
      expect(ticketKeys.totalTaskType()).toEqual(["tickets", "stats", "task-type"]);
      expect(ticketKeys.totalEquipmentType()).toEqual(["tickets", "stats", "equipment-type"]);
    });
  });

  describe("clientKeys and notificationKeys", () => {
    it("generates structured client keys", () => {
      expect(clientKeys.all).toEqual(["clients"]);
      expect(clientKeys.detail(10)).toEqual(["clients", "detail", 10]);
    });

    it("generates structured notification keys", () => {
      expect(notificationKeys.all).toEqual(["notifications"]);
      expect(notificationKeys.list(99)).toEqual(["notifications", 99]);
      expect(notificationKeys.list()).toEqual(["notifications", undefined]);
    });
  });
});
