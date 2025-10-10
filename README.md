# Shivlox AI - Intelligent Chat Application

Shivlox AI is a modern, feature-rich, and intelligent chat application built with Next.js and powered by Google's Gemini models through the Genkit AI SDK. It provides a seamless, engaging, and responsive user experience for interacting with a powerful AI assistant.

**Live Demo:** [**shivlox ai**](https://shivloxai.netlify.app/)

## ✨ Key Features

*   **Intelligent Conversations:** Engage in natural, human-like conversations powered by Google's Gemini models.
*   **AI Image Generation:** Create stunning images directly in the chat interface using the `/imagine` command.
*   **Voice-to-Text:** Transcribe audio messages into text using the built-in microphone functionality.
*   **User Authentication:** Secure user sign-up and login using Firebase Authentication (Email/Password and Google OAuth).
*   **Persistent Chat History:** Conversations are automatically saved to the user's local storage, allowing them to be revisited later.
*   **Profile Management:** Users can update their display name and profile picture (with uploads handled by Cloudinary).
*   **Fully Responsive Design:** A sleek, modern UI built with Tailwind CSS and Shadcn/ui that works beautifully on all devices.
*   **SEO Optimized:** Built with Next.js App Router, ensuring excellent search engine visibility for all informational pages.
*   **PWA Ready:** The application is configured as a Progressive Web App, allowing users to "install" it on their devices for a native-like experience.

## 🛠️ Technologies Used

*   **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn/ui](https://ui.shadcn.com/)
*   **AI:** [Genkit](https://firebase.google.com/docs/genkit) with [Google's Gemini Models](https://deepmind.google.com/technologies/gemini/)
*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Image Storage:** [Cloudinary](https://cloudinary.com/) (for user profile pictures)
*   **Deployment:** Configured for [Netlify](https://www.netlify.com/) & [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or newer)
*   `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AdityaChoudhary01/shivloxai.git
    cd shivloxai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Before running the application, you need to set up your environment variables.

1.  Create a file named `.env.local` in the root of your project.
2.  Copy the contents of `.env.example` into your new `.env.local` file.
3.  Fill in the values for each variable:
    *   `GEMINI_API_KEY`: Your API key for the Google AI SDK.
    *   `NEXT_PUBLIC_FIREBASE_*`: Your Firebase project's web app configuration keys.
    *   `NEXT_PUBLIC_CLOUDINARY_*`: Your Cloudinary cloud name and upload preset for profile image uploads.
    *   `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`: Your Gmail credentials for sending emails from the contact form. **Note:** You may need to generate an "App Password" for this.

### Running the Project

1.  **Start the Genkit AI server:**
    Open a terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This starts the Genkit development server, which handles all AI-related flows.

2.  **Start the Next.js frontend:**
    Open a second terminal and run:
    ```bash
    npm run dev
    ```
    This starts the Next.js development server. The application will be accessible at `http://localhost:3000`.

## ⚙️ Project Structure

*   `src/ai/`: Contains all Genkit-related files, including flow definitions (`flows/`).
*   `src/app/`: The main Next.js application directory, using the App Router.
*   `src/components/`: Reusable React components, including UI components from Shadcn.
*   `src/hooks/`: Custom React hooks for authentication, toast notifications, etc.
*   `src/lib/`: Utility functions and library configurations (e.g., Firebase, utils).
*   `public/`: Static assets like images, icons, and the `manifest.json` for PWA functionality.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AdityaChoudhary01/shivloxai/issues).

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
