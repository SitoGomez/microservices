import { Migration20250620203425_CreateUsersActivityTable } from './Migration20250620203425_CreateUsersActivityTable';
import { Migration20250623183022_AddCreatedAtAndUpdatedAtToUsersActivityTable } from './Migration20250623183022_AddCreatedAtAndUpdatedAtToUsersActivityTable';

export const analyticsMigrations = [
  Migration20250620203425_CreateUsersActivityTable,
  Migration20250623183022_AddCreatedAtAndUpdatedAtToUsersActivityTable,
];
