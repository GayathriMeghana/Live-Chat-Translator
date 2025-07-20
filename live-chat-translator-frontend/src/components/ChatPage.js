//////////import React, { useState, useEffect } from 'react';
//////////import SockJS from 'sockjs-client';
//////////import { Client } from '@stomp/stompjs';
//////////import './ChatPage.css';
//////////
//////////function ChatPage({ user }) {
//////////  const [messages, setMessages] = useState([]);
//////////  const [chatInput, setChatInput] = useState('');
//////////  const [stompClient, setStompClient] = useState(null);
//////////  const [connected, setConnected] = useState(false);
//////////
//////////
//////////  useEffect(() => {
//////////    // Create a SockJS instance pointing to your Spring Boot endpoint.
//////////    const socket = new SockJS('http://localhost:8000/ws');
//////////
//////////    // Create and configure the STOMP client.
//////////    const client = new Client({
//////////      // A function to provide the underlying WebSocket instance.
//////////      webSocketFactory: () => socket,
//////////      reconnectDelay: 5000,
//////////      onConnect: () => {
//////////        console.log('Connected to WebSocket');
//////////        setConnected(true);
//////////        // Subscribe to the topic for this user.
//////////        // This assumes that your backend sends messages to /topic/messages/{receiverId}
//////////        client.subscribe(`/topic/messages/${user.id}`, (message) => {
//////////          if (message.body) {
//////////            const msg = JSON.parse(message.body);
//////////            setMessages(prevMessages => [...prevMessages, msg]);
//////////          }
//////////        });
//////////      },
//////////      onStompError: (frame) => {
//////////        console.error('Broker reported error: ' + frame.headers['message']);
//////////        console.error('Additional details: ' + frame.body);
//////////      }
//////////    });
//////////    client.activate();
//////////    setStompClient(client);
//////////
//////////    // Clean up on component unmount.
//////////    return () => {
//////////      client.deactivate();
//////////    };
//////////  }, [user]);
//////////  const sendMessage = () => {
//////////    if (!stompClient || !stompClient.connected || chatInput.trim() === '') {
//////////      console.warn("❌ Not connected or message is empty.");
//////////      return;
//////////    }
////////////
////////////  const sendMessage = () => {
////////////    if (chatInput.trim() === '' || !stompClient) return;
//////////
//////////    // Construct your chat message.
//////////    // For demonstration, the receiverId is hard-coded (e.g., 2),
//////////    // but in a real app you would select a recipient.
//////////    const msg = {
//////////      senderId: user.id,
//////////      receiverId: 2,
//////////      message: chatInput
//////////    };
//////////
//////////    // Send the message to the backend endpoint "/app/chat"
//////////    stompClient.publish({
//////////      destination: '/app/chat',
//////////      body: JSON.stringify(msg)
//////////    });
//////////
//////////    // Optionally, add your own message to the chat history immediately.
//////////    setMessages(prev => [
//////////      ...prev,
//////////      {
//////////        id: Date.now(),
//////////        senderId: user.id,
//////////        receiverId: 2,
//////////        originalText: chatInput,
//////////        translatedText: chatInput  // Initially display the original; backend may update this via WS.
//////////      }
//////////    ]);
//////////
//////////    setChatInput('');
//////////  };
//////////
//////////  return (
//////////    <div className="chat-container">
//////////      <div className="chat-header">
//////////        <h3>Welcome, {user.username}!</h3>
//////////      </div>
//////////
//////////      <div className="chat-messages">
//////////        {messages.map((msg, index) => (
//////////          <div key={index} className={`chat-message ${msg.senderId === user.id ? 'me' : 'other'}`}>
//////////            <p>{msg.translatedText}</p>
//////////          </div>
//////////        ))}
//////////      </div>
//////////
//////////      <div className="chat-input">
//////////        <input
//////////          type="text"
//////////          placeholder="Type your message..."
//////////          value={chatInput}
//////////          onChange={(e) => setChatInput(e.target.value)}
//////////          autoComplete="off"
//////////        />
//////////        <button onClick={sendMessage}>Send</button>
//////////      </div>
//////////    </div>
//////////  );
//////////}
//////////
//////////export default ChatPage;
////////
////////
////////
////////
////////
////////import React, { useState, useEffect } from 'react';
////////import SockJS from 'sockjs-client';
////////import { Client } from '@stomp/stompjs';
////////import './ChatPage.css';
////////
////////function ChatPage({ user }) {
////////  const [messages, setMessages] = useState([]);
////////  const [chatInput, setChatInput] = useState('');
////////  const [stompClient, setStompClient] = useState(null);
////////  const [receiverId, setReceiverId] = useState('');
////////  const [availableUsers, setAvailableUsers] = useState([]);
////////
////////  useEffect(() => {
////////    // WebSocket setup
////////    const socket = new SockJS('http://localhost:8000/ws');
////////    const client = new Client({
////////      webSocketFactory: () => socket,
////////      reconnectDelay: 5000,
////////      onConnect: () => {
////////        console.log('✅ Connected to WebSocket');
////////        client.subscribe(`/topic/messages/${user.id}`, (message) => {
////////          if (message.body) {
////////            const msg = JSON.parse(message.body);
////////            setMessages(prev => [...prev, msg]);
////////          }
////////        });
////////      },
////////      onStompError: (frame) => {
////////        console.error('❌ STOMP error:', frame);
////////      }
////////    });
////////
////////    client.activate();
////////    setStompClient(client);
////////
////////    return () => {
////////      client.deactivate();
////////    };
////////  }, [user]);
////////
////////  // Fetch all users except the logged-in one
////////  useEffect(() => {
////////    const fetchUsers = async () => {
////////      try {
////////        const res = await fetch(`http://localhost:8000/api/user/others/${user.id}`);
////////        const data = await res.json();
////////        setAvailableUsers(data);
////////      } catch (error) {
////////        console.error("❌ Failed to load users:", error);
////////      }
////////    };
////////    fetchUsers();
////////  }, [user]);
////////
////////  const sendMessage = () => {
////////    if (!receiverId || chatInput.trim() === '' || !stompClient || !stompClient.connected) {
////////      alert('⚠️ Please select a receiver and enter a message.');
////////      return;
////////    }
////////
////////    const msg = {
////////      senderId: user.id,
////////      receiverId: parseInt(receiverId),
////////      message: chatInput
////////    };
////////
////////    stompClient.publish({
////////      destination: '/app/chat',
////////      body: JSON.stringify(msg)
////////    });
////////
////////    setMessages(prev => [
////////      ...prev,
////////      {
////////        id: Date.now(),
////////        senderId: user.id,
////////        receiverId: parseInt(receiverId),
////////        originalText: chatInput,
////////        translatedText: chatInput
////////      }
////////    ]);
////////
////////    setChatInput('');
////////  };
////////
////////  return (
////////    <div className="chat-container">
////////      <div className="chat-header">
////////        <h3>Welcome, {user.username}!</h3>
////////        <select value={receiverId} onChange={(e) => setReceiverId(e.target.value)} required>
////////          <option value="">Select Receiver</option>
////////          {availableUsers.map(u => (
////////            <option key={u.id} value={u.id}>
////////              {u.username}
////////            </option>
////////          ))}
////////        </select>
////////      </div>
////////
////////      <div className="chat-messages">
////////        {messages.map((msg, index) => (
////////          <div key={index} className={`chat-message ${msg.senderId === user.id ? 'me' : 'other'}`}>
////////            <p>{msg.translatedText}</p>
////////          </div>
////////        ))}
////////      </div>
////////
////////      <div className="chat-input">
////////        <input
////////          type="text"
////////          placeholder="Type your message..."
////////          value={chatInput}
////////          onChange={(e) => setChatInput(e.target.value)}
////////          autoComplete="off"
////////        />
////////        <button onClick={sendMessage}>Send</button>
////////      </div>
////////    </div>
////////  );
////////}
////////
////////export default ChatPage;
//////
//////
//////
//////
//////
//////
//////
//////
//////import React, { useState, useEffect } from 'react';
//////import SockJS from 'sockjs-client';
//////import { Client } from '@stomp/stompjs';
//////import './ChatPage.css';
//////
//////function ChatPage({ user }) {
//////  const [messages, setMessages] = useState([]);
//////  const [chatInput, setChatInput] = useState('');
//////  const [stompClient, setStompClient] = useState(null);
//////  const [receiverId, setReceiverId] = useState('');
//////  const [availableUsers, setAvailableUsers] = useState([]);
//////
//////  useEffect(() => {
//////    const socket = new SockJS('http://localhost:8000/ws');
//////    const client = new Client({
//////      webSocketFactory: () => socket,
//////      reconnectDelay: 5000,
//////      onConnect: () => {
//////        console.log('✅ Connected to WebSocket');
//////        client.subscribe(`/topic/messages/${user.id}`, (message) => {
//////          if (message.body) {
//////            const msg = JSON.parse(message.body);
//////            setMessages(prev => [...prev, msg]);
//////          }
//////        });
//////      },
//////      onStompError: (frame) => {
//////        console.error('❌ STOMP error:', frame);
//////      }
//////    });
//////
//////    client.activate();
//////    setStompClient(client);
//////
//////    return () => {
//////      client.deactivate();
//////    };
//////  }, [user]);
//////
//////  useEffect(() => {
//////    const fetchUsers = async () => {
//////      try {
//////        const res = await fetch(`http://localhost:8000/api/user/others/${user.id}`);
//////        const data = await res.json();
//////        setAvailableUsers(data);
//////      } catch (error) {
//////        console.error("❌ Failed to load users:", error);
//////      }
//////    };
//////    fetchUsers();
//////  }, [user]);
//////
//////  const sendMessage = () => {
//////    if (!receiverId || chatInput.trim() === '' || !stompClient || !stompClient.connected) {
//////      alert('⚠️ Please select a receiver and enter a message.');
//////      return;
//////    }
//////
//////
//////  // ✅ Log selected values before sending the message
//////  console.log("📤 Message details", {
//////    receiverId,
//////    chatInput,
//////    connected: stompClient?.connected
//////  });
//////
//////
//////    const msg = {
//////      senderId: user.id,
//////      receiverId: parseInt(receiverId),
//////      message: chatInput
//////    };
//////
//////    stompClient.publish({
//////      destination: '/app/chat',
//////      body: JSON.stringify(msg)
//////    });
//////
//////    setMessages(prev => [
//////      ...prev,
//////      {
//////        id: Date.now(),
//////        senderId: user.id,
//////        receiverId: parseInt(receiverId),
//////        originalText: chatInput,
//////        translatedText: chatInput
//////      }
//////    ]);
//////
//////    setChatInput('');
//////  };
//////
//////  return (
//////    <div className="chat-container">
//////      <div className="chat-header">
//////        <h3>Welcome, {user.username}!</h3>
//////          <select
//////            value={receiverId}
//////            onChange={(e) => {
//////              setReceiverId(e.target.value);
//////              console.log("Selected Receiver ID:", e.target.value); // ✅ Log here
//////            }}
//////            required
//////          >
//////            <option value="">Select Receiver</option>
//////            {availableUsers.map(u => (
//////              <option key={u.id} value={u.id}>
//////                {u.username}
//////              </option>
//////            ))}
//////          </select>
//////        {/* <select value={receiverId} onChange={(e) => setReceiverId(e.target.value)} required>
//////          <option value="">Select Receiver</option>
//////          {availableUsers.map(u => (
//////            <option key={u.id} value={u.id}>
//////              {u.username}
//////            </option>
//////          ))}
//////        </select>*/}
//////      </div>
//////
//////      <div className="chat-messages">
//////        {messages.map((msg, index) => (
//////          <div key={index} className={`chat-message ${msg.senderId === user.id ? 'me' : 'other'}`}>
//////            <p>{msg.translatedText}</p>
//////          </div>
//////        ))}
//////      </div>
//////
//////      <div className="chat-input">
//////        <input
//////          type="text"
//////          placeholder="Type your message..."
//////          value={chatInput}
//////          onChange={(e) => setChatInput(e.target.value)}
//////          autoComplete="off"
//////        />
//////        <button onClick={sendMessage}>Send</button>
//////      </div>
//////    </div>
//////  );
//////}
//////
//////export default ChatPage;
////
////
////
////import React, { useState, useEffect } from 'react';
////import SockJS from 'sockjs-client';
////import { Client } from '@stomp/stompjs';
////import './ChatPage.css';
////
////function ChatPage({ user }) {
////  const [messages, setMessages] = useState([]);
////  const [chatInput, setChatInput] = useState('');
////  const [stompClient, setStompClient] = useState(null);
////  const [receiverId, setReceiverId] = useState('');
////  const [availableUsers, setAvailableUsers] = useState([]);
////
////  // WebSocket connection
////  useEffect(() => {
////    const socket = new SockJS('http://localhost:8000/ws');
////    const client = new Client({
////      webSocketFactory: () => socket,
////      reconnectDelay: 5000,
////      onConnect: () => {
////        console.log('✅ Connected to WebSocket');
////        client.subscribe(`/topic/messages/${user.id}`, (message) => {
////          if (message.body) {
////            const msg = JSON.parse(message.body);
////            setMessages(prev => [...prev, msg]);
////          }
////        });
////      },
////      onStompError: (frame) => {
////        console.error('❌ STOMP error:', frame);
////      }
////    });
////
////    client.activate();
////    setStompClient(client);
////
////    return () => {
////      client.deactivate();
////    };
////  }, [user]);
////
////  // Load other users
////  useEffect(() => {
////    const fetchUsers = async () => {
////      try {
////        const res = await fetch(`http://localhost:8000/api/user/others/${user.id}`);
////        const data = await res.json();
////        setAvailableUsers(data);
////      } catch (error) {
////        console.error("❌ Failed to load users:", error);
////      }
////    };
////    fetchUsers();
////  }, [user]);
////
////  // ✅ Fetch chat history when receiver is selected
////  const fetchChatHistory = async (senderId, receiverId) => {
////    try {
////      const res = await fetch(
////        `http://localhost:8000/api/message/history?senderId=${senderId}&receiverId=${receiverId}`
////      );
////      const data = await res.json();
////      setMessages(data);
////    } catch (error) {
////      console.error("❌ Error fetching chat history:", error);
////    }
////  };
////
////  const sendMessage = () => {
////    if (!receiverId || chatInput.trim() === '' || !stompClient || !stompClient.connected) {
////      alert('⚠️ Please select a receiver and enter a message.');
////      return;
////    }
////
////    const msg = {
////      senderId: user.id,
////      receiverId: parseInt(receiverId),
////      message: chatInput
////    };
////
////    stompClient.publish({
////      destination: '/app/chat',
////      body: JSON.stringify(msg)
////    });
////
////    setMessages(prev => [
////      ...prev,
////      {
////        id: Date.now(),
////        senderId: user.id,
////        receiverId: parseInt(receiverId),
////        originalText: chatInput,
////        translatedText: chatInput
////      }
////    ]);
////
////    setChatInput('');
////  };
////
////  return (
////    <div className="chat-container">
////      <div className="chat-header">
////        <h3>Welcome, {user.username}!</h3>
////        <select
////          value={receiverId}
////          onChange={(e) => {
////            const selectedId = e.target.value;
////            setReceiverId(selectedId);
////            console.log("Selected Receiver ID:", selectedId);
////
////            if (selectedId) {
////              fetchChatHistory(user.id, selectedId); // ✅ Load history here
////            }
////          }}
////          required
////        >
////          <option value="">Select Receiver</option>
////          {availableUsers.map(u => (
////            <option key={u.id} value={u.id}>
////              {u.username}
////            </option>
////          ))}
////        </select>
////      </div>
////
////      <div className="chat-messages">
////        {messages.map((msg, index) => (
////          <div key={index} className={`chat-message ${msg.senderId === user.id ? 'me' : 'other'}`}>
////            <p title={msg.originalText}>{msg.translatedText}</p>
////          </div>
////        ))}
////      </div>
////
////      <div className="chat-input">
////        <input
////          type="text"
////          placeholder="Type your message..."
////          value={chatInput}
////          onChange={(e) => setChatInput(e.target.value)}
////          autoComplete="off"
////        />
////        <button onClick={sendMessage}>Send</button>
////      </div>
////    </div>
////  );
////}
////
////export default ChatPage;
//
//
//
//
//
//
//import React, { useState, useEffect } from 'react';
//import SockJS from 'sockjs-client';
//import { Client } from '@stomp/stompjs';
//import './ChatPage.css';
//
//function ChatPage({ user }) {
//  const [messages, setMessages] = useState([]);
//  const [chatInput, setChatInput] = useState('');
//  const [stompClient, setStompClient] = useState(null);
//  const [receiverId, setReceiverId] = useState('');
//  const [availableUsers, setAvailableUsers] = useState([]);
//
//  // WebSocket connection
//  useEffect(() => {
//    const socket = new SockJS('http://localhost:8000/ws');
//    const client = new Client({
//      webSocketFactory: () => socket,
//      reconnectDelay: 5000,
//      onConnect: () => {
//        console.log('✅ Connected to WebSocket');
//        client.subscribe(`/topic/messages/${user.id}`, (message) => {
//          if (message.body) {
//            const msg = JSON.parse(message.body);
//            setMessages(prev => [...prev, msg]);
//          }
//        });
//      },
//      onStompError: (frame) => {
//        console.error('❌ STOMP error:', frame);
//      }
//    });
//
//    client.activate();
//    setStompClient(client);
//
//    return () => {
//      client.deactivate();
//    };
//  }, [user]);
//
//  // Load other users
//  useEffect(() => {
//    const fetchUsers = async () => {
//      try {
//        const res = await fetch(`http://localhost:8000/api/user/others/${user.id}`);
//        const data = await res.json();
//        setAvailableUsers(data);
//      } catch (error) {
//        console.error("❌ Failed to load users:", error);
//      }
//    };
//    fetchUsers();
//  }, [user]);
//
//  // ✅ Fetch chat history when receiver is selected
//  const fetchChatHistory = async (senderId, receiverId) => {
//    try {
//      const res = await fetch(
//        `http://localhost:8000/api/message/history?senderId=${senderId}&receiverId=${receiverId}`
//      );
//      const data = await res.json();
//      setMessages(data);
//    } catch (error) {
//      console.error("❌ Error fetching chat history:", error);
//    }
//  };
//
//  const sendMessage = () => {
//    if (!receiverId || chatInput.trim() === '' || !stompClient || !stompClient.connected) {
//      alert('⚠️ Please select a receiver and enter a message.');
//      return;
//    }
//
//    const msg = {
//      senderId: user.id,
//      receiverId: parseInt(receiverId),
//      message: chatInput
//    };
//
//    stompClient.publish({
//      destination: '/app/chat',
//      body: JSON.stringify(msg)
//    });
//
//    setMessages(prev => [
//      ...prev,
//      {
//        id: Date.now(),
//        senderId: user.id,
//        receiverId: parseInt(receiverId),
//        originalText: chatInput,
//        translatedText: chatInput,
//        timestamp: new Date().toISOString()
//      }
//    ]);
//
//    setChatInput('');
//  };
//
//  return (
//    <div className="chat-container">
//      <div className="chat-header">
//        <h3>Welcome, {user.username}!</h3>
//        <select
//          value={receiverId}
//          onChange={(e) => {
//            const selectedId = e.target.value;
//            setReceiverId(selectedId);
//            console.log("Selected Receiver ID:", selectedId);
//
//            if (selectedId) {
//              fetchChatHistory(user.id, selectedId); // ✅ Load history here
//            }
//          }}
//          required
//        >
//          <option value="">Select Receiver</option>
//          {availableUsers.map(u => (
//            <option key={u.id} value={u.id}>
//              {u.username}
//            </option>
//          ))}
//        </select>
//      </div>
//
//      <div className="chat-messages">
//        {messages.map((msg, index) => {
//          const isMe = msg.senderId === user.id;
//          const time = new Date(msg.timestamp).toLocaleTimeString([], {
//            hour: '2-digit',
//            minute: '2-digit',
//          });
//
//          return (
//            <div key={index} className={`chat-message ${isMe ? 'me' : 'other'}`}>
//              <div className="message-meta">
//                <strong>{isMe ? 'You' : 'Other'}</strong> • <span className="time">{time}</span>
//              </div>
//              <p title={msg.originalText}>{msg.translatedText}</p>
//            </div>
//          );
//        })}
//      </div>
//
//      <div className="chat-input">
//        <input
//          type="text"
//          placeholder="Type your message..."
//          value={chatInput}
//          onChange={(e) => setChatInput(e.target.value)}
//          autoComplete="off"
//        />
//        <button onClick={sendMessage}>Send</button>
//      </div>
//    </div>
//  );
//}
//
//export default ChatPage;
//
//
//import React, { useState, useEffect, useRef } from 'react';
//import SockJS from 'sockjs-client';
//import { Client } from '@stomp/stompjs';
//import './ChatPage.css';
//
//function ChatPage({ user }) {
//  const [messages, setMessages] = useState([]);
//  const [chatInput, setChatInput] = useState('');
//  const [stompClient, setStompClient] = useState(null);
//  const [receiverId, setReceiverId] = useState('');
//  const [availableUsers, setAvailableUsers] = useState([]);
//  const [typingStatus, setTypingStatus] = useState('');
//
//  const typingTimeoutRef = useRef(null);
//
//  // WebSocket setup
//  useEffect(() => {
//    const socket = new SockJS('http://localhost:8000/ws');
//    const client = new Client({
//      webSocketFactory: () => socket,
//      reconnectDelay: 5000,
//      onConnect: () => {
//        console.log('✅ Connected to WebSocket');
//
//        // Subscribe to message topic
//        client.subscribe(`/topic/messages/${user.id}`, (message) => {
//          if (message.body) {
//            const msg = JSON.parse(message.body);
//            setMessages(prev => [...prev, msg]);
//          }
//        });
//
//        // Subscribe to typing topic
//        client.subscribe(`/topic/typing`, (message) => {
//          const data = JSON.parse(message.body);
//          if (data.receiverId === user.id && data.senderId === parseInt(receiverId)) {
//            setTypingStatus(data.typing ? 'Typing...' : '');
//          }
//        });
//      },
//      onStompError: (frame) => {
//        console.error('❌ STOMP error:', frame);
//      }
//    });
//
//    client.activate();
//    setStompClient(client);
//
//    return () => {
//      client.deactivate();
//    };
//  }, [user, receiverId]);
//
//  // Load other users
//  useEffect(() => {
//    const fetchUsers = async () => {
//      try {
//        const res = await fetch(`http://localhost:8000/api/user/others/${user.id}`);
//        const data = await res.json();
//        setAvailableUsers(data);
//      } catch (error) {
//        console.error("❌ Failed to load users:", error);
//      }
//    };
//    fetchUsers();
//  }, [user]);
//
//  // Fetch chat history
//  const fetchChatHistory = async (senderId, receiverId) => {
//    try {
//      const res = await fetch(
//        `http://localhost:8000/api/message/history?senderId=${senderId}&receiverId=${receiverId}`
//      );
//      const data = await res.json();
//      setMessages(data);
//    } catch (error) {
//      console.error("❌ Error fetching chat history:", error);
//    }
//  };
//
//  const sendMessage = () => {
//    if (!receiverId || chatInput.trim() === '' || !stompClient?.connected) {
//      alert('⚠️ Please select a receiver and enter a message.');
//      return;
//    }
//
//    const msg = {
//      senderId: user.id,
//      receiverId: parseInt(receiverId),
//      message: chatInput
//    };
//
//    stompClient.publish({
//      destination: '/app/chat',
//      body: JSON.stringify(msg)
//    });
//
//    setMessages(prev => [
//      ...prev,
//      {
//        id: Date.now(),
//        senderId: user.id,
//        receiverId: parseInt(receiverId),
//        originalText: chatInput,
//        translatedText: chatInput,
//        timestamp: new Date().toISOString()
//      }
//    ]);
//
//    setChatInput('');
//  };
//
//  // Handle typing event
//  const sendTypingStatus = () => {
//    if (!receiverId || !stompClient?.connected) return;
//
//    stompClient.publish({
//      destination: '/app/typing',
//      body: JSON.stringify({
//        senderId: user.id,
//        receiverId: parseInt(receiverId),
//        typing: true
//      })
//    });
//
//    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//
//    typingTimeoutRef.current = setTimeout(() => {
//      stompClient.publish({
//        destination: '/app/typing',
//        body: JSON.stringify({
//          senderId: user.id,
//          receiverId: parseInt(receiverId),
//          typing: false
//        })
//      });
//    }, 2000); // 2 seconds after stop
//  };
//
//  return (
//    <div className="chat-container">
//      <div className="chat-header">
//        <h3>Welcome, {user.username}!</h3>
//        <select
//          value={receiverId}
//          onChange={(e) => {
//            const selectedId = e.target.value;
//            setReceiverId(selectedId);
//            console.log("Selected Receiver ID:", selectedId);
//            if (selectedId) {
//              fetchChatHistory(user.id, selectedId);
//              setTypingStatus(''); // reset indicator
//            }
//          }}
//          required
//        >
//          <option value="">Select Receiver</option>
//          {availableUsers.map(u => (
//            <option key={u.id} value={u.id}>
//              {u.username}
//            </option>
//          ))}
//        </select>
//        {typingStatus && <p className="typing-indicator">{typingStatus}</p>}
//      </div>
//
//      <div className="chat-messages">
//        {messages.map((msg, index) => (
//          <div
//            key={index}
//            className={`chat-message ${msg.senderId === user.id ? 'me' : 'other'}`}
//          >
//            <p title={msg.originalText}>{msg.translatedText}</p>
//            <span className="timestamp">
//              {new Date(msg.timestamp).toLocaleTimeString()}
//            </span>
//          </div>
//        ))}
//      </div>
//
//      <div className="chat-input">
//        <input
//          type="text"
//          placeholder="Type your message..."
//          value={chatInput}
//          onChange={(e) => {
//            setChatInput(e.target.value);
//            sendTypingStatus();
//          }}
//          autoComplete="off"
//        />
//        <button onClick={sendMessage}>Send</button>
//      </div>
//    </div>
//  );
//}
//
//export default ChatPage;






