import { useState } from 'react';
import { FiSend, FiSearch, FiPaperclip, FiChevronLeft } from 'react-icons/fi';

const AdminMessages = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'John Doe', subject: 'Maintenance Request', preview: 'The kitchen sink is leaking...', date: '2023-06-15', read: false },
    { id: 2, sender: 'Jane Smith', subject: 'Rent Payment Confirmation', preview: 'I have made the payment for June...', date: '2023-06-14', read: true },
    { id: 3, sender: 'Property Management', subject: 'Upcoming Inspection', preview: 'Just a reminder about the annual...', date: '2023-06-12', read: true },
    { id: 4, sender: 'Mike Johnson', subject: 'Lease Renewal', preview: 'I would like to discuss renewing my...', date: '2023-06-10', read: false },
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      alert('Message sent!');
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Message List */}
      <div className={`${selectedMessage ? 'hidden md:block md:w-1/3' : 'w-full'} border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 border-b border-gray-200 cursor-pointer ${!message.read ? 'bg-blue-50' : 'hover:bg-gray-50'} ${selectedMessage?.id === message.id ? 'bg-gray-100' : ''}`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`text-sm font-medium ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>{message.sender}</h3>
                <span className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</span>
              </div>
              <h4 className={`text-sm ${!message.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{message.subject}</h4>
              <p className="text-sm text-gray-500 truncate">{message.preview}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail */}
      {selectedMessage ? (
        <div className={`${selectedMessage ? 'w-full md:w-2/3' : 'hidden'} flex flex-col`}>
          <div className="p-4 border-b border-gray-200 flex items-center">
            <button
              onClick={() => setSelectedMessage(null)}
              className="md:hidden mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-900">{selectedMessage.sender}</h3>
              <span className="text-xs text-gray-500">{new Date(selectedMessage.date).toLocaleString()}</span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>Dear Property Manager,</p>
              <p className="mt-2">This is a detailed version of the message regarding "{selectedMessage.subject}". In a real application, this would be the full content of the message sent by the tenant or other party.</p>
              <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
              <p className="mt-4">Best regards,<br />{selectedMessage.sender}</p>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Reply</h3>
            <textarea
              className="flex-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your reply here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="mt-3 flex justify-between items-center">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <FiPaperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!newMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex md:w-2/3 items-center justify-center bg-gray-50">
          <div className="text-center p-6">
            <div className="mx-auto h-16 w-16 text-gray-400 mb-4">📩</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Select a message</h3>
            <p className="text-sm text-gray-500">Choose a message from the list to view its contents</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;