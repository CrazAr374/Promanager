
import { LoginCredentials, Project, RegisterData, TimeLog, User } from "../types";
import { mockProjects, mockTimeLogs, mockUsers } from "./mockData";

// Simulate backend API calls with local storage
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initialize local storage with mock data
const initializeLocalStorage = () => {
  if (!localStorage.getItem('users')) {
    setLocalStorage('users', mockUsers);
  }
  
  if (!localStorage.getItem('projects')) {
    setLocalStorage('projects', mockProjects);
  }
  
  if (!localStorage.getItem('timeLogs')) {
    setLocalStorage('timeLogs', mockTimeLogs);
  }
  
  if (!localStorage.getItem('currentUser')) {
    setLocalStorage('currentUser', null);
  }
};

// Authentication APIs
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  initializeLocalStorage();
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getLocalStorage<User[]>('users', []);
      const user = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setLocalStorage('currentUser', userWithoutPassword);
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500); // Simulate network delay
  });
};

export const registerUser = async (userData: RegisterData): Promise<User> => {
  initializeLocalStorage();
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getLocalStorage<User[]>('users', []);
      
      if (users.some((u) => u.email === userData.email)) {
        reject(new Error('Email already in use'));
        return;
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };
      
      const updatedUsers = [...users, newUser];
      setLocalStorage('users', updatedUsers);
      
      const { password, ...userWithoutPassword } = newUser;
      setLocalStorage('currentUser', userWithoutPassword);
      resolve(userWithoutPassword);
    }, 500);
  });
};

export const logoutUser = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      setLocalStorage('currentUser', null);
      resolve();
    }, 300);
  });
};

export const getCurrentUser = async (): Promise<User | null> => {
  initializeLocalStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUser = getLocalStorage<User | null>('currentUser', null);
      resolve(currentUser);
    }, 300);
  });
};

// Project APIs
export const getProjects = async (): Promise<Project[]> => {
  initializeLocalStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const projects = getLocalStorage<Project[]>('projects', []);
      resolve(projects);
    }, 500);
  });
};

export const getProject = async (id: string): Promise<Project> => {
  initializeLocalStorage();
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projects = getLocalStorage<Project[]>('projects', []);
      const project = projects.find((p) => p.id === id);
      
      if (project) {
        resolve(project);
      } else {
        reject(new Error('Project not found'));
      }
    }, 300);
  });
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  initializeLocalStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const projects = getLocalStorage<Project[]>('projects', []);
      const newProject: Project = {
        ...project,
        id: `project-${Date.now()}`,
      };
      
      const updatedProjects = [...projects, newProject];
      setLocalStorage('projects', updatedProjects);
      resolve(newProject);
    }, 500);
  });
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  initializeLocalStorage();
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projects = getLocalStorage<Project[]>('projects', []);
      const index = projects.findIndex((p) => p.id === id);
      
      if (index !== -1) {
        const updatedProject = { ...projects[index], ...projectData };
        const updatedProjects = [...projects];
        updatedProjects[index] = updatedProject;
        
        setLocalStorage('projects', updatedProjects);
        resolve(updatedProject);
      } else {
        reject(new Error('Project not found'));
      }
    }, 500);
  });
};

export const deleteProject = async (id: string): Promise<void> => {
  initializeLocalStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const projects = getLocalStorage<Project[]>('projects', []);
      const updatedProjects = projects.filter((p) => p.id !== id);
      setLocalStorage('projects', updatedProjects);
      
      // Also delete related time logs
      const timeLogs = getLocalStorage<TimeLog[]>('timeLogs', []);
      const updatedTimeLogs = timeLogs.filter((log) => log.projectId !== id);
      setLocalStorage('timeLogs', updatedTimeLogs);
      
      resolve();
    }, 500);
  });
};

// Time Log APIs
export const getTimeLogs = async (projectId?: string): Promise<TimeLog[]> => {
  initializeLocalStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const timeLogs = getLocalStorage<TimeLog[]>('timeLogs', []);
      
      if (projectId) {
        resolve(timeLogs.filter((log) => log.projectId === projectId));
      } else {
        resolve(timeLogs);
      }
    }, 400);
  });
};

export const createTimeLog = async (timeLog: Omit<TimeLog, 'id'>): Promise<TimeLog> => {
  initializeLocalStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const timeLogs = getLocalStorage<TimeLog[]>('timeLogs', []);
      const newTimeLog: TimeLog = {
        ...timeLog,
        id: `log-${Date.now()}`,
      };
      
      const updatedTimeLogs = [...timeLogs, newTimeLog];
      setLocalStorage('timeLogs', updatedTimeLogs);
      resolve(newTimeLog);
    }, 400);
  });
};

// Users API
export const getUsers = async (): Promise<User[]> => {
  initializeLocalStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getLocalStorage<User[]>('users', []);
      // Remove passwords before sending to client
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      resolve(usersWithoutPasswords);
    }, 400);
  });
};
