// Universal Code Compiler - PyVerse JavaScript

// Global variables
let editor;
let currentLanguage = 'python';
// AI Assistant variables
let aiAssistantOpen = false;
let aiMinimized = false;
let autopilotEnabled = false;
let isTyping = false;

// File management variables
let files = [];
let currentFileId = 0;
let nextFileId = 1;

// Code history for revert functionality
let codeHistory = [];
const MAX_HISTORY_SIZE = 10;

// Language templates and file structures with welcome messages
const languageTemplates = {
    python: {
        files: [
            {
                name: 'main.py', content: `# 🐍 Welcome to Python in CodeGenix!
# ======================================
# Python is a versatile, beginner-friendly language.
# Start coding your ideas below!

def main():
    """Main function - entry point of our program"""
    print("🚀 Welcome to Python!")
    print("This is your Python coding environment.")
    print()
    
    # Variables and data types
    name = "CodeGenix"
    version = 2.0
    is_awesome = True
    
    print(f"Running {name} v{version}")
    print(f"Ready to code: {is_awesome}")
    
    # Try adding your own code here!
    # Example: Create a loop, define functions, or build something amazing!

if __name__ == "__main__":
    main()
` }
        ]
    },
    javascript: {
        files: [
            {
                name: 'main.js', content: `// 🌐 Welcome to JavaScript in CodeGenix!
// ========================================
// JavaScript powers the web and beyond.
// Start coding your ideas below!

function main() {
    console.log("🚀 Welcome to JavaScript!");
    console.log("This is your JavaScript coding environment.");
    console.log();
    
    // Variables and data types
    const name = "CodeGenix";
    const version = 2.0;
    let isAwesome = true;
    
    console.log(\`Running \${name} v\${version}\`);
    console.log(\`Ready to code: \${isAwesome}\`);
    
    // Try adding your own code here!
    // Example: Create functions, arrays, or objects!
}

// Run the main function
main();
` }
        ]
    },
    java: {
        files: [
            {
                name: 'Main.java', content: `// ☕ Welcome to Java in CodeGenix!
// ==================================
// Java is a powerful, object-oriented language.
// Start coding your ideas below!

public class Main {
    public static void main(String[] args) {
        System.out.println("🚀 Welcome to Java!");
        System.out.println("This is your Java coding environment.");
        System.out.println();
        
        // Variables and data types
        String name = "CodeGenix";
        double version = 2.0;
        boolean isAwesome = true;
        
        System.out.println("Running " + name + " v" + version);
        System.out.println("Ready to code: " + isAwesome);
        
        // Try adding your own code here!
        // Example: Create classes, methods, or data structures!
    }
}
` }
        ]
    },
    cpp: {
        files: [
            {
                name: 'main.cpp', content: `// ⚡ Welcome to C++ in CodeGenix!
// ==================================
// C++ is a high-performance, powerful language.
// Start coding your ideas below!

#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "🚀 Welcome to C++!" << endl;
    cout << "This is your C++ coding environment." << endl;
    cout << endl;
    
    // Variables and data types
    string name = "CodeGenix";
    double version = 2.0;
    bool isAwesome = true;
    
    cout << "Running " << name << " v" << version << endl;
    cout << "Ready to code: " << (isAwesome ? "true" : "false") << endl;
    
    // Try adding your own code here!
    // Example: Create functions, classes, or algorithms!
    
    return 0;
}
` }
        ]
    },
    c: {
        files: [
            {
                name: 'main.c', content: `/* ⚙️ Welcome to C in CodeGenix!
   ================================
   C is the foundation of modern programming.
   Start coding your ideas below! */

#include <stdio.h>
#include <stdbool.h>

int main() {
    printf("🚀 Welcome to C!\\n");
    printf("This is your C coding environment.\\n");
    printf("\\n");
    
    // Variables and data types
    char name[] = "CodeGenix";
    float version = 2.0;
    bool isAwesome = true;
    
    printf("Running %s v%.1f\\n", name, version);
    printf("Ready to code: %s\\n", isAwesome ? "true" : "false");
    
    // Try adding your own code here!
    // Example: Create functions, arrays, or pointers!
    
    return 0;
}
` }
        ]
    },
    html: {
        files: [
            {
                name: 'index.html',
                content: `<!DOCTYPE html>
<!-- 🌍 Welcome to HTML in CodeGenix! -->
<!-- This is your web development environment. -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CodeGenix</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1 id="title">🚀 Welcome to HTML!</h1>
        <p class="welcome">This is your HTML coding environment.</p>
        <p>Start building amazing web pages!</p>
        <button onclick="changeMessage()">Click me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
            },
            {
                name: 'styles.css',
                content: `/* 🎨 Welcome to CSS in CodeGenix! */
/* Style your HTML elements here. */

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    text-align: center;
    background: white;
    padding: 2rem 3rem;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
    color: #333;
    margin-bottom: 1rem;
    transition: transform 0.2s ease;
}

.welcome {
    color: #666;
    margin-bottom: 1.5rem;
}

button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}`
            },
            {
                name: 'script.js',
                content: `// 🎯 Welcome to JavaScript in CodeGenix!
// Add interactivity to your HTML page here.

function changeMessage() {
    const title = document.getElementById("title");
    const messages = [
        "🚀 Welcome to HTML!",
        "✨ Welcome to CodeGenix!",
        "🎉 Happy Coding!",
        "💡 Build Amazing Things!"
    ];
    
    const currentIndex = messages.indexOf(title.textContent);
    const nextIndex = (currentIndex + 1) % messages.length;
    
    title.textContent = messages[nextIndex];
    title.style.transform = "scale(1.1)";
    setTimeout(() => {
        title.style.transform = "scale(1)";
    }, 200);
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 CodeGenix HTML project loaded!");
});`
            }
        ]
    },
    css: {
        files: [
            {
                name: 'styles.css', content: `/* 🎨 Welcome to CSS in CodeGenix!
   ================================
   CSS brings your HTML to life with style.
   Start designing your layouts below! */

/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Container Styles */
.container {
    text-align: center;
    background: white;
    padding: 2rem 3rem;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

/* Typography */
h1 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 1rem;
}

p {
    color: #666;
    line-height: 1.6;
}

/* Try adding your own styles here!
   Example: animations, transitions, or hover effects! */
` }
        ]
    },
    php: {
        files: [
            {
                name: 'index.php', content: `<?php
// 🐘 Welcome to PHP in CodeGenix!
// =================================
// PHP powers millions of websites worldwide.
// Start coding your ideas below!

echo "🚀 Welcome to PHP!\\n";
echo "This is your PHP coding environment.\\n";
echo "\\n";

// Variables and data types
$name = "CodeGenix";
$version = 2.0;
$isAwesome = true;

echo "Running $name v$version\\n";
echo "Ready to code: " . ($isAwesome ? "true" : "false") . "\\n";

// You can also use functions
function greet($userName) {
    return "Hello, $userName! Welcome to PHP!";
}

echo greet("Developer") . "\\n";

// Try adding your own code here!
// Example: Create arrays, loops, or functions!
?>
` }
        ]
    },
    go: {
        files: [
            {
                name: 'main.go', content: `// 🔷 Welcome to Go in CodeGenix!
// =================================
// Go is simple, fast, and efficient.
// Start coding your ideas below!

package main

import "fmt"

func main() {
    fmt.Println("🚀 Welcome to Go!")
    fmt.Println("This is your Go coding environment.")
    fmt.Println()
    
    // Variables and data types
    name := "CodeGenix"
    version := 2.0
    isAwesome := true
    
    fmt.Printf("Running %s v%.1f\\n", name, version)
    fmt.Printf("Ready to code: %t\\n", isAwesome)
    
    // You can also use functions
    greet("Developer")
    
    // Try adding your own code here!
    // Example: Create structs, goroutines, or channels!
}

func greet(userName string) {
    fmt.Printf("Hello, %s! Welcome to Go!\\n", userName)
}
` }
        ]
    },
    rust: {
        files: [
            {
                name: 'main.rs', content: `// 🦀 Welcome to Rust in CodeGenix!
// ==================================
// Rust is safe, fast, and concurrent.
// Start coding your ideas below!

fn main() {
    println!("🚀 Welcome to Rust!");
    println!("This is your Rust coding environment.");
    println!();
    
    // Variables and data types
    let name = "CodeGenix";
    let version: f64 = 2.0;
    let is_awesome = true;
    
    println!("Running {} v{}", name, version);
    println!("Ready to code: {}", is_awesome);
    
    // You can also use functions
    greet("Developer");
    
    // Try adding your own code here!
    // Example: Create structs, enums, or pattern matching!
}

fn greet(user_name: &str) {
    println!("Hello, {}! Welcome to Rust!", user_name);
}
` }
        ]
    }
};


// ===== Session Persistence =====
function saveSession() {
    try {
        // Save current editor content to the active file object
        if (currentFileId !== null && editor) {
            const currentFile = files.find(f => f.id === currentFileId);
            if (currentFile) {
                currentFile.content = editor.getValue();
            }
        }
        const sessionData = {
            currentLanguage: currentLanguage,
            files: files,
            currentFileId: currentFileId,
            nextFileId: nextFileId
        };
        localStorage.setItem('codegenix_session', JSON.stringify(sessionData));
    } catch (e) {
        console.warn('Failed to save session:', e);
    }
}

function restoreSession() {
    try {
        const saved = localStorage.getItem('codegenix_session');
        if (!saved) return false;
        const sessionData = JSON.parse(saved);
        if (!sessionData || !sessionData.files || sessionData.files.length === 0) return false;

        currentLanguage = sessionData.currentLanguage || 'python';
        files = sessionData.files;
        nextFileId = sessionData.nextFileId || files.length;

        // Reset modified flags — content is already saved in localStorage
        files.forEach(f => f.modified = false);

        // Set currentFileId to null FIRST so switchToFile doesn't save
        // the editor's empty/default content over our restored file data
        currentFileId = null;

        // Update language dropdown
        document.getElementById('languageSelect').value = currentLanguage;

        const targetFileId = sessionData.currentFileId || 0;
        renderTabs();
        switchToFile(targetFileId);
        return true;
    } catch (e) {
        console.warn('Failed to restore session:', e);
        return false;
    }
}

function clearSession() {
    localStorage.removeItem('codegenix_session');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeCodeEditor();
    initializeEventListeners();

    // Check URL query parameters for language preselection (SEO support)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    const supportedLanguages = ['python', 'javascript', 'java', 'cpp', 'c', 'html', 'css', 'php', 'go', 'rust'];

    if (langParam && supportedLanguages.includes(langParam.toLowerCase())) {
        // URL has a valid language parameter — override session and set this language
        currentLanguage = langParam.toLowerCase();
        document.getElementById('languageSelect').value = currentLanguage;
        initializeFiles();
    } else if (!restoreSession()) {
        // No URL param and no saved session — initialize with defaults (Python)
        initializeFiles();
    }

    loadSavedTheme();
    // Load saved editor settings (font, tab size, etc.)
    loadSavedSettings();

    // Initialize scroll button states
    setTimeout(() => {
        updateScrollButtonStates();
    }, 100);

    // Auto-save session on editor changes (debounced)
    let saveTimeout;
    editor.on('change', function () {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveSession, 1000);
    });
});

// Save session before page unload
window.addEventListener('beforeunload', function () {
    saveSession();
});

// File Management Functions
function initializeFiles() {
    // Initialize with language template - only main file
    const template = languageTemplates[currentLanguage];
    files = template.files.map((file, index) => ({
        id: index,
        name: file.name,
        content: file.content,
        modified: false,
        language: currentLanguage
    }));

    currentFileId = 0;
    nextFileId = files.length;

    renderTabs();
    switchToFile(0);
}

function renderTabs() {
    const tabsContainer = document.getElementById('fileTabs');
    tabsContainer.innerHTML = '';

    files.forEach(file => {
        const tab = document.createElement('div');
        tab.className = `tab ${file.id === currentFileId ? 'active' : ''} ${file.modified ? 'modified' : ''}`;
        tab.id = `tab-${file.id}`;
        tab.setAttribute('data-file-id', file.id);
        tab.onclick = () => switchToFile(file.id);

        tab.innerHTML = `
            <span class="tab-name" ondblclick="renameFile(${file.id})">${file.name}</span>
            <i class="fas fa-times tab-close" onclick="closeTab(${file.id}); event.stopPropagation();"></i>
        `;

        tabsContainer.appendChild(tab);
    });

    // Update scroll functionality after rendering tabs
    setTimeout(() => {
        updateScrollButtonStates();

        // Add scroll event listener to update button states
        const tabsContainer = document.querySelector('.file-tabs-container');
        if (tabsContainer) {
            // Remove existing listener to avoid duplicates
            tabsContainer.removeEventListener('scroll', updateScrollButtonStates);
            // Add new listener
            tabsContainer.addEventListener('scroll', updateScrollButtonStates);
        }
    }, 50);
}

function addNewFile() {
    try {
        console.log('addNewFile function called'); // Debug log
        console.log('Current files:', files.length); // Debug log

        // Show immediate feedback
        showNotification('Creating new file...', 'info');

        const fileName = prompt('Enter file name:', `new_file.${getDefaultExtension()}`);
        if (!fileName) {
            console.log('No filename provided');
            showNotification('File creation cancelled', 'warning');
            return;
        }

        // Check if file name already exists
        if (files.some(f => f.name === fileName)) {
            alert('File name already exists!');
            showNotification('File name already exists!', 'error');
            return;
        }

        const newFile = {
            id: nextFileId++,
            name: fileName,
            content: getDefaultContent(fileName),
            modified: false,
            language: currentLanguage
        };

        files.push(newFile);
        console.log('File added to array, total files:', files.length);

        renderTabs();
        switchToFile(newFile.id);

        // Scroll to show the new tab if needed
        setTimeout(() => {
            scrollToActiveTab();
        }, 100);

        showNotification(`File "${fileName}" created successfully!`, 'success');
        console.log('New file created successfully:', fileName); // Debug log
    } catch (error) {
        console.error('Error in addNewFile:', error);
        alert('Error creating new file: ' + error.message);
        showNotification('Error creating file: ' + error.message, 'error');
    }
}

function switchToFile(fileId) {
    // Save current file content
    if (currentFileId !== null && files.find(f => f.id === currentFileId)) {
        const currentFile = files.find(f => f.id === currentFileId);
        const newContent = editor.getValue();
        if (currentFile.content !== newContent) {
            currentFile.content = newContent;
            currentFile.modified = true;
        }
    }

    // Switch to new file
    currentFileId = fileId;
    const file = files.find(f => f.id === fileId);

    if (file) {
        editor.setValue(file.content);

        // Update editor mode based on file extension
        const extension = file.name.split('.').pop().toLowerCase();
        updateEditorMode(extension);

        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        const activeTab = document.getElementById(`tab-${fileId}`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Scroll to show active tab
        setTimeout(() => {
            scrollToActiveTab();
        }, 10);
    }
}

function updateEditorMode(extension) {
    const modeMap = {
        'py': 'python',
        'js': 'javascript',
        'java': 'text/x-java',
        'cpp': 'text/x-c++src',
        'c': 'text/x-csrc',
        'html': 'xml',
        'css': 'css',
        'php': 'php',
        'go': 'go',
        'rs': 'rust'
    };

    const mode = modeMap[extension] || 'text';
    editor.setOption('mode', mode);
}

function scrollToActiveTab() {
    const activeTab = document.querySelector('.tab.active');
    const tabsContainer = document.querySelector('.file-tabs-container');

    if (!activeTab || !tabsContainer) return;

    const containerRect = tabsContainer.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    // Check if tab is visible
    if (tabRect.left < containerRect.left) {
        // Tab is to the left of visible area
        const scrollAmount = tabRect.left - containerRect.left - 20;
        tabsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else if (tabRect.right > containerRect.right) {
        // Tab is to the right of visible area
        const scrollAmount = tabRect.right - containerRect.right + 20;
        tabsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    // Update scroll button states after scroll
    setTimeout(() => {
        updateScrollButtonStates();
    }, 300);
}

function getDefaultExtension() {
    const extensionMap = {
        'python': 'py',
        'javascript': 'js',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'html': 'html',
        'css': 'css',
        'php': 'php',
        'go': 'go',
        'rust': 'rs'
    };
    return extensionMap[currentLanguage] || 'txt';
}

function getDefaultContent(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();

    const templates = {
        'py': '# Python file\nprint("Hello from ' + fileName + '")',
        'js': '// JavaScript file\nconsole.log("Hello from ' + fileName + '");',
        'java': 'public class ' + fileName.replace('.java', '') + ' {\n    public static void main(String[] args) {\n        System.out.println("Hello from ' + fileName + '");\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from ' + fileName + '" << endl;\n    return 0;\n}',
        'c': '#include <stdio.h>\n\nint main() {\n    printf("Hello from ' + fileName + '\\n");\n    return 0;\n}',
        'html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>' + fileName + '</title>\n</head>\n<body>\n    <h1>Hello from ' + fileName + '</h1>\n</body>\n</html>',
        'css': '/* CSS file: ' + fileName + ' */\nbody {\n    font-family: Arial, sans-serif;\n}',
        'php': '<?php\necho "Hello from ' + fileName + '\\n";\n?>',
        'go': 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from ' + fileName + '")\n}',
        'rs': 'fn main() {\n    println!("Hello from ' + fileName + '");\n}'
    };

    return templates[extension] || '// New file: ' + fileName;
}

function closeTab(fileId) {
    if (files.length === 1) {
        alert('Cannot close the last file!');
        return;
    }

    const file = files.find(f => f.id === fileId);
    if (file && file.modified) {
        if (!confirm(`File "${file.name}" has unsaved changes. Close anyway?`)) {
            return;
        }
    }

    // Remove file
    files = files.filter(f => f.id !== fileId);

    // Switch to another file if current file was closed
    if (currentFileId === fileId) {
        const nextFile = files[0];
        switchToFile(nextFile.id);
    }

    renderTabs();
}

function renameFile(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const newName = prompt('Enter new file name:', file.name);
    if (!newName || newName === file.name) return;

    // Check if file name already exists
    if (files.some(f => f.name === newName && f.id !== fileId)) {
        alert('File name already exists!');
        return;
    }

    file.name = newName;
    file.modified = true;
    renderTabs();

    // Update editor mode if extension changed
    if (currentFileId === fileId) {
        const extension = newName.split('.').pop().toLowerCase();
        updateEditorMode(extension);
    }
}

// Initialize CodeMirror editor
function initializeCodeEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        lineNumbers: true,
        mode: 'python',
        theme: 'monokai',
        indentUnit: 4,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    editor.setSize("100%", "100%");

    // Add scroll event listener for editor (for any future functionality)
    editor.on('scroll', function () {
        // Native scrollbars handle the visual feedback
        // This can be used for other scroll-related functionality if needed
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Console input
    document.getElementById('consoleInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            executeConsoleCommand();
        }
    });

    // AI query input
    document.getElementById('aiQuery').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            askAI();
        }
    });

    // YouTube search
    document.getElementById('youtubeSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchYoutube();
        }
    });

    // Note: The add-file-btn uses onclick="addNewFile()" in HTML.
    // No additional event listener needed here (would cause double popup).

    // Add scroll button event listeners
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Scroll left button clicked');
            scrollTabsBelt('left');
        });
    }

    if (scrollRightBtn) {
        scrollRightBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Scroll right button clicked');
            scrollTabsBelt('right');
        });
    }

    // Add scroll event listener to chat (for any future functionality)
    const chatDisplay = document.getElementById('chatDisplay');
    if (chatDisplay) {
        chatDisplay.addEventListener('scroll', function () {
            // Native scrollbars handle the visual feedback
            // This can be used for other scroll-related functionality if needed
        });
    }

    // Window resize listener for tab scrolling
    window.addEventListener('resize', function () {
        updateScrollButtonStates();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl+Tab to switch between tabs
        if (e.ctrlKey && e.key === 'Tab') {
            e.preventDefault();
            const currentIndex = files.findIndex(f => f.id === currentFileId);
            const nextIndex = e.shiftKey
                ? (currentIndex - 1 + files.length) % files.length
                : (currentIndex + 1) % files.length;
            switchToFile(files[nextIndex].id);
        }

        // Ctrl+W to close current tab
        if (e.ctrlKey && e.key === 'w') {
            e.preventDefault();
            if (files.length > 1) {
                closeTab(currentFileId);
            }
        }

        // Ctrl+N to create new file
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            addNewFile();
        }
    });

    // Load default tutorial on page load
    loadDefaultTutorial();
}

// Navigation functions
function newFile() {
    if (files.some(f => f.modified)) {
        if (!confirm('You have unsaved changes. Create new project anyway?')) {
            return;
        }
    }

    // Clear saved session so we get fresh templates
    clearSession();

    // Load template for current language
    const template = languageTemplates[currentLanguage];
    files = template.files.map((file, index) => ({
        id: index,
        name: file.name,
        content: file.content,
        modified: false,
        language: currentLanguage
    }));

    // Set currentFileId to null so switchToFile doesn't save old editor content
    // over the fresh template files
    currentFileId = null;
    nextFileId = files.length;

    renderTabs();
    switchToFile(0);

    showNotification(`New ${currentLanguage.toUpperCase()} project created!`, 'success');
}

function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.py,.js,.java,.cpp,.c,.php,.go,.rs,.html,.css,.txt,.json,.xml,.md,.sql,.rb,.swift';
    input.multiple = true;

    input.onchange = function (e) {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        // Save current file content before opening new files
        if (currentFileId !== null && files.find(f => f.id === currentFileId)) {
            const currentFile = files.find(f => f.id === currentFileId);
            currentFile.content = editor.getValue();
        }

        // Load selected files as NEW tabs (don't clear existing files)
        let loadedCount = 0;
        let firstNewFileId = null;

        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Check if a file with the same name already exists
                const existingFile = files.find(f => f.name === file.name);
                if (existingFile) {
                    // Update existing file content
                    existingFile.content = e.target.result;
                    existingFile.modified = false;
                    if (firstNewFileId === null) firstNewFileId = existingFile.id;
                } else {
                    // Add as a new tab
                    const newFile = {
                        id: nextFileId++,
                        name: file.name,
                        content: e.target.result,
                        modified: false,
                        language: detectLanguageFromFile(file.name)
                    };
                    files.push(newFile);
                    if (firstNewFileId === null) firstNewFileId = newFile.id;
                }

                loadedCount++;

                // When all files are loaded
                if (loadedCount === selectedFiles.length) {
                    renderTabs();
                    // Switch to the first newly opened file
                    if (firstNewFileId !== null) {
                        switchToFile(firstNewFileId);
                    }

                    // Update language dropdown based on the opened file
                    const openedFile = files.find(f => f.id === firstNewFileId);
                    if (openedFile) {
                        const lang = detectLanguageFromFile(openedFile.name);
                        currentLanguage = lang;
                        document.getElementById('languageSelect').value = lang;
                    }

                    showNotification(`Opened ${selectedFiles.length} file(s)`, 'success');

                    // Scroll to show the new tab
                    setTimeout(() => {
                        scrollToActiveTab();
                    }, 100);
                }
            };
            reader.readAsText(file);
        });
    };

    input.click();
}

function detectLanguageFromFile(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const langMap = {
        'py': 'python',
        'js': 'javascript',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'php': 'php',
        'go': 'go',
        'rs': 'rust',
        'html': 'html',
        'css': 'css'
    };
    return langMap[extension] || 'python';
}

function saveFile() {
    // Save current file content
    if (currentFileId !== null) {
        const currentFile = files.find(f => f.id === currentFileId);
        if (currentFile) {
            currentFile.content = editor.getValue();
        }
    }

    if (files.length === 1) {
        // Save single file
        const file = files[0];
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);

        file.modified = false;
        renderTabs();
        showNotification(`Saved ${file.name}`, 'success');
    } else {
        // Save all files as ZIP
        saveAsZip();
    }
}

async function saveAsZip() {
    try {
        if (typeof JSZip !== 'undefined') {
            // Use JSZip for proper ZIP file
            const zip = new JSZip();
            const folderName = `${currentLanguage}_project`;
            const folder = zip.folder(folderName);

            files.forEach(file => {
                folder.file(file.name, file.content);
            });

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${folderName}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            // Fallback: download each file individually
            files.forEach(file => {
                const blob = new Blob([file.content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                a.click();
                URL.revokeObjectURL(url);
            });
        }

        // Mark all files as saved
        files.forEach(file => file.modified = false);
        renderTabs();

        showNotification(`📦 Saved ${files.length} files as ZIP!`, 'success');
    } catch (error) {
        showNotification('Error saving files: ' + error.message, 'error');
    }
}

function shareCode() {
    // Save current file content
    if (currentFileId !== null) {
        const currentFile = files.find(f => f.id === currentFileId);
        if (currentFile) {
            currentFile.content = editor.getValue();
        }
    }

    // Check if all files are empty
    const hasContent = files.some(f => f.content && f.content.trim().length > 0);
    if (!hasContent) {
        showNotification('Nothing to share! Write some code first.', 'warning');
        return;
    }

    if (files.length === 1) {
        // Share single file
        navigator.clipboard.writeText(files[0].content).then(() => {
            showNotification('Code copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy code', 'error');
        });
    } else {
        // Share all files
        let allCode = '';
        files.forEach(file => {
            allCode += `// === ${file.name} ===\n`;
            allCode += file.content;
            allCode += '\n\n';
        });

        navigator.clipboard.writeText(allCode).then(() => {
            showNotification('All files copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy code', 'error');
        });
    }
}

