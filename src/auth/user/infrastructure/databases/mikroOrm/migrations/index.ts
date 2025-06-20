import { Migration20250611103928_CreateUsersTable } from './Migration20250611103928_CreateUsersTable';
import { Migration20250611103929_MakeEmailUniqueUsersTable } from './Migration20250611103929_MakeEmailUniqueUsersTable';
import { Migration20250611103940_RemoveFullnameColumnFromUsersTable } from './Migration20250611103940_RemoveFullnameColumnFromUsersTable';
import { Migration20250611103950_AddCreatedAtAndUpdatedAtToUsersTable } from './Migration20250611103950_AddCreatedAtAndUpdatedAtToUsersTable';

export const authMigrations = [
  {
    name: Migration20250611103928_CreateUsersTable.name,
    class: Migration20250611103928_CreateUsersTable,
  },
  {
    name: Migration20250611103929_MakeEmailUniqueUsersTable.name,
    class: Migration20250611103929_MakeEmailUniqueUsersTable,
  },
  {
    name: Migration20250611103940_RemoveFullnameColumnFromUsersTable.name,
    class: Migration20250611103940_RemoveFullnameColumnFromUsersTable,
  },
  {
    name: Migration20250611103950_AddCreatedAtAndUpdatedAtToUsersTable.name,
    class: Migration20250611103950_AddCreatedAtAndUpdatedAtToUsersTable,
  },
];
