"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { FileTextIcon, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Menu = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Dashboard"
            className={cn(
              isActive("/dashboard") &&
                "bg-neutral-800 text-white hover:bg-neutral-800 hover:text-white",
            )}
          >
            <Link href="/dashboard">
              <LayoutDashboardIcon />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Invoices"
            className={cn(
              isActive("/invoices") &&
                "bg-neutral-800 text-white hover:bg-neutral-800 hover:text-white",
            )}
          >
            <Link href="/invoices">
              <FileTextIcon />
              <span>Invoices</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};
