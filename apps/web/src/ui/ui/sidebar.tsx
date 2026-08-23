import * as React from 'react';
import { cn } from '@/logic/formatters';

function Sidebar({ className, ...props }: React.ComponentProps<'aside'>) {
  return (
    <aside
      data-slot="sidebar"
      className={cn('bg-sidebar text-sidebar-foreground', className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-header" className={cn('border-b border-sidebar-border p-6', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-content" className={cn('flex flex-1 flex-col gap-2 p-4', className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-footer" className={cn('border-t border-sidebar-border p-4', className)} {...props} />;
}

function SidebarItem({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sidebar-item" className={cn('rounded-lg px-3 py-3', className)} {...props} />;
}

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarItem };
