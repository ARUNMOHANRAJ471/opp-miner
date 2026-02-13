import { useState } from 'react';
import { sendChatMessage } from '../api/client';
import styles from './DashboardAskAI.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function DashboardAskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await sendChatMessage(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response || 'Sorry, I could not generate a response.' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <h3 className={styles.chatTitle}>Ask AI</h3>
            <div className={styles.headerActions}>
              {messages.length > 0 && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setMessages([])}
                  aria-label="Clear chat history"
                  title="Clear chat"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
          {messages.length > 0 && (
            <div className={styles.messages}>
              {messages.map((msg, idx) => (
                <div key={idx} className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                  <div className={styles.messageContent}>{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className={styles.assistantMessage}>
                  <div className={styles.messageContent}>Thinking...</div>
                </div>
              )}
            </div>
          )}
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Ask about assumptions, ROI, risks..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
      {!isOpen && (
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          Ask AI
        </button>
      )}
    </div>
  );
}
