import { Link, Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { User, LogOut, Link as LinkIcon, Coins, Settings, UserCircle } from 'lucide-react';

interface UserProfileDropdownProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    dincoin?: number;
    dircoin?: number;
  };
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Coin Balance Section */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                <Coins className="w-3 h-3 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium">DinCoin</span>
                <span className="text-sm font-bold text-yellow-600">
                  {user.dincoin?.toLocaleString() || 0}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                <Coins className="w-3 h-3 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium">DirCoin</span>
                <span className="text-sm font-bold text-gray-600">
                  {user.dircoin?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/dashboard/biolink" className="flex items-center">
            <LinkIcon className="mr-2 h-4 w-4" />
            <span>Biolink Saya</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/dashboard/profil" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/dashboard/pengaturan" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Pengaturan</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem asChild>
          <Form method="post" action="/auth/logout" className="w-full">
            <button
              type="submit"
              className="flex w-full items-center px-2 py-1.5 text-sm text-red-600 hover:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </button>
          </Form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
