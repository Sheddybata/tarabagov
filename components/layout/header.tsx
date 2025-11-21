"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Search, User, LogOut, Settings, Shield } from "lucide-react";

export function Header() {
  const [notifications] = useState(3); // Mock notification count

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
      {/* Coat of Arms / Logo Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-taraba-green">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-900">
            Taraba State Government
          </h1>
          <p className="text-xs text-gray-500">Unified Citizen Portal</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search Bar */}
      <div className="hidden md:flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {notifications > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-taraba-gold text-taraba-green text-xs font-bold flex items-center justify-center">
            {notifications}
          </span>
        )}
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* User Profile Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar-placeholder.png" alt="User" />
              <AvatarFallback className="bg-taraba-green text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">Citizen</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">john.doe@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

