# Booky 📚

Booky is a fun, interactive reading tracker and vocabulary builder designed to encourage kids to read more, learn new words, and achieve their reading goals! 

## 🌟 Key Features

### 📖 Reading Library
* **Log Books:** Keep track of every book read, including the title, author, and a short summary.
* **Earn Points:** Every book logged earns the reader **1 point** towards their goals.

### 🎯 Goal Tracking (Parental Controls)
* **Set Rewards:** Parents can set custom goals (e.g., "Ice Cream Trip", "New Toy") with a specific point cost.
* **Cash Out:** Once a reader earns enough points, they can cash out their goal, triggering a fun confetti celebration!
* *Note: Adding, cashing out, and deleting goals is protected by a parent password.*

### 🧠 Vocabulary Builder
* **Word Bank:** Readers can add new words they discover while reading, along with their definitions.
* **Standalone Words:** Add words independently or link them directly to specific books.

### 🔖 Wishlist
* **Future Reads:** Keep a running list of books the reader wants to get in the future.
* **Mark as Gotten:** Once a book is acquired, simply check it off the list! The item will be visually marked as completed.

### 👥 Multi-User Support
* **Manage Profiles:** Create separate profiles for different readers (e.g., siblings) so everyone can track their own books, points, and goals.
* *Note: User management (adding/removing users) is hidden behind a subtle settings gear icon and is protected by a parent password.*

## 🔒 Parental Controls
Certain features in Booky are protected to ensure kids don't accidentally delete users or cash out goals without permission. 
* **Default Password:** `piggy`

## 🛠️ Tech Stack
* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion, Canvas Confetti
* **Icons:** Lucide React
* **Storage:** LocalStorage (Data is saved locally in the browser)

## 🚀 Getting Started & Setup Instructions

Booky can be run as a standard web application in your browser or as a standalone desktop application using Electron.

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone or download the repository.
2. Open your terminal and navigate to the project folder.
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the App

**Option 1: Browser Mode (Web)**
Runs the app in your default web browser. Data is saved to your browser's `localStorage`.
```bash
npm run dev
```

**Option 2: Desktop Mode (Electron)**
Runs the app as a standalone desktop window. Data is saved locally to a `data.json` file on your machine.
```bash
npm run electron:dev
```

### Building for Production

**To build the web version:**
```bash
npm run build:web
```

**To build the installable desktop app (Windows, Mac, Linux):**
```bash
npm run electron:build
```
*Note: The built executables will be located in the `release/` folder.*

## 🎮 How to Use Booky
1. Open the app and click the subtle gear icon in the top right corner to set up your readers (Password: `piggy`).
2. Select a reader from the dropdown menu in the header.
3. Start logging books, adding words, and setting goals!
