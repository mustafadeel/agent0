import { useState } from 'react'
import { LogOut, UserCircle, Link } from 'lucide-react'

import { Button, Popover } from '@/components/ui'
import { User, LogoutOptions } from '@auth0/auth0-react'
import { cn } from '@/lib/utils'

import { LinkedAccountsDialog } from '@/components/dialogs'

interface UserButtonProps {
  user: User
  logout: (options?: LogoutOptions) => void
  className?: string
}

export function UserButton({ user, logout, className }: UserButtonProps) {
  const [isLinkedAccountsOpen, setIsLinkedAccountsOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleOpenLinkedAccounts = () => {
    setIsPopoverOpen(false)
    setIsLinkedAccountsOpen(true)
  }

  return (
    <>
      <LinkedAccountsDialog
        open={isLinkedAccountsOpen}
        onOpenChange={setIsLinkedAccountsOpen}
      />

      <Popover
        align="end"
        width={240}
        sideOffset={2}
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        className="rounded-3xl"
        content={
          <div className="flex w-full flex-col p-1">
            <div className="bg-input-muted flex items-center gap-1 rounded-lg p-1">
              <div className="relative">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'Profile picture'}
                    className="border-foreground/10 size-10 overflow-clip rounded-md border shadow-xs"
                  />
                ) : (
                  <div className="border-foreground/10 size-10 overflow-clip rounded-full border shadow-xs">
                    <UserCircle className="text-muted-foreground size-7" />
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-foreground truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="text-secondary-foreground truncate text-sm">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="mt-0.5 flex flex-col">
              <Button
                variant="ghost"
                onClick={handleOpenLinkedAccounts}
                className="text-foreground hover:bg-muted flex items-center gap-2 rounded-xl px-2 text-left text-sm"
                startIcon={<Link className="text-foreground size-4" />}
              >
                <span>Linked Accounts</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-foreground hover:bg-muted flex items-center gap-2 rounded-xl px-2 text-left text-sm"
                startIcon={<LogOut className="text-foreground size-4" />}
              >
                <span>Log out</span>
              </Button>
            </div>
          </div>
        }
      >
        <div className={cn('cursor-pointer', className)}>
          {user.picture ? (
            <div className="relative">
              <img
                src={user.picture}
                alt={user.name || 'Profile picture'}
                className="hover:shadow-btn-outlined-focus focus-within:shadow-btn-outlined-focus size-9 overflow-clip rounded-full transition-all duration-200 ease-out"
              />
              <div className="border-border bg-muted absolute inset-0 hidden items-center justify-center rounded-full border">
                <UserCircle className="text-muted-foreground size-6" />
              </div>
            </div>
          ) : (
            <div className="border-border bg-muted flex size-9 items-center justify-center rounded-full border">
              <UserCircle className="text-muted-foreground size-6" />
            </div>
          )}
        </div>
      </Popover>
    </>
  )
}
