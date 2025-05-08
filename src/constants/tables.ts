export const TableStatus = {
    Available: 'Available',
    Hidden: 'Hidden',
    Reserved: 'Reserved'
  } as const
  
  export const TableStatusValues = [TableStatus.Available, TableStatus.Hidden, TableStatus.Reserved] as const
    export type TableStatusType = (typeof TableStatusValues)[number];