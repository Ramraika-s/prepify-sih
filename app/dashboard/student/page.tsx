"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlayCircle, Target, TrendingUp, Clock, CalendarDays, BrainCircuit } from "lucide-react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock Data
const myPerformanceData = [
  { test: "Mock 1", score: 45, percentile: 62 },
  { test: "Mock 2", score: 58, percentile: 71 },
  { test: "Mock 3", score: 62, percentile: 75 },
  { test: "Mock 4", score: 60, percentile: 73 },
  { test: "Mock 5", score: 72, percentile: 82 },
  { test: "Mock 6", score: 78, percentile: 88 },
  { test: "Mock 7", score: 85, percentile: 94 },
];

const upcomingTests = [
  { id: "T-001", name: "JEE Full Syllabus Mock 8", duration: "180 mins", date: "Tomorrow, 10:00 AM", subjects: "Phy, Chem, Math" },
  { id: "T-002", name: "Organic Chemistry Revision Test", duration: "60 mins", date: "Friday, 4:00 PM", subjects: "Chem" },
];

export default function StudentDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Student CBT Dashboard</h1>
        <p className="text-zinc-400 mt-2">Welcome back. Continue your learning and track your test progress.</p>
      </div>

      {/* Action Center - Continue Learning */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2 bg-gradient-to-br from-zinc-900 to-black border-white/10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Ready for your next challenge?</CardTitle>
            <CardDescription className="text-zinc-400">You have a mock test scheduled for tomorrow.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 backdrop-blur-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg text-white">JEE Full Syllabus Mock 8</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-md border border-emerald-500/30">Upcoming</span>
              </div>
              <div className="flex gap-4 text-sm text-zinc-400">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> 180 mins</span>
                <span className="flex items-center"><CalendarDays className="w-4 h-4 mr-1" /> Tomorrow, 10:00 AM</span>
              </div>
            </div>
            <Button className="w-full bg-white text-black hover:bg-zinc-200">
              <PlayCircle className="mr-2 h-4 w-4" /> Start Practice Now
            </Button>
          </CardContent>
        </Card>

        {/* Mini Stats */}
        <div className="col-span-2 grid gap-4 grid-cols-2">
          <Card className="bg-[#0a0a0a] border-white/10 text-white hover:border-white/20 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Current Percentile</CardTitle>
              <Target className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">94<span className="text-lg text-zinc-500">.2</span></div>
              <p className="text-xs text-emerald-400 mt-1">Top 5% in your batch</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/10 text-white hover:border-white/20 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Tests Attempted</CardTitle>
              <TrendingUp className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">12</div>
              <p className="text-xs text-zinc-500 mt-1">This month</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/10 text-white hover:border-white/20 transition-colors col-span-2 flex items-center justify-between">
            <div className="p-6">
              <CardTitle className="text-sm font-medium text-zinc-400 mb-1">Average Accuracy</CardTitle>
              <div className="text-2xl font-bold text-white">82%</div>
            </div>
            <div className="p-6 pt-6">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                View Analysis
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Analytics & Materials Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Personal Analytics Chart */}
        <Card className="col-span-4 bg-[#0a0a0a] border-white/10 text-white">
          <CardHeader>
            <CardTitle>Score Progression</CardTitle>
            <CardDescription className="text-zinc-400">Your mock test scores over the last 7 attempts.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={myPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="test" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={2} dot={{ r: 4, fill: '#0a0a0a', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#ffffff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Study Materials & Upcoming */}
        <Card className="col-span-3 bg-[#0a0a0a] border-white/10 text-white">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription className="text-zinc-400">Tests and materials assigned to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Test Name</TableHead>
                    <TableHead className="text-zinc-400 text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingTests.map((test) => (
                    <TableRow key={test.id} className="border-white/5 hover:bg-white/5 cursor-pointer">
                      <TableCell className="font-medium py-4">
                        <div className="text-sm text-white">{test.name}</div>
                        <div className="text-xs text-zinc-500 mt-1">{test.subjects}</div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="text-sm text-zinc-300">{test.date}</div>
                        <div className="text-xs text-zinc-500 mt-1">{test.duration}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-zinc-300 mb-4">Recommended Review</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200">Rotational Mechanics Notes</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Based on mistakes in Mock 7</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white shrink-0">View</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}
