export interface ThreadSummary {
  id: string;
  created_at: string;
  first_message: string;
  message_count: number;
  isNew?: boolean;
}

export interface Message {
  id: string;
  user_query: string;
  agent_response: string;
  created_at: string;
}

export interface Thread {
  id: string;
  created_at: string;
  messages: Message[];
}

// Add this type for streaming messages
export interface StreamMessage {
  id: string;
  user_query: string;
  agent_response: string;
  created_at: string;
  isStreaming?: boolean;
  threadId?: string;
} 