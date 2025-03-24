import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ChatInterface } from '@/components/chat'
import { Message } from '@/types/message'
import { useAuth0 } from '@auth0/auth0-react'
import {
  addMessageToChat,
  createChat,
  getChatById,
  getChatMessages,
  updateChatTitle,
} from '@/lib/storage'

export default function ChatRoute() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingChat, setIsFetchingChat] = useState(false)
  const [chatTitle, setChatTitle] = useState('New Chat')
  const { chatId } = useParams<{ chatId: string }>()
  const navigate = useNavigate()
  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently, user } =
    useAuth0()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      role: 'assistant',
    },
  ])

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatId || !isAuthenticated || !user) return

      setIsFetchingChat(true)
      try {
        const chat = await getChatById(chatId)

        if (chat && chat.userId === user.sub) {
          setChatTitle(chat.title)

          const messagesFromDb = await getChatMessages(chatId)
          if (messagesFromDb.length > 0) {
            setMessages(
              messagesFromDb.map((msg) => ({
                id: msg.id,
                content: msg.content,
                role: msg.role as 'user' | 'assistant',
              }))
            )
          } else {
            // Reset messages for new empty chats
            setMessages([
              {
                id: '1',
                content: 'Hello! How can I help you today?',
                role: 'assistant',
              },
            ])
          }
        } else {
          navigate('/', { replace: true })
        }
      } catch (error) {
        console.error('Error fetching chat:', error)

        navigate('/', { replace: true })
      } finally {
        setIsFetchingChat(false)
      }
    }

    fetchChatMessages()
  }, [chatId, isAuthenticated, user, navigate])

  useEffect(() => {
    if (!chatId) {
      setMessages([
        {
          id: '1',
          content: 'Hello! How can I help you today?',
          role: 'assistant',
        },
      ])
      setChatTitle('New Chat')
    }
  }, [chatId])

  const handleUpdateChatTitle = async (newTitle: string) => {
    if (!chatId || !newTitle.trim()) return

    try {
      await updateChatTitle(chatId, newTitle.trim())
      setChatTitle(newTitle.trim())
      return true
    } catch (error) {
      console.error('Error updating chat title:', error)
      return false
    }
  }

  const generateTitle = (message: string) => {
    const maxLength = 30
    let title = message.trim()

    if (title.length > maxLength) {
      title = title.substring(0, maxLength) + '...'
    }

    return title
  }

  const handleSendMessage = async (message: string) => {
    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }

    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const token = await getAccessTokenSilently()

      let currentChatId = chatId
      let isFirstMessage = false

      if (!currentChatId && user?.sub) {
        const newChat = await createChat(user.sub)
        currentChatId = newChat.id
        isFirstMessage = true

        navigate(`/chat/${newChat.id}`, { replace: true })

        setChatTitle(newChat.title)
      }

      if (currentChatId && user?.sub) {
        await addMessageToChat(currentChatId, {
          content: userMessage.content,
          role: userMessage.role,
        })

        if (isFirstMessage) {
          const title = generateTitle(userMessage.content)
          await updateChatTitle(currentChatId, title)
          setChatTitle(title)
        }
      }

      const apiUrl = `${import.meta.env.AUTH0_API_HOST}/agent`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ content, role }) => ({
            content,
            role,
          })),
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.error(
            'Unauthorized: Check API permissions or token validity.'
          )
        } else {
          console.error('API responded with status:', response.status)
        }
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
      }

      setMessages((prev) => [...prev, systemMessage])

      if (currentChatId) {
        await addMessageToChat(currentChatId, {
          content: systemMessage.content,
          role: systemMessage.role,
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Login required') {
        console.error('Token expired or invalid. Redirecting to login...')
        loginWithRedirect()
      } else {
        console.error('Error sending message:', error)

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
        }

        setMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChatInterface
      messages={messages}
      isLoading={isLoading || isFetchingChat}
      handleSendMessage={handleSendMessage}
      chatTitle={chatTitle}
      onUpdateChatTitle={handleUpdateChatTitle}
    />
  )
}
