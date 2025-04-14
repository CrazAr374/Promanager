
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Mail, Phone, UserRound } from "lucide-react";

// Mock team members data
const teamMembers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Project Manager",
    department: "Management",
    phone: "+1 (555) 123-4567",
    avatar: "AJ",
    status: "active"
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "Senior Developer",
    department: "Engineering",
    phone: "+1 (555) 234-5678",
    avatar: "BS",
    status: "active"
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol.williams@example.com",
    role: "UI/UX Designer",
    department: "Design",
    phone: "+1 (555) 345-6789",
    avatar: "CW",
    status: "active"
  },
  {
    id: "4",
    name: "Dave Brown",
    email: "dave.brown@example.com",
    role: "Frontend Developer",
    department: "Engineering",
    phone: "+1 (555) 456-7890",
    avatar: "DB",
    status: "away"
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva.martinez@example.com",
    role: "Backend Developer",
    department: "Engineering",
    phone: "+1 (555) 567-8901",
    avatar: "EM",
    status: "inactive"
  }
];

// Department types
const departments = ["All Departments", "Management", "Engineering", "Design", "Marketing", "Sales"];

const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [viewType, setViewType] = useState("grid");

  // Filter team members based on search and department
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "All Departments" || 
      member.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search team members..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="All Departments" onValueChange={setDepartmentFilter} className="w-auto">
            <TabsList className="h-9">
              {departments.map(dept => (
                <TabsTrigger key={dept} value={dept} className="text-xs px-3">{dept}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <Tabs defaultValue="grid" onValueChange={setViewType} className="w-auto">
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-3">Grid</TabsTrigger>
              <TabsTrigger value="list" className="px-3">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewType === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => (
            <Card key={member.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} alt={member.name} />
                    <AvatarFallback>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="truncate">{member.role}</CardDescription>
                  </div>
                  <Badge variant={member.status === 'active' ? 'default' : member.status === 'away' ? 'outline' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <span>{member.department}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View Profile</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} alt={member.name} />
                      <AvatarFallback>{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role} • {member.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.status === 'active' ? 'default' : member.status === 'away' ? 'outline' : 'secondary'}>
                      {member.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamPage;
