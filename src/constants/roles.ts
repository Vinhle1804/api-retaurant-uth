export const Role = {
    Owner: 'Owner',
    Employee: 'Employee',
    Guest: 'Guest',
    GuestOnline: 'GuestOnline',
  } as const;
  
 export const RoleValues = [Role.Owner, Role.Employee, Role.Guest, Role.GuestOnline] as const
  export type RoleType = (typeof RoleValues)[number];
  