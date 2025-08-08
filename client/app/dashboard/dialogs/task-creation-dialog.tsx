"use client"

import { useState } from "react"
import { X, Plus, Calendar, Flag, Tag, FileText, Zap, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface TaskCreationModalProps {
    isOpen: boolean
    onClose: () => void
    onCreateTask: (task: {
        title: string
        description: string
        priority: "low" | "medium" | "high"
        status: "todo" | "in-progress" | "completed"
        dueDate: string
        category: string
    }) => void
    isSubmitting: boolean
}

interface FormData {
    title: string
    description: string
    priority: "low" | "medium" | "high"
    status: "todo" | "in-progress" | "completed"
    dueDate: string
    category: string
}

interface FormErrors {
    title?: string
    description?: string
    dueDate?: string
    category?: string
}

const categories = [
    'Development', 'Design', 'Security', 'Testing', 'Infrastructure',
    'Research', 'Marketing', 'Analytics', 'DevOps', 'AI/ML'
]

export function TaskCreationDialog({ isOpen, onClose, onCreateTask, isSubmitting }: TaskCreationModalProps) {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        dueDate: "",
        category: ""
    })

    const [errors, setErrors] = useState<FormErrors>({})

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = "Task title is required"
        } else if (formData.title.length < 3) {
            newErrors.title = "Title must be at least 3 characters"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Task description is required"
        } else if (formData.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters"
        }

        if (!formData.dueDate) {
            newErrors.dueDate = "Due date is required"
        } else {
            const selectedDate = new Date(formData.dueDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (selectedDate < today) {
                newErrors.dueDate = "Due date cannot be in the past"
            }
        }

        if (!formData.category) {
            newErrors.category = "Category is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return;

        try {
            onCreateTask(formData)

            // Reset form
            setFormData({
                title: "",
                description: "",
                priority: "medium",
                status: "todo",
                dueDate: "",
                category: ""
            })
            setErrors({})
            onClose()
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

    const handleInputChange = (field: keyof FormData, value: string) => {

        console.log(value)

        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-red-500/20 text-red-400 border-red-500/50"
            case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
            case "low": return "bg-green-500/20 text-green-400 border-green-500/50"
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto">
                {/* Animated background effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-blue-900/20 to-slate-900/50 rounded-lg" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] rounded-lg" />

                <div className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                                <Brain className="h-6 w-6 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Initialize Task
                                </h2>
                                <p className="text-sm text-gray-400">Create a new task</p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 p-2"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Task Title
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter task designation..."
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className={`bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 ${errors.title ? 'border-red-500/50 focus:border-red-400' : ''
                                    }`}
                            />
                            {errors.title && (
                                <p className="text-xs text-red-400">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Task Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the parameters and processing requirements..."
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                className={`bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 resize-none ${errors.description ? 'border-red-500/50 focus:border-red-400' : ''
                                    }`}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-400">{errors.description}</p>
                            )}
                        </div>

                        {/* Priority and Status Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Priority */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                    <Flag className="h-4 w-4" />
                                    Priority Level
                                </Label>
                                <Select value={formData.priority} onValueChange={(value: "low" | "medium" | "high") => handleInputChange('priority', value)}>
                                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-cyan-500/30">
                                        <SelectItem value="low">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                Low Priority
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                                Medium Priority
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="high">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                High Priority
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Badge className={`${getPriorityColor(formData.priority)} border text-xs w-fit`}>
                                    {formData.priority.toUpperCase()} PRIORITY
                                </Badge>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    Initial Status
                                </Label>
                                <Select value={formData.status} onValueChange={(value: "todo" | "in-progress" | "completed") => handleInputChange('status', value)}>
                                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-cyan-500/30">
                                        <SelectItem value="todo">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                                To Do
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="in-progress">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                In Progress
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                Completed
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Due Date and Category Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Due Date */}
                            <div className="space-y-2">
                                <Label htmlFor="dueDate" className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Deadline
                                </Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 ${errors.dueDate ? 'border-red-500/50 focus:border-red-400' : ''
                                        }`}
                                />
                                {errors.dueDate && (
                                    <p className="text-xs text-red-400">{errors.dueDate}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Task Category
                                </Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                    <SelectTrigger className={`bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 ${errors.category ? 'border-red-500/50' : ''
                                        }`}>
                                        <SelectValue placeholder="Select neural category..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-cyan-500/30">
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-xs text-red-400">{errors.category}</p>
                                )}
                            </div>
                        </div>

                        {/* Task Preview */}
                        {formData.title && (
                            <div className="p-4 bg-slate-800/30 border border-cyan-500/20 rounded-lg">
                                <h4 className="text-sm font-medium text-cyan-400 mb-2">Task Preview</h4>
                                <div className="space-y-2">
                                    <p className="text-white font-medium">{formData.title}</p>
                                    {formData.description && (
                                        <p className="text-gray-300 text-sm">{formData.description.substring(0, 100)}...</p>
                                    )}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge className={`${getPriorityColor(formData.priority)} border text-xs`}>
                                            {formData.priority.toUpperCase()}
                                        </Badge>
                                        {formData.category && (
                                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                                                {formData.category}
                                            </Badge>
                                        )}
                                        {formData.dueDate && (
                                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
                                                Due: {formData.dueDate.split("-")[2] + "/" + formData.dueDate.split("-")[1] + "/" + formData.dueDate.split("-")[0]}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 border-t border-cyan-500/20">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Initializing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Task
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
