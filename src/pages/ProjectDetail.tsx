
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getProject, getTimeLogs, getUsers, deleteProject } from "@/services/api";
import { Project, TimeLog, User } from "@/types";
import { TimeLogForm } from "@/components/TimeLogForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  EditIcon,
  Loader2Icon,
  TrashIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [projectData, timeLogsData, usersData] = await Promise.all([
          getProject(id),
          getTimeLogs(id),
          getUsers()
        ]);
        
        setProject(projectData);
        setTimeLogs(timeLogsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error loading project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleting(true);
      await deleteProject(id);
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted",
      });
      navigate("/projects");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const refreshTimeLogs = async () => {
    if (!id) return;
    const timeLogsData = await getTimeLogs(id);
    setTimeLogs(timeLogsData);
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  const getPriorityClasses = (priority: string) => {
    const classes = {
      low: "bg-project-low text-green-800",
      medium: "bg-project-medium text-amber-800",
      high: "bg-project-high text-red-800",
    };
    return classes[priority as keyof typeof classes] || classes.medium;
  };

  const getStatusClasses = (status: string) => {
    const classes = {
      pending: "bg-gray-100 text-gray-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };
    return classes[status as keyof typeof classes] || classes.pending;
  };

  const getTaskStatusIcon = (status: string) => {
    if (status === "completed") return <CheckIcon className="h-4 w-4 text-green-600" />;
    if (status === "in-progress") return <ClockIcon className="h-4 w-4 text-blue-600" />;
    return <XIcon className="h-4 w-4 text-gray-600" />;
  };

  const getTotalHours = () => {
    return timeLogs.reduce((sum, log) => sum + log.hours, 0);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link to="/projects">
          <Button>Go back to projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/projects")}
            className="mr-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{project.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/projects/${id}/edit`}>
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this project? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground">
                  {deleting ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex gap-2">
                  <Badge className={getStatusClasses(project.status)}>
                    {project.status.replace("-", " ")}
                  </Badge>
                  <Badge className={getPriorityClasses(project.priority)}>
                    {project.priority} priority
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {project.team.map((memberId) => {
                    const memberName = getUserName(memberId);
                    return (
                      <div
                        key={memberId}
                        className="flex items-center px-3 py-1 bg-muted rounded-full"
                      >
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${memberName}`} />
                          <AvatarFallback className="text-xs">
                            {memberName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{memberName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {project.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-2">
                    {project.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-muted/40 rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            {getTaskStatusIcon(task.status)}
                          </div>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-muted-foreground">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {task.assignedTo && (
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getUserName(task.assignedTo)
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No tasks have been created for this project yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Time Logs</span>
                  <Badge variant="outline" className="ml-2">
                    {getTotalHours().toFixed(1)} hours total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeLogs.length > 0 ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {timeLogs
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((log) => (
                          <div key={log.id}>
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback className="text-xs">
                                    {getUserName(log.userId)
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">
                                    {getUserName(log.userId)}
                                  </div>
                                  {log.taskId && project.tasks && (
                                    <div className="text-xs text-muted-foreground">
                                      {
                                        project.tasks.find(
                                          (t) => t.id === log.taskId
                                        )?.title
                                      }
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-sm">
                                  {log.hours} hours
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {format(
                                    new Date(log.date),
                                    "MMM dd, yyyy"
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 mb-3">
                              {log.description}
                            </p>
                            <Separator className="my-3" />
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No time logs have been recorded for this project yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <TimeLogForm
            projects={[project]}
            projectId={project.id}
            onSuccess={refreshTimeLogs}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
