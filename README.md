# Default Profile Changer

**A simple Stream Deck plugin to easily switch your default profile — with one button press.**


## ✨ What is Default Profile Changer?

Default Profile Changer solves a small but annoying problem:  
Normally, Stream Deck automatically switches profiles based on active applications.  
But sometimes, you just want to **manually set** your **default profile** — easily and quickly.

This plugin adds a **button** that lets you set any profile as the default, without diving into menus.


## 🚀 How it Works

- Select the profile you want to set as default.
- Press the button.
- Your Stream Deck updates the default profile instantly (with a quick Stream Deck reload).

Fast, simple!


## 🔧 Usage

- Simply add the **Default Profile Changer** action to any button on your Stream Deck.
- Click the button to switch your default profile.


## 🛠️ Tech Stack

- **TypeScript:** Full codebase written in TypeScript
- **Stream Deck SDK:** Built using [Elgato's official SDK](https://docs.elgato.com/streamdeck/sdk/introduction/getting-started)
- **Express.js Server:** Lightweight local server to safely edit profile files
- **Rollup & Nodemon:** Easy development with live-reloading


## 📦 Development Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/streamdeck-default-profile-changer.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development environment:
    ```bash
    npm run dev
    ```

This will:
- Watch and rebuild the plugin and server automatically.
- Restart the Stream Deck plugin for easy testing.


## 📜 License

MIT License — free for personal and commercial use.

