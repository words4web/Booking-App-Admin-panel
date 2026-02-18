import { UserRoles } from "../enums/roles.enum";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRoles;
  companyId?: string | null;
}
