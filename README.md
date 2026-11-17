# 🗂️ Kanban Board App

Aplikasi Kanban Board berbasis **Ionic + React** untuk manajemen tugas, dibuat sebagai Take Home Test Frontend Developer — PT Adhikari Inovasi Indonesia (Adhivasindo).

---

## ✨ Fitur

- **5 Kolom**: To Do, Doing, Review, Done, Rework
- **CRUD Task**: Tambah, lihat detail, edit, dan hapus task (dengan konfirmasi)
- **Drag & Drop**: Pindahkan task antar kolom dengan mouse atau sentuhan
- **Filter Priority**: Filter task berdasarkan High / Medium / Low
- **Search**: Cari task berdasarkan judul, deskripsi, atau label
- **Subtask & Progress Bar**: Tambah checklist subtask dengan progress bar otomatis
- **Local Storage**: Data tersimpan otomatis di browser tanpa backend
- **Responsif**: Mendukung tampilan desktop dan mobile

---

## 🛠️ Tech Stack

| Teknologi | Versi |
|---|---|
| Ionic Framework | 9 |
| React | 19 |
| TypeScript | 5.9 |
| @dnd-kit/core | 6 |
| Vite | 5 |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js v18+
- npm v9+

### Langkah

```bash
# 1. Clone repository
git clone https://github.com/Hasbialj/kanban-board.git
cd kanban-board

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Jalankan dev server
npm run dev
```

Buka browser di **http://localhost:5173**

### Build Production

```bash
npm run build
```

---

## 📁 Struktur Project

```
src/
├── types/
│   └── kanban.ts          # Type definitions (Task, Column, Subtask)
├── hooks/
│   └── useKanban.ts       # State management + localStorage
├── components/
│   ├── KanbanColumn.tsx   # Droppable column component
│   ├── TaskCard.tsx       # Draggable task card
│   └── TaskModal.tsx      # Modal create / edit / view task
└── pages/
    └── Home.tsx           # Halaman utama Kanban Board
```

---

## 📸 Screenshot

![Kanban Board](https://github.com/Hasbialj/kanban-board/raw/main/public/screenshot.png)

---

## 👤 Author

**Hasbial Jamil Mardia Putra**  
Take Home Test — Frontend Developer  
PT Adhikari Inovasi Indonesia (Adhivasindo)