// Language management
function changeLanguage() {
    const select = document.getElementById('languageSelect');
    const newLanguage = select.value;

    if (newLanguage !== currentLanguage) {
        // Clear saved session for the old language
        clearSession();

        currentLanguage = newLanguage;

        // Load language template
        const template = languageTemplates[currentLanguage];
        files = template.files.map((file, index) => ({
            id: index,
            name: file.name,
            content: file.content,
            modified: false,
            language: currentLanguage
        }));

        // Reset currentFileId to null so switchToFile won't save blank editor content
        // over the new template files
        currentFileId = null;
        nextFileId = files.length;

        renderTabs();
        switchToFile(0);

        // Save the new session
        saveSession();

        showNotification(`Switched to ${newLanguage.toUpperCase()}`, 'success');
    }
}

// Code execution
async function runCode() {
    // Save current file content
    if (currentFileId !== null) {
        const currentFile = files.find(f => f.id === currentFileId);
        if (currentFile) {
            currentFile.content = editor.getValue();
        }
    }

    // For HTML projects, we need to handle multiple files differently
    if (currentLanguage === 'html') {
        runHTMLProject();
        return;
    }

    // For other languages, find the main file
    const mainFile = findMainFile();
    if (!mainFile) {
        showNotification('No main file found!', 'warning');
        return;
    }

    const code = mainFile.content.trim();
    if (!code) {
        showNotification('Please write some code first!', 'warning');
        return;
    }

    showOutput('>>> Compiling and executing...\n', true);

    try {
        const input = document.getElementById('inputArea').value;

        const response = await fetch(`/api/compile/${currentLanguage}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                input: input,
                language: currentLanguage,
                files: files // Send all files for languages that might need them
            })
        });

        const result = await response.json();

        if (result.success) {
            showOutput(result.output || '(No output)', false);
            if (result.error) {
                showOutput('\n--- Warnings ---\n' + result.error, false);
            }
        } else {
            showOutput('Error: ' + result.error, false);
            // Trigger AI assistance for error
            getAIErrorHelp(result.error);
        }
    } catch (error) {
        showOutput('Connection Error: ' + error.message + '\n\nMake sure the backend server is running.', false);
    }
}

function findMainFile() {
    // Priority order for main files
    const mainFileNames = {
        'python': ['main.py', 'app.py', 'index.py'],
        'javascript': ['main.js', 'index.js', 'app.js'],
        'java': ['Main.java', 'App.java'],
        'cpp': ['main.cpp', 'main.c++'],
        'c': ['main.c'],
        'php': ['index.php', 'main.php'],
        'go': ['main.go'],
        'rust': ['main.rs']
    };

    const possibleNames = mainFileNames[currentLanguage] || [];

    // First, try to find by name
    for (const name of possibleNames) {
        const file = files.find(f => f.name === name);
        if (file) return file;
    }

    // If no main file found by name, return the first file of the correct type
    const extension = getDefaultExtension();
    return files.find(f => f.name.endsWith('.' + extension)) || files[0];
}

function runHTMLProject() {
    // For HTML projects, create a preview
    const htmlFile = files.find(f => f.name.endsWith('.html'));
    const cssFile = files.find(f => f.name.endsWith('.css'));
    const jsFile = files.find(f => f.name.endsWith('.js'));

    if (!htmlFile) {
        showNotification('No HTML file found!', 'warning');
        return;
    }

    let htmlContent = htmlFile.content;

    // Inject CSS if exists
    if (cssFile) {
        const cssTag = `<style>\n${cssFile.content}\n</style>`;
        htmlContent = htmlContent.replace('</head>', cssTag + '\n</head>');
    }

    // Inject JS if exists
    if (jsFile) {
        const jsTag = `<script>\n${jsFile.content}\n</script>`;
        htmlContent = htmlContent.replace('</body>', jsTag + '\n</body>');
    }

    // Create a blob URL and open in new window
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Show in output
    showOutput('HTML Project Preview:\n\nOpening in new window...', true);
    showOutput('\nHTML Content:\n' + htmlContent, false);

    // Open in new window
    window.open(url, '_blank');

    // Clean up URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// I/O Panel management
function switchIOTab(tab) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.io-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.io-panel').forEach(p => p.classList.remove('active'));

    // Add active class to selected tab and panel
    event.target.classList.add('active');
    document.getElementById(tab + 'Panel').classList.add('active');
}

function showOutput(text, clear = false) {
    const outputContent = document.getElementById('outputContent');
    const placeholder = outputContent.querySelector('.output-placeholder');

    if (placeholder) {
        placeholder.remove();
    }

    if (clear) {
        outputContent.innerHTML = '';
    }

    const outputText = document.createElement('pre');
    outputText.textContent = text;
    outputText.style.margin = '0';
    outputText.style.whiteSpace = 'pre-wrap';
    outputContent.appendChild(outputText);

    // Auto-scroll to bottom
    outputContent.scrollTop = outputContent.scrollHeight;
}

function clearOutput() {
    const outputContent = document.getElementById('outputContent');
    outputContent.innerHTML = `
        <div class="output-placeholder">
            <i class="fas fa-play-circle"></i>
            <p>Click "Run" to execute your code</p>
            <p>Output will appear here...</p>
        </div>
    `;
}

function downloadOutput() {
    const outputContent = document.getElementById('outputContent').textContent;
    const blob = new Blob([outputContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Console functions
function executeConsoleCommand() {
    const input = document.getElementById('consoleInput');
    const command = input.value.trim();

    if (command) {
        const consoleContent = document.getElementById('consoleContent');

        // Add command to console
        const commandDiv = document.createElement('div');
        commandDiv.innerHTML = `<span style="color: var(--accent-color);">>>> </span>${command}`;
        consoleContent.appendChild(commandDiv);

        // Execute command (basic implementation)
        executeBasicCommand(command);

        input.value = '';
        consoleContent.scrollTop = consoleContent.scrollHeight;
    }
}

// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TERMINAL EMULATOR
// ═══════════════════════════════════════════════════════════════
let terminalCwd = '~/project';
let terminalEnv = { USER: 'codegenix', HOME: '~', SHELL: '/bin/bash', LANG: 'en_US.UTF-8', EDITOR: 'codegenix', PATH: '/usr/bin:/bin:/usr/local/bin' };
let terminalHistory = [];
let terminalHistoryIndex = -1;
let terminalAliases = { ll: 'ls -la', la: 'ls -a', '..': 'cd ..', cls: 'clear', py: 'python', c: 'clear' };

function executeBasicCommand(command) {
    const consoleContent = document.getElementById('consoleContent');
    const resultDiv = document.createElement('div');
    resultDiv.style.whiteSpace = 'pre-wrap';
    resultDiv.style.fontFamily = 'monospace';

    // Store in history
    terminalHistory.push(command);
    terminalHistoryIndex = terminalHistory.length;

    const raw = command.trim();
    // Resolve aliases
    const firstWord = raw.split(/\s+/)[0].toLowerCase();
    const resolved = terminalAliases[firstWord] ? raw.replace(firstWord, terminalAliases[firstWord]) : raw;
    const parts = resolved.match(/(?:[^\s"]+|"[^"]*")/g) || [resolved];
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).map(a => a.replace(/^"|"$/g, ''));

    // ── CLEAR ──
    if (cmd === 'clear' || cmd === 'cls' || cmd === 'reset') {
        consoleContent.innerHTML = '';
        return;
    }

    // ── HELP ──
    else if (cmd === 'help' || cmd === 'man' && !args[0]) {
        resultDiv.innerHTML = `<span style="color:#4fc3f7;font-weight:bold">CodeGenix Terminal</span>
<span style="color:#aaa">═══════════════════════════════════════════════</span>
<span style="color:#81c784">FILE COMMANDS:</span>
  ls, dir, ll, la          List files (with color-coded types)
  cat, head, tail           View file content (head/tail with line count)
  touch <name>              Create a new file tab
  rm <name>                 Remove a file tab
  cp <src> <dest>           Copy a file
  mv <src> <dest>           Rename a file
  find, locate <pattern>    Search files by name
  grep <text> [file]        Search inside file content (highlighted)
  wc [file]                 Count lines, words, characters
  stat [file]               Show file details (size, lines, modified)
  file <name>               Show file type
  diff <f1> <f2>            Compare two files
  tree                      Show file tree
  nano/vi/vim <name>        Open or create a file in editor
  du                        Show disk usage per file

<span style="color:#81c784">CODE COMMANDS:</span>
  run                       Compile and run current code
  python, node, java, gcc   Run code (same as 'run')

<span style="color:#81c784">TEXT PROCESSING:</span>
  sort [file]               Sort file lines alphabetically
  uniq [file]               Remove duplicate lines
  rev <text>                Reverse text
  base64 <text>             Base64 encode text
  md5sum <file>             Compute hash of file
  strings                   Extract text strings from current file

<span style="color:#81c784">SYSTEM:</span>
  whoami, hostname, uname   System identity
  date                      Current date/time
  cal                       Calendar for current month
  uptime                    Session uptime
  env, export, unset        Manage environment variables
  history                   Command history (↑/↓ arrows)
  alias, unalias            Create/remove command aliases
  echo <text>               Print text (supports $VAR)
  cd, pwd                   Navigate directories
  lang                      Show current language
  version                   Show version info

<span style="color:#81c784">MATH & FUN:</span>
  expr <math>               Evaluate math expression
  factor <n>                Prime factorization
  seq <start> <end>         Generate number sequence
  neofetch                  System info display
  cowsay <text>             ASCII cow with message
  figlet <text>             Large text display
  fortune                   Random coding quote

  clear / cls               Clear the console
  help                      Show this help

<span style="color:#aaa">All commands work with your actual project files. Use ↑/↓ for history.</span>`;
    }

    // ── MAN PAGE ──
    else if (cmd === 'man' && args[0]) {
        const manPages = {
            ls: 'ls - list directory contents\nUsage: ls [options]\n  -l  long format\n  -a  show hidden\n  -h  human readable sizes\n  -R  recursive',
            cat: 'cat - concatenate and print files\nUsage: cat [filename]\nDisplays the content of the specified file.',
            grep: 'grep - search text patterns\nUsage: grep [pattern] [filename]\nSearches for pattern in file content.',
            run: 'run - execute current code\nUsage: run\nCompiles and runs the code in the active editor tab.',
            cd: 'cd - change directory\nUsage: cd [directory]\nChanges the current working directory.',
            echo: 'echo - display text\nUsage: echo [text]\nPrints the given text to the terminal.',
            python: 'python - run Python code\nUsage: python [file]\nExecutes the current Python code in the editor.',
            git: 'git - version control\nUsage: git [subcommand]\nSimulated git commands for the CodeGenix environment.',
            find: 'find - search for files\nUsage: find [pattern]\nSearches for files matching the pattern in the project.',
        };
        resultDiv.textContent = manPages[args[0]] || `No manual entry for '${args[0]}'\nTry: help`;
    }

    // ── FILE LISTING ──
    else if (cmd === 'ls' || cmd === 'dir' || cmd === 'll' || cmd === 'la') {
        const showLong = cmd === 'll' || args.includes('-l') || args.includes('-la') || args.includes('-al');
        const showAll = cmd === 'la' || cmd === 'll' || args.includes('-a') || args.includes('-la') || args.includes('-al');
        let output = '';
        if (showAll) output += '<span style="color:#64b5f6">.</span>  <span style="color:#64b5f6">..</span>\n';
        files.forEach(f => {
            const icon = f.id === currentFileId ? '▶ ' : '  ';
            const color = f.name.endsWith('.py') ? '#4fc3f7' : f.name.endsWith('.js') ? '#ffeb3b' : f.name.endsWith('.java') ? '#ff8a65' : f.name.endsWith('.html') ? '#ef5350' : f.name.endsWith('.css') ? '#42a5f5' : '#aaa';
            if (showLong) {
                const size = (f.content || '').length;
                const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                output += `${icon}-rw-r--r--  1 ${terminalEnv.USER}  staff  ${String(size).padStart(6)}  ${date}  <span style="color:${color}">${f.name}</span>${f.modified ? ' *' : ''}\n`;
            } else {
                output += `${icon}<span style="color:${color}">${f.name}</span>${f.modified ? '*' : ''}  `;
            }
        });
        resultDiv.innerHTML = output || '<span style="color:#aaa">(no files)</span>';
    }

    // ── CAT / HEAD / TAIL ──
    else if (cmd === 'cat' || cmd === 'head' || cmd === 'tail' || cmd === 'more' || cmd === 'less') {
        const fname = args[0];
        if (!fname) { resultDiv.textContent = `Usage: ${cmd} <filename>`; }
        else {
            const file = files.find(f => f.name === fname);
            if (!file) { resultDiv.innerHTML = `<span style="color:var(--warning-color)">${cmd}: ${fname}: No such file</span>`; }
            else {
                const lines = file.content.split('\n');
                let content;
                if (cmd === 'head') content = lines.slice(0, parseInt(args[1]) || 10).join('\n');
                else if (cmd === 'tail') content = lines.slice(-(parseInt(args[1]) || 10)).join('\n');
                else content = file.content;
                resultDiv.textContent = content;
            }
        }
    }

    // ── WC (word count) ──
    else if (cmd === 'wc') {
        const fname = args[0];
        const file = fname ? files.find(f => f.name === fname) : files.find(f => f.id === currentFileId);
        if (!file) { resultDiv.textContent = fname ? `wc: ${fname}: No such file` : 'wc: no file open'; }
        else {
            const content = file.content || '';
            const lines = content.split('\n').length;
            const words = content.split(/\s+/).filter(w => w).length;
            const chars = content.length;
            resultDiv.textContent = `  ${lines}  ${words}  ${chars} ${file.name}`;
        }
    }

    // ── TOUCH (create file) ──
    else if (cmd === 'touch') {
        if (!args[0]) { resultDiv.textContent = 'Usage: touch <filename>'; }
        else {
            const existing = files.find(f => f.name === args[0]);
            if (existing) { resultDiv.textContent = `File '${args[0]}' already exists.`; }
            else {
                files.push({ id: nextFileId++, name: args[0], content: '', modified: true, language: currentLanguage });
                renderTabs();
                saveSession();
                resultDiv.innerHTML = `<span style="color:var(--success-color)">Created: ${args[0]}</span>`;
            }
        }
    }

    // ── MKDIR ──
    else if (cmd === 'mkdir') {
        resultDiv.textContent = args[0] ? `mkdir: created directory '${args[0]}' (virtual)` : 'Usage: mkdir <dirname>';
    }

    // ── RM (remove file) ──
    else if (cmd === 'rm' || cmd === 'rmdir') {
        const fname = args.filter(a => !a.startsWith('-'))[0];
        if (!fname) { resultDiv.textContent = `Usage: ${cmd} <filename>`; }
        else {
            const idx = files.findIndex(f => f.name === fname);
            if (idx === -1) { resultDiv.innerHTML = `<span style="color:var(--warning-color)">${cmd}: ${fname}: No such file</span>`; }
            else if (files.length <= 1) { resultDiv.textContent = 'Cannot remove the only file.'; }
            else {
                files.splice(idx, 1);
                if (currentFileId !== null && !files.find(f => f.id === currentFileId)) {
                    switchToFile(files[0].id);
                }
                renderTabs();
                saveSession();
                resultDiv.innerHTML = `<span style="color:var(--success-color)">Removed: ${fname}</span>`;
            }
        }
    }

    // ── CP (copy file) ──
    else if (cmd === 'cp') {
        if (args.length < 2) { resultDiv.textContent = 'Usage: cp <source> <dest>'; }
        else {
            const src = files.find(f => f.name === args[0]);
            if (!src) { resultDiv.textContent = `cp: ${args[0]}: No such file`; }
            else {
                files.push({ id: nextFileId++, name: args[1], content: src.content, modified: true, language: currentLanguage });
                renderTabs(); saveSession();
                resultDiv.innerHTML = `<span style="color:var(--success-color)">Copied: ${args[0]} → ${args[1]}</span>`;
            }
        }
    }

    // ── MV (rename file) ──
    else if (cmd === 'mv') {
        if (args.length < 2) { resultDiv.textContent = 'Usage: mv <source> <dest>'; }
        else {
            const src = files.find(f => f.name === args[0]);
            if (!src) { resultDiv.textContent = `mv: ${args[0]}: No such file`; }
            else { src.name = args[1]; renderTabs(); saveSession(); resultDiv.innerHTML = `<span style="color:var(--success-color)">Renamed: ${args[0]} → ${args[1]}</span>`; }
        }
    }

    // ── FIND / LOCATE ──
    else if (cmd === 'find' || cmd === 'locate') {
        const pattern = args[0] || '*';
        const matches = files.filter(f => f.name.includes(pattern.replace('*', '')));
        resultDiv.textContent = matches.length ? matches.map(f => `./${f.name}`).join('\n') : `No files matching '${pattern}'`;
    }

    // ── GREP ──
    else if (cmd === 'grep' || cmd === 'egrep' || cmd === 'fgrep') {
        const pattern = args[0]; const fname = args[1];
        if (!pattern) { resultDiv.textContent = 'Usage: grep <pattern> [filename]'; }
        else {
            const searchFiles = fname ? files.filter(f => f.name === fname) : files;
            let output = '';
            searchFiles.forEach(f => {
                const lines = f.content.split('\n');
                lines.forEach((line, i) => {
                    if (line.toLowerCase().includes(pattern.toLowerCase())) {
                        output += `<span style="color:#ce93d8">${f.name}</span>:<span style="color:#4fc3f7">${i + 1}</span>: ${line.replace(new RegExp(pattern, 'gi'), m => `<span style="color:#f44336;font-weight:bold">${m}</span>`)}\n`;
                    }
                });
            });
            resultDiv.innerHTML = output || `No matches for '${pattern}'`;
        }
    }

    // ── STAT ──
    else if (cmd === 'stat') {
        const fname = args[0];
        const file = fname ? files.find(f => f.name === fname) : files.find(f => f.id === currentFileId);
        if (!file) { resultDiv.textContent = fname ? `stat: ${fname}: No such file` : 'stat: no file'; }
        else {
            const ext = file.name.split('.').pop();
            resultDiv.textContent = `  File: ${file.name}\n  Size: ${file.content.length} bytes\n  Type: ${ext} source file\n  Lang: ${currentLanguage}\n Lines: ${file.content.split('\n').length}\n Words: ${file.content.split(/\s+/).filter(w => w).length}\nModified: ${file.modified ? 'Yes (unsaved)' : 'No'}`;
        }
    }

    // ── FILE ──
    else if (cmd === 'file') {
        const fname = args[0];
        const file = fname ? files.find(f => f.name === fname) : null;
        if (!file) { resultDiv.textContent = fname ? `file: ${fname}: No such file` : 'Usage: file <filename>'; }
        else {
            const ext = file.name.split('.').pop();
            const types = { py: 'Python script, ASCII text', js: 'JavaScript source, ASCII text', java: 'Java source, ASCII text', c: 'C source, ASCII text', cpp: 'C++ source, ASCII text', html: 'HTML document, ASCII text', css: 'CSS stylesheet, ASCII text', go: 'Go source, ASCII text', rs: 'Rust source, ASCII text', php: 'PHP script, ASCII text', md: 'Markdown document, ASCII text', txt: 'ASCII text' };
            resultDiv.textContent = `${file.name}: ${types[ext] || 'ASCII text'}`;
        }
    }

    // ── DIFF ──
    else if (cmd === 'diff') {
        if (args.length < 2) { resultDiv.textContent = 'Usage: diff <file1> <file2>'; }
        else {
            const f1 = files.find(f => f.name === args[0]);
            const f2 = files.find(f => f.name === args[1]);
            if (!f1 || !f2) { resultDiv.textContent = `diff: file not found`; }
            else if (f1.content === f2.content) { resultDiv.textContent = 'Files are identical.'; }
            else { resultDiv.textContent = `Files differ:\n< ${args[0]} (${f1.content.length} bytes)\n> ${args[1]} (${f2.content.length} bytes)\n${f1.content.split('\n').length} vs ${f2.content.split('\n').length} lines`; }
        }
    }

    // ── NANO / VI / VIM ──
    else if (cmd === 'nano' || cmd === 'vi' || cmd === 'vim' || cmd === 'code') {
        const fname = args[0];
        if (!fname) { resultDiv.textContent = `Usage: ${cmd} <filename>`; }
        else {
            const file = files.find(f => f.name === fname);
            if (file) { switchToFile(file.id); resultDiv.innerHTML = `<span style="color:var(--success-color)">Opened ${fname} in editor</span>`; }
            else {
                files.push({ id: nextFileId++, name: fname, content: '', modified: true, language: currentLanguage });
                renderTabs(); switchToFile(nextFileId - 1); saveSession();
                resultDiv.innerHTML = `<span style="color:var(--success-color)">Created and opened ${fname}</span>`;
            }
        }
    }

    // ── ECHO / PRINTF ──
    else if (cmd === 'echo' || cmd === 'printf') {
        let text = args.join(' ').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        // Handle $VAR substitution
        text = text.replace(/\$(\w+)/g, (_, v) => terminalEnv[v] || '');
        resultDiv.textContent = text;
    }

    // ── CD / PWD ──
    else if (cmd === 'cd') {
        const dir = args[0] || '~';
        if (dir === '~' || dir === '/') terminalCwd = '~/project';
        else if (dir === '..') terminalCwd = terminalCwd.includes('/') ? terminalCwd.substring(0, terminalCwd.lastIndexOf('/')) || '~' : '~';
        else terminalCwd = `${terminalCwd}/${dir}`;
        resultDiv.textContent = ''; // cd produces no output
    }
    else if (cmd === 'pwd') { resultDiv.textContent = terminalCwd; }

    // ── TREE ──
    else if (cmd === 'tree') {
        let output = `<span style="color:#64b5f6">.</span>\n`;
        files.forEach((f, i) => {
            const prefix = i === files.length - 1 ? '└── ' : '├── ';
            const color = f.name.endsWith('.py') ? '#4fc3f7' : f.name.endsWith('.js') ? '#ffeb3b' : '#aaa';
            output += `${prefix}<span style="color:${color}">${f.name}</span>\n`;
        });
        output += `\n${files.length} file(s)`;
        resultDiv.innerHTML = output;
    }

    // ── RUN / COMPILE / BUILD ──
    else if (cmd === 'run' || cmd === 'compile' || cmd === 'build' || cmd === 'make' ||
        cmd === 'python' || cmd === 'python3' || cmd === 'node' || cmd === 'java' || cmd === 'javac' ||
        cmd === 'gcc' || cmd === 'g++' || cmd === 'rustc' || cmd === 'cargo' || cmd === 'go' ||
        cmd === 'php' || cmd === 'ruby' || cmd === 'perl' || cmd === 'swift' || cmd === 'kotlin' ||
        cmd === 'dotnet' || cmd === 'tsc' || cmd.startsWith('./')) {
        resultDiv.textContent = `Compiling ${currentLanguage} code...`;
        resultDiv.style.color = 'var(--accent-color)';
        consoleContent.appendChild(resultDiv);
        switchIOTab('output');
        runCode();
        return;
    }


    // ── SYSTEM INFO ──
    else if (cmd === 'whoami') { resultDiv.textContent = terminalEnv.USER; }
    else if (cmd === 'hostname') { resultDiv.textContent = 'codegenix-ide'; }
    else if (cmd === 'uname') {
        if (args.includes('-a')) resultDiv.textContent = 'CodeGenix 2.0.0 codegenix-ide x86_64 Browser/WebAssembly';
        else resultDiv.textContent = 'CodeGenix';
    }
    else if (cmd === 'date') {
        resultDiv.textContent = new Date().toString();
    }
    else if (cmd === 'cal') {
        const now = new Date();
        const month = now.toLocaleString('en', { month: 'long' });
        const year = now.getFullYear();
        const firstDay = new Date(year, now.getMonth(), 1).getDay();
        const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
        let cal = `     ${month} ${year}\nSu Mo Tu We Th Fr Sa\n`;
        cal += '   '.repeat(firstDay);
        for (let d = 1; d <= daysInMonth; d++) {
            const pad = d < 10 ? ' ' : '';
            const highlight = d === now.getDate() ? `\x1b[7m${pad}${d}\x1b[0m` : `${pad}${d}`;
            cal += `${pad}${d} `;
            if ((d + firstDay) % 7 === 0) cal += '\n';
        }
        resultDiv.textContent = cal;
    }
    else if (cmd === 'uptime') {
        const mins = Math.floor(performance.now() / 60000);
        resultDiv.textContent = `up ${mins} minute(s), 1 user, load average: 0.01, 0.03, 0.05`;
    }


    // ── ENVIRONMENT ──
    else if (cmd === 'env' || cmd === 'printenv') {
        resultDiv.textContent = Object.entries(terminalEnv).map(([k, v]) => `${k}=${v}`).join('\n');
    }
    else if (cmd === 'export' || cmd === 'set') {
        if (!args[0]) { resultDiv.textContent = Object.entries(terminalEnv).map(([k, v]) => `${k}=${v}`).join('\n'); }
        else {
            const [key, ...val] = args[0].split('=');
            terminalEnv[key] = val.join('=') || '';
            resultDiv.textContent = `${key}=${terminalEnv[key]}`;
        }
    }
    else if (cmd === 'unset') {
        if (args[0]) { delete terminalEnv[args[0]]; resultDiv.textContent = `Unset: ${args[0]}`; }
        else { resultDiv.textContent = 'Usage: unset <variable>'; }
    }

    // ── HISTORY / ALIAS ──
    else if (cmd === 'history') {
        const n = parseInt(args[0]) || terminalHistory.length;
        resultDiv.textContent = terminalHistory.slice(-n).map((h, i) => `  ${i + 1}  ${h}`).join('\n');
    }
    else if (cmd === 'alias') {
        if (!args[0]) { resultDiv.textContent = Object.entries(terminalAliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n'); }
        else {
            const match = args.join(' ').match(/(\w+)=['"](.*?)['"]/);
            if (match) { terminalAliases[match[1]] = match[2]; resultDiv.textContent = `alias ${match[1]}='${match[2]}'`; }
            else { resultDiv.textContent = "Usage: alias name='command'"; }
        }
    }
    else if (cmd === 'unalias') {
        if (args[0]) { delete terminalAliases[args[0]]; resultDiv.textContent = `Removed alias: ${args[0]}`; }
    }

    // ── TEXT PROCESSING ──
    else if (cmd === 'sort') {
        const fname = args[0]; const file = fname ? files.find(f => f.name === fname) : files.find(f => f.id === currentFileId);
        if (!file) { resultDiv.textContent = 'No file found'; }
        else { resultDiv.textContent = file.content.split('\n').sort().join('\n'); }
    }
    else if (cmd === 'uniq') {
        const fname = args[0]; const file = fname ? files.find(f => f.name === fname) : files.find(f => f.id === currentFileId);
        if (!file) { resultDiv.textContent = 'No file found'; }
        else { resultDiv.textContent = [...new Set(file.content.split('\n'))].join('\n'); }
    }
    else if (cmd === 'rev') {
        resultDiv.textContent = (args.join(' ') || '').split('').reverse().join('');
    }
    else if (cmd === 'base64') {
        if (args[0]) { resultDiv.textContent = btoa(args.join(' ')); }
        else { resultDiv.textContent = 'Usage: base64 <text>'; }
    }
    else if (cmd === 'md5sum' || cmd === 'sha256sum') {
        const fname = args[0]; const file = fname ? files.find(f => f.name === fname) : null;
        if (!file) resultDiv.textContent = `Usage: ${cmd} <filename>`;
        else {
            let hash = 0; for (let i = 0; i < file.content.length; i++) { hash = ((hash << 5) - hash) + file.content.charCodeAt(i); hash |= 0; }
            resultDiv.textContent = `${Math.abs(hash).toString(16).padStart(32, '0')}  ${file.name}`;
        }
    }


    // ── DISK USAGE (real - computes actual file sizes) ──
    else if (cmd === 'du') {
        let total = 0;
        let output = '';
        files.forEach(f => { const size = f.content.length; total += size; output += `${size}\t./${f.name}\n`; });
        output += `${total}\t.`;
        resultDiv.textContent = output;
    }

    // ── FUN COMMANDS ──
    else if (cmd === 'neofetch' || cmd === 'screenfetch') {
        resultDiv.innerHTML = `<span style="color:#4fc3f7">       _____          </span>  <span style="color:#81c784">${terminalEnv.USER}@codegenix-ide</span>
<span style="color:#4fc3f7">      / ____|         </span>  <span style="color:#aaa">─────────────────────</span>
<span style="color:#4fc3f7">     | |     ___      </span>  <span style="color:#ce93d8">OS:</span> CodeGenix IDE v2.0
<span style="color:#4fc3f7">     | |    / _ \\     </span>  <span style="color:#ce93d8">Shell:</span> CodeGenix Terminal
<span style="color:#4fc3f7">     | |___| (_) |    </span>  <span style="color:#ce93d8">Language:</span> ${currentLanguage}
<span style="color:#4fc3f7">      \\_____\\___/     </span>  <span style="color:#ce93d8">Files:</span> ${files.length} open
<span style="color:#4fc3f7">                      </span>  <span style="color:#ce93d8">Uptime:</span> ${Math.floor(performance.now() / 60000)} min
<span style="color:#4fc3f7">     CodeGenix IDE    </span>  <span style="color:#ce93d8">Memory:</span> ${(performance.memory?.usedJSHeapSize / 1048576 || 32).toFixed(0)} MB
                        <span style="background:#f44336">  </span><span style="background:#ff9800">  </span><span style="background:#ffeb3b">  </span><span style="background:#4caf50">  </span><span style="background:#2196f3">  </span><span style="background:#9c27b0">  </span><span style="background:#607d8b">  </span><span style="background:#fff">  </span>`;
    }
    else if (cmd === 'cowsay') {
        const text = args.join(' ') || 'Moo! Welcome to CodeGenix!';
        const border = '_'.repeat(text.length + 2);
        resultDiv.textContent = ` ${border}\n< ${text} >\n ${'-'.repeat(text.length + 2)}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`;
    }
    else if (cmd === 'figlet') {
        const text = args.join(' ') || 'Hello';
        resultDiv.innerHTML = `<span style="color:#4fc3f7;font-size:1.2em;font-weight:bold">${text.split('').map(c => c.toUpperCase()).join(' ')}</span>`;
    }
    else if (cmd === 'fortune') {
        const fortunes = ['The best way to learn to code is by coding.', 'Any sufficiently advanced bug is indistinguishable from a feature.', 'First, solve the problem. Then, write the code.', 'Code is like humor. When you have to explain it, it\'s bad.', 'Debugging is twice as hard as writing code.', 'There are only 10 types of people: those who understand binary and those who don\'t.', 'It works on my machine!', 'Talk is cheap. Show me the code. - Linus Torvalds'];
        resultDiv.textContent = fortunes[Math.floor(Math.random() * fortunes.length)];
    }
    else if (cmd === 'factor') {
        const n = parseInt(args[0]);
        if (!n || n < 2) { resultDiv.textContent = 'Usage: factor <number>'; }
        else {
            let factors = []; let num = n;
            for (let i = 2; i <= Math.sqrt(num); i++) { while (num % i === 0) { factors.push(i); num /= i; } }
            if (num > 1) factors.push(num);
            resultDiv.textContent = `${n}: ${factors.join(' ')}`;
        }
    }

    else if (cmd === 'true') { resultDiv.textContent = ''; }
    else if (cmd === 'false') { resultDiv.textContent = ''; }
    else if (cmd === 'seq') {
        const start = parseInt(args[0]) || 1; const end = parseInt(args[1]) || parseInt(args[0]) || 10;
        const s = args[1] ? start : 1; const e = args[1] ? end : start;
        const nums = []; for (let i = s; i <= Math.min(e, s + 100); i++) nums.push(i);
        resultDiv.textContent = nums.join('\n');
    }
    else if (cmd === 'expr') {
        try { resultDiv.textContent = eval(args.join('').replace(/x/g, '*')); } catch { resultDiv.textContent = 'expr: syntax error'; }
    }
    else if (cmd === 'strings') {
        const file = files.find(f => f.id === currentFileId);
        if (file) resultDiv.textContent = file.content.match(/[a-zA-Z]{4,}/g)?.join('\n') || '(no strings found)';
        else resultDiv.textContent = 'No file open';
    }

    // ── VERSION / EXIT ──
    else if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
        resultDiv.textContent = 'CodeGenix Universal IDE v2.0\nTerminal v2.0\n© 2024 CodeGenix';
    }
    else if (cmd === 'exit' || cmd === 'quit' || cmd === 'logout') {
        resultDiv.textContent = 'Use the CodeGenix IDE interface to navigate. This terminal runs within the browser.';
    }

    // ── LANG COMMAND ──
    else if (cmd === 'lang') { resultDiv.textContent = `Current language: ${currentLanguage}`; }

    // ── UNKNOWN COMMAND ──
    else {
        resultDiv.innerHTML = `<span style="color:var(--warning-color)">bash: ${cmd}: command not found</span>\nType <b>help</b> for available commands.`;
    }

    consoleContent.appendChild(resultDiv);
}

// Terminal history navigation (up/down arrows)
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const consoleInput = document.getElementById('consoleInput');
        if (consoleInput) {
            consoleInput.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (terminalHistoryIndex > 0) {
                        terminalHistoryIndex--;
                        consoleInput.value = terminalHistory[terminalHistoryIndex] || '';
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (terminalHistoryIndex < terminalHistory.length - 1) {
                        terminalHistoryIndex++;
                        consoleInput.value = terminalHistory[terminalHistoryIndex] || '';
                    } else {
                        terminalHistoryIndex = terminalHistory.length;
                        consoleInput.value = '';
                    }
                }
            });
        }
    }, 1000);
});

// YouTube integration
async function searchYoutube() {
    const query = document.getElementById('youtubeSearch').value.trim();
    if (!query) {
        showNotification('Please enter a search query or YouTube URL', 'warning');
        return;
    }

    // Check if input is a YouTube URL
    const videoId = extractVideoId(query);
    if (videoId) {
        // Direct URL pasted - load the video immediately
        playVideo(videoId, 'Video from URL');
        showNotification('Video loaded from URL!', 'success');
        return;
    }

    // Otherwise, perform a search
    showNotification(`Searching for "${query}" tutorials...`, 'info');

    try {
        // Use YouTube Data API v3 - request more results
        const response = await fetch('/api/youtube/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `${query} ${currentLanguage} programming tutorial`,
                maxResults: 8
            })
        });

        const result = await response.json();

        if (result.success && result.videos && result.videos.length > 0) {
            // Show search results grid
            showSearchResults(result.videos, query);
        } else {
            // Fallback to predefined videos
            const fallbackVideoId = await findRelevantVideo(query);
            if (fallbackVideoId) {
                playVideo(fallbackVideoId, 'Related tutorial');
                showNotification('Showing related tutorial (API limit reached)', 'info');
            } else {
                showNotification('No videos found, showing default tutorial', 'warning');
                loadDefaultTutorial();
            }
        }
    } catch (error) {
        console.error('YouTube search error:', error);
        showNotification('Search failed, loading default tutorial', 'warning');
        loadDefaultTutorial();
    }
}

// Extract video ID from various YouTube URL formats
function extractVideoId(url) {
    if (!url) return null;

    // Pattern 1: youtube.com/watch?v=VIDEO_ID
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];

    // Pattern 2: youtu.be/VIDEO_ID
    match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];

    // Pattern 3: youtube.com/embed/VIDEO_ID
    match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];

    // Pattern 4: Just the video ID (11 characters)
    match = url.match(/^[a-zA-Z0-9_-]{11}$/);
    if (match) return match[0];

    return null;
}

// Display search results in a grid
function showSearchResults(videos, query) {
    const searchResultsContainer = document.getElementById('youtubeSearchResults');
    const videoGrid = document.getElementById('videoGrid');
    const searchTitle = document.getElementById('searchResultsTitle');
    const playerContainer = document.getElementById('youtubePlayer');

    // Update title
    searchTitle.textContent = `Search Results for "${query}" (${videos.length} videos)`;

    // Clear previous results
    videoGrid.innerHTML = '';

    // Create video cards
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.onclick = () => {
            playVideo(video.videoId, video.title);
            hideSearchResults();
        };

        card.innerHTML = `
            <div class="thumbnail-container">
                <img class="thumbnail" src="${video.thumbnail}" alt="${video.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 9%22><rect fill=%22%23333%22 width=%2216%22 height=%229%22/><text x=%228%22 y=%225%22 fill=%22%23888%22 font-size=%222%22 text-anchor=%22middle%22>No Image</text></svg>'">
                <div class="play-icon">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="channel-name">${video.channelTitle}</div>
            </div>
        `;

        videoGrid.appendChild(card);
    });

    // Show search results, hide player
    playerContainer.style.display = 'none';
    searchResultsContainer.style.display = 'flex';
}

// Hide search results and show player
function hideSearchResults() {
    const searchResultsContainer = document.getElementById('youtubeSearchResults');
    const playerContainer = document.getElementById('youtubePlayer');

    searchResultsContainer.style.display = 'none';
    playerContainer.style.display = 'block';
}

// Play a specific video
function playVideo(videoId, title) {
    const iframe = document.getElementById('youtubeFrame');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    hideSearchResults();
    showNotification(`Playing: ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}`, 'success');
}

async function searchYouTubeVideos(query) {
    try {
        // For demo purposes, we'll use a simple approach
        // In production, you would use YouTube Data API v3

        // Method 1: Direct YouTube search (opens in iframe)
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

        // Method 2: Use YouTube embed search (more reliable for iframe)
        // We'll search for the first relevant video using a predefined list
        // and fallback to language-specific tutorials

        const videoId = await findRelevantVideo(query);
        if (videoId) {
            const iframe = document.getElementById('youtubeFrame');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            showNotification('Video loaded successfully!', 'success');
        } else {
            // Fallback to YouTube search page
            const iframe = document.getElementById('youtubeFrame');
            iframe.src = `https://www.youtube.com/embed/search?query=${encodeURIComponent(query)}`;
            showNotification('Showing search results...', 'info');
        }

    } catch (error) {
        console.error('YouTube search error:', error);
        showNotification('Search failed. Loading default tutorial...', 'warning');
        loadDefaultTutorial();
    }
}

async function findRelevantVideo(query) {
    // This is a simplified approach. In production, use YouTube Data API
    const searchTerms = query.toLowerCase();

    // Extended video database with search keywords
    const videoDatabase = {
        // Python tutorials
        'python': { id: 'kqtD5dpn9C8', keywords: ['python', 'basics', 'beginner', 'tutorial'] },
        'python_advanced': { id: 'WGJJIrtnfpk', keywords: ['python', 'advanced', 'oop', 'classes'] },
        'python_web': { id: 'Z1RJmh_OqeA', keywords: ['python', 'flask', 'django', 'web'] },
        'python_data': { id: 'r-uOLxNrNk8', keywords: ['python', 'pandas', 'data', 'analysis'] },

        // JavaScript tutorials
        'javascript': { id: 'PkZNo7MFNFg', keywords: ['javascript', 'basics', 'beginner', 'js'] },
        'javascript_dom': { id: 'y17RuWkWdn8', keywords: ['javascript', 'dom', 'manipulation', 'html'] },
        'javascript_async': { id: 'PoRJizFvM7s', keywords: ['javascript', 'async', 'promises', 'await'] },
        'react': { id: 'Tn6-PIqc4UM', keywords: ['react', 'javascript', 'components', 'jsx'] },

        // Java tutorials
        'java': { id: 'eIrMbAQSU34', keywords: ['java', 'basics', 'beginner', 'oop'] },
        'java_spring': { id: 'vtPkZShrvXQ', keywords: ['java', 'spring', 'boot', 'framework'] },

        // C++ tutorials
        'cpp': { id: 'vLnPwxZdW4Y', keywords: ['c++', 'cpp', 'basics', 'beginner'] },
        'cpp_oop': { id: 'wN0x9eZLix4', keywords: ['c++', 'oop', 'classes', 'objects'] },

        // C tutorials
        'c': { id: 'KJgsSFOSQv0', keywords: ['c', 'programming', 'basics', 'beginner'] },

        // Other languages
        'php': { id: 'OK_JCtrrv-c', keywords: ['php', 'web', 'server', 'basics'] },
        'go': { id: 'YS4e4q9oBaU', keywords: ['go', 'golang', 'basics', 'google'] },
        'rust': { id: 'zF34dRivLOw', keywords: ['rust', 'systems', 'programming', 'memory'] },
        'html': { id: 'UB1O30fR-EE', keywords: ['html', 'web', 'markup', 'basics'] },
        'css': { id: 'yfoY53QXEnI', keywords: ['css', 'styling', 'web', 'design'] },
        'sql': { id: 'HXV3zeQKqGY', keywords: ['sql', 'database', 'query', 'mysql'] },
        'typescript': { id: 'BwuLxPH8IDs', keywords: ['typescript', 'javascript', 'types', 'ts'] },
        'kotlin': { id: 'F9UC9DY-vIU', keywords: ['kotlin', 'android', 'java', 'jetbrains'] },
        'swift': { id: 'comQ1-x2a1Q', keywords: ['swift', 'ios', 'apple', 'mobile'] },
        'ruby': { id: 't_ispmWmdjY', keywords: ['ruby', 'rails', 'web', 'programming'] }
    };

    // Find best matching video based on search terms
    let bestMatch = null;
    let maxScore = 0;

    for (const [key, video] of Object.entries(videoDatabase)) {
        let score = 0;

        // Check how many keywords match
        for (const keyword of video.keywords) {
            if (searchTerms.includes(keyword)) {
                score += 1;
            }
        }

        // Bonus for exact language match
        if (searchTerms.includes(currentLanguage)) {
            score += 2;
        }

        if (score > maxScore) {
            maxScore = score;
            bestMatch = video.id;
        }
    }

    return bestMatch;
}

function loadDefaultTutorial() {
    const tutorialIds = {
        python: 'zOjov-2OZ0E',  // Introduction to Programming (freeCodeCamp) - general basics of coding
        javascript: 'PkZNo7MFNFg',
        java: 'eIrMbAQSU34',
        cpp: 'vLnPwxZdW4Y',
        c: 'KJgsSFOSQv0',
        php: 'OK_JCtrrv-c',
        go: 'YS4e4q9oBaU',
        rust: 'zF34dRivLOw',
        html: 'UB1O30fR-EE',
        css: 'yfoY53QXEnI',
        sql: 'HXV3zeQKqGY',
        typescript: 'BwuLxPH8IDs',
        kotlin: 'F9UC9DY-vIU',
        swift: 'comQ1-x2a1Q',
        ruby: 't_ispmWmdjY'
    };

    const videoId = tutorialIds[currentLanguage] || 'zOjov-2OZ0E';
    const iframe = document.getElementById('youtubeFrame');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
}

// AI Assistant functions
function toggleAI() {
    aiAssistantOpen = !aiAssistantOpen;
    const panel = document.getElementById('aiPanel');

    if (aiAssistantOpen && !aiMinimized) {
        panel.classList.add('active');
    } else {
        panel.classList.remove('active');
    }
}

function minimizeAI() {
    aiMinimized = true;
    document.getElementById('aiPanel').classList.remove('active');
}

function closeAI() {
    aiAssistantOpen = false;
    aiMinimized = false;
    document.getElementById('aiPanel').classList.remove('active');
}

function toggleFullscreen() {
    const panel = document.getElementById('aiPanel');
    panel.classList.toggle('fullscreen');

    const btn = event.target.closest('button');
    const icon = btn.querySelector('i');

    if (panel.classList.contains('fullscreen')) {
        icon.className = 'fas fa-compress';
        btn.title = 'Exit Fullscreen';
    } else {
        icon.className = 'fas fa-expand';
        btn.title = 'Toggle Fullscreen';
    }
}

function toggleAutopilot() {
    autopilotEnabled = document.getElementById('autopilotToggle').checked;

    if (autopilotEnabled) {
        showNotification('Autopilot enabled! AI will now implement code changes directly.', 'success');
        addAIMessage('🚀 Autopilot mode activated! I can now write and modify code directly in your editor. Just tell me what you want to implement!');
    } else {
        showNotification('Autopilot disabled. AI will provide suggestions only.', 'info');
        addAIMessage('Autopilot mode deactivated. I\'ll provide suggestions and explanations without modifying your code.');
    }
}

function handleAIInput(event) {
    if (event.key === 'Enter') {
        askAI();
    }
}

async function askAI() {
    const query = document.getElementById('aiQuery').value.trim();
    if (!query || isTyping) return;

    // Add user message
    addUserMessage(query);

    // Clear input
    document.getElementById('aiQuery').value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Prepare conversation history
        const history = window.conversationHistory?.slice(-10) || [];

        // Call backend API
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: query,
                code: editor.getValue(),
                language: currentLanguage,
                history: history,
                autopilot: autopilotEnabled
            })
        });

        const data = await response.json();

        if (data.success) {
            // Check for [CREATE_FILES] marker in AI response
            const hasCreateFiles = data.response && data.response.includes('[CREATE_FILES]');

            // Apply autopilot changes ONLY if there are no [CREATE_FILES]
            // (multi-file projects are handled by parseAndCreateFiles instead)
            if (data.extracted_code && autopilotEnabled && !hasCreateFiles) {
                implementCodeChanges(data.extracted_code);
            }

            // Parse and create file tabs if [CREATE_FILES] is present
            if (hasCreateFiles) {
                parseAndCreateFiles(data.response);
            }

            // Hide typing indicator and show response
            hideTypingIndicator();
            await typeAIMessage(data.response);

            // Add to history
            if (!window.conversationHistory) window.conversationHistory = [];
            window.conversationHistory.push({ role: 'user', content: query });
            window.conversationHistory.push({ role: 'assistant', content: data.response });

        } else {
            throw new Error(data.error || 'Unknown error');
        }

    } catch (error) {
        console.error('AI response error:', error);
        hideTypingIndicator();

        // Show a clear error message instead of generating template code
        const errorMsg = error.message || 'Unknown error';
        if (errorMsg.includes('API key') || errorMsg.includes('not configured')) {
            addAIMessage('⚠️ AI API key is not configured. Please add your GROQ_API_KEY to the .env file to enable AI assistance.\n\nTo get a free API key, visit: https://console.groq.com');
        } else if (errorMsg.includes('timeout') || errorMsg.includes('Timeout')) {
            addAIMessage('⏱️ The AI request timed out. Please try again — the server might be busy.');
        } else {
            addAIMessage(`❌ AI request failed: ${errorMsg}\n\nPlease check your internet connection and try again.`);
        }
    } finally {
        isTyping = false;
    }
}

