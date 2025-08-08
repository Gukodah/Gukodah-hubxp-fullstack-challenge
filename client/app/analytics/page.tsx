"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, Download, Filter, TrendingUp, TrendingDown, Activity, Clock, CheckCircle, AlertCircle, Users, Zap, Brain, BarChart3, PieChartIcon, LineChartIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Task {
    id: string
    title: string
    description: string
    priority: "low" | "medium" | "high"
    status: "todo" | "in-progress" | "completed"
    dueDate: string
    category: string
    createdAt: string
}

// Generate comprehensive mock data for analytics
const generateAnalyticsData = () => {
    const priorities: Task['priority'][] = ['low', 'medium', 'high']
    const statuses: Task['status'][] = ['todo', 'in-progress', 'completed']
    const categories = ['Development', 'Design', 'Security', 'Testing', 'Infrastructure', 'Research', 'Marketing', 'Analytics', 'DevOps', 'AI/ML']

    const tasks: Task[] = []
    const now = new Date()

    // Generate 500 tasks with realistic distribution over the last 6 months
    for (let i = 0; i < 500; i++) {
        const createdDaysAgo = Math.floor(Math.random() * 180) // Last 6 months
        const createdAt = new Date(now.getTime() - createdDaysAgo * 24 * 60 * 60 * 1000)

        const dueDaysFromCreated = Math.floor(Math.random() * 30) + 1 // 1-30 days after creation
        const dueDate = new Date(createdAt.getTime() + dueDaysFromCreated * 24 * 60 * 60 * 1000)

        // Realistic status distribution based on age
        let status: Task['status']
        if (createdDaysAgo > 60) {
            status = Math.random() > 0.2 ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)]
        } else if (createdDaysAgo > 30) {
            status = Math.random() > 0.4 ? (Math.random() > 0.5 ? 'completed' : 'in-progress') : 'todo'
        } else {
            status = statuses[Math.floor(Math.random() * statuses.length)]
        }

        tasks.push({
            id: `task-${i}`,
            title: `Task ${i + 1}`,
            description: `Description for task ${i + 1}`,
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            status,
            dueDate: dueDate.toISOString().split('T')[0],
            category: categories[Math.floor(Math.random() * categories.length)],
            createdAt: createdAt.toISOString()
        })
    }

    return tasks
}

