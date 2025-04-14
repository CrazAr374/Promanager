
import { useEffect, useState } from "react";
import { getProjects, getTimeLogs, getUsers } from "@/services/api";
import { Project, TimeLog, User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { TimeLogForm } from "@/components/TimeLogForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClockIcon,
  Loader2Icon,
  SearchIcon,
} from "lucide-react";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const TimeLogsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all-projects");
  const [userFilter, setUserFilter] = useState("all-users");
  const [dateFilter, setDateFilter] = useState("");
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsData, timeLogsData, usersData] = await Promise.all([
          getProjects(),
          getTimeLogs(),
          getUsers()
        ]);
        
        setProjects(projectsData);
        setTimeLogs(timeLogsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error loading time logs data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const refreshTimeLogs = async () => {
    const timeLogsData = await getTimeLogs();
    setTimeLogs(timeLogsData);
  };
  
  const getProjectById = (id: string) => {
    return projects.find((p) => p.id === id);
  };
  
  const getUserById = (id: string) => {
    return users.find((u) => u.id === id);
  };
  
  const getTaskById = (projectId: string, taskId?: string) => {
    if (!taskId) return null;
    const project = getProjectById(projectId);
    return project?.tasks?.find((t) => t.id === taskId);
  };
  
  const filteredLogs = timeLogs.filter((log) => {
    // Project filter
    if (projectFilter !== "all-projects" && log.projectId !== projectFilter) return false;
    
    // User filter
    if (userFilter !== "all-users" && log.userId !== userFilter) return false;
    
    // Date filter
    if (dateFilter && log.date !== dateFilter) return false;
    
    // Search term (check description)
    if (
      searchTerm &&
      !log.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    
    return true;
  });
  
  // Sort logs by date (newest first)
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const totalHours = sortedLogs.reduce((sum, log) => sum + log.hours, 0);
  
  const formatTimeAgo = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };
  
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <ClockIcon className="h-6 w-6 mr-2" />
          Time Logs
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-base">
          Total: {totalHours.toFixed(1)} hours
        </Badge>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-projects">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-users">All Users</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Time Log Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedLogs.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedLogs.map((log) => {
                        const projectName = getProjectById(log.projectId)?.title || "Unknown Project";
                        const userName = getUserById(log.userId)?.name || "Unknown User";
                        const task = getTaskById(log.projectId, log.taskId);
                        
                        return (
                          <TableRow key={log.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback className="text-xs">
                                    {userName.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {userName}
                              </div>
                            </TableCell>
                            <TableCell>{projectName}</TableCell>
                            <TableCell>{task?.title || "-"}</TableCell>
                            <TableCell>{log.hours}</TableCell>
                            <TableCell className="max-w-[200px]">
                              <div className="truncate">{log.description}</div>
                            </TableCell>
                            <TableCell>
                              <div className="whitespace-nowrap">
                                {new Date(log.date).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatTimeAgo(log.date)}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  {searchTerm || projectFilter !== "all-projects" || userFilter !== "all-users" || dateFilter
                    ? "No time logs match your filters"
                    : "No time logs have been recorded yet"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <TimeLogForm projects={projects} onSuccess={refreshTimeLogs} />
        </div>
      </div>
    </div>
  );
};

export default TimeLogsPage;
