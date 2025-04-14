
export interface TimeLog {
  id: string;
  projectId: string;
  userId: string;
  date: string;
  hours: number;
  description: string;
  status?: string; // Make status optional to handle existing data
}
