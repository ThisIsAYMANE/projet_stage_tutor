"use client"

import { MessageCircle, Plus, User, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  {
    title: "Messages",
    icon: MessageCircle,
    id: "messages",
  },
  {
    title: "Add Announcement",
    icon: Plus,
    id: "announcements",
  },
  {
    title: "Edit Profile",
    icon: User,
    id: "profile",
  },
]

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TC</span>
          </div>
          <span className="font-bold text-xl text-gray-900">TutorConnect</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-700 data-[active=true]:bg-pink-100 data-[active=true]:text-pink-700 data-[active=true]:font-medium rounded-lg transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
