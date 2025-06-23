import { Migration20250611103928_CreateUsersTable } from './Migration20250611103928_CreateUsersTable';
import { Migration20250611103929_MakeEmailUniqueUsersTable } from './Migration20250611103929_MakeEmailUniqueUsersTable';
import { Migration20250611103940_RemoveFullnameColumnFromUsersTable } from './Migration20250611103940_RemoveFullnameColumnFromUsersTable';
import { Migration20250611103950_AddCreatedAtAndUpdatedAtToUsersTable } from './Migration20250611103950_AddCreatedAtAndUpdatedAtToUsersTable';

export const authMigrations = [
  Migration20250611103928_CreateUsersTable,
  Migration20250611103929_MakeEmailUniqueUsersTable,
  Migration20250611103940_RemoveFullnameColumnFromUsersTable,
  Migration20250611103950_AddCreatedAtAndUpdatedAtToUsersTable,
];
