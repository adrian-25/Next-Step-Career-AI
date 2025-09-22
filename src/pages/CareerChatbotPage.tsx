import React from "react";
import { CareerChatbot } from "@/components/CareerChatbot";

export function CareerChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-light p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-black mb-4">
            <span className="gradient-text">AI Career</span> Mentor Chat
          </h1>
          <p className="text-xl text-muted-foreground">
            Get instant, personalized career advice from your AI mentor. Ask anything about skills, jobs, interviews, networking, or career growth.
          </p>
        </div>

        <CareerChatbot 
          userSkills={["JavaScript", "React", "Node.js", "Python", "SQL"]}
          targetRole="Senior Full-Stack Developer"
          experienceYears={3}
        />
      </div>
    </div>
  );
}
