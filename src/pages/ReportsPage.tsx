
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProjects, mockTimeLogs, mockUsers } from "@/services/mockData";
import { format, parseISO, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, ArrowUpDown, Calendar, Clock } from "lucide-react";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];

const ReportsPage = () => {
  const [reportType, setReportType] = useState("time");
  const [timeRange, setTimeRange] = useState("month");
  const [projectFilter, setProjectFilter] = useState("all-projects");

  // Calculate total hours by project
  const getProjectHours = () => {
    const projectHours = {} as Record<string, number>;
    
    mockTimeLogs.forEach(log => {
      if (projectFilter !== "all-projects" && log.projectId !== projectFilter) {
        return;
      }
      
      if (!projectHours[log.projectId]) {
        projectHours[log.projectId] = 0;
      }
      
      projectHours[log.projectId] += log.hours;
    });
    
    return Object.entries(projectHours).map(([projectId, hours]) => {
      const project = mockProjects.find(p => p.id === projectId);
      return {
        name: project?.title || "Unknown Project",
        hours
      };
    });
  };

  // Calculate total hours by user
  const getUserHours = () => {
    const userHours = {} as Record<string, number>;
    
    mockTimeLogs.forEach(log => {
      if (projectFilter !== "all-projects" && log.projectId !== projectFilter) {
        return;
      }
      
      if (!userHours[log.userId]) {
        userHours[log.userId] = 0;
      }
      
      userHours[log.userId] += log.hours;
    });
    
    return Object.entries(userHours).map(([userId, hours]) => {
      const user = mockUsers.find(u => u.id === userId);
      return {
        name: user?.name || "Unknown User",
        hours
      };
    });
  };

  // Calculate total hours by task status
  const getStatusHours = () => {
    const statusHours = {} as Record<string, number>;
    
    mockTimeLogs.forEach(log => {
      if (projectFilter !== "all-projects" && log.projectId !== projectFilter) {
        return;
      }
      
      // Use a default status if not available
      const status = log.status || "Completed";
      
      if (!statusHours[status]) {
        statusHours[status] = 0;
      }
      
      statusHours[status] += log.hours;
    });
    
    return Object.entries(statusHours).map(([status, hours]) => ({
      name: status,
      hours
    }));
  };

  // Calculate data for selected report type
  const getReportData = () => {
    switch (reportType) {
      case "time":
        return getProjectHours();
      case "user":
        return getUserHours();
      case "status":
        return getStatusHours();
      default:
        return [];
    }
  };

  const reportData = getReportData();
  
  // Generate summary statistics
  const totalHours = reportData.reduce((sum, item) => sum + item.hours, 0);
  const topItem = [...reportData].sort((a, b) => b.hours - a.hours)[0] || { name: "None", hours: 0 };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Hours</CardDescription>
            <CardTitle className="text-3xl">{totalHours.toFixed(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Total tracked time
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top {reportType === "time" ? "Project" : reportType === "user" ? "User" : "Status"}</CardDescription>
            <CardTitle className="truncate text-xl">{topItem.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {topItem.hours.toFixed(1)} hours
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Daily Hours</CardDescription>
            <CardTitle className="text-3xl">
              {(totalHours / Math.max(differenceInDays(endOfMonth(new Date()), startOfMonth(new Date())), 1)).toFixed(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Hours per day
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Projects Tracked</CardDescription>
            <CardTitle className="text-3xl">
              {projectFilter === "all-projects" 
                ? getProjectHours().length 
                : projectFilter ? "1" : "0"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Total projects with time entries
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
            <CardDescription>Configure your report view</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Report Type</h4>
              <Tabs defaultValue={reportType} onValueChange={setReportType} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="time">By Project</TabsTrigger>
                  <TabsTrigger value="user">By User</TabsTrigger>
                  <TabsTrigger value="status">By Status</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Time Range</h4>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Project</h4>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-projects">All Projects</SelectItem>
                  {mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>
              {reportType === "time" 
                ? "Time by Project" 
                : reportType === "user" 
                  ? "Time by User" 
                  : "Time by Status"}
            </CardTitle>
            <CardDescription>
              {timeRange === "week" 
                ? "This week" 
                : timeRange === "month" 
                  ? "This month" 
                  : timeRange === "quarter" 
                    ? "This quarter" 
                    : "This year"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar" className="w-full">
              <TabsList className="w-full flex justify-end mb-4">
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="pie">Pie</TabsTrigger>
              </TabsList>
              <TabsContent value="bar" className="mt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#8884d8" name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="pie" className="mt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="hours"
                    >
                      {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} hours`, "Time"]} />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
