"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { LogOut, BookOpen, Users, Calendar, BarChart3, Presentation, Home } from "lucide-react";

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const getLinks = () => {
    const baseLinks = [];

    switch (role) {
      case "student":
        baseLinks.push(
          { name: "My Dashboard", href: "/dashboard/student", icon: Home },
          { name: "Join Batch (Invite)", href: "/dashboard/student/join", icon: Users }
        );
        break;
      case "trainer":
        baseLinks.push(
          { name: "Dashboard", href: "/dashboard/trainer", icon: Home },
          { name: "Sessions", href: "/dashboard/trainer/sessions", icon: Presentation }
        );
        break;
      case "institution":
        baseLinks.push(
          { name: "Dashboard", href: "/dashboard/institution", icon: Home }
        );
        break;
      case "programme_manager":
        baseLinks.push(
          { name: "Dashboard", href: "/dashboard/manager", icon: Home }
        );
        break;
      case "monitoring_officer":
        baseLinks.push(
          { name: "Global Analytics", href: "/dashboard/monitor", icon: BarChart3 }
        );
        break;
      default:
        break;
    }

    return baseLinks;
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full shadow-sm relative z-10">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SkillBridge
          </h1>
        </div>
        
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard/' + role);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