// Parse AI response for [CREATE_FILES] marker and create file tabs
function parseAndCreateFiles(response) {
    try {
        // Extract JSON after [CREATE_FILES] marker
        const markerIndex = response.indexOf('[CREATE_FILES]');
        if (markerIndex === -1) return;

        const afterMarker = response.substring(markerIndex + '[CREATE_FILES]'.length);

        // Try multiple patterns to find the JSON array
        let jsonStr = null;

        // Pattern 1: ```json ... ``` block
        const jsonBlockMatch = afterMarker.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
        if (jsonBlockMatch) {
            jsonStr = jsonBlockMatch[1].trim();
        }

        // Pattern 2: Raw JSON array [ ... ]
        if (!jsonStr) {
            const jsonMatch = afterMarker.match(/\[\s*\{[\s\S]*?\}\s*\]/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }
        }

        if (!jsonStr) return;

        // Clean up the JSON string (handle newlines in content fields)
        // Replace literal newlines inside string values with \n
        jsonStr = jsonStr.replace(/\r\n/g, '\n');

        const filesData = JSON.parse(jsonStr);
        if (!Array.isArray(filesData) || filesData.length === 0) return;

        createFilesFromAI(filesData);
    } catch (e) {
        console.warn('Failed to parse CREATE_FILES data:', e);
        // Try a looser parsing as fallback
        try {
            const markerIndex = response.indexOf('[CREATE_FILES]');
            const afterMarker = response.substring(markerIndex + '[CREATE_FILES]'.length);

            // Try to extract individual file objects
            const fileMatches = afterMarker.matchAll(/"name"\s*:\s*"([^"]+)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"/g);
            const filesData = [];
            for (const match of fileMatches) {
                filesData.push({
                    name: match[1],
                    content: match[2].replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"')
                });
            }
            if (filesData.length > 0) {
                createFilesFromAI(filesData);
            }
        } catch (e2) {
            console.warn('Fallback parsing also failed:', e2);
        }
    }
}

