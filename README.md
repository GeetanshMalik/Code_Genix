# CodeGenix — Universal Online Code Compiler & IDE

A powerful web-based IDE with multi-language compilation, AI coding assistant, integrated YouTube tutorials, and a real terminal — all in one interface.

> **Try it live:** [codegenix.live](https://codegenix.live)

---

## ✨ Features

### 🌐 10 Language Support
Python • JavaScript • Java • C++ • C • PHP • Go • Rust • HTML • CSS

All languages compile and execute server-side via Docker with real compilers (GCC, JDK, Node.js, etc.).

### 🤖 AI Coding Assistant
- **Chat-based help** — Ask questions, get code, fix errors
- **Autopilot mode** — AI automatically writes code into your editor
- **Multi-file generation** — AI creates multiple file tabs for complex projects
- **Code revert** — Undo AI changes with one click
- Powered by Groq API (Llama models)

### 🎬 YouTube Integration
- Programming tutorials embedded directly in the IDE
- Search tutorials without leaving the editor
- Language-specific video suggestions

### 💻 Built-in Terminal
- File operations: `ls`, `cat`, `grep`, `find`, `touch`, `rm`, `cp`, `mv`, `diff`, `tree`
- Code execution: `run`, `python`, `node`, `java`, `gcc`
- Text processing: `sort`, `uniq`, `base64`, `md5sum`, `strings`
- System info: `date`, `cal`, `uptime`, `whoami`, `env`
- Fun: `neofetch`, `cowsay`, `figlet`, `fortune`
- Command history with ↑/↓ arrow navigation

### 📁 Multi-File Project Support
- Tabbed file editor with create, rename, close
- AI automatically creates project files when needed
- Save all files as ZIP download
- Open local files with auto language detection
- Session persistence across page refreshes

### 🎨 Modern UI
- Dark/Light theme toggle (animated sun/moon switch)
- 3-panel layout: Editor | YouTube | I/O
- CodeMirror editor with syntax highlighting & autocomplete
- Responsive design with smooth animations

---

## 🚀 Quick Start

### Local Development

```bash
# Clone
git clone https://github.com/GeetanshMalik/Code_Genix.git
cd Code_Genix

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run
python app.py
```

Open `http://localhost:5000`

### Docker

```bash
docker-compose up --build
```

### Deploy to Heroku

```bash
heroku create your-app-name
heroku stack:set container
git push heroku main
heroku config:set GROQ_API_KEY=your_key YOUTUBE_API_KEY=your_key
```

---

## ⚙️ Environment Variables

| Variable          | Required |
|-------------------|----------|
| `GROQ_API_KEY`    | Yes      |
| `YOUTUBE_API_KEY` | Yes      |

Create a `.env` file from the template:
```bash
cp .env.example .env
```

---

## 🏗️ Architecture

```
├── app.py              # Flask backend (API + static serving)
├── Dockerfile          # Multi-language Docker image
├── heroku.yml          # Heroku container deployment
├── docker-compose.yml  # Local Docker setup
├── requirements.txt    # Python dependencies
├── src/
│   ├── compilers/      # Language compiler modules
│   │   ├── base_compiler.py
│   │   ├── python_compiler.py
│   │   ├── javascript_compiler.py
│   │   ├── java_compiler.py
│   │   ├── cpp_compiler.py
│   │   └── compiler_factory.py
│   └── interpreter/    # Python interpreter module
└── web/
    ├── index.html      # Main IDE page
    ├── pyverse.js      # Frontend logic (editor, AI, terminal)
    └── assets/
        └── main.css    # All styles
```

### API Endpoints

| Method  | Endpoint                   | Description              |
|---------|----------------------------|--------------------------|
| `GET`   | `/`                        | Serve IDE interface      |
| `POST`  | `/api/compile/<language>`  | Compile & run code       |
| `POST`  | `/api/ai/chat`             | AI assistant chat        |
| `GET`   | `/api/youtube/search`      | YouTube search           |
| `GET`   | `/api/languages`           | List supported languages |
| `GET`   | `/api/health`              | Health check             |

---

## 🐳 Docker Language Support

The Dockerfile installs all compilers so every language works out of the box:

| Language         | Compiler/Runtime | Version |
|------------------|------------------|---------|
| Python           | python3          | 3.10+   |
| JavaScript       | Node.js          | 12+     |
| Java             | OpenJDK          | 11+     |
| C / C++          | GCC / G++        | 11+     |
| PHP              | php              | 8+      |
| Go               | golang           | 1.18+   |
| Rust             | rustc            | 1.60+   |
| HTML / CSS       | Browser preview  | —       |

---

## 📝 License

MIT License — see [LICENSE](LICENSE)

---

## 🙏 Acknowledgments

- [CodeMirror](https://codemirror.net/) — Code editor
- [Flask](https://flask.palletsprojects.com/) — Web framework
- [Groq](https://groq.com/) — AI inference
- [Font Awesome](https://fontawesome.com/) — Icons
- [JSZip](https://stuk.github.io/jszip/) — ZIP file creation

---

**Made for developers who love to learn and code**