
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  team: string[];
  tasks?: Task[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
}

export interface TimeLog {
  id: string;
  projectId: string;
  userId: string;
  taskId?: string;
  hours: number;
  description: string;
  date: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