// Create new file tabs from AI-generated file data
function createFilesFromAI(filesData) {
    let firstNewFileId = null;
    let createdCount = 0;

    filesData.forEach(fileData => {
        if (!fileData.name || !fileData.content) return;

        // Check if file already exists
        const existingFile = files.find(f => f.name === fileData.name);
        if (existingFile) {
            // Update existing file content
            existingFile.content = fileData.content;
            existingFile.modified = true;
            if (firstNewFileId === null) firstNewFileId = existingFile.id;
        } else {
            // Create new file tab
            const newFile = {
                id: nextFileId++,
                name: fileData.name,
                content: fileData.content,
                modified: true,
                language: currentLanguage
            };
            files.push(newFile);
            if (firstNewFileId === null) firstNewFileId = newFile.id;
        }
        createdCount++;
    });

    if (createdCount > 0) {
        // Set currentFileId to null FIRST so switchToFile doesn't save
        // the old editor content back over the AI-generated file content
        currentFileId = null;

        renderTabs();
        if (firstNewFileId !== null) {
            switchToFile(firstNewFileId);
        }
        // Save session after creating files
        saveSession();
        showNotification(`🤖 AI created ${createdCount} file(s)!`, 'success');

        // Scroll to show the new tab
        setTimeout(() => {
            scrollToActiveTab();
        }, 100);
    }
}

