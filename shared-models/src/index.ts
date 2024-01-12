export type User = {
  id: number;
  name: string;
};

export type Ticket = {
  id: number;
  title?: string;
  description: string;
  assigneeId: null | number;
  completed: boolean;
};
