"use client"

import { useState, useEffect } from "react"
import { Brain, BarChart3, Settings, User, Bell, Search, Plus, Home, Calendar, Users, FileText, Zap, Shield, LogOut, ChevronLeft, ChevronRight, Activity, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
    className?: string
    onCollapse?: (isCollapsed: boolean) => void
    currentUser?: {
        "id": number | null,
        "email": string,
        "first_name": string,
        "last_name": string,
    }
}

const navigationItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: Home,
        badge: null,
        description: "Task overview"
    },
    {
        title: "Task Matrix",
        href: "/tasks",
        icon: Brain,
        badge: "120",
        description: "Manage quantum tasks"
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        badge: null,
        description: "Performance metrics"
    },
    {
        title: "Calendar",
        href: "/calendar",
        icon: Calendar,
        badge: "3",
        description: "Schedule matrix"
    },
    {
        title: "Team",
        href: "/team",
        icon: Users,
        badge: null,
        description: "Neural network"
    },
    {
        title: "Reports",
        href: "/reports",
        icon: FileText,
        badge: null,
        description: "Data intelligence"
    }
]

const quickActions = [
    {
        title: "New Task",
        icon: Plus,
        action: () => console.log("New task"),
        color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
    },
    {
        title: "Quick Search",
        icon: Search,
        action: () => console.log("Search"),
        color: "bg-blue-500/20 text-blue-400 border-blue-500/50"
    },
]

export function Sidebar({ className, onCollapse, currentUser }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const pathname = usePathname()

    // Check if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth < 1024) {
                setIsCollapsed(false) // Always expanded on mobile when open
            }
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobile && isMobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobile, isMobileOpen])

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/"
        }
        return pathname.startsWith(href)
    }

    const toggleSidebar = () => {
        if (isMobile) {
            setIsMobileOpen(!isMobileOpen)
        } else {
            onCollapse && onCollapse(!isCollapsed);
            setIsCollapsed(!isCollapsed);
        }
    }

    const closeMobileSidebar = () => {
        if (isMobile) {
            setIsMobileOpen(false)
        }
    }

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-[60] lg:hidden bg-slate-800/90 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 p-2"
                >
                    {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            )}

            {/* Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
        ${isMobile ? 'fixed' : 'fixed'} 
        ${isMobile
                    ? `left-0 top-0 h-full transition-transform duration-300 ease-in-out z-50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    } w-80`
                    : `left-0 top-0 h-full transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-20' : 'w-80'
                    }`
                }
        bg-slate-900/95 backdrop-blur-sm border-r border-cyan-500/30
        ${className}
      `}>
                {/* Animated background effects */}
                <div className="relative h-full flex flex-col">
                    {/* Header */}
                    <div className="p-4 lg:p-6 border-b border-cyan-500/20">
                        <div className="flex items-center justify-between">
                            {(!isCollapsed || isMobile) && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                                        <Brain className="h-5 w-5 lg:h-6 lg:w-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-base lg:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                            TASKS APP
                                        </h1>
                                        <p className="text-xs text-gray-400">Organization Name</p>
                                    </div>
                                </div>
                            )}

                            {!isMobile && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleSidebar}
                                    className="text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 p-2"
                                >
                                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="p-3 lg:p-4 border-b border-cyan-500/20">
                        <div className="flex items-center gap-3">
                            <Avatar className="border-2 border-cyan-500/30 h-8 w-8 lg:h-10 lg:w-10">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-sm">JD</AvatarFallback>
                            </Avatar>

                            {(!isCollapsed || isMobile) && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{currentUser?.first_name + " " + currentUser?.last_name}</p>
                                    <p className="text-xs text-gray-400 truncate">Neural Engineer</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-400">Online</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-2 lg:py-4">
                        <nav className="space-y-1 lg:space-y-2 px-3 lg:px-4">
                            {navigationItems.map((item) => {
                                const Icon = item.icon
                                const active = isActive(item.href)

                                return (
                                    <Link key={item.href} href={item.href} onClick={closeMobileSidebar}>
                                        <div className={`
                      group relative flex items-center gap-3 px-3 py-2.5 lg:py-3 rounded-lg transition-all duration-200
                      ${active
                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                                                : 'text-gray-300 hover:bg-slate-800/50 hover:text-cyan-400 border border-transparent hover:border-cyan-500/30'
                                            }
                    `}>
                                            {/* Active indicator */}
                                            {active && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 lg:h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                                            )}

                                            <Icon className={`h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 ${active ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'}`} />

                                            {(!isCollapsed || isMobile) && (
                                                <>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm lg:text-base font-medium truncate">{item.title}</p>
                                                        <p className="text-xs text-gray-500 truncate hidden lg:block">{item.description}</p>
                                                    </div>

                                                    {item.badge && (
                                                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                </>
                                            )}

                                            {/* Tooltip for collapsed state on desktop */}
                                            {!isMobile && isCollapsed && (
                                                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                                    <p className="text-sm font-medium text-white">{item.title}</p>
                                                    <p className="text-xs text-gray-400">{item.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Quick Actions */}
                        {(!isCollapsed || isMobile) && (
                            <div className="mt-6 lg:mt-8 px-3 lg:px-4">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    {quickActions.map((action, index) => {
                                        const Icon = action.icon
                                        return (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                onClick={action.action}
                                                className={`w-full justify-start gap-2 text-xs lg:text-sm ${action.color} hover:bg-opacity-30 transition-all duration-200`}
                                            >
                                                <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                                                {action.title}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 lg:p-4 border-t border-cyan-500/20">
                        <div className="space-y-2">
                            <Link href="/settings" onClick={closeMobileSidebar}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-full justify-start gap-2 text-gray-300 hover:bg-slate-800/50 hover:text-cyan-400 text-xs lg:text-sm ${(isCollapsed && !isMobile) ? 'px-2' : ''}`}
                                >
                                    <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
                                    {(!isCollapsed || isMobile) && "Settings"}
                                </Button>
                            </Link>

                            <Button
                                variant="ghost"
                                size="sm"
                                className={`w-full justify-start gap-2 text-gray-300 hover:bg-red-500/10 hover:text-red-400 text-xs lg:text-sm ${(isCollapsed && !isMobile) ? 'px-2' : ''}`}
                            >
                                <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
                                {(!isCollapsed || isMobile) && "Disconnect"}
                            </Button>
                        </div>

                        {(!isCollapsed || isMobile) && (
                            <div className="mt-3 lg:mt-4 text-center">
                                <p className="text-xs text-gray-500">Tasks App v2.0</p>
                                <p className="text-xs text-gray-600"> Provided by HubXP</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
