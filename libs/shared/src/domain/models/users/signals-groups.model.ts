export interface SignalsGroups {
  Id: number;
  Name: string;
}

export interface SignalsGroupsCreateInput {
  Name: string;
}

export interface SignalsGroupsUpdateInput {
  Name?: string;
}
