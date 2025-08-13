"use client";

import { Link, useFetcher } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Coins, LogOut } from "lucide-react";

// PENTING: Pastikan Anda sudah menambahkan komponen ini melalui terminal:
// npx shadcn-ui@latest add dropdown-menu button avatar

interface UserNavProps {
  user: {
    name: string;
    email: string;
    initials: string;
    avatarUrl?: string | null;
    dincoin?: number;
    dircoin?: number;
  } | null;
}

export function UserNav({ user }: UserNavProps) {
  const fetcher = useFetcher();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    fetcher.submit(
      {},
      { method: "post", action: "/logout" }
    );
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Coin Balance Display */}
      {(user.dincoin !== undefined || user.dircoin !== undefined) && (
        <div className="flex items-center space-x-2">
          {/* Dincoin */}
          <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <Coins className="h-2.5 w-2.5 text-yellow-800" />
            </div>
            <span className="text-xs font-medium text-yellow-800">
              {user.dincoin || 0}
            </span>
          </div>
          {/* Dircoin */}
          <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
              <Coins className="h-2.5 w-2.5 text-gray-800" />
            </div>
            <span className="text-xs font-medium text-gray-800">
              {user.dircoin || 0}
            </span>
          </div>
        </div>
      )}

      {/* User Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          {/* Wallet Balance in Dropdown */}
          {(user.dincoin !== undefined || user.dircoin !== undefined) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-xs text-muted-foreground">Saldo Dompet</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-xs">Dincoin</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {user.dincoin || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-xs">Dircoin</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {user.dircoin || 0}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/dashboard/profil">Profil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/dompet">Dompet</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/hafalan">Hafalan</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
