"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileUp, Users, FolderOpen, Target, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// Mock Data
const mockStudents = [
  { id: "STU-001", name: "Rahul Sharma", grade: "12th", avgScore: 84, lastActive: "2 hrs ago" },
  { id: "STU-002", name: "Priya Patel", grade: "12th", avgScore: 91, lastActive: "1 day ago" },
  { id: "STU-003", name: "Amit Kumar", grade: "11th", avgScore: 76, lastActive: "3 days ago" },
  { id: "STU-004", name: "Neha Singh", grade: "11th", avgScore: 88, lastActive: "5 hrs ago" },
];

export default function MentorDashboard() {
  const [hasStudents, setHasStudents] = useState(true);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Mentor Workspace</h1>
          <p className="text-zinc-400 mt-2">Manage your students, review performance, and upload study materials.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white bg-transparent hover:bg-white/5" onClick={() => setHasStudents(!hasStudents)}>
            Toggle Empty State
          </Button>
          <Button className="bg-white text-black hover:bg-zinc-200">
            <FileUp className="mr-2 h-4 w-4" /> Upload Resource
          </Button>
        </div>
      </div>

      {!hasStudents ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl bg-[#0a0a0a]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-4">
            <Users className="h-10 w-10 text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No students assigned yet</h2>
          <p className="text-zinc-400 text-center max-w-sm mb-6">
            You currently have no students in your roster. Once students are assigned to you, their performance and details will appear here.
          </p>
          <Button className="bg-white text-black hover:bg-zinc-200">
            Assign First Student
          </Button>
        </div>
      ) : (
        <>
          {/* Action Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-[#0a0a0a] border-white/10 text-white hover:border-white/20 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Total Students</CardTitle>
                <Users className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-zinc-500 mt-1">Across 3 active batches</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a0a0a] border-white/10 text-white hover:border-white/20 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Needs Attention</CardTitle>
                <Target className="h-4 w-4 text-rose-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-400">3</div>
                <p className="text-xs text-zinc-500 mt-1">Students scoring below 60%</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a0a0a] border-white/10 text-white hover:border-white/20 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Assignments Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-zinc-500 mt-1">Average completion rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Student Roster */}
            <Card className="col-span-2 bg-[#0a0a0a] border-white/10 text-white flex flex-col">
              <CardHeader>
                <CardTitle>Student Roster</CardTitle>
                <CardDescription className="text-zinc-400">Recent performance of your assigned students.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-zinc-400">Name</TableHead>
                        <TableHead className="text-zinc-400">Grade</TableHead>
                        <TableHead className="text-zinc-400">Avg. Score</TableHead>
                        <TableHead className="text-zinc-400 text-right">Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockStudents.map((student) => (
                        <TableRow key={student.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              student.avgScore >= 90 ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20' : 
                              student.avgScore >= 75 ? 'bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20' : 
                              'bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20'
                            }`}>
                              {student.avgScore}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-zinc-400">{student.lastActive}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Resources Section */}
            <Card className="bg-[#0a0a0a] border-white/10 text-white flex flex-col">
              <CardHeader>
                <CardTitle>Recent Materials</CardTitle>
                <CardDescription className="text-zinc-400">Recently uploaded study resources.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                {[
                  { title: "Kinematics Formula Sheet", type: "PDF", size: "2.4 MB" },
                  { title: "Organic Chemistry Revision", type: "Video", size: "128 MB" },
                  { title: "Mock Test 4 Solutions", type: "Document", size: "1.1 MB" }
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-white/5 rounded-md shrink-0">
                        <FolderOpen className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{file.title}</p>
                        <p className="text-xs text-zinc-500">{file.type} • {file.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-auto pt-4">
                  <Button variant="outline" className="w-full border-white/10 text-white bg-transparent hover:bg-white/5">
                    View All Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
