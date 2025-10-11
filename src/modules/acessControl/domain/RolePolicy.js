// src/modules/accessControl/domain/RolePolicy.js
export const RolePolicy = {
  TECHNICIAN: [
    "VIEW_MACHINES",
    "VIEW_ORDERS",
    "VIEW_PIECES",
    "CREATE_HISTORY",
  ],

  SUPERVISOR: [
    "VIEW_MACHINES",
    "CREATE_ORDER",
    "UPDATE_ORDER",
    "VIEW_REPORTS",
    "VIEW_PIECES",
    "CREATE_SCHEDULE",
  ],

  ADMIN: [
    "ALL", // acesso total
  ],
};
