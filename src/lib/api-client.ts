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
const API_BASE_URL = 'https://your-vercel-deployment-url.vercel.app'; // IMPORTANT: Replace with your actual Vercel URL

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
 * 1. Copy this function (and the type import) into your React Native project.
 *
 * 2. Ensure your backend Next.js application is deployed to Vercel.
 *
 * 3. Update the `API_BASE_URL` with your production Vercel URL.
 *    For better security and flexibility, manage this URL using a library
 *    like `react-native-dotenv` to avoid hardcoding it.
 *
 * 4. Call this function from your React Native components:
 *
 *    ```javascript
 *    // In your ChatScreen.tsx
 *
 *    const handleSendMessage = async () => {
 *      // ... (your existing logic to prepare the message)
 *
 *      const chatInput = {
 *        history: currentMessages,
 *        prompt: userInput,
 *      };
 *
 *      try {
 *        const result = await callChatApi(chatInput);
 *        // Add the AI's response to your chat history
 *        const aiMessage = { role: 'model', content: result.response };
 *        // ... (update your state with the new message)
 *      } catch (error) {
 *        // ... (handle the error in the UI)
 *      }
 *    };
 *    ```
 */
