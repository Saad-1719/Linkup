import React, { useContext, useEffect, useState, useCallback } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import ImageViewer from "react-simple-image-viewer"; // Import the ImageViewer component

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } =
    useContext(AppContext);
  const [input, setInput] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [parent] = useAutoAnimate();

  // Create a state to store image URLs
  const [msgImages, setMsgImages] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading && input.trim() !== "") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // Summarization function
  const summarizeMessage = async (message) => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
      });
      const prompt = `Summarize the following message concisely in 1-2 sentences in easy and understandable words: "${message}"`;

      const result = await model.generateContent(prompt);
      const summary = await result.response.text();

      toast.info(`Summary: ${summary}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error) {
      toast.error("Failed to generate summary", {
        position: "top-right",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Smart Reply function
  const generateSmartReply = async (message) => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
      });
      const prompt = `Generate a concise, conversational reply to this message: "${message}". 
            The reply should be friendly, short (less than 20 words), and contextually appropriate.`;

      const result = await model.generateContent(prompt);
      const reply = await result.response.text();

      // Set the generated reply in the input field
      setInput(reply);
    } catch (error) {
      toast.error("Failed to generate smart reply", {
        position: "bottom-right",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        const messageDocRef = doc(db, "messages", messagesId);
        await updateDoc(messageDocRef, {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  };

  const handleAIAction = (action, message) => {
    if (action === "Summarize") {
      summarizeMessage(message);
    } else if (action === "Reply") {
      generateSmartReply(message);
    }
  };

  const convertTimeStamp = (Timestamp) => {
    let date = Timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + (minute < 10 ? "0" + minute : minute) + "PM";
    } else {
      return hour + ":" + (minute < 10 ? "0" + minute : minute) + "AM";
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (snapshot) => {
        if (snapshot.exists()) {
          const newMessages = snapshot.data().messages.reverse();
          setMessages(newMessages);
          // Update msgImages with image URLs
          setMsgImages(newMessages.filter(msg => msg.type === "image").map(msg => msg.text));
        }
      });
      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  const sendImage = async (e) => {
    try {
      const file = e.target.files[0];

      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!file) {
        toast.error("No image selected");
        return;
      }

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload JPEG or PNG.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 5MB.");
        return;
      }

      setIsLoading(true);

      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chat_images"); // Create a specific preset for chat images
      formData.append("folder", "chat_images");

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error(
          "Cloudinary cloud name is not defined in the environment variables"
        );
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      const imageUrl = result.secure_url;

      // Send image message to Firestore
      if (imageUrl && messagesId) {
        const messageDocRef = doc(db, "messages", messagesId);
        await updateDoc(messageDocRef, {
          messages: arrayUnion({
            sId: userData.id,
            text: imageUrl,
            type: "image",
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = "Sent an image";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });

        toast.success("Image sent successfully");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to send image");
    } finally {
      setIsLoading(false);
    }
  };

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return chatUser ? (
    <div className="h-[85vh] relative bg-sky-200" >
      {/* Loading Indicator */}
      {isLoading && (
        <span className="loader absolute top-[50%] left-[50%] z-50"></span>
      )}

      {/* Chat Header */}
      <div className="py-3 px-4 flex items-center gap-3 border-b-black border-2" >
        <img
          src={chatUser.userData.avatar}
          alt=""
          className="rounded-full w-10 h-auto aspect-square"
        />
        <p className="flex gap-x-3 font-semibold text-lg flex-1 items-center ">
				  {chatUser.userData.name}{" "}
				  {Date.now()-chatUser.userData.lastSeen <= 70000 ?<img
            src={assets.green_dot}
            alt=""
            className="rounded-full w-4 items-center"
          /> :" "}
          
        </p>
        <img
          src={assets.help_icon}
          alt=""
          className="rounded-full w-6 h-auto"
        />
      </div>

      {/* Chat Area */}
      <div className="pb-[50px] h-[calc(100%-70px)] overflow-y-scroll flex flex-col-reverse no-scrollbar" ref={parent}>
        {messages.map((msg, index) =>
          msg.sId === userData.id ? (
            <div
              key={index}
              className="flex items-end justify-end gap-1 py-0 px-4 relative mb-4"
            >
              {msg.type === "image" ? (
                <img
                  src={msg.text}
                  alt="Sent"
                  className="max-w-48 rounded-lg cursor-pointer"
                  onClick={() => openImageViewer(msgImages.indexOf(msg.text))}
                />
              ) : (
                <p
                  className="text-white bg-sky-500 p-2 max-w-48 text-base mb-7 rounded-tr-lg rounded-tl-lg rounded-bl-lg"
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-[11px]">
                <img
                  src={userData.avatar}
                  alt=""
                  className="w-6 rounded-full aspect-square"
                />
                <p>{convertTimeStamp(msg.createdAt)}</p>
              </div>
            </div>
          ) : (
            <div key={index} className="flex flex-row group relative mb-4">
              <div className="flex flex-col items-end pl-3 pr-2 justify-end text-center text-[11px]">
                <img
                  src={chatUser.userData.avatar}
                  alt=""
                  className="w-6 rounded-full aspect-square"
                />
                <p>{convertTimeStamp(msg.createdAt)}</p>
              </div>
              <div className="flex space-x-3 relative">
                {msg.type === "image" ? (
                  <img
                    src={msg.text}
                    alt="Sent"
                    className="max-w-48 rounded-lg cursor-pointer"
                    onClick={() => openImageViewer(msgImages.indexOf(msg.text))}
                  />
                ) : (
                  <p
                    className="text-white bg-sky-500 p-2 max-w-48 text-base mb-7 rounded-tr-lg rounded-tl-lg rounded-br-lg group"
                    onMouseEnter={() => setHoveredMessage(index)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    {msg.text}
                    {hoveredMessage === index && (
                      <div
                        className={
                          isLoading
                            ? "hidden"
                            : "absolute bottom-full left-0 mb-0 z-10 bg-white border rounded-lg shadow-lg text-black text-xs"
                        }
                      >
                        <div
                          className="px-4 py-2 hover:bg-sky-100 cursor-pointer flex items-center gap-2"
                          onClick={() => handleAIAction("Summarize", msg.text)}
                        >
                          <img
                            src={assets.ai_icon}
                            alt=""
                            className="w-5 h-auto"
                          />
                          Summarize
                        </div>
                        <div
                          className="px-4 py-2 hover:bg-sky-100 cursor-pointer flex items-center gap-2"
                          onClick={() => handleAIAction("Reply", msg.text)}
                        >
                          <img
                            src={assets.ai_icon}
                            alt=""
                            className="w-5 h-auto"
                          />
                          Smart Reply
                        </div>
                      </div>
                    )}
                  </p>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="flex items-center gap-3 py-2 px-4 bg-white absolute bottom-0 left-0 right-0">
        <input
          type="text"
          placeholder="send a message"
          className="outline-none flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          onKeyDown={handleKeyDown}
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label htmlFor="image" className="flex ">
          <img
            src={assets.gallery_icon}
            alt=""
            className="cursor-pointer w-5"
          />
        </label>
        <img
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
          onClick={sendMessage}
        />
      </div>

      {/* Image Viewer */}
      {isViewerOpen && (
        <ImageViewer
          src={msgImages}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <img src={assets.logo_icon} alt="" className="w-20 h-auto" />
      <p>Chat Anytime, anywhere</p>
    </div>
  );
};

export default ChatBox;