function addUserMessage(message) {
    const chatDisplay = document.getElementById('chatDisplay');

    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message ai-message-user';
    messageDiv.textContent = message;

    chatDisplay.appendChild(messageDiv);

    // Scroll to bottom
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function addAIMessage(message) {
    const chatDisplay = document.getElementById('chatDisplay');

    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message ai-message-bot';
    messageDiv.innerHTML = formatAIResponse(message);

    chatDisplay.appendChild(messageDiv);

    // Scroll to bottom
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function showTypingIndicator() {
    const chatDisplay = document.getElementById('chatDisplay');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message ai-message-bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span>AI is typing...</span>';

    chatDisplay.appendChild(typingDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    isTyping = true;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

async function typeAIMessage(message) {
    const chatDisplay = document.getElementById('chatDisplay');

    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message ai-message-bot';

    // Format the message with proper code blocks
    const formattedMessage = formatAIResponse(message);
    messageDiv.innerHTML = formattedMessage;

    chatDisplay.appendChild(messageDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Format AI response to properly display code blocks and formatting
function formatAIResponse(message) {
    // Escape HTML first
    let formatted = message
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Convert code blocks (```code```) to styled pre/code elements
    formatted = formatted.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'code';
        return `<pre class="ai-code-block"><code class="language-${language}">${code.trim()}</code></pre>`;
    });

    // Convert inline code (`code`) to styled code elements
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');

    // Convert bullet points
    formatted = formatted.replace(/^[\s]*[-•]\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="ai-list">$&</ul>');

    // Convert numbered lists
    formatted = formatted.replace(/^[\s]*(\d+)\.\s+(.+)$/gm, '<li>$2</li>');

    // Convert line breaks to <br> for regular text (but not inside code blocks)
    formatted = formatted.replace(/\n/g, '<br>');

    // Clean up extra <br> tags inside pre blocks
    formatted = formatted.replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/g, (match, attrs, content) => {
        return `<pre${attrs}>${content.replace(/<br>/g, '\n')}</pre>`;
    });

    return formatted;
}

// Help button function
async function getCodeHelp() {
    if (isTyping) return;
    document.getElementById('aiQuery').value = "Please help me with my code and identify any errors";
    await askAI();
}

// Optimize button function
async function optimizeCode() {
    if (isTyping) return;
    const code = editor.getValue().trim();
    if (!code) {
        addAIMessage("Please write some code first, then I can help you optimize it!");
        return;
    }
    document.getElementById('aiQuery').value = "Please analyze this code and suggest optimizations for better performance and readability";
    await askAI();
}

// Explain button function
async function explainCode() {
    if (isTyping) return;
    const code = editor.getValue().trim();
    if (!code) {
        addAIMessage("Please write some code first, then I can explain it to you!");
        return;
    }
    document.getElementById('aiQuery').value = "Please explain my code line by line and describe what each part does";
    await askAI();
}

// Clear chat function
function clearChat() {
    const chatDisplay = document.getElementById('chatDisplay');
    chatDisplay.innerHTML = `
        <div class="ai-message ai-message-bot">
            Hello! I'm your AI coding assistant. I can help you with code analysis, debugging, and optimization. Try asking me about your code!
        </div>
    `;
    window.conversationHistory = [];
    showNotification('Chat cleared', 'info');
}


async function getEnhancedAIResponse(query, code, language) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    const queryLower = query.toLowerCase();

    // Store in conversation history for context
    if (!window.conversationHistory) {
        window.conversationHistory = [];
    }
    window.conversationHistory.push({ role: 'user', content: query });

    // Keep only last 10 messages for context
    if (window.conversationHistory.length > 10) {
        window.conversationHistory = window.conversationHistory.slice(-10);
    }

    // INTENT DETECTION - What does the user want?
    const intent = detectUserIntent(queryLower, query);

    let response;

    switch (intent.type) {
        case 'code_request':
            response = handleCodeRequest(query, queryLower, language, intent);
            break;
        case 'explain':
            response = handleExplainRequest(query, code, language);
            break;
        case 'debug':
            response = handleDebugRequest(query, code, language);
            break;
        case 'optimize':
            response = handleOptimizeRequest(query, code, language);
            break;
        case 'greeting':
            response = handleGreeting(language);
            break;
        case 'thanks':
            response = handleThanks();
            break;
        case 'question':
            response = handleEducationalQuestion(query, queryLower, language);
            break;
        case 'conversation':
            response = handleConversation(query, queryLower, language, code);
            break;
        default:
            response = handleGeneralRequest(query, queryLower, language, code);
    }

    // Store AI response in history
    window.conversationHistory.push({ role: 'assistant', content: response });

    return response;
}

function detectUserIntent(queryLower, query) {
    // Code generation keywords - most specific first
    const codeKeywords = ['write', 'create', 'make', 'build', 'implement', 'generate', 'code', 'program', 'give me', 'show me', 'clone', 'develop', 'design'];
    const explainKeywords = ['explain', 'what does', 'how does', 'what is', 'understand', 'mean', 'why'];
    const debugKeywords = ['error', 'bug', 'fix', 'problem', 'issue', 'wrong', 'not working', 'broken', 'debug'];
    const optimizeKeywords = ['optimize', 'improve', 'faster', 'better', 'performance', 'efficient'];
    const greetingKeywords = ['hello', 'hi', 'hey', 'good morning', 'good evening'];
    const thanksKeywords = ['thank', 'thanks', 'appreciate'];
    const questionKeywords = ['what is', 'how to', 'can you tell', 'difference between', 'which is better'];

    // Check for code request (highest priority)
    if (codeKeywords.some(kw => queryLower.includes(kw))) {
        // Extract what they want to create
        const projectTypes = extractProjectType(queryLower);
        return { type: 'code_request', project: projectTypes };
    }

    // Check for debug/fix request
    if (debugKeywords.some(kw => queryLower.includes(kw))) {
        return { type: 'debug' };
    }

    // Check for optimization request
    if (optimizeKeywords.some(kw => queryLower.includes(kw))) {
        return { type: 'optimize' };
    }

    // Check for explanation request
    if (explainKeywords.some(kw => queryLower.includes(kw))) {
        return { type: 'explain' };
    }

    // Check for educational question
    if (questionKeywords.some(kw => queryLower.includes(kw))) {
        return { type: 'question' };
    }

    // Check for greeting (only if it's primarily a greeting)
    if (greetingKeywords.some(kw => queryLower.startsWith(kw)) && query.length < 20) {
        return { type: 'greeting' };
    }

    // Check for thanks
    if (thanksKeywords.some(kw => queryLower.includes(kw))) {
        return { type: 'thanks' };
    }

    // Default to conversation/general
    return { type: 'conversation' };
}

function extractProjectType(queryLower) {
    const projects = {
        netflix: 'streaming platform',
        youtube: 'video platform',
        spotify: 'music player',
        twitter: 'social media',
        instagram: 'photo sharing',
        facebook: 'social network',
        amazon: 'e-commerce',
        calculator: 'calculator',
        todo: 'task manager',
        game: 'game',
        chat: 'chat application',
        blog: 'blog',
        portfolio: 'portfolio',
        weather: 'weather app',
        clock: 'clock',
        timer: 'timer',
        quiz: 'quiz app',
        snake: 'snake game',
        tictactoe: 'tic-tac-toe game',
        api: 'API integration'
    };

    for (const [key, value] of Object.entries(projects)) {
        if (queryLower.includes(key)) {
            return { name: key, description: value };
        }
    }

    return { name: 'custom', description: queryLower };
}

function handleCodeRequest(query, queryLower, language, intent) {
    // Generate code based on what the user wants
    const generatedCode = generateSmartCode(queryLower, language, intent.project);

    if (autopilotEnabled) {
        // Write directly to editor
        implementCodeChanges(generatedCode);
        return `Done! I've written the ${intent.project?.description || 'code'} to your editor. Here's what I created:\n\n${generatedCode.substring(0, 300)}${generatedCode.length > 300 ? '...' : ''}\n\nYou can run it using the ▶ Run button!`;
    } else {
        // Show in chat
        return `Here's the ${language} code for ${intent.project?.description || 'your request'}:\n\n\`\`\`${language}\n${generatedCode}\n\`\`\`\n\nYou can copy this code to the editor, or enable Autopilot for me to write it directly!`;
    }
}

function generateSmartCode(queryLower, language, project) {
    // Smart code generation based on project type and language
    const projectName = project?.name || 'custom';

    // Extensive code templates for different projects
    const codeTemplates = {
        python: {
            netflix: `# Netflix Clone - Python Console Version
# A simple movie streaming console application

import random

class Movie:
    def __init__(self, title, genre, rating, duration):
        self.title = title
        self.genre = genre
        self.rating = rating
        self.duration = duration
        self.watched = False
    
    def __str__(self):
        status = "✓ Watched" if self.watched else "Not watched"
        return f"{self.title} | {self.genre} | ⭐ {self.rating} | {self.duration}min | {status}"

class NetflixClone:
    def __init__(self):
        self.movies = [
            Movie("Stranger Things", "Sci-Fi", 4.8, 50),
            Movie("Breaking Bad", "Drama", 4.9, 58),
            Movie("The Crown", "Historical", 4.6, 60),
            Movie("Money Heist", "Thriller", 4.7, 55),
            Movie("Dark", "Mystery", 4.5, 52),
        ]
        self.user = None
        self.watchlist = []
    
    def display_banner(self):
        print("=" * 50)
        print("       🎬 NETFLIX CLONE - Python Edition 🎬")
        print("=" * 50)
    
    def show_menu(self):
        print("\\n📺 MAIN MENU:")
        print("1. Browse Movies")
        print("2. Search Movies")  
        print("3. My Watchlist")
        print("4. Recommendations")
        print("5. Exit")
        return input("\\nChoose option (1-5): ")
    
    def browse_movies(self):
        print("\\n🎬 ALL MOVIES:")
        print("-" * 50)
        for i, movie in enumerate(self.movies, 1):
            print(f"{i}. {movie}")
    
    def search_movies(self):
        query = input("\\n🔍 Search: ").lower()
        results = [m for m in self.movies if query in m.title.lower() or query in m.genre.lower()]
        if results:
            print(f"\\nFound {len(results)} results:")
            for movie in results:
                print(f"  • {movie}")
        else:
            print("No movies found!")
    
    def get_recommendations(self):
        print("\\n🎯 RECOMMENDED FOR YOU:")
        recommended = random.sample(self.movies, min(3, len(self.movies)))
        for movie in recommended:
            print(f"  ⭐ {movie.title} - {movie.genre}")
    
    def run(self):
        self.display_banner()
        while True:
            choice = self.show_menu()
            if choice == "1":
                self.browse_movies()
            elif choice == "2":
                self.search_movies()
            elif choice == "3":
                print("\\n📋 Your Watchlist:", self.watchlist if self.watchlist else "Empty!")
            elif choice == "4":
                self.get_recommendations()
            elif choice == "5":
                print("\\n👋 Thanks for using Netflix Clone!")
                break
            else:
                print("Invalid option!")

# Run the app
if __name__ == "__main__":
    app = NetflixClone()
    app.run()`,

            calculator: `# Calculator Program
def add(a, b): return a + b
def subtract(a, b): return a - b
def multiply(a, b): return a * b
def divide(a, b): return a / b if b != 0 else "Cannot divide by zero"

print("🧮 Simple Calculator")
print("Enter two numbers:")
a = float(input("First number: "))
b = float(input("Second number: "))

print(f"\\n{a} + {b} = {add(a, b)}")
print(f"{a} - {b} = {subtract(a, b)}")
print(f"{a} × {b} = {multiply(a, b)}")
print(f"{a} ÷ {b} = {divide(a, b)}")`,

            todo: `# Todo List Application
class TodoList:
    def __init__(self):
        self.tasks = []
    
    def add_task(self, task):
        self.tasks.append({"task": task, "done": False})
        print(f"✅ Added: {task}")
    
    def complete_task(self, index):
        if 0 <= index < len(self.tasks):
            self.tasks[index]["done"] = True
            print(f"✓ Completed: {self.tasks[index]['task']}")
    
    def show_tasks(self):
        print("\\n📋 YOUR TODO LIST:")
        for i, t in enumerate(self.tasks):
            status = "✓" if t["done"] else "○"
            print(f"  {i+1}. [{status}] {t['task']}")

# Demo
todo = TodoList()
todo.add_task("Learn Python")
todo.add_task("Build a project")
todo.add_task("Practice coding")
todo.complete_task(0)
todo.show_tasks()`,

            game: `# Simple Number Guessing Game
import random

def play_game():
    secret = random.randint(1, 100)
    attempts = 0
    
    print("🎮 NUMBER GUESSING GAME")
    print("I'm thinking of a number between 1 and 100")
    
    while True:
        guess = int(input("\\nYour guess: "))
        attempts += 1
        
        if guess < secret:
            print("📈 Too low!")
        elif guess > secret:
            print("📉 Too high!")
        else:
            print(f"🎉 Correct! You got it in {attempts} attempts!")
            break

play_game()`,

            weather: `# Weather App Simulation
import random

def get_weather(city):
    conditions = ["☀️ Sunny", "🌤️ Partly Cloudy", "☁️ Cloudy", "🌧️ Rainy", "⛈️ Stormy"]
    temp = random.randint(15, 35)
    humidity = random.randint(40, 90)
    condition = random.choice(conditions)
    
    return {
        "city": city,
        "temperature": temp,
        "humidity": humidity,
        "condition": condition
    }

def display_weather(data):
    print("\\n" + "=" * 40)
    print(f"  🌍 Weather for {data['city']}")
    print("=" * 40)
    print(f"  {data['condition']}")
    print(f"  🌡️ Temperature: {data['temperature']}°C")
    print(f"  💧 Humidity: {data['humidity']}%")
    print("=" * 40)

# Demo
city = input("Enter city name: ")
weather = get_weather(city)
display_weather(weather)`,

            hello: `# Hello World Program
print("Hello, World!")
print("Welcome to CodeGenix!")
print("Happy Coding! 🚀")`,

            loop: `# Loop Examples
print("Counting from 1 to 10:")
for i in range(1, 11):
    print(f"  Number: {i}")

print("\\nEven numbers:")
for i in range(2, 21, 2):
    print(f"  {i}", end=" ")
print()`,

            function: `# Function Examples
def greet(name):
    """Greet a person by name."""
    return f"Hello, {name}! Welcome!"

def calculate_area(length, width):
    """Calculate rectangle area."""
    return length * width

def is_prime(n):
    """Check if a number is prime."""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

# Test the functions
print(greet("Developer"))
print(f"Area: {calculate_area(5, 3)}")
print(f"Is 17 prime? {is_prime(17)}")`,

            class: `# Class Example
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old."
    
    def birthday(self):
        self.age += 1
        return f"Happy Birthday! {self.name} is now {self.age}!"

# Create and use objects
person = Person("Alice", 25)
print(person.introduce())
print(person.birthday())`,

            snake: `# Snake Game (Console Version)
import random

class SnakeGame:
    def __init__(self, size=10):
        self.size = size
        self.snake = [(5, 5)]
        self.food = self.spawn_food()
        self.score = 0
        self.direction = 'right'
    
    def spawn_food(self):
        while True:
            pos = (random.randint(0, self.size-1), random.randint(0, self.size-1))
            if pos not in self.snake:
                return pos
    
    def display(self):
        print("\\n" + "+" + "-" * (self.size * 2 + 1) + "+")
        for y in range(self.size):
            row = "|"
            for x in range(self.size):
                if (x, y) == self.snake[0]:
                    row += " @"
                elif (x, y) in self.snake:
                    row += " O"
                elif (x, y) == self.food:
                    row += " *"
                else:
                    row += " ."
            row += " |"
            print(row)
        print("+" + "-" * (self.size * 2 + 1) + "+")
        print(f"Score: {self.score} | Controls: w/a/s/d")

game = SnakeGame()
game.display()
print("\\n🐍 Snake Game initialized! This is a demo version.")`,

            tictactoe: `# Tic-Tac-Toe Game
class TicTacToe:
    def __init__(self):
        self.board = [' '] * 9
        self.current_player = 'X'
    
    def display(self):
        print("\\n")
        for i in range(3):
            row = self.board[i*3:(i+1)*3]
            print(f" {row[0]} | {row[1]} | {row[2]} ")
            if i < 2:
                print("-----------")
    
    def make_move(self, position):
        if self.board[position] == ' ':
            self.board[position] = self.current_player
            self.current_player = 'O' if self.current_player == 'X' else 'X'
            return True
        return False
    
    def check_winner(self):
        wins = [(0,1,2), (3,4,5), (6,7,8), (0,3,6), (1,4,7), (2,5,8), (0,4,8), (2,4,6)]
        for a, b, c in wins:
            if self.board[a] == self.board[b] == self.board[c] != ' ':
                return self.board[a]
        return None

game = TicTacToe()
game.display()
print("\\n🎮 Tic-Tac-Toe ready! Enter 0-8 to place your mark.")`,

            api: `# API Request Example
import json

def mock_api_request(endpoint, method="GET"):
    """Simulated API request (for demo purposes)."""
    mock_data = {
        "/users": [
            {"id": 1, "name": "John Doe", "email": "john@example.com"},
            {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
        ],
        "/posts": [
            {"id": 1, "title": "First Post", "author": "John"},
            {"id": 2, "title": "Hello World", "author": "Jane"}
        ]
    }
    
    print(f"\\n📡 {method} Request to: {endpoint}")
    print("-" * 40)
    
    if endpoint in mock_data:
        response = mock_data[endpoint]
        print("✅ Response:")
        print(json.dumps(response, indent=2))
        return response
    else:
        print("❌ Endpoint not found")
        return None

# Demo API calls
mock_api_request("/users")
mock_api_request("/posts")`,

            custom: `# Custom Python Program
# Generated based on your request

def main():
    print("🚀 Program Starting...")
    print("\\nThis is a custom template.")
    print("Modify it according to your needs!")
    
    # Add your code here
    data = [1, 2, 3, 4, 5]
    print(f"\\nData: {data}")
    print(f"Sum: {sum(data)}")
    print(f"Average: {sum(data)/len(data)}")

if __name__ == "__main__":
    main()
    print("\\n✅ Program completed!")`
        },

        javascript: {
            netflix: `// Netflix Clone - JavaScript Version
class NetflixApp {
    constructor() {
        this.movies = [
            { id: 1, title: "Stranger Things", genre: "Sci-Fi", rating: 4.8, image: "🎬" },
            { id: 2, title: "Breaking Bad", genre: "Drama", rating: 4.9, image: "🎭" },
            { id: 3, title: "The Crown", genre: "Historical", rating: 4.6, image: "👑" },
            { id: 4, title: "Money Heist", genre: "Thriller", rating: 4.7, image: "💰" },
            { id: 5, title: "Dark", genre: "Mystery", rating: 4.5, image: "🌑" }
        ];
        this.watchlist = [];
    }
    
    displayBanner() {
        console.log("=".repeat(50));
        console.log("       🎬 NETFLIX CLONE - JS Edition 🎬");
        console.log("=".repeat(50));
    }
    
    browseMovies() {
        console.log("\\n📺 BROWSE MOVIES:");
        this.movies.forEach((movie, i) => {
            console.log(\`  \${i+1}. \${movie.image} \${movie.title} | \${movie.genre} | ⭐ \${movie.rating}\`);
        });
    }
    
    searchMovies(query) {
        const results = this.movies.filter(m => 
            m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.genre.toLowerCase().includes(query.toLowerCase())
        );
        console.log(\`\\n🔍 Search results for "\${query}":\`);
        results.forEach(m => console.log(\`  • \${m.title}\`));
        return results;
    }
    
    addToWatchlist(movieId) {
        const movie = this.movies.find(m => m.id === movieId);
        if (movie && !this.watchlist.includes(movie)) {
            this.watchlist.push(movie);
            console.log(\`✅ Added "\${movie.title}" to watchlist!\`);
        }
    }
    
    showWatchlist() {
        console.log("\\n📋 YOUR WATCHLIST:");
        if (this.watchlist.length === 0) {
            console.log("  (Empty)");
        } else {
            this.watchlist.forEach(m => console.log(\`  • \${m.title}\`));
        }
    }
}

// Demo
const netflix = new NetflixApp();
netflix.displayBanner();
netflix.browseMovies();
netflix.searchMovies("drama");
netflix.addToWatchlist(1);
netflix.showWatchlist();`,

            calculator: `// Calculator Program
const calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => b !== 0 ? a / b : "Cannot divide by zero"
};

console.log("🧮 JavaScript Calculator");
console.log("5 + 3 =", calculator.add(5, 3));
console.log("10 - 4 =", calculator.subtract(10, 4));
console.log("6 × 7 =", calculator.multiply(6, 7));
console.log("20 ÷ 4 =", calculator.divide(20, 4));`,

            hello: `// Hello World Program
console.log("Hello, World!");
console.log("Welcome to CodeGenix!");
console.log("Happy Coding! 🚀");`,

            function: `// Function Examples
function greet(name) {
    return \`Hello, \${name}! Welcome!\`;
}

const calculateArea = (length, width) => length * width;

const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
};

console.log(greet("Developer"));
console.log("Area:", calculateArea(5, 3));
console.log("Is 17 prime?", isPrime(17));`,

            class: `// JavaScript Class Example
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    introduce() {
        return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
    }
    
    birthday() {
        this.age++;
        return \`Happy Birthday! \${this.name} is now \${this.age}!\`;
    }
}

const person = new Person("Alice", 25);
console.log(person.introduce());
console.log(person.birthday());`,

            todo: `// Todo List Application
class TodoList {
    constructor() {
        this.tasks = [];
    }
    
    addTask(task) {
        this.tasks.push({ task, done: false });
        console.log(\`✅ Added: \${task}\`);
    }
    
    completeTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks[index].done = true;
            console.log(\`✓ Completed: \${this.tasks[index].task}\`);
        }
    }
    
    showTasks() {
        console.log("\\n📋 YOUR TODO LIST:");
        this.tasks.forEach((t, i) => {
            const status = t.done ? "✓" : "○";
            console.log(\`  \${i+1}. [\${status}] \${t.task}\`);
        });
    }
}

const todo = new TodoList();
todo.addTask("Learn JavaScript");
todo.addTask("Build a project");
todo.completeTask(0);
todo.showTasks();`,

            custom: `// Custom JavaScript Program
console.log("🚀 Program Starting...");

// Your code here
const data = [1, 2, 3, 4, 5];
console.log("Data:", data);
console.log("Sum:", data.reduce((a, b) => a + b, 0));
console.log("Average:", data.reduce((a, b) => a + b, 0) / data.length);

console.log("\\n✅ Program completed!");`
        },

        java: {
            hello: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Welcome to CodeGenix!");
    }
}`,
            calculator: `public class Calculator {
    public static int add(int a, int b) { return a + b; }
    public static int subtract(int a, int b) { return a - b; }
    public static int multiply(int a, int b) { return a * b; }
    public static double divide(int a, int b) { 
        return b != 0 ? (double)a / b : 0; 
    }
    
    public static void main(String[] args) {
        System.out.println("Calculator:");
        System.out.println("5 + 3 = " + add(5, 3));
        System.out.println("10 - 4 = " + subtract(10, 4));
        System.out.println("6 * 7 = " + multiply(6, 7));
        System.out.println("20 / 4 = " + divide(20, 4));
    }
}`,
            custom: `public class Main {
    public static void main(String[] args) {
        System.out.println("🚀 Program Starting...");
        
        // Your code here
        int[] data = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : data) {
            sum += num;
        }
        
        System.out.println("Sum: " + sum);
        System.out.println("Average: " + (double)sum / data.length);
    }
}`
        },

        cpp: {
            hello: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    cout << "Welcome to CodeGenix!" << endl;
    return 0;
}`,
            calculator: `#include <iostream>
using namespace std;

int main() {
    cout << "Calculator Demo:" << endl;
    cout << "5 + 3 = " << 5 + 3 << endl;
    cout << "10 - 4 = " << 10 - 4 << endl;
    cout << "6 * 7 = " << 6 * 7 << endl;
    cout << "20 / 4 = " << 20.0 / 4 << endl;
    return 0;
}`,
            custom: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Program Starting..." << endl;
    
    vector<int> data = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int num : data) {
        sum += num;
    }
    
    cout << "Sum: " << sum << endl;
    cout << "Average: " << (double)sum / data.size() << endl;
    
    return 0;
}`
        },

        c: {
            hello: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to CodeGenix!\\n");
    return 0;
}`,
            custom: `#include <stdio.h>

int main() {
    printf("Program Starting...\\n");
    
    int data[] = {1, 2, 3, 4, 5};
    int size = sizeof(data) / sizeof(data[0]);
    int sum = 0;
    
    for (int i = 0; i < size; i++) {
        sum += data[i];
    }
    
    printf("Sum: %d\\n", sum);
    printf("Average: %.2f\\n", (float)sum / size);
    
    return 0;
}`
        },

        go: {
            hello: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    fmt.Println("Welcome to CodeGenix!")
}`,
            calculator: `package main

