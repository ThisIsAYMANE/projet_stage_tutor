"use client"

import { useState } from "react"
import { Send, Search, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    lastMessage: "Thanks for the math help yesterday!",
    time: "2m ago",
    unread: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    lastMessage: "Can we schedule a session for tomorrow?",
    time: "1h ago",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
  {
    id: 3,
    name: "Emma Wilson",
    lastMessage: "The chemistry assignment was really helpful",
    time: "3h ago",
    unread: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content: "Hi! I wanted to thank you for yesterday's math session. The quadratic equations finally make sense!",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "I'm so glad to hear that! You did great work. Keep practicing those problems we went over.",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "Will do! Can we schedule another session for next week?",
    time: "10:35 AM",
    isOwn: false,
  },
]

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Connect with your students and manage conversations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search conversations..." className="pl-10 bg-gray-50 border-gray-200" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation.id === conversation.id ? "bg-pink-50 border-r-2 border-pink-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-pink-100 text-pink-700">
                          {conversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-pink-500 hover:bg-pink-600 text-white">{conversation.unread}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat View */}
        <Card className="lg:col-span-2 shadow-sm border-gray-200 flex flex-col">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-pink-100 text-pink-700">
                    {selectedConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isOwn ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isOwn ? "text-pink-100" : "text-gray-500"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setNewMessage("")
                  }
                }}
              />
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
