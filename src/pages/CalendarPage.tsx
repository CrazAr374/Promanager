
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProjects, mockTimeLogs } from "@/services/mockData";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DayProps } from "react-day-picker";

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState("month");
  const [projectFilter, setProjectFilter] = useState("all-projects");
  
  // Get events (time logs) for the selected date
  const getEventsForDate = (date: Date) => {
    return mockTimeLogs.filter((log) => {
      const logDate = parseISO(log.date);
      return isSameDay(logDate, date) && 
        (projectFilter === "all-projects" || log.projectId === projectFilter);
    });
  };

  // Add calendar day render function
  const renderDay = (props: DayProps) => {
    const day = props.date;
    // Guard against null dates
    if (!day) return <div className="relative w-full h-full"></div>;
    
    const events = getEventsForDate(day);
    
    return (
      <div className="relative w-full h-full">
        <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
        {events.length > 0 && (
          <div className="absolute bottom-1 right-1">
            <Badge variant="secondary" className="text-xs">
              {events.length}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  // Calendar navigation
  const navigateCalendar = (direction: 'prev' | 'next') => {
    const days = view === 'month' ? 30 : view === 'week' ? 7 : 1;
    const newDate = direction === 'prev' 
      ? addDays(date, -days)
      : addDays(date, days);
    setDate(newDate);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-4">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-projects">All Projects</SelectItem>
              {mockProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle>
            {format(date, view === 'day' ? 'MMMM d, yyyy' : view === 'week' ? "'Week of' MMMM d, yyyy" : 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateCalendar('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateCalendar('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-background rounded-md border">
            <Calendar
              mode="multiple"
              selected={[]}
              month={date}
              onMonthChange={setDate}
              className="rounded-md pointer-events-auto"
              components={{ Day: renderDay }}
            />
          </div>
          
          {/* Events for the selected date */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Events for {format(date, 'MMMM d, yyyy')}</h3>
            {getEventsForDate(date).length > 0 ? (
              <div className="space-y-2">
                {getEventsForDate(date).map((event) => {
                  const project = mockProjects.find(p => p.id === event.projectId);
                  return (
                    <Card key={event.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{event.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project?.title} • {event.hours} hours
                          </p>
                        </div>
                        <Badge>{event.status || "Completed"}</Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No events for this date</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