import "fmt"

func add(a, b int) int { return a + b }
func subtract(a, b int) int { return a - b }
func multiply(a, b int) int { return a * b }
func divide(a, b float64) float64 { return a / b }

func main() {
    fmt.Println("🧮 Go Calculator")
    fmt.Println("5 + 3 =", add(5, 3))
    fmt.Println("10 - 4 =", subtract(10, 4))
    fmt.Println("6 * 7 =", multiply(6, 7))
    fmt.Println("20 / 4 =", divide(20, 4))
}`,
            custom: `package main

import "fmt"

func main() {
    fmt.Println("🚀 Program Starting...")
    
    data := []int{1, 2, 3, 4, 5}
    sum := 0
    
    for _, num := range data {
        sum += num
    }
    
    fmt.Printf("Data: %v\\n", data)
    fmt.Printf("Sum: %d\\n", sum)
    fmt.Printf("Average: %.2f\\n", float64(sum)/float64(len(data)))
    
    fmt.Println("✅ Program completed!")
}`
        },

        rust: {
            hello: `fn main() {
    println!("Hello, World!");
    println!("Welcome to CodeGenix!");
}`,
            calculator: `fn add(a: i32, b: i32) -> i32 { a + b }
fn subtract(a: i32, b: i32) -> i32 { a - b }
fn multiply(a: i32, b: i32) -> i32 { a * b }
fn divide(a: f64, b: f64) -> f64 { a / b }

