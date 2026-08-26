"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock Data
const performanceData = [
  { month: "Jan", avgScore: 65 },
  { month: "Feb", avgScore: 68 },
  { month: "Mar", avgScore: 72 },
  { month: "Apr", avgScore: 75 },
  { month: "May", avgScore: 71 },
  { month: "Jun", avgScore: 78 },
  { month: "Jul", avgScore: 82 },
];

const mockBatches = [
  { id: "B-2024-A", name: "JEE Advanced Target 2024", students: 120, faculty: "Dr. Sharma", status: "Active" },
  { id: "B-2024-B", name: "NEET Elite Foundation", students: 85, faculty: "Prof. Verma", status: "Active" },
  { id: "B-2025-A", name: "JEE Mains Achievers", students: 150, faculty: "Mr. Gupta", status: "Upcoming" },
  { id: "B-2023-Z", name: "Crash Course 2023", students: 60, faculty: "Mrs. Singh", status: "Completed" },
];

export default function InstituteDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Institute Overview</h1>
        <p className="text-zinc-400 mt-2">Manage your batches, track overall performance, and oversee faculty.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#0a0a0a] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Students</CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-zinc-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Batches</CardTitle>
            <BookOpen className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-zinc-500 mt-1">4 upcoming this week</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Faculty Members</CardTitle>
            <GraduationCap className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-zinc-500 mt-1">2 on leave today</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Avg. Test Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-emerald-500 mt-1">↑ 4% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Tables Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Performance Chart */}
        <Card className="col-span-4 bg-[#0a0a0a] border-white/10 text-white">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription className="text-zinc-400">Average student mock test scores over the last 7 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="avgScore" stroke="#ffffff" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Batches Table */}
        <Card className="col-span-3 bg-[#0a0a0a] border-white/10 text-white">
          <CardHeader>
            <CardTitle>Recent Batches</CardTitle>
            <CardDescription className="text-zinc-400">Status overview of top assigned batches.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Batch Name</TableHead>
                    <TableHead className="text-zinc-400 text-right">Students</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBatches.map((batch) => (
                    <TableRow key={batch.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium">
                        <div>{batch.name}</div>
                        <div className="text-xs text-zinc-500">{batch.faculty}</div>
                      </TableCell>
                      <TableCell className="text-right">{batch.students}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          batch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20' : 
                          batch.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20' : 
                          'bg-zinc-500/10 text-zinc-400 ring-1 ring-inset ring-zinc-500/20'
                        }`}>
                          {batch.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}
