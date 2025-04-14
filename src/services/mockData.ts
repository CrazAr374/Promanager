import { type TimeLog } from "@/types/timelog";

// Re-export the existing mockData with updated types
// This just implements the part that needs to be fixed - the TimeLog items
// should now have status properties

export const mockTimeLogs: TimeLog[] = [
  {
    id: "tl1",
    projectId: "p1",
    userId: "u1",
    date: "2025-04-10",
    hours: 3.5,
    description: "Implemented login form",
    status: "Completed"
  },
  {
    id: "tl2",
    projectId: "p2",
    userId: "u1",
    date: "2025-04-11",
    hours: 2,
    description: "Created dashboard layout",
    status: "Completed"
  },
  {
    id: "tl3",
    projectId: "p1",
    userId: "u2",
    date: "2025-04-12",
    hours: 4,
    description: "API integration for user profile",
    status: "In Progress"
  },
  {
    id: "tl4",
    projectId: "p3",
    userId: "u1",
    date: "2025-04-13",
    hours: 1.5,
    description: "Bug fixes for navigation",
    status: "Completed"
  },
  {
    id: "tl5",
    projectId: "p2",
    userId: "u3",
    date: "2025-04-14",
    hours: 3,
    description: "Database schema design",
    status: "In Progress"
  },
  {
    id: "tl6",
    projectId: "p3",
    userId: "u2",
    date: "2025-04-15",
    hours: 2.5,
    description: "UI design for mobile view",
    status: "Pending Review"
  },
  {
    id: "tl7",
    projectId: "p1",
    userId: "u3",
    date: "2025-04-16",
    hours: 3,
    description: "Testing authentication flow",
    status: "Completed"
  },
  {
    id: "tl8",
    projectId: "p3",
    userId: "u1",
    date: "2025-04-17",
    hours: 2,
    description: "Documentation updates",
    status: "Completed"
  },
  {
    id: "tl9",
    projectId: "p2",
    userId: "u3",
    date: "2025-04-10",
    hours: 4,
    description: "Performance optimization",
    status: "In Progress"
  },
  {
    id: "tl10",
    projectId: "p1",
    userId: "u2",
    date: "2025-04-11",
    hours: 1,
    description: "Code review",
    status: "Completed"
  }
];

export const mockProjects = [
  {
    id: "p1",
    title: "Project Phoenix",
    description: "Revamping the core infrastructure",
    team: ["u1", "u2", "u3"],
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    status: "In Progress",
    client: "Acme Corp",
    budget: 50000,
    priority: "High",
  },
  {
    id: "p2",
    title: "Project Nova",
    description: "Developing a new mobile app",
    team: ["u1", "u3"],
    startDate: "2025-02-15",
    endDate: "2025-05-31",
    status: "Completed",
    client: "Beta Co",
    budget: 30000,
    priority: "Medium",
  },
  {
    id: "p3",
    title: "Project Zenith",
    description: "Creating a marketing website",
    team: ["u1", "u2"],
    startDate: "2025-03-01",
    endDate: "2025-07-31",
    status: "Pending Review",
    client: "Gamma Inc",
    budget: 40000,
    priority: "High",
  },
];

export const mockUsers = [
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Team Lead",
    projects: ["p1", "p2", "p3"],
    skills: ["JavaScript", "React", "Node.js"],
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Software Engineer",
    projects: ["p1", "p3"],
    skills: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: "u3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "UI/UX Designer",
    projects: ["p2"],
    skills: ["Figma", "Adobe XD", "User Research"],
  },
];
