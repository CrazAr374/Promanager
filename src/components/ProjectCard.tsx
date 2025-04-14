
import { Project } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  ArrowRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const priorityClasses = {
    low: "bg-project-low text-green-800 hover:bg-green-200",
    medium: "bg-project-medium text-amber-800 hover:bg-amber-200",
    high: "bg-project-high text-red-800 hover:bg-red-200",
  };

  const statusClasses = {
    "pending": "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "completed": "bg-green-100 text-green-800"
  };

  const getCompletedTaskCount = () => {
    if (!project.tasks) return 0;
    return project.tasks.filter(task => task.status === 'completed').length;
  };

  const getTaskCompletionPercentage = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    return Math.round((getCompletedTaskCount() / project.tasks.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={statusClasses[project.status]}>
              {project.status.replace('-', ' ')}
            </Badge>
            <CardTitle className="mt-2 text-lg">{project.title}</CardTitle>
          </div>
          <Badge className={priorityClasses[project.priority]}>
            {project.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {project.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{formatDate(project.startDate)}</span>
            <span className="mx-2">→</span>
            <span>{formatDate(project.endDate)}</span>
          </div>
          
          {project.tasks && (
            <div className="flex items-center text-sm text-muted-foreground">
              <ClockIcon className="h-4 w-4 mr-2" />
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span>Progress</span>
                  <span>{getCompletedTaskCount()}/{project.tasks.length} tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${getTaskCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex -space-x-2">
          {project.team.map((memberId, index) => (
            index < 3 && (
              <Avatar key={memberId} className="h-8 w-8 border-2 border-white">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {memberId.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )
          ))}
          {project.team.length > 3 && (
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                +{project.team.length - 3}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to={`/projects/${project.id}`}>
            View
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