export default function CyberpunkAnalytics() {
    const [timeRange, setTimeRange] = useState("6months")
    const [reportType, setReportType] = useState("overview")

    const tasks = useMemo(() => generateAnalyticsData(), [])

    // Filter tasks based on time range
    const filteredTasks = useMemo(() => {
        const now = new Date()
        let cutoffDate: Date

        switch (timeRange) {
            case "1month":
                cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                break
            case "3months":
                cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                break
            case "6months":
                cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
                break
            case "1year":
                cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
                break
            default:
                return tasks
        }

        return tasks.filter(task => new Date(task.createdAt) >= cutoffDate)
    }, [tasks, timeRange])

    // Calculate statistics
    const stats = useMemo(() => {
        const total = filteredTasks.length
        const completed = filteredTasks.filter(t => t.status === 'completed').length
        const inProgress = filteredTasks.filter(t => t.status === 'in-progress').length
        const todo = filteredTasks.filter(t => t.status === 'todo').length
        const highPriority = filteredTasks.filter(t => t.priority === 'high').length
        const overdue = filteredTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length

        const completionRate = total > 0 ? (completed / total) * 100 : 0
        const productivityScore = Math.min(100, completionRate + (inProgress * 0.5 / total) * 100)

        return {
            total,
            completed,
            inProgress,
            todo,
            highPriority,
            overdue,
            completionRate,
            productivityScore
        }
    }, [filteredTasks])

    // Prepare chart data
    const statusData = [
        { name: 'Completed', value: stats.completed, color: '#10b981' },
        { name: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
        { name: 'To Do', value: stats.todo, color: '#8b5cf6' }
    ]

    const priorityData = [
        { name: 'High', value: filteredTasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
        { name: 'Medium', value: filteredTasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
        { name: 'Low', value: filteredTasks.filter(t => t.priority === 'low').length, color: '#10b981' }
    ]

    const categoryData = useMemo(() => {
        const categories = ['Development', 'Design', 'Security', 'Testing', 'Infrastructure', 'Research', 'Marketing', 'Analytics', 'DevOps', 'AI/ML']
        return categories.map(category => ({
            name: category,
            tasks: filteredTasks.filter(t => t.category === category).length,
            completed: filteredTasks.filter(t => t.category === category && t.status === 'completed').length
        })).sort((a, b) => b.tasks - a.tasks) // Sort by task count descending
    }, [filteredTasks])

    // Monthly trend data
    const monthlyData = useMemo(() => {
        const months = []
        const now = new Date()

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthName = date.toLocaleDateString('en-US', { month: 'short' })
            const year = date.getFullYear()

            const monthTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.createdAt)
                return taskDate.getMonth() === date.getMonth() && taskDate.getFullYear() === date.getFullYear()
            })

            months.push({
                month: `${monthName} ${year}`,
                created: monthTasks.length,
                completed: monthTasks.filter(t => t.status === 'completed').length,
                productivity: monthTasks.length > 0 ? (monthTasks.filter(t => t.status === 'completed').length / monthTasks.length) * 100 : 0
            })
        }

        return months
    }, [filteredTasks])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800/95 border border-cyan-500/30 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-cyan-400 font-medium">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-white text-sm">
                            <span style={{ color: entry.color }}>{entry.dataKey}: </span>
                            {entry.value}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    const exportReport = () => {
        const reportData = {
            timeRange,
            reportType,
            generatedAt: new Date().toISOString(),
            statistics: stats,
            tasks: filteredTasks.length
        }

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `neural-task-report-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Animated background grid */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

            {/* Floating particles effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                            <Brain className="h-6 w-6 text-cyan-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            TASKS APP
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base">Advanced task intelligence and quantum performance metrics</p>
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20">
                            <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-cyan-500/30">
                            <SelectItem value="1month">Last Month</SelectItem>
                            <SelectItem value="3months">Last 3 Months</SelectItem>
                            <SelectItem value="6months">Last 6 Months</SelectItem>
                            <SelectItem value="1year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20">
                            <BarChart3 className="h-4 w-4 mr-2 text-cyan-400" />
                            <SelectValue placeholder="Report Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-cyan-500/30">
                            <SelectItem value="overview">Overview Report</SelectItem>
                            <SelectItem value="productivity">Productivity Analysis</SelectItem>
                            <SelectItem value="categories">Category Breakdown</SelectItem>
                            <SelectItem value="trends">Trend Analysis</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={exportReport}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                                    <p className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {stats.total.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                                    <Activity className="h-6 w-6 text-cyan-400" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-sm text-green-400">+12% from last period</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400">Completed</p>
                                    <p className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        {stats.completed.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-sm text-emerald-400">{stats.completionRate.toFixed(1)}% completion rate</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400">High Priority</p>
                                    <p className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                                        {stats.highPriority.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                                    <AlertCircle className="h-6 w-6 text-red-400" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-sm text-red-400">{((stats.highPriority / stats.total) * 100).toFixed(1)}% of total</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400">Productivity Score</p>
                                    <p className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {stats.productivityScore.toFixed(0)}%
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                                    <Zap className="h-6 w-6 text-cyan-400" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-sm text-green-400">Excellent performance</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid - Dynamic based on report type */}
                {reportType === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Task Status Distribution */}
                        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <PieChartIcon className="h-5 w-5 text-cyan-400" />
                                    Task Status Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend
                                                wrapperStyle={{ color: '#ffffff' }}
                                                iconType="circle"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Priority Distribution */}
                        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                                    Priority Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={priorityData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {priorityData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {reportType === "productivity" && (
                    <div className="space-y-6">
                        {/* Monthly Trends */}
                        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <LineChartIcon className="h-5 w-5 text-cyan-400" />
                                    Productivity Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="month" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                type="monotone"
                                                dataKey="productivity"
                                                stroke="#06b6d4"
                                                strokeWidth={3}
                                                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                                                name="Productivity %"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Completion Rate by Priority */}
                        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                                    Completion Rate by Priority
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={priorityData.map(p => ({
                                            ...p,
                                            completionRate: filteredTasks.filter(t => t.priority === p.name.toLowerCase()).length > 0
                                                ? (filteredTasks.filter(t => t.priority === p.name.toLowerCase() && t.status === 'completed').length /
                                                    filteredTasks.filter(t => t.priority === p.name.toLowerCase()).length) * 100
                                                : 0
                                        }))}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="completionRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Completion Rate %" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {reportType === "categories" && (
                    <div className="space-y-6">
                        {/* Category Performance */}
                        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Users className="h-5 w-5 text-cyan-400" />
                                    Category Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryData} layout="horizontal">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis type="number" stroke="#94a3b8" />
                                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="tasks" fill="#06b6d4" name="Total Tasks" radius={[0, 4, 4, 0]} />
                                            <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Completion Rates */}
                        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <PieChartIcon className="h-5 w-5 text-cyan-400" />
                                    Category Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData.filter(c => c.tasks > 0).map((cat, index) => ({
                                                    name: cat.name,
                                                    value: cat.tasks,
                                                    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={`hsl(${(index * 137.5) % 360}, 70%, 50%)`} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {reportType === "trends" && (
                    <div className="space-y-6">
                        {/* Monthly Trends */}
                        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <LineChartIcon className="h-5 w-5 text-cyan-400" />
                                    Monthly Task Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                            <defs>
                                                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="month" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="created"
                                                stackId="1"
                                                stroke="#06b6d4"
                                                fillOpacity={1}
                                                fill="url(#colorCreated)"
                                                name="Created"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="completed"
                                                stackId="2"
                                                stroke="#10b981"
                                                fillOpacity={1}
                                                fill="url(#colorCompleted)"
                                                name="Completed"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weekly Velocity */}
                        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                                    Task Velocity Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="month" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                type="monotone"
                                                dataKey="created"
                                                stroke="#06b6d4"
                                                strokeWidth={2}
                                                name="Tasks Created"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="completed"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                name="Tasks Completed"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Report Summary */}
                <Card className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 border-cyan-500/30 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="text-center space-y-4">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Neural Analysis Complete
                            </h3>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Your quantum task matrix has been analyzed. The neural network has processed {stats.total} tasks
                                with a {stats.completionRate.toFixed(1)}% completion rate and {stats.productivityScore.toFixed(0)}% productivity score.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mt-6">
                                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-4 py-2">
                                    <Activity className="h-4 w-4 mr-2" />
                                    {stats.total} Total Tasks
                                </Badge>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 px-4 py-2">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {stats.completed} Completed
                                </Badge>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 px-4 py-2">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {stats.inProgress} In Progress
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