// src/components/ChatPage.js
//
//import React, { useState, useEffect, useRef } from 'react';
//import SockJS from 'sockjs-client';
//import { Client } from '@stomp/stompjs';
//import './ChatPage.css';
//import { getOtherUsers } from '../services/api'; // ✅ Import
//
//import {
//  getChatHistory,
//  sendMessage as sendMessageAPI,
//} from '../services/api';
//
//function ChatPage({ user, token }) {
//  const [messages, setMessages] = useState([]);
//  const [chatInput, setChatInput] = useState('');
//  const [stompClient, setStompClient] = useState(null);
//  const [receiverId, setReceiverId] = useState('');
//  const [availableUsers, setAvailableUsers] = useState([]);
//  const [typingStatus, setTypingStatus] = useState('');
//
//  const typingTimeoutRef = useRef(null);
//
//  // WebSocket Setup
//  useEffect(() => {
//    const socket = new SockJS('http://localhost:8000/ws');
//    const client = new Client({
//      webSocketFactory: () => socket,
//      reconnectDelay: 5000,
//      onConnect: () => {
//        console.log('✅ Connected to WebSocket');
//
//        client.subscribe(`/topic/messages/${user.id}`, (message) => {
//          if (message.body) {
//            const msg = JSON.parse(message.body);
//            setMessages((prev) => [...prev, msg]);
//          }
//        });
//
//        client.subscribe(`/topic/typing`, (message) => {
//          const data = JSON.parse(message.body);
//          if (data.receiverId === user.id && data.senderId === parseInt(receiverId)) {
//            setTypingStatus(data.typing ? 'Typing...' : '');
//          }
//        });
//      },
//      onStompError: (frame) => {
//        console.error('❌ STOMP error:', frame);
//      },
//    });
//
//    client.activate();
//    setStompClient(client);
//
//    return () => client.deactivate();
//  }, [user, receiverId]);
//
//  // Fetch Users
//
//  useEffect(() => {
//    const fetchUsers = async () => {
//      try {
////        const token = localStorage.getItem("token");
//        const res = await getOtherUsers();  // ✅ Use the imported function
//        setAvailableUsers(res.data);
//      } catch (error) {
//        console.error("❌ Error fetching users:", error);
//      }
//    };
//    fetchUsers();
//  }, [user]);
//
//
//
//  // Fetch History
//  const loadChatHistory = async () => {
//    try {
//      if (receiverId) {
//        const res = await getChatHistory(user.id, receiverId, token);
//        setMessages(res.data);
//      }
//    } catch (err) {
//      console.error('❌ Failed to fetch history:', err);
//    }
//  };
//
//  useEffect(() => {
//    if (receiverId) {
//      loadChatHistory();
//      setTypingStatus('');
//    }
//  }, [receiverId]);
//
//  // Send message
//  const sendMessage = async () => {
//    const parsedReceiverId = parseInt(receiverId);
//
//    if (!chatInput.trim() || isNaN(parsedReceiverId) || !stompClient?.connected) {
//      alert('⚠️ Select a receiver and type a message.');
//      return;
//    }
//
//    const msg = {
//      senderId: user.id,
//      receiverId: parsedReceiverId,
//      message: chatInput,
//    };
//
//    // ✅ Publish the message to backend WebSocket
//    stompClient.publish({
//      destination: '/app/chat',
//      body: JSON.stringify(msg),
//    });
//
//    // ✅ Add message to UI immediately for sender (with untranslated version)
//    setMessages((prev) => [
//      ...prev,
//      {
//        senderId: user.id,
//        receiverId: parsedReceiverId,
//        originalText: chatInput,
//        translatedText: chatInput, // You can later update this if you want it to show receiver's language
//        timestamp: new Date().toISOString(),
//      },
//    ]);
//
//    setChatInput('');
//  };
//
////  const sendMessage = async () => {
////    const parsedReceiverId = parseInt(receiverId);
////    console.log("receiverId:", receiverId);                  // should be "2" or some number as string
////    console.log("parsedReceiverId:", parseInt(receiverId));  // should be a number like 2
////    console.log("chatInput:", chatInput);                    // should be "hii"
////    console.log("connected:", stompClient?.connected);       // should be true
////    if (!chatInput.trim() || isNaN(parsedReceiverId) || !stompClient?.connected) {
////      alert('⚠️ Select a receiver and type a message.');
////      return;
////    }
////
////    const msg = {
////      senderId: user.id,
////      receiverId: parsedReceiverId,
////      message: chatInput,
////    };
////
////    stompClient.publish({
////      destination: '/app/chat',
////      body: JSON.stringify(msg),
////    });
////
////    setChatInput('');
////  };
//
//
//  // Typing status
//  const sendTypingStatus = () => {
//    if (!receiverId || !stompClient?.connected) return;
//
//    stompClient.publish({
//      destination: '/app/typing',
//      body: JSON.stringify({
//        senderId: user.id,
//        receiverId: parseInt(receiverId),
//        typing: true,
//      }),
//    });
//
//    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//
//    typingTimeoutRef.current = setTimeout(() => {
//      stompClient.publish({
//        destination: '/app/typing',
//        body: JSON.stringify({
//          senderId: user.id,
//          receiverId: parseInt(receiverId),
//          typing: false,
//        }),
//      });
//    }, 2000);
//  };
//
//  return (
//    <div className="chat-container">
//      <div className="chat-header">
//        <h3>Welcome, {user.username}!</h3>
//        <select
//          value={receiverId}
//          onChange={(e) => setReceiverId(e.target.value)}
//          required
//        >
//          <option value="">Select Receiver</option>
//          {availableUsers.map((u) => (
//            <option key={u.id} value={u.id}>
//              {u.username}
//            </option>
//          ))}
//        </select>
//        {typingStatus && <p className="typing-indicator">{typingStatus}</p>}
//      </div>
//
//      <div className="chat-messages">
//        {messages.map((msg, index) => (
//          <div
//            key={index}
//            className={`chat-message ${msg.senderId === user.id ? 'me' : 'other'}`}
//          >
//            <p title={msg.originalText}>{msg.translatedText}</p>
//            <span className="timestamp">
//              {new Date(msg.timestamp).toLocaleTimeString()}
//            </span>
//          </div>
//        ))}
//      </div>
//
//      <div className="chat-input">
//        <input
//          type="text"
//          value={chatInput}
//          placeholder="Type message..."
//          onChange={(e) => {
//            setChatInput(e.target.value);
//            sendTypingStatus();
//          }}
//          disabled={!receiverId}
//        />
//        <button onClick={sendMessage}>Send</button>
//      </div>
//    </div>
//  );
//}
//
//export default ChatPage;







