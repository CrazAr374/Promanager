
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { createTimeLog } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClockIcon, Loader2Icon } from "lucide-react";
import { Project, Task } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeLogFormProps {
  projects: Project[];
  projectId?: string;
  onSuccess?: () => void;
}

export function TimeLogForm({ projects, projectId, onSuccess }: TimeLogFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to log time",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedProjectId) {
      toast({
        title: "Project required",
        description: "Please select a project",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      await createTimeLog({
        projectId: selectedProjectId,
        userId: user.id,
        taskId: selectedTaskId || undefined,
        hours: parseFloat(hours),
        description,
        date: new Date().toISOString().split('T')[0],
      });
      
      setHours("");
      setDescription("");
      setSelectedTaskId("");
      if (!projectId) setSelectedProjectId("");
      
      toast({
        title: "Time logged successfully",
        description: `Added ${hours} hours to the project`,
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error logging time",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <ClockIcon className="h-5 w-5 mr-2" />
          Log Your Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!projectId && (
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedProjectId && selectedProject?.tasks && selectedProject.tasks.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="task">Task (optional)</Label>
              <Select
                value={selectedTaskId}
                onValueChange={setSelectedTaskId}
              >
                <SelectTrigger id="task">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-task">No specific task</SelectItem>
                  {selectedProject.tasks.map((task: Task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              min="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Enter hours worked"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you work on?"
              rows={3}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Log Time"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
