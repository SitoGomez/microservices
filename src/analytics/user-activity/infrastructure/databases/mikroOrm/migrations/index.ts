import { Migration20250620203425_CreateUsersActivityTable } from './Migration20250620203425_CreateUsersActivityTable';
import { Migration20250623183022_AddCreatedAtAndUpdatedAtToUsersActivityTable } from './Migration20250623183022_AddCreatedAtAndUpdatedAtToUsersActivityTable';
import { Migration20250629123211_CreateProcessedEventsTable } from './Migration20250629123211_CreateProcessedEventsTable';
import { Migration20250629123211_CreateProcessedCommandsTable } from './Migration20250629173211_CreateProcessedCommandsTable';

export const analyticsMigrations = [
  Migration20250620203425_CreateUsersActivityTable,
  Migration20250623183022_AddCreatedAtAndUpdatedAtToUsersActivityTable,
  Migration20250629123211_CreateProcessedEventsTable,
  Migration20250629123211_CreateProcessedCommandsTable,
];
