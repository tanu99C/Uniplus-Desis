
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  ShoppingBag, 
  Search, 
  Home, 
  X, 
  Settings, 
  ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // Simulating user role - in a real application, get this from auth context
  const userRole = "admin"; // Options: "student", "staff", "admin"

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b md:hidden">
        <span className="text-xl font-bold text-uniplus-600">UniPlus</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-6">
        <nav className="space-y-6">
          <div>
            <h3 className="px-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
              Main
            </h3>
            <div className="mt-2 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                    isActive
                      ? "bg-uniplus-50 text-uniplus-600"
                      : "text-gray-700 hover:bg-uniplus-50 hover:text-uniplus-600"
                  )
                }
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink
                to="/announcements"
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                    isActive
                      ? "bg-uniplus-50 text-uniplus-600"
                      : "text-gray-700 hover:bg-uniplus-50 hover:text-uniplus-600"
                  )
                }
              >
                <Bell className="mr-3 h-5 w-5" />
                Announcements
              </NavLink>
              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                    isActive
                      ? "bg-uniplus-50 text-uniplus-600"
                      : "text-gray-700 hover:bg-uniplus-50 hover:text-uniplus-600"
                  )
                }
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Marketplace
              </NavLink>
              <NavLink
                to="/lost-found"
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                    isActive
                      ? "bg-uniplus-50 text-uniplus-600"
                      : "text-gray-700 hover:bg-uniplus-50 hover:text-uniplus-600"
                  )
                }
              >
                <Search className="mr-3 h-5 w-5" />
                Lost & Found
              </NavLink>
            </div>
          </div>

          {/* Fix the condition to use logical OR instead of string comparison */}
          {userRole === "staff" || userRole === "admin" ? (
            <div>
              <h3 className="px-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Administration
              </h3>
              <div className="mt-2 space-y-1">
                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                      isActive
                        ? "bg-uniplus-50 text-uniplus-600"
                        : "text-gray-700 hover:bg-uniplus-50 hover:text-uniplus-600"
                    )
                  }
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </NavLink>
                {userRole === "admin" && (
                  <NavLink
                    to="/admin/moderation"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                        isActive
                          ? "bg-uniplus-50 text-uniplus-600"
                          : "text-gray-700 hover:bg-uniplus-50 hover:text-uniplus-600"
                      )
                    }
                  >
                    <ShieldCheck className="mr-3 h-5 w-5" />
                    Moderation
                  </NavLink>
                )}
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
