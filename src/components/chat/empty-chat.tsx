import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquarePlusIcon } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react'

import { createChat } from '@/lib/storage'
import { Sidebar } from '@/components/app/sidebar'
import { Header } from '@/components/app/header'
import { Button } from '@/components/ui'

export function EmptyChat() {
  const navigate = useNavigate()
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreateNewChat = async () => {
    if (!isAuthenticated || !user?.sub) {
      loginWithRedirect()
      return
    }

    try {
      const newChat = await createChat(user.sub)
      setRefreshTrigger((prev) => prev + 1)
      navigate(`/chat/${newChat.id}`, { replace: true })
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar currentChatTitle="New Chat" refreshTrigger={refreshTrigger} />

      <div className="flex flex-1 flex-col">
        <Header
          loginUrl={() => loginWithRedirect()}
          loading={false}
          logout={logout}
          user={user || undefined}
          chatTitle="New Chat"
        />

        <div className="flex flex-1 items-center justify-center p-4">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <span className="bg-muted/25 shadow-input-resting w-fit rounded-xl p-4">
              <MessageSquarePlusIcon className="text-muted-foreground mx-auto h-8 w-8 translate-y-0.5" />
            </span>
            <div className="flex flex-col gap-0">
              <h3 className="mt-4 text-2xl font-semibold">Start a new chat</h3>
              <p className="text-muted-foreground mt-2">
                Begin a conversation...
              </p>
            </div>
            <Button variant="default" onClick={handleCreateNewChat}>
              New Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
