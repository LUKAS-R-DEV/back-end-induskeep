// src/modules/accessControl/domain/RolePolicy.js
export const RolePolicy = {
  TECHNICIAN: [
    "VIEW_MACHINES",
    "VIEW_ORDERS",
    "VIEW_PIECES",
    "CREATE_HISTORY",
    "VIEW_HISTORY", // Técnicos podem ver apenas suas próprias ordens concluídas
    "UPDATE_ORDER",
    "CREATE_STOCK_EXIT",
  ],

  SUPERVISOR: [
    "VIEW_MACHINES",
    "CREATE_ORDER",
    "UPDATE_ORDER",
    "VIEW_REPORTS",
    "VIEW_PIECES",
    "CREATE_SCHEDULE",
    "VIEW_ORDERS",
    "VIEW_NOTIFICATIONS",
    "VIEW_HISTORY",
    "CREATE_MACHINE",
    "UPDATE_MACHINE",
    "DELETE_MACHINE",
    "CREATE_PIECE",
    "UPDATE_PIECE",
    "DELETE_PIECE",
    "CREATE_STOCK_MOVEMENT",
    "UPDATE_STOCK_MOVEMENT",
    "DELETE_STOCK_MOVEMENT",
    "MANAGE_SETTINGS",
    "DELETE_ORDER",
    // Não inclui permissões de usuários e logs (mantém apenas ADMIN)
  ],

  ADMIN: [
    "ALL", // acesso total
  ],
};
