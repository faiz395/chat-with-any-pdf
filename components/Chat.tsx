"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import serviceClient from "@/appwriteClient"; // Import the Appwrite service client
import { ID, Query } from "appwrite";
import { askQuestion } from "@/actions/askQuestion";
// import { auth } from "@clerk/nextjs/server";

export type Message = {
  id?: string;
  role: "human" | "ai";
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  let user1 = useUser();
  const [user,setUser] = useState<any>();
  
  // const { user } = useUser();
  console.log("user:::", user);

  if(!user) console.log("usernotfound: ",user);
  

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(user1.user){
      setUser(user1.user);
    }
  },[user1])

  // Fetch chats from Appwrite on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
     // const res = await serviceClient.getChatFromDb(user?.id,id as string);
// 
        const res = await serviceClient.getChatFromDb([
          // Query.orderAsc("createdAt")
          // Query.equal("userId", user?.id as string),
          Query.equal("documentId", id),
        ]);
        if (!res) {
          console.log("now res from db");
          return;
        }
        const newMessages = res.documents.map((doc: any) => ({
          id: doc.$id,
          role: doc.role,
          message: doc.message,
          createdAt: new Date(doc.createdAt),
        }));
        console.log("newMessages",newMessages);
        
        setMessages(newMessages);
        bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const question = input;
    setInput("");

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: question,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);

    // if (!user) {
    //   console.log("user is not available!");
    // }

   (user && startTransition(async () => {
      // Store user's message in Appwrite
      console.log("started transition: 0",user);
      
      try {
        await serviceClient.addNewChatToDB({
          role: "human",
          message: question,
          userId: user?.id ,
          documentId: id,
        });

        // Request AI response from askQuestion function
        const { success, message } = await askQuestion(id, question);
        if (!message) {
          console.log("message is not available: ");
          return;
        }
        if (!success) {
          setMessages((prev) =>
            prev.slice(0, prev.length - 1).concat([
              {
                role: "ai",
                message: `Whoops... ${message}`,
                createdAt: new Date(),
              },
            ])
          );
        } else {
          await serviceClient.addNewChatToDB({
            role: "ai",
            message,
            userId: user?.id,
            documentId: id,
          });
          setMessages((prev) => [
            ...prev.slice(0, prev.length - 1),
            {
              role: "ai",
              message,
              createdAt: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error("Error adding message to chat:", error);
      }
    }))
  };

  return (
    <div className="flex flex-col h-full overflow-scroll">
      <div className="flex-1 w-full">
        {messages.length === 0 ? (
          <div className="p-5">Ask me anything</div>
        ) : (
          <div className="p-5">
            {messages.map((message, index) => (
              <div key={message.id || index}>
                <p>{message.message}</p>
              </div>
            ))}
            <div ref={bottomOfChatRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
      >
        <Input
          placeholder="Ask a Question..."
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
