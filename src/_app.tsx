import { Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@/providers/theme-provider'
import ChatRoute from '@/routes/chat'
import { EmptyChat } from '@/components/chat'

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <div className="bg-background text-foreground flex min-h-screen flex-col">
        <Routes>
          <Route path="/" element={<EmptyChat />} />
          <Route path="/chat/:chatId" element={<ChatRoute />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}