fn main() {
    println!("🧮 Rust Calculator");
    println!("5 + 3 = {}", add(5, 3));
    println!("10 - 4 = {}", subtract(10, 4));
    println!("6 * 7 = {}", multiply(6, 7));
    println!("20 / 4 = {}", divide(20.0, 4.0));
}`,
            custom: `fn main() {
    println!("🚀 Program Starting...");
    
    let data = vec![1, 2, 3, 4, 5];
    let sum: i32 = data.iter().sum();
    let avg = sum as f64 / data.len() as f64;
    
    println!("Data: {:?}", data);
    println!("Sum: {}", sum);
    println!("Average: {:.2}", avg);
    
    println!("✅ Program completed!");
}`
        },

        php: {
            hello: `<?php
echo "Hello, World!\\n";
echo "Welcome to CodeGenix!\\n";
?>`,
            calculator: `<?php
function add($a, $b) { return $a + $b; }
function subtract($a, $b) { return $a - $b; }
function multiply($a, $b) { return $a * $b; }
function divide($a, $b) { return $b != 0 ? $a / $b : 0; }

echo "🧮 PHP Calculator\\n";
echo "5 + 3 = " . add(5, 3) . "\\n";
echo "10 - 4 = " . subtract(10, 4) . "\\n";
echo "6 * 7 = " . multiply(6, 7) . "\\n";
echo "20 / 4 = " . divide(20, 4) . "\\n";
?>`,
            custom: `<?php
echo "🚀 Program Starting...\\n";

$data = [1, 2, 3, 4, 5];
$sum = array_sum($data);
$avg = $sum / count($data);

echo "Data: " . implode(", ", $data) . "\\n";
echo "Sum: $sum\\n";
echo "Average: $avg\\n";

echo "✅ Program completed!\\n";
?>`
        },

        html: {
            hello: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to CodeGenix!</p>
</body>
</html>`,
            custom: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .container {
            background: white;
            padding: 2rem 3rem;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        h1 { color: #333; }
        button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome!</h1>
        <p>This is a custom HTML page.</p>
        <button onclick="alert('Hello from CodeGenix!')">Click Me</button>
    </div>
</body>
</html>`
        },

        css: {
            custom: `/* CSS Stylesheet */
body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea, #764ba2);
    min-height: 100vh;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem 3rem;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}

button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
}

button:hover {
    transform: translateY(-2px);
}`
        }
    };

    // Get templates for current language
    const langTemplates = codeTemplates[language];

    // If no templates for this language, return a helpful message
    if (!langTemplates) {
        return getGenericCodeForLanguage(language, project?.description || 'custom program');
    }

    // Find matching template
    if (langTemplates[projectName]) {
        return langTemplates[projectName];
    }

    // Fallback to custom template
    return langTemplates.custom || langTemplates.hello || getGenericCodeForLanguage(language, project?.description);
}

// Generate generic code for any language
function getGenericCodeForLanguage(language, description) {
    const langStarters = {
        python: `# ${description}
def main():
    print("🚀 Program Starting...")
    print("Implement your ${description} here!")

if __name__ == "__main__":
    main()`,
        javascript: `// ${description}
console.log("🚀 Program Starting...");
console.log("Implement your ${description} here!");`,
        java: `// ${description}
public class Main {
    public static void main(String[] args) {
        System.out.println("🚀 Program Starting...");
        System.out.println("Implement your ${description} here!");
    }
}`,
        cpp: `// ${description}
#include <iostream>
using namespace std;

int main() {
    cout << "🚀 Program Starting..." << endl;
    cout << "Implement your ${description} here!" << endl;
    return 0;
}`,
        c: `/* ${description} */
#include <stdio.h>

int main() {
    printf("🚀 Program Starting...\\n");
    printf("Implement your ${description} here!\\n");
    return 0;
}`,
        go: `// ${description}
package main

import "fmt"

func main() {
    fmt.Println("🚀 Program Starting...")
    fmt.Println("Implement your ${description} here!")
}`,
        rust: `// ${description}
fn main() {
    println!("🚀 Program Starting...");
    println!("Implement your ${description} here!");
}`,
        php: `<?php
// ${description}
echo "🚀 Program Starting...\\n";
echo "Implement your ${description} here!\\n";
?>`,
        html: `<!DOCTYPE html>
<html>
<head><title>${description}</title></head>
<body>
    <h1>🚀 ${description}</h1>
    <p>Implement your page here!</p>
</body>
</html>`,
        css: `/* ${description} */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}`
    };

    return langStarters[language] || langStarters.python;
}

function handleExplainRequest(query, code, language) {
    if (!code.trim()) {
        return `I'd be happy to explain code! Please write some ${language} code in the editor first, or ask me about a specific programming concept.`;
    }

    const lines = code.split('\\n').filter(l => l.trim());
    let explanation = `📖 **Code Explanation (${language})**\\n\\n`;
    explanation += `Your code has ${lines.length} lines. Here's what it does:\\n\\n`;

    // Analyze code structure
    if (code.includes('def ') || code.includes('function')) {
        explanation += "• **Functions**: Your code defines reusable functions\\n";
    }
    if (code.includes('class ')) {
        explanation += "• **Classes**: Using object-oriented programming\\n";
    }
    if (code.includes('for ') || code.includes('while ')) {
        explanation += "• **Loops**: Iterating over data\\n";
    }
    if (code.includes('if ')) {
        explanation += "• **Conditionals**: Making decisions based on conditions\\n";
    }
    if (code.includes('import ') || code.includes('require(') || code.includes('#include')) {
        explanation += "• **Imports**: Using external libraries/modules\\n";
    }

    explanation += "\\nWould you like me to explain any specific part in more detail?";
    return explanation;
}

function handleExplainRequest(query, code, language) {
    if (!code.trim()) {
        return `I'd be happy to explain code! Please write some ${language} code in the editor, and I'll break it down for you step by step.`;
    }

    let explanation = `📖 **Code Explanation (${language})**\n\n`;

    // Count basic code metrics
    const lines = code.split('\n').filter(line => line.trim()).length;
    explanation += `Your code has **${lines} lines** of code.\n\n`;

    // Language-specific analysis
    if (language === 'python') {
        if (code.includes('def ')) {
            const funcs = code.match(/def \w+/g) || [];
            explanation += `**Functions defined:** ${funcs.map(f => '\`' + f.replace('def ', '') + '()\`').join(', ')}\n\n`;
        }
        if (code.includes('class ')) {
            explanation += `**Uses classes** - Object-oriented programming\n\n`;
        }
        if (code.includes('import ') || code.includes('from ')) {
            const imports = code.match(/(import \w+|from \w+)/g) || [];
            explanation += `**Imports:** ${imports.join(', ')}\n\n`;
        }
    } else if (language === 'javascript') {
        if (code.includes('function ') || code.includes('=>')) {
            explanation += `**Functions:** Your code defines functions for reusable logic.\n\n`;
        }
        if (code.includes('async ') || code.includes('await ')) {
            explanation += `**Async code:** Uses asynchronous operations.\n\n`;
        }
    }

    // General structure analysis
    explanation += `**Code Structure:**\n`;
    if (code.includes('for ') || code.includes('while ')) {
        explanation += `- Uses **loops** for iteration\n`;
    }
    if (code.includes('if ')) {
        explanation += `- Uses **conditionals** for decision making\n`;
    }
    if (code.includes('print') || code.includes('console.log') || code.includes('cout') || code.includes('printf')) {
        explanation += `- Produces **output** to display results\n`;
    }

    explanation += `\nWould you like me to explain any specific part in more detail?`;
    return explanation;
}

function handleDebugRequest(query, code, language) {
    if (!code.trim()) {
        return "I can help debug your code! Please write some code in the editor, or describe the error you're encountering.";
    }

    let response = `🔍 **Debugging Analysis (${language})**\\n\\n`;
    const issues = [];

    // Language-specific checks
    if (language === 'python') {
        if (code.includes('print ') && !code.includes('print(')) {
            issues.push("Use print() with parentheses (Python 3 syntax)");
        }
        if (code.includes('\\t') && code.includes('    ')) {
            issues.push("Mixed tabs and spaces - use consistent indentation");
        }
    } else if (language === 'javascript') {
        if (code.includes('==') && !code.includes('===')) {
            issues.push("Consider using === for strict equality");
        }
        if (code.includes('var ')) {
            issues.push("Consider using let/const instead of var");
        }
    }

    if (issues.length > 0) {
        response += "Potential issues found:\\n";
        issues.forEach(issue => response += `• ${issue}\\n`);
    } else {
        response += "No obvious syntax issues found! If you're getting runtime errors, please share the error message.";
    }

    return response;
}

function handleOptimizeRequest(query, code, language) {
    if (!code.trim()) {
        return "I can help optimize your code! Please write some code in the editor first.";
    }

    let response = `⚡ **Optimization Suggestions (${language})**\\n\\n`;
    const suggestions = [];

    if (language === 'python') {
        if (code.includes('for') && code.includes('.append(')) {
            suggestions.push("Use list comprehension instead of for loop with append");
        }
        if (code.includes('range(len(')) {
            suggestions.push("Use enumerate() instead of range(len())");
        }
    } else if (language === 'javascript') {
        if (code.includes('.forEach') && code.includes('push')) {
            suggestions.push("Consider using .map() instead of forEach with push");
        }
    }

    if (suggestions.length > 0) {
        suggestions.forEach(s => response += `• ${s}\\n`);
    } else {
        response += "Your code looks well-optimized! Some general tips:\\n";
        response += "• Use built-in functions when possible\\n";
        response += "• Avoid nested loops where feasible\\n";
        response += "• Cache computed values if used multiple times";
    }

    return response;
}

function handleGreeting(language) {
    const greetings = [
        `Hello! 👋 I'm your coding assistant. I can help you write ${language} code, explain concepts, debug errors, and more. What would you like to work on?`,
        `Hi there! Ready to code in ${language}? Just tell me what you need - I can write code, explain concepts, or help debug!`,
        `Hey! 🚀 Welcome to CodeGenix! I'm here to help with your ${language} programming. What are you building today?`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}

function handleThanks() {
    const responses = [
        "You're welcome! Happy to help! 😊 Let me know if you need anything else.",
        "No problem! That's what I'm here for. Keep coding! 🚀",
        "Glad I could help! Feel free to ask more questions anytime."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function handleEducationalQuestion(query, queryLower, language) {
    // Educational responses for CS topics
    if (queryLower.includes('what is') || queryLower.includes('difference between')) {
        if (queryLower.includes('algorithm')) {
            return "📚 **Algorithm**: A step-by-step procedure for solving a problem or performing a computation. Think of it like a recipe - a set of instructions to achieve a specific outcome. Common types include sorting algorithms (QuickSort, MergeSort), searching algorithms (Binary Search), and graph algorithms (Dijkstra's).";
        }
        if (queryLower.includes('data structure')) {
            return "📚 **Data Structure**: A way of organizing and storing data for efficient access and modification. Common ones include Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, and Hash Tables. Choosing the right data structure is crucial for performance!";
        }
        if (queryLower.includes('oop') || queryLower.includes('object oriented')) {
            return "📚 **Object-Oriented Programming (OOP)**: A programming paradigm based on 'objects' that contain data and code. Four pillars:\\n• **Encapsulation**: Bundling data and methods\\n• **Abstraction**: Hiding complexity\\n• **Inheritance**: Reusing code from parent classes\\n• **Polymorphism**: Objects taking many forms";
        }
        if (queryLower.includes('api')) {
            return "📚 **API (Application Programming Interface)**: A set of rules and protocols that allows different software applications to communicate with each other. REST APIs are common for web services, using HTTP methods (GET, POST, PUT, DELETE) to perform operations.";
        }
        if (queryLower.includes('database')) {
            return "📚 **Database**: An organized collection of data. Two main types:\\n• **SQL (Relational)**: MySQL, PostgreSQL - structured tables with relationships\\n• **NoSQL**: MongoDB, Redis - flexible schemas for unstructured data";
        }
    }

    return `That's a great question about ${language} programming! Let me help you understand this concept better. Could you be more specific about what aspect you'd like to learn?`;
}

function handleConversation(query, queryLower, language, code) {
    // Handle general conversation and context-aware responses

    // Check for code-related conversation
    if (queryLower.includes('can you') || queryLower.includes('could you')) {
        if (queryLower.includes('code') || queryLower.includes('program') || queryLower.includes('write')) {
            return handleCodeRequest(query, queryLower, language, { project: extractProjectType(queryLower) });
        }
    }

    // Check for change/modify requests
    if (queryLower.includes('change') || queryLower.includes('modify') || queryLower.includes('update')) {
        if (code.trim()) {
            return `I can help modify your code! What specific changes would you like me to make? For example:\\n• Add a new feature\\n• Change a function\\n• Fix a specific part`;
        }
    }

    // Default conversational response
    return `I understand you're asking about "${query}". I can help with:\\n\\n• Writing ${language} code\\n• Explaining programming concepts\\n• Debugging errors\\n• Optimizing code\\n\\nWhat would you like me to help with specifically?`;
}

function handleGeneralRequest(query, queryLower, language, code) {
    // Catch-all for unrecognized queries - still try to be helpful
    if (query.length < 10) {
        return `Could you tell me more about what you need? I can help with:\\n• Writing code\\n• Debugging\\n• Explaining concepts\\n• Optimization`;
    }

    // Check if it might be a code request without explicit keywords
    if (queryLower.includes('clone') || queryLower.includes('app') || queryLower.includes('program') || queryLower.includes('project')) {
        return handleCodeRequest(query, queryLower, language, { project: extractProjectType(queryLower) });
    }

    return `I'd be happy to help! Based on your message, here are some ways I can assist:\\n\\n• If you want code, just say "write" or "create"\\n• If you want explanations, ask "what is" or "explain"\\n• If you have errors, describe the problem\\n\\nHow can I help you today?`;
}

function implementCodeChanges(code) {
    if (!code) return;

    showNotification('✍️ Writing code to editor...', 'info');

    // Get current content and save to history for revert
    const currentContent = editor.getValue();
    saveToHistory(currentContent);

    // Always replace the code entirely (instead of appending)
    editor.setValue(code);

    // Move cursor to end
    const lastLine = editor.lineCount();
    editor.setCursor(lastLine, 0);

    // Mark file as modified
    const currentFile = files.find(f => f.id === currentFileId);
    if (currentFile) {
        currentFile.modified = true;
        currentFile.content = editor.getValue();
        renderTabs();
    }

    // Update revert button state
    updateRevertButtonState();

    setTimeout(() => {
        showNotification('✅ Code replaced successfully! Use Revert to undo.', 'success');
    }, 500);
}

// Save current code to history for revert functionality
function saveToHistory(code) {
    if (!code || !code.trim()) return;

    // Add to history stack
    codeHistory.push({
        content: code,
        timestamp: Date.now(),
        fileId: currentFileId
    });

    // Limit history size
    if (codeHistory.length > MAX_HISTORY_SIZE) {
        codeHistory.shift();
    }

    updateRevertButtonState();
}

// Revert to the previous code version
function revertCode() {
    if (codeHistory.length === 0) {
        showNotification('No previous version to revert to!', 'warning');
        return;
    }

    // Get the last saved version
    const lastVersion = codeHistory.pop();

    if (lastVersion) {
        // Restore the code
        editor.setValue(lastVersion.content);

        // Update file
        const currentFile = files.find(f => f.id === currentFileId);
        if (currentFile) {
            currentFile.content = lastVersion.content;
            currentFile.modified = true;
            renderTabs();
        }

        showNotification('✅ Reverted to previous version!', 'success');
    }

    updateRevertButtonState();
}

// Update the revert button visibility
function updateRevertButtonState() {
    const revertBtn = document.getElementById('revertCodeBtn');
    if (revertBtn) {
        if (codeHistory.length > 0) {
            revertBtn.style.display = 'inline-flex';
            revertBtn.title = `Revert (${codeHistory.length} versions available)`;
        } else {
            revertBtn.style.display = 'none';
        }
    }
}

function getContextualResponse(query, code, language) {
    const responses = [
        `That's an interesting question about ${language}! Based on your current code, I can help you with that. What specific aspect would you like me to focus on?`,
        `I understand you're working with ${language}. Let me help you with that. Could you provide more details about what you're trying to achieve?`,
        `Great question! In ${language}, there are several approaches to handle this. What's your specific use case or goal?`,
        `I'm here to help with your ${language} development! Could you elaborate on what you're looking for so I can provide the most relevant assistance?`,
        `Interesting! Let me think about this in the context of ${language} programming. Can you give me more details about what you're trying to accomplish?`,
        `I'd be happy to help you with that! For ${language}, there are different ways to approach this problem. What's the specific challenge you're facing?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function getAIErrorHelp(error) {
    // Auto-open AI assistant when there's an error
    if (!aiAssistantOpen) {
        toggleAI();
    }

    const suggestions = document.getElementById('aiSuggestions');
    const errorItem = document.createElement('div');
    errorItem.className = 'suggestion-item';
    errorItem.style.borderLeft = '3px solid var(--warning-color)';
    errorItem.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span><strong>Error Help:</strong> ${getErrorSuggestion(error)}</span>`;

    suggestions.appendChild(errorItem);
    suggestions.scrollTop = suggestions.scrollHeight;
}

function getErrorSuggestion(error) {
    const errorLower = error.toLowerCase();

    if (errorLower.includes('syntax')) {
        return 'Check for missing brackets, quotes, or semicolons. Verify proper indentation.';
    } else if (errorLower.includes('undefined') || errorLower.includes('not defined')) {
        return 'Make sure all variables are declared before use. Check for typos in variable names.';
    } else if (errorLower.includes('import') || errorLower.includes('module')) {
        return 'Verify that all required modules are installed and imported correctly.';
    } else {
        return 'Review the error message carefully and check the line number mentioned. Use debugging techniques to isolate the issue.';
    }
}

// Settings and theme functions
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('active');
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    body.classList.toggle('light-theme');

    if (body.classList.contains('light-theme')) {
        themeToggle.checked = true;
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.checked = false;
        localStorage.setItem('theme', 'dark');
    }

    // Update CodeMirror theme
    if (editor) {
        const newTheme = body.classList.contains('light-theme') ? 'default' : 'monokai';
        editor.setOption('theme', newTheme);
    }
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.checked = true;
        if (editor) {
            editor.setOption('theme', 'default');
        }
    } else {
        themeToggle.checked = false;
    }
}

// Find/Replace functionality
let findCursor = null;
let findMatches = [];
let currentMatchIndex = -1;
let findMarks = [];

function toggleFindReplace() {
    const modal = document.getElementById('findReplaceModal');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        // Focus find input when opened
        setTimeout(() => {
            document.getElementById('findInput').focus();
        }, 100);
    } else {
        // Clear highlights when closing
        clearFindHighlights();
    }
}

function clearFindHighlights() {
    findMarks.forEach(mark => mark.clear());
    findMarks = [];
    findMatches = [];
    currentMatchIndex = -1;
    document.getElementById('matchCount').textContent = '';
}

function handleFindKeyup(event) {
    const query = document.getElementById('findInput').value;
    if (!query) {
        clearFindHighlights();
        return;
    }

    // Perform search on each keyup
    performSearch(query);

    // If Enter is pressed, go to next
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            findPrevious();
        } else {
            findNext();
        }
    }
}

