import { Migration20250611103928_CreateUsersTable } from './Migration20250611103928_CreateUsersTable';
import { Migration20250611103929_MakeEmailUniqueUsersTable } from './Migration20250611103929_MakeEmailUniqueUsersTable';

export const migrations = [
  {
    name: Migration20250611103928_CreateUsersTable.name,
    class: Migration20250611103928_CreateUsersTable,
  },
  {
    name: Migration20250611103929_MakeEmailUniqueUsersTable.name,
    class: Migration20250611103929_MakeEmailUniqueUsersTable,
  },
];
