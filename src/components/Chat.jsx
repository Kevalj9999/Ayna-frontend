import React, { useState, useEffect, useCallback } from 'react';
import { addMessage } from './idb';
import {jwtDecode} from 'jwt-decode';
import { io } from 'socket.io-client';
import './Chat.css';

const Chat = ({ jwtToken, logout }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');

  const fetchUsername = useCallback(async (id) => {
    try {
      const response = await fetch(`https://precious-flower-79d4f83922.strapiapp.com/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUsername(userData.username);
      } else {
        throw new Error('Failed to fetch username');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  }, [jwtToken]);

  useEffect(() => {
    if (jwtToken) {
      try {
        const decodedToken = jwtDecode(jwtToken);
        const { id } = decodedToken;
        setUserId(id);

        // Fetch username based on user ID
        fetchUsername(id);
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
      }
    }

    const newSocket = io('https://precious-flower-79d4f83922.strapiapp.com', {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${jwtToken}`
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      setSocket(newSocket);
    });

    newSocket.on('message', async (event) => {
      try {
        const receivedMessage = JSON.parse(event);
        await handleWebSocketMessage(receivedMessage);
      } catch (error) {
        console.error('Failed to parse incoming message:', error);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    return () => {
      newSocket.close();
    };
  }, [jwtToken, fetchUsername]);

  const handleWebSocketMessage = async (message) => {
    console.log('Received message from server', message);
    await addMessage(message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (socket && message.trim()) {
      const newMessage = {
        userId,
        text: message,
        timestamp: new Date().toISOString(),
      };

      await addMessage(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      socket.emit('message', JSON.stringify(newMessage));
      setMessage('');

      try {
        const response = await fetch('https://precious-flower-79d4f83922.strapiapp.com/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            data: {
              content: message,
              users_permissions_user: userId,
              timestamp: new Date().toISOString(),
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to save message to Strapi: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Failed to save message to Strapi:', error);
      }
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (username) {
        try {
          const response = await fetch(`https://precious-flower-79d4f83922.strapiapp.com/api/findMessagesByUsername/${username}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const { data } = await response.json();
            console.log('Fetched messages:', data);

            // Map fetched messages to the required format and duplicate each message
            const fetchedMessages = data.flatMap((item) => [
              { text: item.content },
              { text: item.content },
            ]);

            // Set messages state with fetched messages
            setMessages(fetchedMessages);
          } else {
            throw new Error('Failed to fetch messages from Strapi');
          }
        } catch (error) {
          console.error('Error fetching messages from Strapi:', error);
        }
      }
    };

    fetchMessages();
  }, [username, jwtToken, fetchUsername]);

  return (
    <div className="chat-app">
      <div className="sidebar">
        <h2>{username}</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat Room</h2>
        </div>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${index % 2 === 1 ? 'received' : 'sent'}`}
            >
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
        </div>
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