function performSearch(query) {
    if (!editor || !query) return;

    // Clear previous highlights
    clearFindHighlights();

    const caseSensitive = document.getElementById('caseSensitive').checked;
    const wholeWord = document.getElementById('wholeWord').checked;
    const useRegex = document.getElementById('useRegex').checked;

    let searchQuery;
    if (useRegex) {
        try {
            searchQuery = new RegExp(query, caseSensitive ? 'g' : 'gi');
        } catch (e) {
            document.getElementById('matchCount').textContent = 'Invalid regex';
            return;
        }
    } else {
        let escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
            escapedQuery = '\\b' + escapedQuery + '\\b';
        }
        searchQuery = new RegExp(escapedQuery, caseSensitive ? 'g' : 'gi');
    }

    // Find all matches
    const content = editor.getValue();
    let match;
    const regex = new RegExp(searchQuery.source, searchQuery.flags);

    while ((match = regex.exec(content)) !== null) {
        const from = editor.posFromIndex(match.index);
        const to = editor.posFromIndex(match.index + match[0].length);
        findMatches.push({ from, to });

        // Highlight match
        const mark = editor.markText(from, to, {
            className: 'cm-find-highlight'
        });
        findMarks.push(mark);

        // Prevent infinite loop for zero-length matches
        if (match.index === regex.lastIndex) regex.lastIndex++;
    }

    // Update match count display
    const matchCountEl = document.getElementById('matchCount');
    if (findMatches.length > 0) {
        matchCountEl.textContent = `${findMatches.length} match${findMatches.length > 1 ? 'es' : ''}`;
    } else {
        matchCountEl.textContent = 'No matches';
    }

    currentMatchIndex = -1;
}

function findNext() {
    const query = document.getElementById('findInput').value;
    if (!query) return;

    if (findMatches.length === 0) {
        performSearch(query);
        if (findMatches.length === 0) return;
    }

    currentMatchIndex = (currentMatchIndex + 1) % findMatches.length;
    goToMatch(currentMatchIndex);
}

function findPrevious() {
    const query = document.getElementById('findInput').value;
    if (!query) return;

    if (findMatches.length === 0) {
        performSearch(query);
        if (findMatches.length === 0) return;
    }

    currentMatchIndex = (currentMatchIndex - 1 + findMatches.length) % findMatches.length;
    goToMatch(currentMatchIndex);
}

function goToMatch(index) {
    if (index < 0 || index >= findMatches.length) return;

    const match = findMatches[index];

    // Remove previous active highlight
    findMarks.forEach(mark => {
        const pos = mark.find();
        if (pos) {
            mark.clear();
        }
    });

    // Re-highlight all matches and make current one stand out
    findMarks = [];
    findMatches.forEach((m, i) => {
        const className = i === index ? 'cm-find-highlight-active' : 'cm-find-highlight';
        const mark = editor.markText(m.from, m.to, { className });
        findMarks.push(mark);
    });

    // Scroll to the current match
    editor.setSelection(match.from, match.to);
    editor.scrollIntoView({ from: match.from, to: match.to }, 100);

    // Update match count to show position
    document.getElementById('matchCount').textContent = `${index + 1} of ${findMatches.length}`;
}

function replaceOne() {
    if (findMatches.length === 0 || currentMatchIndex < 0) {
        findNext();
        return;
    }

    const replaceText = document.getElementById('replaceInput').value;
    const match = findMatches[currentMatchIndex];

    editor.replaceRange(replaceText, match.from, match.to);

    // Re-perform search after replacement
    const query = document.getElementById('findInput').value;
    performSearch(query);

    // Go to next match
    if (findMatches.length > 0) {
        if (currentMatchIndex >= findMatches.length) {
            currentMatchIndex = 0;
        }
        goToMatch(currentMatchIndex);
    }

    showNotification('Replaced 1 occurrence', 'success');
}

function replaceAll() {
    const query = document.getElementById('findInput').value;
    const replaceText = document.getElementById('replaceInput').value;
    if (!query) return;

    if (findMatches.length === 0) {
        performSearch(query);
        if (findMatches.length === 0) {
            showNotification('No matches to replace', 'warning');
            return;
        }
    }

    const count = findMatches.length;

    // Replace from bottom to top to preserve positions
    for (let i = findMatches.length - 1; i >= 0; i--) {
        const match = findMatches[i];
        editor.replaceRange(replaceText, match.from, match.to);
    }

    clearFindHighlights();
    showNotification(`Replaced ${count} occurrence${count > 1 ? 's' : ''}`, 'success');
}

function clearChat() {
    const chatDisplay = document.getElementById('chatDisplay');
    if (chatDisplay) {
        chatDisplay.innerHTML = `
            <div class="chat-message self-start bg-blue-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm">
                Hello! I'm your AI coding assistant. I can help you with code analysis, debugging, and optimization. Try asking me about your code!
            </div>
        `;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '9999',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Tab Belt Scrolling Functions
function scrollTabsBelt(direction) {
    const tabsContainer = document.querySelector('.file-tabs-container');
    if (!tabsContainer) {
        console.warn('Tabs container not found');
        return;
    }

    const scrollAmount = 150; // Pixels to scroll per click
    const currentScroll = tabsContainer.scrollLeft;

    if (direction === 'left') {
        tabsContainer.scrollTo({
            left: Math.max(0, currentScroll - scrollAmount),
            behavior: 'smooth'
        });
    } else if (direction === 'right') {
        const maxScroll = tabsContainer.scrollWidth - tabsContainer.clientWidth;
        tabsContainer.scrollTo({
            left: Math.min(maxScroll, currentScroll + scrollAmount),
            behavior: 'smooth'
        });
    }

    // Update button states after scrolling
    setTimeout(() => {
        updateScrollButtonStates();
    }, 350);
}

function updateScrollButtonStates() {
    const tabsContainer = document.querySelector('.file-tabs-container');
    const leftBtn = document.getElementById('scrollLeft');
    const rightBtn = document.getElementById('scrollRight');

    if (!tabsContainer || !leftBtn || !rightBtn) {
        return;
    }

    const scrollLeft = tabsContainer.scrollLeft;
    const scrollWidth = tabsContainer.scrollWidth;
    const clientWidth = tabsContainer.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    // Small threshold to account for rounding errors
    const threshold = 2;

    // Enable/disable left button
    if (scrollLeft <= threshold) {
        leftBtn.disabled = true;
        leftBtn.classList.add('disabled');
    } else {
        leftBtn.disabled = false;
        leftBtn.classList.remove('disabled');
    }

    // Enable/disable right button
    if (scrollLeft >= maxScroll - threshold || maxScroll <= 0) {
        rightBtn.disabled = true;
        rightBtn.classList.add('disabled');
    } else {
        rightBtn.disabled = false;
        rightBtn.classList.remove('disabled');
    }
}

// ===== Settings Functions =====

function switchSettingsTab(tabName) {
    // Remove active from all tabs and panels
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.settings-panel').forEach(panel => panel.classList.remove('active'));

    // Activate the selected tab
    const tabs = document.querySelectorAll('.settings-tab');
    const tabMap = { 'editor': 0, 'appearance': 1, 'about': 2 };
    if (tabMap[tabName] !== undefined && tabs[tabMap[tabName]]) {
        tabs[tabMap[tabName]].classList.add('active');
    }

    // Activate the corresponding panel
    const panelMap = {
        'editor': 'editorSettings',
        'appearance': 'appearanceSettings',
        'about': 'aboutSettings'
    };
    const panel = document.getElementById(panelMap[tabName]);
    if (panel) {
        panel.classList.add('active');
    }
}

function applyEditorSettings() {
    if (!editor) return;

    // Font Family
    const fontFamily = document.getElementById('fontFamilySelect').value;
    editor.getWrapperElement().style.fontFamily = fontFamily;

    // Font Size
    const fontSize = document.getElementById('fontSizeSelect').value;
    editor.getWrapperElement().style.fontSize = fontSize + 'px';

    // Tab Size
    const tabSize = parseInt(document.getElementById('tabSizeSelect').value);
    editor.setOption('indentUnit', tabSize);
    editor.setOption('tabSize', tabSize);

    // Line Numbers
    const showLineNumbers = document.getElementById('lineNumbersToggle').checked;
    editor.setOption('lineNumbers', showLineNumbers);

    // Word Wrap
    const wordWrap = document.getElementById('wordWrapToggle').checked;
    editor.setOption('lineWrapping', wordWrap);

    // Match Brackets (from appearance tab)
    const matchBrackets = document.getElementById('matchBracketsToggle');
    if (matchBrackets) {
        editor.setOption('matchBrackets', matchBrackets.checked);
    }

    // Active Line Highlight
    const activeLine = document.getElementById('activeLineToggle');
    if (activeLine) {
        editor.setOption('styleActiveLine', activeLine.checked);
    }

    // Refresh editor to apply visual changes
    setTimeout(() => {
        editor.refresh();
    }, 50);
}

function saveSettings() {
    const settings = {
        fontFamily: document.getElementById('fontFamilySelect').value,
        fontSize: document.getElementById('fontSizeSelect').value,
        tabSize: document.getElementById('tabSizeSelect').value,
        lineNumbers: document.getElementById('lineNumbersToggle').checked,
        wordWrap: document.getElementById('wordWrapToggle').checked,
        autoSave: document.getElementById('autoSave').checked,
        aiEnabled: document.getElementById('aiEnabled').checked,
        editorTheme: document.getElementById('editorThemeSelect').value,
        matchBrackets: document.getElementById('matchBracketsToggle').checked,
        activeLine: document.getElementById('activeLineToggle').checked
    };

    localStorage.setItem('codegenix-settings', JSON.stringify(settings));

    // Apply settings immediately
    applyEditorSettings();

    showNotification('Settings saved successfully!', 'success');
}

function loadSavedSettings() {
    const saved = localStorage.getItem('codegenix-settings');
    if (!saved) return;

    try {
        const settings = JSON.parse(saved);

        // Restore form values
        if (settings.fontFamily) {
            document.getElementById('fontFamilySelect').value = settings.fontFamily;
        }
        if (settings.fontSize) {
            document.getElementById('fontSizeSelect').value = settings.fontSize;
        }
        if (settings.tabSize) {
            document.getElementById('tabSizeSelect').value = settings.tabSize;
        }
        if (settings.lineNumbers !== undefined) {
            document.getElementById('lineNumbersToggle').checked = settings.lineNumbers;
        }
        if (settings.wordWrap !== undefined) {
            document.getElementById('wordWrapToggle').checked = settings.wordWrap;
        }
        if (settings.autoSave !== undefined) {
            document.getElementById('autoSave').checked = settings.autoSave;
        }
        if (settings.aiEnabled !== undefined) {
            document.getElementById('aiEnabled').checked = settings.aiEnabled;
        }
        if (settings.editorTheme) {
            document.getElementById('editorThemeSelect').value = settings.editorTheme;
            // Apply editor theme (but don't override the UI light/dark toggle)
            editor.setOption('theme', settings.editorTheme);
        }
        if (settings.matchBrackets !== undefined) {
            document.getElementById('matchBracketsToggle').checked = settings.matchBrackets;
        }
        if (settings.activeLine !== undefined) {
            document.getElementById('activeLineToggle').checked = settings.activeLine;
        }

        // Apply the loaded settings to the editor
        applyEditorSettings();
    } catch (e) {
        console.warn('Failed to load saved settings:', e);
    }
}

function resetSettings() {
    // Reset all form controls to defaults
    document.getElementById('fontFamilySelect').value = "'Consolas', monospace";
    document.getElementById('fontSizeSelect').value = '14';
    document.getElementById('tabSizeSelect').value = '4';
    document.getElementById('lineNumbersToggle').checked = true;
    document.getElementById('wordWrapToggle').checked = true;
    document.getElementById('autoSave').checked = true;
    document.getElementById('aiEnabled').checked = true;
    document.getElementById('editorThemeSelect').value = 'monokai';
    document.getElementById('matchBracketsToggle').checked = true;
    document.getElementById('activeLineToggle').checked = true;

    // Remove saved settings
    localStorage.removeItem('codegenix-settings');

    // Apply defaults
    applyEditorSettings();
    editor.setOption('theme', 'monokai');

    showNotification('Settings reset to defaults', 'success');
}

function applyEditorTheme() {
    if (!editor) return;

    const theme = document.getElementById('editorThemeSelect').value;
    editor.setOption('theme', theme);

    showNotification(`Editor theme changed to ${theme}`, 'success');
}

function setUITheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    if (theme === 'light') {
        body.classList.add('light-theme');
        themeToggle.checked = true;
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        themeToggle.checked = false;
        localStorage.setItem('theme', 'dark');
    }

    // Also update editor theme based on the UI theme if user hasn't customized it
    const editorThemeSelect = document.getElementById('editorThemeSelect');
    if (theme === 'light' && editorThemeSelect.value === 'monokai') {
        editorThemeSelect.value = 'default';
        editor.setOption('theme', 'default');
    } else if (theme === 'dark' && editorThemeSelect.value === 'default') {
        editorThemeSelect.value = 'monokai';
        editor.setOption('theme', 'monokai');
    }

    showNotification(`UI theme set to ${theme}`, 'success');
}

function formatCode() {
    if (!editor) return;

    // Select all content and auto-indent
    const totalLines = editor.lineCount();
    for (let i = 0; i < totalLines; i++) {
        editor.indentLine(i, 'smart');
    }

    showNotification('Code formatted', 'success');
}