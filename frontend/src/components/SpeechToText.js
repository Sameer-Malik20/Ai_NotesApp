import { useEffect, useRef, useState } from "react";

const SpeechToText = ({ onTextResult }) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      onTextResult(transcript);
    };

    recognition.onend = () => {
      setListening(false); // auto-stop on silence
    };

    recognitionRef.current = recognition;

    // Click outside to stop
    const handleClick = () => {
      if (recognitionRef.current && listening) {
        recognitionRef.current.stop();
        setListening(false);
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      recognition.stop();
    };
  }, []);

  const toggleListening = (e) => {
    e.stopPropagation(); // mic par click karne se screen click wala stop na ho
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setListening(!listening);
  };

  return (
    <div
      onClick={toggleListening}
      className="cursor-pointer text-blue-600 my-2"
    >
      🎤 {listening ? "Listening... (Click to stop)" : "Click mic to speak"}
    </div>
  );
};

export default SpeechToText;
