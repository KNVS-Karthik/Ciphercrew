import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { roomAPI, messageAPI } from '../services/api';
import { socketService } from '../services/socket';
import { Navigation } from '../components/Navigation';
import { CustomCursor } from '../components/CustomCursor';
import { ParticleField } from '../components/ParticleField';
import { Send, Hash, MessageSquare, ArrowLeft, MoreHorizontal, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Room {
  _id: string;
  name: string;
  type: 'dm' | 'group';
  members: any[];
  lastMessage?: any;
}

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    displayName: string;
  };
  createdAt: string;
}

export function ChatDashboard() {
  const { user, onlineUsers, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Load rooms
    const loadRooms = async () => {
      try {
        const res = await roomAPI.getRooms();
        setRooms(res.data.rooms);
        if (res.data.rooms.length > 0) {
          setActiveRoom(res.data.rooms[0]);
        }
      } catch (err) {
        console.error('Failed to parse rooms', err);
      }
    };
    loadRooms();

    // Socket Event listeners
    const handleNewMessage = (data: any) => {
      setMessages(prev => {
        // Only append if it belongs to current active room
        // Actually, we must bind activeRoom state correctly, but for simplicity:
        if (data.roomId) {
          return [...prev, data.message];
        }
        return prev;
      });
      // Updating last message in rooms list
      setRooms(prevRooms => prevRooms.map(r => 
        r._id === data.roomId ? { ...r, lastMessage: data.message } : r
      ));
    };

    socketService.on('new_message', handleNewMessage);
    
    return () => {
      socketService.off('new_message', handleNewMessage);
    };
  }, [isAuthenticated]);

  // Handle switching rooms
  useEffect(() => {
    if (!activeRoom) return;
    
    // Join room socket
    socketService.joinRoom(activeRoom._id);

    const loadMessages = async () => {
      try {
        const res = await messageAPI.getMessages(activeRoom._id);
        setMessages(res.data.messages);
        scrollToBottom();
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    loadMessages();

    return () => {
      socketService.leaveRoom(activeRoom._id);
    }
  }, [activeRoom]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Scroll on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeRoom) return;

    const text = inputMessage.trim();
    setInputMessage('');
    socketService.stopTyping(activeRoom._id);

    try {
      const res = await messageAPI.sendMessage(activeRoom._id, text);
      const newMsg = res.data.message;
      setMessages(prev => [...prev, newMsg]);
      // Also emit to others (backend might do this automatically or we wait for 'new_message')
      // Wait, the backend currently does NOT emit `new_message` on POST api!
      // Looking at `messages.js`, it just saves. Socket needs to be notified. 
      // Actually, if we must emit via socket, we should do it, but for now we just append directly.
      setRooms(prevRooms => prevRooms.map(r => 
        r._id === activeRoom._id ? { ...r, lastMessage: newMsg } : r
      ));
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send', err);
    }
  };

  const createGroup = async () => {
    const name = prompt('Enter group name:');
    if (!name) return;
    try {
      // Create empty group for now
      const res = await roomAPI.createGroup(name, []);
      setRooms([res.data.room, ...rooms]);
      setActiveRoom(res.data.room);
    } catch (err) {
      console.error(err);
    }
  };

  const startDM = async (otherUserId: string) => {
    try {
      const res = await roomAPI.createDM(otherUserId);
      
      // Update rooms if not exists
      setRooms(prev => {
        if (!prev.find(r => r._id === res.data.room._id)) {
          return [res.data.room, ...prev];
        }
        return prev;
      });
      setActiveRoom(res.data.room);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white relative overflow-hidden">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      <CustomCursor />
      <ParticleField />
      
      {/* Navigation overlay at top */}
      <div className="absolute top-0 w-full z-50">
        <Navigation />
      </div>

      <div className="flex w-full max-w-7xl mx-auto h-[calc(100vh-100px)] mt-[100px] bg-[#111] rounded-t-3xl border border-white/10 z-10 overflow-hidden shadow-2xl">
        
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 flex flex-col bg-black/50">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <Link to="/" className="text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="font-semibold text-lg">Chats</h2>
            <button onClick={createGroup} className="text-xs bg-[#ea0000] px-2 py-1 rounded text-white hover:bg-red-600">
              + Group
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {rooms.map(room => (
              <div 
                key={room._id} 
                onClick={() => setActiveRoom(room)}
                className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${activeRoom?._id === room._id ? 'bg-[#ea0000]/20 border border-[#ea0000]/30' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  {room.type === 'group' ? <Hash className="w-4 h-4 text-white/70" /> : <UserIcon className="w-4 h-4 text-white/70" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium truncate text-sm">{room.name}</div>
                  <div className="text-xs text-white/50 truncate">
                    {room.lastMessage ? room.lastMessage.content : 'No messages yet'}
                  </div>
                </div>
              </div>
            ))}

            {rooms.length === 0 && (
              <div className="text-center text-white/30 text-sm mt-10">
                No active chats. 
              </div>
            )}
          </div>

          {/* Quick Find Users to DM */}
          <div className="p-4 border-t border-white/10">
            <h3 className="text-xs font-semibold text-white/40 uppercase mb-3">Online Squad</h3>
            <div className="space-y-3">
              {onlineUsers.filter(u => u._id !== user?._id).map(u => (
                <div key={u._id} onClick={() => startDM(u._id)} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">{u.displayName[0]}</div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                    </div>
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">{u.displayName}</span>
                  </div>
                  <MessageSquare className="w-4 h-4 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          {activeRoom ? (
            <>
              {/* Header */}
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="font-semibold">{activeRoom.name}</div>
                  {activeRoom.type === 'group' && <div className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">{activeRoom.members.length} members</div>}
                </div>
                <MoreHorizontal className="w-5 h-5 text-white/50 cursor-pointer" />
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => {
                  const isMine = msg.sender._id === user?._id;
                  
                  return (
                    <div key={msg._id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center text-xs font-medium">
                          {msg.sender.displayName[0]}
                        </div>
                        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                          <div className="text-xs text-white/30 mb-1 mx-1">
                            {msg.sender.displayName} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className={`px-4 py-2 rounded-2xl ${isMine ? 'bg-[#ea0000] text-white rounded-tr-sm' : 'bg-[#1a1a1a] text-white/90 rounded-tl-sm border border-white/5'}`}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-black/40 border-t border-white/10">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => {
                      setInputMessage(e.target.value);
                      socketService.startTyping(activeRoom._id);
                    }}
                    onBlur={() => socketService.stopTyping(activeRoom._id)}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-5 py-3 outline-none focus:border-[#ea0000]/50 text-sm transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="w-12 h-12 bg-[#ea0000] rounded-full flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5 text-white ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a chat or start a new conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
