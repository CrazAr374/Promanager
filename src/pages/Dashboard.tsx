
import { useEffect, useState } from "react";
import { getProjects, getTimeLogs } from "@/services/api";
import { Project, TimeLog } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { ProjectCard } from "@/components/ProjectCard";
import { TimeLogForm } from "@/components/TimeLogForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3Icon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
  Loader2Icon,
  PlusIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        const timeLogsData = await getTimeLogs();
        setProjects(projectsData);
        setTimeLogs(timeLogsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Summary stats calculations
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "in-progress"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const totalHoursLogged = timeLogs.reduce((sum, log) => sum + log.hours, 0);

  // Recent projects (last 3)
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 3);

  // Project status chart data
  const statusData = [
    {
      name: "Pending",
      value: projects.filter((p) => p.status === "pending").length,
      color: "#94A3B8",
    },
    {
      name: "In Progress",
      value: activeProjects,
      color: "#3B82F6",
    },
    {
      name: "Completed",
      value: completedProjects,
      color: "#22C55E",
    },
  ];

  // Time logs by project data for bar chart
  const timeLogsByProject = projects.map((project) => {
    const hours = timeLogs
      .filter((log) => log.projectId === project.id)
      .reduce((sum, log) => sum + log.hours, 0);
    return {
      name: project.title.length > 15 ? project.title.substring(0, 15) + "..." : project.title,
      hours,
    };
  });

  // Sort by hours and take top 5
  const topTimeLogProjects = [...timeLogsByProject]
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link to="/projects/new">
            <Button className="gap-1">
              <PlusIcon className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={totalProjects.toString()}
          icon={FolderIcon}
          description="All time"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects.toString()}
          icon={CalendarIcon}
          description="In progress"
        />
        <StatCard
          title="Completed"
          value={completedProjects.toString()}
          icon={CheckCircleIcon}
          description="Projects"
        />
        <StatCard
          title="Hours Logged"
          value={totalHoursLogged.toFixed(1)}
          icon={ClockIcon}
          description="Total hours"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3Icon className="h-5 w-5 mr-2" />
                Time Logged by Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {topTimeLogProjects.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topTimeLogProjects}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No time logs available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between hover:bg-muted/50 p-2 rounded">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-3 ${
                                project.priority === "high"
                                  ? "bg-project-high"
                                  : project.priority === "medium"
                                  ? "bg-project-medium"
                                  : "bg-project-low"
                              }`}
                            />
                            <span className="font-medium">{project.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(project.endDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No projects available
                    </div>
                  )}
                  {recentProjects.length > 0 && (
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <Link to="/projects">View all projects</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <TimeLogForm projects={projects} onSuccess={() => getTimeLogs().then(setTimeLogs)} />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {description}
            </div>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
