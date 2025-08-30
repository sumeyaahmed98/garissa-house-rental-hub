import { useState } from 'react';
import { FiMessageSquare, FiSearch, FiSend, FiLink, FiMoreHorizontal } from 'react-icons/fi';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      tenant: 'Ahmed Mohamed',
      property: 'Garissa Heights #1',
      lastMessage: 'The kitchen tap is leaking, can you send a plumber?',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      tenant: 'Fatuma Abdi',
      property: 'River View Apartments',
      lastMessage: 'I have transferred the rent for this month',
      time: '1 day ago',
      unread: false
    },
    {
      id: 3,
      tenant: 'Omar Hassan',
      property: 'Townhouse #2',
      lastMessage: 'When will the painting work be completed?',
      time: '3 days ago',
      unread: false
    },
  ];

  const messages = [
    { id: 1, sender: 'tenant', text: 'Hello, the kitchen tap is leaking', time: '10:30 AM' },
    { id: 2, sender: 'tenant', text: 'Can you send a plumber to fix it?', time: '10:31 AM' },
    { id: 3, sender: 'owner', text: 'Hi Ahmed, I will arrange for a plumber tomorrow morning', time: '11:45 AM' },
    { id: 4, sender: 'tenant', text: 'Thank you, that would be great', time: '12:15 PM' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      alert(`Message sent: ${newMessage}`);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex h-full">
        {/* Conversation list */}
        <div className="w-full md:w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>

          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${activeConversation === conv.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {conv.tenant.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{conv.tenant}</h3>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.property}</p>
                    <p className={`text-sm ${conv.unread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 ml-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message area */}
        <div className="hidden md:flex flex-col w-2/3">
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {conversations.find(c => c.id === activeConversation)?.tenant.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">
                      {conversations.find(c => c.id === activeConversation)?.tenant}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conversations.find(c => c.id === activeConversation)?.property}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreHorizontal />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'owner' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.sender === 'owner' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'owner' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
                    <FiLink />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 mx-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FiSend />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FiMessageSquare className="mx-auto text-gray-300 text-4xl mb-2" />
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;