export const DishStatus = {
    Available: 'Available',
    Unavailable: 'Unavailable',
    Hidden: 'Hidden'
  } as const
  
  export const DishStatusValues = [DishStatus.Available, DishStatus.Unavailable, DishStatus.Hidden] as const;
  export type DishStatusType = (typeof DishStatusValues)[number];

  