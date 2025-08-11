import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  Settings,
  MessageSquare,
  Bell,
  Trophy,
  X,
  LayoutDashboard,
  Receipt,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Football Matches",
    href: "/football-matches/",
    icon: Trophy,
  },
  {
    name: "Analytics",
    href: "/analytics/",
    icon: BarChart3,
  },
  {
    name: "Projects",
    href: "/projects/",
    icon: Receipt,
  },
  {
    name: "Schedule",
    href: "/schedule/",
    icon: CalendarDays,
  },
  {
    name: "Calendar",
    href: "/calendar/",
    icon: Calendar,
  },
  {
    name: "Messages",
    href: "/messages/",
    icon: MessageSquare,
    badge: 49,
  },
  {
    name: "Notification",
    href: "/notifications/",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/settings/",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-sidebar-bg border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-sm">Li</span>
            </div>
            <span className="font-semibold text-xs text-foreground">
              Live Management
            </span>
          </div>

          {/* Close button for mobile */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} onClick={onClose}>
                <div
                  className={cn(
                    "group flex items-center w-full px-3 py-4 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out relative",
                    isActive
                      ? "text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">Tr</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">
                Triệu Mập
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Free Account
              </p>
            </div>
            <button className="p-1 hover:bg-muted rounded-md transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
