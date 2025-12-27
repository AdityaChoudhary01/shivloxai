
/**
 * @fileoverview This file provides an example of how to create a client
 * to interact with the Genkit flows from a separate frontend application,
 * such as a React Native app.
 *
 * It demonstrates how to make a POST request to the API endpoint
 * exposed by the `@genkit-ai/next` plugin.
 */

// Import the input type from the flow. You can share types between your
// web backend and native app for consistency.
import type { ChatInput } from '@/ai/flows/chat';

// Define the base URL of your deployed Next.js backend.
// In a real React Native app, this should come from environment variables.
const API_BASE_URL = 'https://shivloxai.netlify.app'; // IMPORTANT: Replace with your actual Vercel URL

/**
 * An example function that calls the 'chatFlow' on the backend.
 *
 * @param input The data to send to the chat flow, matching the ChatInput schema.
 * @returns The response from the AI model.
 */
export async function callChatApi(input: ChatInput) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/flows/chatFlow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // The body must be a JSON string that matches the flow's input schema.
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    // The Genkit Next.js plugin returns the flow's output directly as JSON.
    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Failed to call the chat API:', error);
    // You might want to show an error message to the user in the native app.
    throw new Error('Could not connect to the chat service.');
  }
}

/**
 * --- HOW TO USE THIS IN YOUR REACT NATIVE APP ---
 *
 * 1.  **File Location**: Place the `callChatApi` function in a file like `src/api/client.ts` in your React Native project.
 * 2.  **Dependencies**: You don't need any special libraries, just React and React Native.
 * 3.  **Update URL**: Replace the `API_BASE_URL` placeholder with your actual Vercel deployment URL.
 * 4.  **Component Usage**: Use the code below as a starting point for your main chat screen component (e.g., `src/screens/ChatScreen.tsx`).
 */

/*
// --- START: EXAMPLE REACT NATIVE CHAT SCREEN ---
// --- FILE: /src/screens/ChatScreen.tsx (in your future native app) ---

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// You would import the function from the file you created in your native project.
// import { callChatApi } from '../api/client';

// Define the shape of a message
type Message = {
  role: 'user' | 'model';
  content: string;
};

// Re-create the ChatInput type or import it from a shared types package
type NativeChatInput = {
  history: { role: 'user' | 'model'; content: string }[];
  prompt: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const chatInput: NativeChatInput = { history, prompt: input };

    try {
      // This function is defined above and makes the call to your Vercel backend
      const result = await callChatApi(chatInput);
      const aiMessage: Message = { role: 'model', content: result.response };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.modelBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          style={styles.chatArea}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        {isLoading && <ActivityIndicator size="large" color="#8A2BE2" style={{ marginVertical: 10 }} />}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            editable={!isLoading}
          />
          <Button title="Send" onPress={handleSendMessage} disabled={isLoading || !input.trim()} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09011E',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
    backgroundColor: '#1c1c1e',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#3a3a3c',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: 'white',
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: '#372a4f',
    alignSelf: 'flex-end',
  },
  modelBubble: {
    backgroundColor: '#262629',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChatScreen;

// --- END: EXAMPLE REACT NATIVE CHAT SCREEN ---
*/
