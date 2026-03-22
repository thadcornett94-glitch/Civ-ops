import { useEffect, useState } from 'react';

const useVoiceInput = () => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const { transcript: result } = event.results[event.results.length - 1];
            setTranscript(result);
        };

        recognition.onend = () => {
            if (isListening) {
                recognition.start(); // Restart recognition if listening is true.
            }
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening]);

    return { transcript, isListening, setIsListening };
};

export default useVoiceInput;