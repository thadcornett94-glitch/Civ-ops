import { useState, useEffect } from 'react';

// Custom hook for chat state management
const useChatState = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Function to send a message
    const sendMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setInputValue('');
    };

    return {
        messages,
        inputValue,
        setInputValue,
        sendMessage,
    };
};

export default useChatState;
