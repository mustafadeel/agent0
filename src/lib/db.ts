import { PrismaClient } from '@prisma/client'
import type { Message } from '@/types/message'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function createChat(userId: string, title = 'New Chat') {
  return prisma.chat.create({
    data: {
      userId,
      title,
    },
  })
}

export async function getChatById(chatId: string) {
  return prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: true },
  })
}

export async function getUserChats(userId: string) {
  return prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function addMessageToChat(
  chatId: string,
  message: Omit<Message, 'id'>
) {
  return prisma.message.create({
    data: {
      content: message.content,
      role: message.role,
      chatId,
    },
  })
}

export async function getChatMessages(chatId: string) {
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function updateChatTitle(chatId: string, title: string) {
  return prisma.chat.update({
    where: { id: chatId },
    data: { title },
  })
}

export async function deleteChat(chatId: string) {
  return prisma.chat.delete({
    where: { id: chatId },
  })
}
