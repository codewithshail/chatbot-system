"use client"

import type React from "react"
import { useEffect } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/navigation/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAuthStore } from "@/lib/store"
import { userService } from "@/lib/services/user"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { supabaseUser, userProfile, setUserProfile } = useAuthStore()
  
  // Force profile refresh if we have a user but no profile
  useEffect(() => {
    if (supabaseUser && !userProfile) {
      console.log('[DashboardLayout] User exists but no profile, attempting to fetch...')
      userService.getCurrentUserProfile().then(profile => {
        if (profile) {
          console.log('[DashboardLayout] Profile fetched successfully')
          setUserProfile(profile)
        }
      }).catch(err => {
        console.error('[DashboardLayout] Error fetching profile:', err)
      })
    }
  }, [supabaseUser, userProfile, setUserProfile])
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