// src/components/ChatPage.js

import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './ChatPage.css';
import { getOtherUsers, getChatHistory } from '../services/api';
function ChatPage({ user, token }) {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [receiverId, setReceiverId] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');

  const [editMsg, setEditMsg] = useState(null);
  const [editText, setEditText] = useState('');

  const typingTimeoutRef = useRef(null);

  // WebSocket Setup
  useEffect(() => {
    const socket = new SockJS('http://localhost:8000/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ Connected to WebSocket');

        client.subscribe(`/topic/messages/${user.id}`, (message) => {
          if (message.body) {
            const msg = JSON.parse(message.body);
            setMessages((prev) => [...prev, msg]);
          }
        });

        client.subscribe(`/topic/typing`, (message) => {
          const data = JSON.parse(message.body);
          if (data.receiverId === user.id && data.senderId === parseInt(receiverId)) {
            setTypingStatus(data.typing ? 'Typing...' : '');
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame);
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [user, receiverId]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getOtherUsers();
        setAvailableUsers(res.data);
      } catch (error) {
        console.error('❌ Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [user]);

  // Fetch History
  const loadChatHistory = async () => {
    try {
      if (receiverId) {
        const res = await getChatHistory(user.id, receiverId, token);
        setMessages(res.data);
      }
    } catch (err) {
      console.error('❌ Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    if (receiverId) {
      loadChatHistory();
      setTypingStatus('');
    }
  }, [receiverId]);

  // Send message

    const sendMessage = () => {
      const parsedReceiverId = parseInt(receiverId);

      if (!chatInput.trim() || isNaN(parsedReceiverId) || !stompClient?.connected) {
        alert('⚠️ Select a receiver and type a message.');
        return;
      }

      const msg = {
        senderId: user.id,
        receiverId: parsedReceiverId,
        message: chatInput,
      };

      // ✅ Just send to backend — don't push manually to state
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(msg),
      });

      setChatInput('');
    };


//    setMessages((prev) => [
//      ...prev,
//      {
//        id:Date.now(),
//        senderId: user.id,
//        receiverId: parsedReceiverId,
//        originalText: chatInput,
//        translatedText: chatInput,
//        timestamp: new Date().toISOString(),
//      },
//    ]);
//
//    setChatInput('');
//  };


  // Typing status
  const sendTypingStatus = () => {
    if (!receiverId || !stompClient?.connected) return;

    stompClient.publish({
      destination: '/app/typing',
      body: JSON.stringify({
        senderId: user.id,
        receiverId: parseInt(receiverId),
        typing: true,
      }),
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      stompClient.publish({
        destination: '/app/typing',
        body: JSON.stringify({
          senderId: user.id,
          receiverId: parseInt(receiverId),
          typing: false,
        }),
      });
    }, 2000);
  };

  // Edit Message: open editor
  const handleEdit = (msg) => {
    setEditMsg(msg);
    setEditText(msg.originalText);
  };

  // Submit edited message to backend
  const submitEdit = async () => {
    if (!editMsg) return;

    try {
      console.log("Submitting edit for ID:", editMsg.id);  // Add this for debugging
      if (!editMsg.id) {
        alert("❌ Cannot edit: message ID is missing");
        return;
      }

      const res = await fetch(`http://localhost:8000/api/message/edit/${editMsg.id}`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include only if JWT used
        },
        body: JSON.stringify({ originalText: editText }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
        setEditMsg(null);
        setEditText('');
      } else {
        const error = await res.text();
        console.error('❌ Edit failed:', error);
        alert('❌ Error: ' + (error || 'Unknown Error'));
      }

    } catch (err) {
      console.error(err);
      alert('❌ Failed to update message.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Welcome, {user.username}!</h3>
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
        >
          <option value="">Select Receiver</option>
          {availableUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
        {typingStatus && <p className="typing-indicator" style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic' }}>{typingStatus}</p>}
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.senderId === user.id ? 'me' : 'other'}`}
          >
            <p title={msg.originalText}>{msg.translatedText}</p>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            {msg.senderId === user.id && (
              <button onClick={() => handleEdit(msg)} style={{ marginLeft: '10px', fontSize: '12px' }}>
                ✏️ Edit
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Edit box UI */}
      {editMsg && (
        <div style={{ backgroundColor: '#eef', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          <h4>Edit Message</h4>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ width: '80%' }}
          />
          <button onClick={submitEdit} style={{ marginLeft: '10px' }}>Update</button>
          <button onClick={() => setEditMsg(null)} style={{ marginLeft: '5px' }}>Cancel</button>
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          value={chatInput}
          placeholder="Type message..."
          onChange={(e) => {
            setChatInput(e.target.value);
            sendTypingStatus();
          }}
          disabled={!receiverId}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
export default ChatPage;








