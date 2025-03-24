import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { SocialLogo } from 'social-logos'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { useAuth0 } from '@auth0/auth0-react'

// Define available social connections
const socialConnections = [
  {
    id: 'google-oauth2',
    name: 'Google',
    icon: <SocialLogo icon="google" size={24} className="fill-foreground" />,
    color: '#DB4437',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <SocialLogo icon="github" size={24} className="fill-foreground" />,
    color: '#333',
  },
]

interface Identity {
  connection: string
  provider: string
  isSocial: boolean
}

interface LinkedAccountsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LinkedAccountsDialog({
  open,
  onOpenChange,
}: LinkedAccountsDialogProps) {
  const { user, getAccessTokenSilently } = useAuth0()

  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([])
  const [isLinking, setIsLinking] = useState<string | null>(null)

  useEffect(() => {
    if (user?.sub) {
      // Extract linked accounts from user identities
      const linked = (user.identities || []).map(
        (identity: Identity) => identity.connection
      )
      setLinkedAccounts(linked)
    }
  }, [user])

  const handleLink = async (connection: string) => {
    try {
      setIsLinking(connection)

      const token = await getAccessTokenSilently()

      const authorizeUrl =
        `https://${import.meta.env.AUTH0_DOMAIN}/authorize?` +
        `response_type=code&` +
        `client_id=${import.meta.env.AUTH0_CLIENT_ID}&` +
        `connection=${connection}&` +
        `redirect_uri=${encodeURIComponent(window.location.origin)}&` +
        `scope=openid profile email offline_access&` +
        `access_token=${token}`

      window.location.href = authorizeUrl
    } catch (error) {
      console.error('Error linking account:', error)
      toast.error('Error linking account. Please try again later.')
    } finally {
      setIsLinking(null)
    }
  }

  const handleUnlink = async (connection: string) => {
    try {
      setIsLinking(connection)

      const token = await getAccessTokenSilently()

      // Call Auth0's Management API to unlink the connection
      const response = await fetch(
        `https://${import.meta.env.AUTH0_DOMAIN}/api/v2/users/${
          user?.sub
        }/identities/${connection}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to unlink account')

      // Update local state
      setLinkedAccounts((prev) => prev.filter((acc) => acc !== connection))

      toast.success('Successfully unlinked your account.')
    } catch (error) {
      console.error('Error unlinking account:', error)
      toast.error('Error unlinking account. Please try again later.')
    } finally {
      setIsLinking(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="35rem">
        <DialogHeader>
          <DialogTitle>Linked Accounts </DialogTitle>
          <DialogDescription>
            Link your account to additional social providers for easier sign-in
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          {socialConnections.map((connection) => {
            const isLinked = linkedAccounts.includes(connection.id)
            return (
              <div
                key={connection.id}
                className="border-border bg-background text-foreground flex items-center justify-between rounded-xl border p-4"
              >
                <div className="flex items-center gap-3">
                  {connection.icon}
                  <p className="font-medium">{connection.name}</p>
                </div>
                <Button
                  variant={isLinked ? 'destructive' : 'outline'}
                  onClick={() =>
                    isLinked
                      ? handleUnlink(connection.id)
                      : handleLink(connection.id)
                  }
                  disabled={isLinking === connection.id}
                >
                  {isLinked ? 'Unlink' : 'Link'}
                </Button>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
