# 🎵 MyMusic

A fast, clean and modern **Vanilla JavaScript + Tailwind CSS** music player that loads songs dynamically from folders.  
No backend, no frameworks — everything runs on the front-end.

---

## 🚀 Features

### 🎧 Music Player
- Play / Pause  
- Next / Previous  
- Seek bar with live time update  
- Auto-play next song  

### 📁 Folder-Based Song System
The `/songs` directory contains multiple music folders.  
Each folder includes:
- `songs.json`  
- Song audio files  
- Cover image  

The app:
- Reads `folders.json`  
- Fetches each folder’s `songs.json`  
- Displays all songs dynamically  

### ❤️ Liked Songs
- Like / unlike any song  
- Stored using `localStorage`  
- Persists after refresh  

### 🔍 Live Search
- Real-time search  
- Instant filtering as you type  

### 📜 Recently Played
- Stored in `localStorage`  

### 🎨 Tailwind-Powered UI
- Fully responsive  
- Clean spacing, colours and layout  
- Tailwind grid layout for song cards  
- Hidden scrollbar using Tailwind utilities  

---

## ⚙️ How It Works

- `folders.json` stores a list of folder names.  
- JavaScript fetches that file and loops through each folder.  
- For every folder:
  - Fetches its `songs.json`  
  - Loads its song list + cover image  
  - Renders everything using Tailwind UI components  

When a song is clicked:
- Player UI updates  
- Current song details change  
- Recently played list is updated  
- Like status is loaded or saved  

All functionality is implemented using **pure JavaScript**.

---

## 🛠️ Technologies Used
- **HTML5**  
- **Tailwind CSS**  
- **Vanilla JavaScript**  
- **LocalStorage**  
- **Fetch API**  

---

## 📌 Core Features (Quick List)
- Dynamic music loading  
- Play / pause / next / previous  
- Live seek bar  
- Responsive Tailwind UI  
- Liked songs system  
- Recently played songs  
- Real-time search  

---

## 📂 How to Add New Songs

1. Create a new folder inside `/songs`

2. Add inside it:
   - `songs.json`  
   - Song `.mp3` files  
   - Cover image  

3. Your `songs.json` must follow this format:

```json
[
  "songName.mp3",
  "SongName.mp3",
  "SongName.mp3"
]

```

⚠️ Important:
The names in the JSON must match the exact file names of the audio files, or they will not appear in the UI.

4. Add the folder name to folders.json as:

```json

{
    "folderTitle": "Folder Name",
    "folderSongLink": "/songs/Folder Name/"
}

```





 


