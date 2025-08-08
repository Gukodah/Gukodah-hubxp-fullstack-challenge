"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Search, Filter, Plus, Calendar, Clock, Star, Zap, Loader2, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { useAppSelector } from "@/store/store"
import { TaskCreationDialog } from "./dialogs/task-creation-dialog"
import { usePostV1TasksMutation } from "@/store/api/tasks.api"

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

// Generate mock tasks with more variety
const generateMockTasks = (count: number, startIndex: number = 0): Task[] => {
  const priorities: Task['priority'][] = ['low', 'medium', 'high']
  const statuses: Task['status'][] = ['todo', 'in-progress', 'completed']
  const categories = ['Development', 'Design', 'Security', 'Testing', 'Infrastructure', 'Research', 'Marketing', 'Analytics', 'DevOps', 'AI/ML']

  const taskTemplates = [
    'Implement Neural Network Architecture',
    'Optimize Quantum Database Performance',
    'Design Cyberpunk User Interface',
    'Conduct Security Vulnerability Assessment',
    'Develop AI-Powered Analytics Dashboard',
    'Create Holographic Data Visualization',
    'Build Blockchain Integration Layer',
    'Test Neural Processing Algorithms',
    'Deploy Cloud Infrastructure',
    'Research Machine Learning Models',
    'Enhance Biometric Authentication',
    'Optimize Real-time Data Streaming',
    'Implement Voice Recognition System',
    'Design Augmented Reality Interface',
    'Build Quantum Encryption Protocol',
    'Create Digital Twin Simulation',
    'Develop IoT Sensor Network',
    'Implement Edge Computing Solution',
    'Design Neural Network Topology',
    'Build Predictive Analytics Engine',
    'Configure Kubernetes Clusters',
    'Implement GraphQL API Gateway',
    'Design Microservices Architecture',
    'Build Real-time Chat System',
    'Create Data Pipeline Framework',
    'Implement OAuth2 Authentication',
    'Design Responsive Mobile Interface',
    'Build Automated Testing Suite',
    'Create Performance Monitoring Dashboard',
    'Implement Caching Strategy',
    'Design Database Schema',
    'Build CI/CD Pipeline',
    'Create API Documentation',
    'Implement Load Balancing',
    'Design Error Handling System',
    'Build Notification Service',
    'Create Backup and Recovery System',
    'Implement Search Functionality',
    'Design User Management System',
    'Build Payment Processing Integration',
    'Create Content Management System',
    'Implement File Upload Service',
    'Design Email Template System',
    'Build Analytics Tracking',
    'Create Multi-language Support',
    'Implement Rate Limiting',
    'Design Audit Logging System',
    'Build Image Processing Service',
    'Create Workflow Automation',
    'Implement Data Validation'
  ]

  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i
    const template = taskTemplates[index % taskTemplates.length]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]

    const baseDate = new Date()
    const daysOffset = Math.floor(Math.random() * 60) - 30
    const dueDate = new Date(baseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000)

    const createdDaysOffset = Math.floor(Math.random() * 30)
    const createdAt = new Date(baseDate.getTime() - createdDaysOffset * 24 * 60 * 60 * 1000)

    return {
      id: `task-${index}`,
      title: `${template} #${index + 1}`,
      description: `Advanced ${category.toLowerCase()} task involving cutting-edge technology and neural processing capabilities. This task requires deep technical expertise and quantum-level thinking to complete successfully.`,
      priority,
      status,
      dueDate: dueDate.toISOString().split('T')[0],
      category,
      createdAt: createdAt.toISOString()
    }
  })
}

const motivationalMessages = [
  "The future belongs to those who code it today.",
  "Every bug fixed is a step closer to digital perfection.",
  "In the matrix of possibilities, you are the architect.",
  "Debugging is like being a detective in a crime movie where you are also the murderer.",
  "Code is poetry written in logic and executed in reality.",
  "Neural networks learn, quantum computers calculate, but humans create.",
  "In the digital realm, persistence is the ultimate superpower.",
  "Every line of code is a step toward digital immortality."
]

