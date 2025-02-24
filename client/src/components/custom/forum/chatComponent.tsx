import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Heart, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: number;
  message: string;
  votes: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  forumId: number;
  author?: {
    username: string;
    id: number;
  };
}

interface ChatComponentProps {
  forumId: string | number | undefined;
}

export function ChatComponent({ forumId }: ChatComponentProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [likedMessages, setLikedMessages] = useState<Record<number, boolean>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchChatMessages = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/chat/all/${forumId}`);
      setChatMessages(res.data);
      
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

//   const fetchLikedMessages = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/v1/chat/likes`, {
//         withCredentials: true,
//       });
      
//       if (res.status === 200 && res.data.likedMessages) {
//         const likedMessagesMap = res.data.likedMessages.reduce((acc, messageId) => {
//           acc[messageId] = true;
//           return acc;
//         }, {});
//         setLikedMessages(likedMessagesMap);
//       }
//     } catch (error) {
//       console.error("Error fetching liked messages:", error);
//     }
//   };

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/user/self', {
        withCredentials: true,
      });
      
      if (res.status === 200 && res.data.user.id) {
        setCurrentUserId(res.data.user.id);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    // fetchLikedMessages();
    fetchCurrentUser();

    const intervalId = setInterval(fetchChatMessages, 10000); 
    
    return () => clearInterval(intervalId);
  }, [forumId]);

  const toggleLike = async (messageId: number) => {
    try {
      if (likedMessages[messageId]) {
        await axios.delete(`http://localhost:3000/api/v1/chat/${messageId}/like`, {
          withCredentials: true,
        });
        
        setLikedMessages(prev => ({
          ...prev,
          [messageId]: false
        }));
        
        setChatMessages(prev => 
          prev.map(message => 
            message.id === messageId ? { ...message, votes: message.votes - 1 } : message
          )
        );
      } else {
        await axios.post(`http://localhost:3000/api/v1/chat/${messageId}/like`, {}, {
          withCredentials: true,
        });
        
        setLikedMessages(prev => ({
          ...prev,
          [messageId]: true
        }));
        
        setChatMessages(prev => 
          prev.map(message => 
            message.id === messageId ? { ...message, votes: message.votes + 1 } : message
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/chat/create`, 
        {
          message: newMessage,
          forumId: forumId
        },
        {
          withCredentials: true,
        }
      );
      
      if (res.status === 200) {
        setChatMessages(prev => [...prev, res.data]);
        
        setNewMessage("");
        
        // Scroll to bottom
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = () => {
    const groups = {};
    
    chatMessages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      dateFormatted: formatDateHeader(date),
      messages
    }));
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message area */}
      <div className="flex-grow overflow-hidden">
        <ScrollArea 
          className="h-full p-4"
          ref={scrollAreaRef}
        >
          {isLoading && chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500">Loading messages...</p>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500">No messages yet. Be the first to chat!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupMessagesByDate().map(group => (
                <div key={group.date} className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="h-px bg-zinc-700/50 flex-1"></div>
                    <span className="px-2 text-xs text-zinc-500">{group.dateFormatted}</span>
                    <div className="h-px bg-zinc-700/50 flex-1"></div>
                  </div>
                  
                  {group.messages.map((message: ChatMessage) => (
                    <div key={message.id} className="group flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {message.author?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {message.author?.username || 'Anonymous'}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                        
                        <p className="mt-1 text-zinc-300">{message.message}</p>
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => toggleLike(message.id)}
                          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
                        >
                          <Heart 
                            className={`h-4 w-4 ${likedMessages[message.id] ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                          <span>{message.votes > 0 ? message.votes : ''}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Input area - Fixed at the bottom */}
      <div className="p-4 border-t border-zinc-700 bg-zinc-900 mt-auto">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-zinc-800 border-zinc-700 focus:border-violet-500 text-white"
          />
          <Button 
            onClick={sendMessage} 
            size="icon" 
            className="bg-violet-600 hover:bg-violet-700 min-w-10 h-10 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;