// src/modules/accessControl/application/AccessService.js
import { RolePolicy } from "../domain/RolePolicy.js";

export const AccessService = {
  hasPermission(role, permission) {
    const permissions = RolePolicy[role] || [];
    return permissions.includes("ALL") || permissions.includes(permission);
  },

  canAccess(role, rolesAllowed = []) {
    return rolesAllowed.includes(role) || rolesAllowed.includes("ALL");
  },
};