// Loading skeleton component
const TaskSkeleton = () => (
  <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm animate-pulse">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="h-6 bg-slate-700 rounded w-3/4"></div>
        <div className="h-5 bg-slate-700 rounded w-16"></div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="h-4 bg-slate-700 rounded w-full"></div>
      <div className="h-4 bg-slate-700 rounded w-2/3"></div>
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-700 rounded w-20"></div>
        <div className="h-4 bg-slate-700 rounded w-16"></div>
      </div>
      <div className="h-4 bg-slate-700 rounded w-24"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-slate-700 rounded flex-1"></div>
        <div className="h-8 bg-slate-700 rounded flex-1"></div>
      </div>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [displayCount, setDisplayCount] = useState(20)
  const [isCollapsed, setIsCollapsed] = useState(false);

  //dialogs state
  const [isOpenTaskCreationDialog, setIsOpenTaskCreationDialog] = useState(false);

  const observerRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_LOAD = 20
  const MAX_TASKS = 2000 // Maximum tasks to generate

  const currentUser = useAppSelector(state => state.users);

  const todaysMessage = useMemo(() =>
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
    []
  )

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || task.status === filterStatus
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [allTasks, searchTerm, filterStatus, filterPriority])

  // Get currently displayed tasks
  const displayedTasks = useMemo(() => {
    return filteredTasks.slice(0, displayCount)
  }, [filteredTasks, displayCount])

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_LOAD)
  }, [searchTerm, filterStatus, filterPriority])

  // Load more tasks from the "API"
  const loadMoreTasks = useCallback(async () => {
    if (isLoading || allTasks.length >= MAX_TASKS) return

    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      const newTasks = generateMockTasks(ITEMS_PER_LOAD, allTasks.length)
      setAllTasks(prev => [...prev, ...newTasks])

      // Check if we've reached the maximum
      if (allTasks.length + ITEMS_PER_LOAD >= MAX_TASKS) {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, allTasks.length])

  // Load more displayed tasks
  const loadMoreDisplayed = useCallback(async () => {
    const newDisplayCount = displayCount + ITEMS_PER_LOAD

    // If we need more tasks and haven't reached the limit, load them
    if (newDisplayCount > filteredTasks.length && hasMore && allTasks.length < MAX_TASKS) {
      await loadMoreTasks()
    }

    // Always increase display count if there are more filtered tasks to show
    if (newDisplayCount <= filteredTasks.length || hasMore) {
      setDisplayCount(newDisplayCount)
    }
  }, [displayCount, filteredTasks.length, hasMore, allTasks.length, loadMoreTasks])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          const canShowMore = displayedTasks.length < filteredTasks.length
          const canLoadMore = hasMore && allTasks.length < MAX_TASKS

          if (canShowMore || canLoadMore) {
            loadMoreDisplayed()
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px' // Trigger 200px before the element comes into view
      }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreDisplayed, isLoading, displayedTasks.length, filteredTasks.length, hasMore, allTasks.length])

  // Load initial tasks (100+ tasks to start with)
  useEffect(() => {
    const initialTasks = generateMockTasks(120) // Start with 120 tasks
    setAllTasks(initialTasks)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/50"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
      case "in-progress": return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "todo": return "bg-purple-500/20 text-purple-400 border-purple-500/50"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const hasMoreToShow = displayedTasks.length < filteredTasks.length || (hasMore && allTasks.length < MAX_TASKS)

  const [createTask, { isLoading: isLoadingCreateTask }] = usePostV1TasksMutation();

  //handlers
  const handleCreateTask = (newTaskData: {
    title: string
    description: string
    priority: "low" | "medium" | "high"
    status: "todo" | "in-progress" | "completed"
    dueDate: string
    category: string
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...newTaskData,
      createdAt: new Date().toISOString()
    }

    // createTask(newTaskData);

    setAllTasks(prev => [newTask, ...prev])
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex">
      {/* Sidebar */}
      <Sidebar currentUser={currentUser} onCollapse={(isCollapsed) => setIsCollapsed(isCollapsed)} />

      {/* Main Content */}
      <div className={`flex-1 ${!isCollapsed ? "lg:ml-80" : ""}`}>
        {/* Animated background grid */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

        <div className="relative z-10 container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 pt-16 lg:pt-4">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TASKS APP
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <div className="text-sm text-cyan-400 font-mono">
              Showing {displayedTasks.length.toLocaleString()} of {filteredTasks.length.toLocaleString()} filtered • {allTasks.length.toLocaleString()} total loaded
            </div>
          </div>

          {/* Motivational Message */}
          <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-cyan-500/20 flex-shrink-0">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs md:text-sm font-medium text-cyan-400 mb-1">DAILY MOTIVATION PROTOCOL</h3>
                  <p className="text-sm md:text-lg font-medium text-white leading-tight">{todaysMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20">
                <Filter className="h-4 w-4 mr-2 text-cyan-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-cyan-500/30">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20">
                <Star className="h-4 w-4 mr-2 text-cyan-400" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-cyan-500/30">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Task Button */}
          <div className="flex justify-end">
            <Button onClick={() => { setIsOpenTaskCreationDialog(true) }} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Initialize New Task</span>
              <span className="sm:hidden">New Task</span>
            </Button>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayedTasks.map((task) => (
              <Card
                key={task.id}
                className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base md:text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 min-w-0">
                      {task.title}
                    </CardTitle>
                    <Badge className={`${getPriorityColor(task.priority)} border text-xs font-medium flex-shrink-0`}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(task.status)} border text-xs`}>
                      {task.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <div className="text-xs text-gray-400 font-mono truncate ml-2">
                      {task.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Update</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 text-xs">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <TaskSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-cyan-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Loading tasks...</span>
              </div>
            </div>
          )}

          {/* Intersection Observer Target */}
          {hasMoreToShow && (
            <div ref={observerRef} className="h-20 flex items-center justify-center">
              <div className="text-cyan-400/50 text-sm">
                {isLoading ? 'Loading...' : 'Scroll for more tasks'}
              </div>
            </div>
          )}

          {/* Manual Load More Button */}
          {hasMoreToShow && !isLoading && (
            <div className="text-center py-4">
              <Button
                onClick={loadMoreDisplayed}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
              >
                Load More Tasks ({filteredTasks.length - displayedTasks.length} remaining)
              </Button>
            </div>
          )}

          {/* End of Results */}
          {!hasMoreToShow && displayedTasks.length > 0 && (
            <div className="text-center py-8">
              <div className="text-cyan-400 text-sm font-medium">
                fully loaded • {displayedTasks.length.toLocaleString()} tasks rendered
              </div>
              <div className="text-gray-500 text-xs mt-2">
                {allTasks.length >= MAX_TASKS ? 'Maximum task limit reached' : 'All available tasks displayed'}
              </div>
            </div>
          )}

          {/* Empty State */}
          {displayedTasks.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-4xl md:text-6xl mb-4">🔍</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-400 mb-2">No Tasks Found</h3>
              <p className="text-sm md:text-base text-gray-500 mb-4">No tasks match your current search and filter criteria.</p>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                  setFilterPriority("all")
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TaskCreationDialog
        isSubmitting={isLoadingCreateTask}
        isOpen={isOpenTaskCreationDialog}
        onClose={() => setIsOpenTaskCreationDialog(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  )
}
