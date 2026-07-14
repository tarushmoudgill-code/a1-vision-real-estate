"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Home,
  CalendarCheck,
  Users,
  FileText,
  Star,
  MessageSquare,
  Building,
  MapPin,
  BarChart3,
  Settings,
  ScrollText,
  UserCircle,
  Menu,
  LogOut,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "@/store/router";
import { useAuth, type AuthUser } from "@/store/auth";
import { canAccessSection } from "@/lib/admin-rbac";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "properties", label: "Properties", icon: Home },
  { key: "inspections", label: "Inspections", icon: CalendarCheck },
  { key: "leads", label: "Leads", icon: Users },
  { key: "customers", label: "Customers", icon: UserCircle },
  { key: "blog", label: "Blog", icon: FileText },
  { key: "testimonials", label: "Testimonials", icon: Star },
  { key: "contacts", label: "Contacts", icon: MessageSquare },
  { key: "team", label: "Team", icon: Building },
  { key: "suburbs", label: "Suburbs", icon: MapPin },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "audit", label: "Audit Log", icon: ScrollText },
  { key: "settings", label: "Settings", icon: Settings },
];

const SECTION_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  properties: "Properties",
  inspections: "Inspections",
  leads: "Leads CRM",
  customers: "Customers",
  blog: "Blog Posts",
  testimonials: "Testimonials",
  contacts: "Contact Submissions",
  team: "Team & Agents",
  suburbs: "Suburb Guides",
  reports: "Reports & Analytics",
  audit: "Audit Log",
  settings: "Site Settings",
  profile: "My Profile",
};

const ROLE_LABEL: Record<AuthUser["role"], string> = {
  ADMIN: "Administrator",
  AGENT: "Agent",
  PROPERTY_MANAGER: "Property Manager",
  MARKETING: "Marketing",
};

function NavList({
  active,
  onNavigate,
  role,
}: {
  active: string;
  onNavigate: (s: string) => void;
  role: AuthUser["role"];
}) {
  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      <div className="px-3 pb-2">
        <p className="font-serif text-lg leading-tight text-sidebar-foreground">
          A1 Vision Real Estate
        </p>
        <p className="text-[11px] uppercase tracking-wider text-gold">
          Admin Console
        </p>
      </div>
      <Separator className="mb-2 bg-sidebar-border" />
      {NAV_ITEMS.filter((item) => canAccessSection(role, item.key)).map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-gold text-gold-foreground shadow-sm"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                isActive ? "text-gold-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
              )}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="rounded-lg bg-white px-3 py-1.5 shadow-sm">
        <Image src="/logo.png" alt="A1 Vision Real Estate" width={130} height={44} className="h-9 w-auto shrink-0 object-contain sm:h-10" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
        Staff Portal
      </p>
    </div>
  );
}

function UserMenu() {
  const navigate = useRouter((s) => s.navigate);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border bg-background py-1 pl-1 pr-3 text-sm shadow-sm transition-colors hover:bg-muted">
          <Avatar className="size-7">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-medium leading-tight">{user.name}</span>
            <span className="block text-[10px] text-muted-foreground leading-tight">
              {ROLE_LABEL[user.role]}
            </span>
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
          </div>
          <Badge className="mt-2 w-fit bg-gold text-gold-foreground">
            {ROLE_LABEL[user.role]}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("admin/settings")}>
          <Settings className="size-4" />
          Site settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("home")}>
          <ExternalLink className="size-4" />
          View website
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={async () => {
            await logout();
            navigate("home");
          }}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AdminLayoutProps {
  active: string;
  onNavigate: (section: string) => void;
  children: ReactNode;
}

export function AdminLayout({ active, onNavigate, children }: AdminLayoutProps) {
  const navigate = useRouter((s) => s.navigate);
  const user = useAuth((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = SECTION_TITLES[active] || "Dashboard";

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-sidebar text-sidebar-foreground lg:block">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <BrandMark />
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-luxe">
          {user && (
            <NavList
              active={active}
              role={user.role}
              onNavigate={(s) => onNavigate(s)}
            />
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile nav trigger — same Sheet instance as the panel below */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
                <SheetHeader className="border-b border-sidebar-border px-5 py-4">
                  <SheetTitle asChild>
                    <div>
                      <BrandMark />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto">
                  {user && (
                    <NavList
                      active={active}
                      role={user.role}
                      onNavigate={(s) => {
                        setMobileOpen(false);
                        onNavigate(s);
                      }}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="font-serif text-lg leading-tight sm:text-xl">{title}</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage your real estate business
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => navigate("home")}
            >
              <ExternalLink className="size-4" />
              View site
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => navigate("home")}
              aria-label="View site"
            >
              <ExternalLink className="size-4" />
            </Button>
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
