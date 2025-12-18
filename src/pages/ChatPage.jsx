import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";

const ChatPage = () => {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  let user = JSON.parse(rawUser);
  const [convos, setConvos] = React.useState(null);
  const [activeChat, setActiveChat] = React.useState();
  const [chatText, setChatText] = React.useState(null);
  const [arrivalMessage, setArrivalMessage] = React.useState(null);

  const socket = React.useRef(null);
  const scrollRef = React.useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SOCKET_URL);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        senderID: data.senderID,
        text: data.text,
        createdAt: Date.now(),
      });
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeChat?.userID) return;

    socket.current.emit("addUser", activeChat.userID);
  }, [activeChat?.userID]);

  useEffect(() => {
    const handleUsers = (users) => {};

    socket.current.on("getUsers", handleUsers);

    return () => {
      socket.current.off("getUsers", handleUsers);
    };
  }, []);

  useEffect(() => {
    if (!arrivalMessage) return;

    setActiveChat((prev) => {
      if (!prev) return prev;

      const isMember = prev.conversation.members.some(
        (m) => m._id === arrivalMessage.senderID
      );

      if (!isMember) return prev;

      return {
        ...prev,
        messages: [...prev.messages, arrivalMessage],
      };
    });
    setConvos((prev) =>
      prev
        .map((c) =>
          c._id === activeChat.chatID
            ? {
                ...c,
                lastMessage: arrivalMessage.text,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  }, [arrivalMessage]);

  const timeAgo = (isoTime) => {
    const diff = Date.now() - new Date(isoTime).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const fetchChat = async (conversationID) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/message/chat-messages/${conversationID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setActiveChat({ ...data, chatID: conversationID });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const convoDisplay = convos?.map((chat) => {
    const username =
      chat.members[0].username != user.username
        ? chat.members[0].username
        : chat.members[1].username;
    return (
      <div
        className={`convo-card ${
          activeChat?.chatID === chat._id ? "active" : ""
        }`}
        key={chat._id}
        onClick={() => fetchChat(chat._id)}
      >
        <h3>{username}</h3>
        <div>
          <h5>
            {chat.lastMessage ? (
              chat.lastMessage.length > 50 ? (
                `${chat.lastMessage.slice(0, 50)}...`
              ) : (
                chat.lastMessage
              )
            ) : (
              <em>shoot a "Hi"</em>
            )}
          </h5>
          <h5>{timeAgo(chat.updatedAt)}</h5>
        </div>
      </div>
    );
  });

  const fetchMyChats = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/conversation/my-chats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setConvos(data.myConversations);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  React.useEffect(() => {
    fetchMyChats();
  }, []);

  const sendNewMessage = async (chatID) => {
    const senderID = activeChat?.userID;
    const recieverID = activeChat?.recieverName._id;

    const newMessage = {
      senderID,
      text: chatText,
      createdAt: Date.now(),
    };

    setActiveChat((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    setConvos((prev) =>
      prev
        .map((c) =>
          c._id === chatID
            ? {
                ...c,
                lastMessage: chatText,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );

    socket.current.emit("sendMessage", {
      senderID,
      recieverID,
      text: chatText,
    });

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/v1/message/send`;
      const res = await axios.post(
        url,
        {
          conversationID: chatID,
          messageText: chatText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatText(null);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const activeChatDisplay = activeChat ? (
    <div className="chat-window">
      <div className="chat-header">
        <h3 style={{ textTransform: "capitalize" }}>
          {activeChat.recieverName.username}
        </h3>
      </div>

      <div className="chat-messages">
        {activeChat.messages?.map((msg, i) => (
          <div
            key={msg._id || i}
            ref={i === activeChat.messages.length - 1 ? scrollRef : null}
            className={`message-row ${
              msg.senderID === activeChat.userID ? "own" : "other"
            }`}
          >
            <div className="message-bubble">
              <p className="message-text">{msg.text}</p>
              <span className="message-time">{timeAgo(msg.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={chatText || ""}
          onChange={(e) => setChatText(e.target.value)}
        />
        <button onClick={() => sendNewMessage(activeChat.chatID)}>
          {<IoMdSend />}
        </button>
      </div>
    </div>
  ) : (
    <div className="chat-window">
      <div className="chat-messages">
        <h3 style={{ color: "#0b7a63" }}>
          Connect with your mutuals via Skill-Swap-Chat !
        </h3>
      </div>
    </div>
  );

  return (
    <div className="chat-page">
      <div className="chat-cont">{activeChatDisplay}</div>
      <div className="convo-cont">
        <h3 style={{ textAlign: "center" }}>My Chats</h3>
        <div className="convo-box">
          {convoDisplay ? convoDisplay : `no mutuals yet`}
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
