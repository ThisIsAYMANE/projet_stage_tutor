"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

interface SidebarContextProps {
  isOpen: boolean
  setOpen: (open: boolean) => void
  toggleOpen: () => void
}

const SidebarContext = createContext<SidebarContextProps>({
  isOpen: false,
  setOpen: () => {},
  toggleOpen: () => {},
})

interface SidebarProviderProps {
  defaultOpen?: boolean
  children: ReactNode
}

function SidebarProvider({ defaultOpen = false, children }: SidebarProviderProps) {
  const [isOpen, setOpen] = useState(defaultOpen)

  const toggleOpen = () => {
    setOpen(!isOpen)
  }

  const value = { isOpen, setOpen, toggleOpen }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

interface SidebarProps {
  className?: string
  children: React.ReactNode
}

function Sidebar({ className, children }: SidebarProps) {
  const { isOpen } = useContext(SidebarContext)

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-sidebar-background border-r border-sidebar-border transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 md:translate-x-0 ${className}`}
    >
      {children}
    </aside>
  )
}

interface SidebarContentProps {
  className?: string
  children: React.ReactNode
}

function SidebarContent({ className, children }: SidebarContentProps) {
  return <div className={`flex-1 overflow-y-auto scrollbar-hide ${className}`}>{children}</div>
}

interface SidebarFooterProps {
  className?: string
  children: React.ReactNode
}

function SidebarFooter({ className, children }: SidebarFooterProps) {
  return <div className={`p-4 border-t border-sidebar-border ${className}`}>{children}</div>
}

interface SidebarGroupProps {
  className?: string
  children: React.ReactNode
}

function SidebarGroup({ className, children }: SidebarGroupProps) {
  return <div className={className}>{children}</div>
}

interface SidebarGroupContentProps {
  className?: string
  children: React.ReactNode
}

function SidebarGroupContent({ className, children }: SidebarGroupContentProps) {
  return <div className={className}>{children}</div>
}

interface SidebarMenuProps {
  className?: string
  children: React.ReactNode
}

function SidebarMenu({ className, children }: SidebarMenuProps) {
  return <ul className={`space-y-1 ${className}`}>{children}</ul>
}

interface SidebarMenuButtonProps {
  isActive?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

function SidebarMenuButton({ isActive, className, children, onClick }: SidebarMenuButtonProps) {
  return (
    <button onClick={onClick} className={className} data-active={isActive}>
      {children}
    </button>
  )
}

interface SidebarMenuItemProps {
  className?: string
  children: React.ReactNode
}

function SidebarMenuItem({ className, children }: SidebarMenuItemProps) {
  return <li className={className}>{children}</li>
}

interface SidebarHeaderProps {
  className?: string
  children: React.ReactNode
}

function SidebarHeader({ className, children }: SidebarHeaderProps) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarContext,
}
