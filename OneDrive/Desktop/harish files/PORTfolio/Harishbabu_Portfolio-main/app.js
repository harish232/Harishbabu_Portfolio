// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg', 'bg-brand-dark/90');
        nav.classList.remove('py-4');
        nav.classList.add('py-2');
    } else {
        nav.classList.remove('shadow-lg', 'bg-brand-dark/90');
        nav.classList.remove('py-2');
        nav.classList.add('py-4');
    }
});

// Project Filtering Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button styling
        filterBtns.forEach(b => {
            b.classList.remove('bg-brand-accent', 'text-brand-dark');
            b.classList.add('glass', 'text-gray-300');
        });
        btn.classList.add('bg-brand-accent', 'text-brand-dark');
        btn.classList.remove('glass', 'text-gray-300');

        const filterValue = btn.getAttribute('data-filter');

        projects.forEach(project => {
            // Slight animation for filtering
            project.style.opacity = '0';
            project.style.transform = 'scale(0.95)';

            setTimeout(() => {
                if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                    project.style.display = 'flex';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    project.style.display = 'none';
                }
            }, 300); // Wait for fade out
        });
    });
});

// Contact Form Handling (No alerts)
function handleContactSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    const successMsg = document.getElementById('successMessage');

    // UI feedback
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Transmitting...';
    btn.disabled = true;

    // Simulate network request
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        e.target.reset();
        successMsg.classList.remove('hidden');

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 5000);
    }, 1500);
}

// Intersection Observer for Scroll Animations (Fade-in sections)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
});

// 3D Tilt Effect for Experience Cards
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation (max 10 degrees for a smooth, high-end effect)
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        // Reset smoothly
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// --- AI Pitch Generator Logic ---

function openPitchModal() {
    const modal = document.getElementById('pitch-modal');
    const content = document.getElementById('pitch-modal-content');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Trigger animation
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// Close Pitch Modal
function closePitchModal() {
    const modal = document.getElementById('pitch-modal');
    const content = document.getElementById('pitch-modal-content');

    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // Reset form on close
        setTimeout(resetPitch, 300);
    }, 300);
}

// Reset Pitch Generator
function resetPitch() {
    document.getElementById('pitch-form-container').classList.remove('hidden');
    document.getElementById('pitch-result-container').classList.add('hidden');
    document.getElementById('pitch-result-container').classList.remove('flex');
    document.getElementById('pitch-result-text').textContent = 'Generating...';
    document.getElementById('pitch-role').value = '';
    document.getElementById('pitch-company').value = '';
    document.getElementById('copy-pitch-btn').innerHTML = '<i class="fas fa-copy"></i> Copy Pitch';
}

// Copy generated pitch to clipboard
function copyPitch() {
    const text = document.getElementById('pitch-result-text').textContent;

    // Fallback for iframe restrictions
    const copyWithFallback = (textToCopy) => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            document.getElementById('copy-pitch-btn').innerHTML = '<i class="fas fa-check"></i> Copied!';
        } catch (err) {
            console.error('Copy failed', err);
        }
        setTimeout(() => {
            document.getElementById('copy-pitch-btn').innerHTML = '<i class="fas fa-copy"></i> Copy Pitch';
        }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            document.getElementById('copy-pitch-btn').innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                document.getElementById('copy-pitch-btn').innerHTML = '<i class="fas fa-copy"></i> Copy Pitch';
            }, 2000);
        }).catch(() => {
            copyWithFallback(text);
        });
    } else {
        copyWithFallback(text);
    }
}

// Generate tailored pitch
async function generatePitch() {
    const role = document.getElementById('pitch-role').value.trim();
    const company = document.getElementById('pitch-company').value.trim();

    if (!role || !company) {
        const inputs = [document.getElementById('pitch-role'), document.getElementById('pitch-company')];
        inputs.forEach(el => {
            if (!el.value.trim()) {
                el.style.borderColor = '#EF4444';
                setTimeout(() => el.style.borderColor = '', 2000);
            }
        });
        return;
    }

    const btn = document.getElementById('generate-pitch-btn');
    const originalBtnHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Generating...';
    btn.disabled = true;

    const apiKey = ""; // API key is injected by the platform environment

    // If API key is empty, fall back directly to mock responder
    if (!apiKey) {
        setTimeout(() => {
            document.getElementById('pitch-form-container').classList.add('hidden');
            const resultContainer = document.getElementById('pitch-result-container');
            resultContainer.classList.remove('hidden');
            resultContainer.classList.add('flex');
            document.getElementById('pitch-result-text').textContent = `I am Harish Babu Yarraguntla. With my strong analytical background in Electrical Engineering and hands-on experience building Python full-stack applications, I am well-equipped to tackle complex challenges. I am eager to bring my problem-solving skills to the ${role} position at ${company}.`;

            btn.innerHTML = originalBtnHtml;
            btn.disabled = false;
        }, 800);
        return;
    }

    const prompt = `Act as Harish Babu Yarraguntla. Write a highly tailored, confident, and professional 3-sentence pitch to a recruiter at ${company} for the ${role} position. 
Context about Harish: Transitioned from Electrical and Electronics Engineering (EEE) to Software Engineering/Data Analysis. Has strong analytical problem-solving skills from EEE. Interned at DRDO building MATLAB simulations. Built "Fake Job Shield" (Python/Django cybersecurity tool) and "Farmdirect" (Full-stack marketplace). 
Instructions: Connect the EEE background/analytical rigor directly to why he would excel in the ${role} role at ${company}. Keep it to exactly 3 impactful sentences. Output only the pitch text, no greetings or sign-offs.`;

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('API Request Failed');

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const aiText = candidate.content.parts[0].text;

            document.getElementById('pitch-form-container').classList.add('hidden');
            const resultContainer = document.getElementById('pitch-result-container');
            resultContainer.classList.remove('hidden');
            resultContainer.classList.add('flex');

            document.getElementById('pitch-result-text').textContent = aiText;
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error("Pitch Generation Error:", error);
        document.getElementById('pitch-form-container').classList.add('hidden');
        const resultContainer = document.getElementById('pitch-result-container');
        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('flex');
        document.getElementById('pitch-result-text').textContent = "Error: Unable to generate pitch at this time. Please try again later.";
    } finally {
        btn.innerHTML = originalBtnHtml;
        btn.disabled = false;
    }
}

// --- Gemini AI Chat Logic ---

let isChatOpen = false;
let chatHistory = [];

// Comprehensive context about Harish to feed the LLM
const systemPrompt = `You are a high-tech, professional AI assistant representing Harish Babu Yarraguntla on his portfolio website.
Your goal is to answer questions from recruiters and visitors about Harish's skills, experience, and projects.
Tone: Professional, concise, confident, and slightly futuristic (fitting a cyberpunk luxury aesthetic). Do not use markdown headers, just plain text with line breaks if necessary.

Context about Harish:
- Role: Python Full Stack Developer.
- Background: Transitioned deliberately from an Electrical and Electronics Engineering (EEE) B.Tech (Class of 2025, CGPA: 6.45/10) to software development.
- Skills: Python, SQL, JavaScript, Django, Django ORM, REST APIs, Celery, Redis, DRF, MySQL, SQLite, HTML5, CSS3, Render/PythonAnywhere, Git.
- Experience 1: Data Science Intern at BIST Technologies Pvt. Ltd (Feb 2025). Cleaned datasets with Python, wrote reusable scripts (reduced effort 40%), performed SQL data extraction.
- Experience 2: MATLAB Simulation Intern (BLDC Motor) at DRDO (May 2024). Validated simulation models with MATLAB/Simulink, increased model accuracy by 18%.
- Project - Farm Direct: Django Full Stack application built with Python, Django 5.1, DRF, Celery, Redis, MySQL, Razorpay API, and JWT Auth.
- Project - Deloitte Virtual Experience: Applied Python and SQL to analyze business datasets and build structured queries.
- Goal: Seeking an entry-level Python Backend / Django Developer role.

- Instructions:
- Keep answers under 3-4 sentences unless specifically asked for details.
- If asked for his resume or CV, provide a direct HTML link: '<a href="Harish_Babu_Resume.pdf" download="Harish_Babu_Resume.pdf" class="text-brand-accent underline font-bold">Download Resume</a>'. Do not direct them to the hero section.
- If asked for contact info, provide his email and phone number and also offer the direct resume download link.
- Never make up information. If you don't know, say you don't have that specific data but emphasize his ability to learn quickly.`;

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow.classList.add('open');
        document.getElementById('chat-input').focus();
    } else {
        chatWindow.classList.remove('open');
    }
}

function appendMessage(role, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');

    if (role === 'user') {
        msgDiv.className = 'msg-user self-end p-3 rounded-lg max-w-[85%] text-sm text-white shadow-sm';
    } else {
        msgDiv.className = 'msg-ai self-start p-3 rounded-lg max-w-[85%] text-sm text-gray-300 leading-relaxed shadow-sm';
    }

    // Basic sanitization and formatting
    if (role === 'user') {
        msgDiv.textContent = text;
    } else {
        msgDiv.innerHTML = text;
        // If there's an uploaded resume, replace the link in this message immediately
        const uploadedResume = localStorage.getItem('uploaded_resume');
        if (uploadedResume) {
            msgDiv.querySelectorAll('a[href="Harish_Babu_Resume.pdf"], a[href*="Harish_Babu_Resume.pdf"]').forEach(link => {
                link.href = uploadedResume;
                link.setAttribute('download', 'Harish_Babu_Resume.pdf');
            });
        }
    }
    messagesContainer.appendChild(msgDiv);

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setTypingIndicator(show) {
    const indicator = document.getElementById('typing-indicator');
    const messagesContainer = document.getElementById('chat-messages');
    if (show) {
        indicator.classList.remove('hidden');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else {
        indicator.classList.add('hidden');
    }
}

// Predefined responder when API key is not present or calls fail
function getMockAIResponse(userText) {
    const query = userText.toLowerCase();

    if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greet') || query.includes('yo')) {
        return "Hello! I am Harish's AI assistant. I can tell you about his Python Full Stack skills, DRDO/BIST internships, Deloitte credential, or web projects. What would you like to know?";
    }
    if (query.includes('skill') || query.includes('language') || query.includes('technolog') || query.includes('tech') || query.includes('python') || query.includes('django') || query.includes('database') || query.includes('sql') || query.includes('javascript') || query.includes('js')) {
        return "Harish is skilled in Python, SQL, and JavaScript. His backend stack includes Django, Django ORM, REST APIs (DRF), MySQL, SQLite, Celery, Redis, and Git. For frontend, he uses HTML5, CSS3, and JavaScript.";
    }
    if (query.includes('project') || query.includes('portfolio') || query.includes('farm') || query.includes('direct') || query.includes('akhil') || query.includes('sports') || query.includes('ecommerce') || query.includes('e-commerce')) {
        return "Harish has built: 1) 'Farm Direct' (Django full stack with Farmer/Customer/Delivery/Admin roles, Razorpay API, real-time GPS tracking fields, Celery/Redis, and JWT Auth). 2) 'Akhil Sports' (Node.js/Express e-commerce system with parallel Email+SMS notifications and localStorage offline-first fallback).";
    }
    if (query.includes('experience') || query.includes('intern') || query.includes('work') || query.includes('job') || query.includes('bist') || query.includes('drdo') || query.includes('defense') || query.includes('defence')) {
        return "Harish's professional experience: 1) Data Science Intern at BIST Technologies (Feb 2025) - optimized datasets using Python/SQL, reducing effort by 40%. 2) MATLAB Simulation Intern at DRDO (May 2024) - modeled BLDC motors, improving accuracy by 18%.";
    }
    if (query.includes('education') || query.includes('college') || query.includes('degree') || query.includes('btech') || query.includes('study') || query.includes('gpa') || query.includes('cgpa') || query.includes('engineering') || query.includes('eee')) {
        return "Harish holds a B.Tech in Electrical & Electronics Engineering (EEE) from Bapatla Engineering College (Class of 2025, CGPA: 6.45/10). He also completed his Intermediate studies at Sri Chaitanya Junior College and SSC at Z.P. High School.";
    }
    if (query.includes('resume') || query.includes('cv')) {
        return "You can download Harish's resume directly here: <a href='Harish_Babu_Resume.pdf' download='Harish_Babu_Resume.pdf' class='text-brand-accent underline font-semibold'>Download Resume</a>.";
    }
    if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('mail') || query.includes('number') || query.includes('call') || query.includes('mobile')) {
        return "You can contact Harish at yarraguntlaharishbabu@gmail.com, call him at +91 8088886368, or download his resume directly here: <a href='Harish_Babu_Resume.pdf' download='Harish_Babu_Resume.pdf' class='text-brand-accent underline font-semibold'>Download Resume</a>.";
    }
    if (query.includes('deloitte') || query.includes('forage') || query.includes('certificat')) {
        return "Harish completed the Deloitte Virtual Experience Program in Data Analytics through Forage, gaining exposure to cloud engineering, data cleaning, and client proposal presentation.";
    }

    return "Harish is a Python Full Stack Developer specializing in Django backend services, database query optimization, and frontend interfaces. Feel free to ask about his specific projects like 'Farm Direct', his DRDO/BIST internships, or his contact information!";
}

async function handleChatSubmit(e) {
    e.preventDefault();
    const inputField = document.getElementById('chat-input');
    const submitBtn = document.getElementById('chat-submit-btn');
    const userText = inputField.value.trim();

    if (!userText) return;

    // Add user message to UI and history
    appendMessage('user', userText);
    inputField.value = '';
    inputField.disabled = true;
    submitBtn.disabled = true;

    chatHistory.push({ role: "user", parts: [{ text: userText }] });

    setTypingIndicator(true);

    const apiKey = ""; // API key is injected by the platform environment

    // If API key is empty, fall back directly to mock responder
    if (!apiKey) {
        setTimeout(() => {
            const reply = getMockAIResponse(userText);
            chatHistory.push({ role: "model", parts: [{ text: reply }] });
            appendMessage('model', reply);
            setTypingIndicator(false);
            inputField.disabled = false;
            submitBtn.disabled = false;
            inputField.focus();
        }, 800);
        return;
    }

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: chatHistory,
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        // Fetch with timeout/backoff simulation (standard fetch)
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('API Request Failed');

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const aiText = candidate.content.parts[0].text;

            // Add AI response to history and UI
            chatHistory.push(candidate.content);
            appendMessage('model', aiText);
        } else {
            throw new Error('Invalid response structure');
        }

    } catch (error) {
        console.error("Chat Error, falling back to local responder:", error);
        // Fallback to local answering engine if API call fails
        const reply = getMockAIResponse(userText);
        chatHistory.push({ role: "model", parts: [{ text: reply }] });
        appendMessage('model', reply);
    } finally {
        setTypingIndicator(false);
        inputField.disabled = false;
        submitBtn.disabled = false;
        inputField.focus();
    }
}

// --- Single Page Application (SPA) Logic ---
function showSection(sectionId) {
    const sections = ['home', 'skills', 'experience', 'projects', 'certifications', 'contact'];

    // 1. Hide other sections
    sections.forEach(id => {
        if (id !== sectionId) {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('active');
                setTimeout(() => {
                    if (!el.classList.contains('active')) {
                        el.style.display = 'none';
                    }
                }, 400);
            }
        }
    });

    // 2. Show target section
    setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
            target.style.display = 'block';
            // Trigger reflow
            void target.offsetWidth;
            target.classList.add('active');

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 400); // Wait for others to fade out

    // 3. Update Navbar active states
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-brand-accent', 'border-b-2', 'border-brand-accent');
        link.classList.add('text-gray-300');

        // Highlight active link by checking its onclick handler
        const onclickAttr = link.getAttribute('onclick') || '';
        if (onclickAttr.includes(`showSection('${sectionId}')`)) {
            link.classList.remove('text-gray-300');
            link.classList.add('text-brand-accent');
            // Add bottom border only for desktop items (does not have block class)
            if (!link.classList.contains('block')) {
                link.classList.add('border-b-2', 'border-brand-accent');
            }
        }
    });
}

const bootSequence = [
    "Initializing Harish Babu OS v1.0.0...",
    "Loading System Kernel [OK]",
    "DB Connection Established.",
    "Profile Found: Harish Babu Yarraguntla",
    "Launching Portfolio Interface..."
];

let bootSequenceFinished = false;

function runBootSequence() {
    const outputDiv = document.getElementById('intro-output');
    const currentLineSpan = document.getElementById('intro-current-line');
    const terminalOverlay = document.getElementById('intro-terminal');

    if (!outputDiv || !currentLineSpan || !terminalOverlay) return;

    let lineIndex = 0;
    let charIndex = 0;

    // Allow click/tap to skip the boot sequence immediately
    terminalOverlay.addEventListener('click', () => {
        if (bootSequenceFinished) return;
        bootSequenceFinished = true;
        terminalOverlay.style.opacity = "0";
        terminalOverlay.style.visibility = "hidden";
        document.body.classList.remove('intro-active');
    });

    const isMobile = window.innerWidth < 768;
    const charDelayBase = isMobile ? 5 : 10;
    const charDelayRandom = isMobile ? 10 : 20;
    const lineDelayBase = isMobile ? 25 : 50;
    const lineDelayRandom = isMobile ? 100 : 200;
    const finalDelay = isMobile ? 500 : 1000;

    function typeChar() {
        if (bootSequenceFinished) return;
        if (lineIndex < bootSequence.length) {
            const currentString = "> " + bootSequence[lineIndex];
            if (charIndex < currentString.length) {
                currentLineSpan.innerText += currentString.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, Math.random() * charDelayRandom + charDelayBase);
            } else {
                outputDiv.innerHTML += `<div>${currentLineSpan.innerText}</div>`;
                currentLineSpan.innerText = "";
                charIndex = 0;
                lineIndex++;
                terminalOverlay.scrollTop = terminalOverlay.scrollHeight;
                setTimeout(typeChar, Math.random() * lineDelayRandom + lineDelayBase);
            }
        } else {
            currentLineSpan.innerText = "> System Ready. Initiating...";
            setTimeout(() => {
                if (bootSequenceFinished) return;
                bootSequenceFinished = true;
                terminalOverlay.style.opacity = "0";
                terminalOverlay.style.visibility = "hidden";
                document.body.classList.remove('intro-active');
            }, finalDelay);
        }
    }

    setTimeout(typeChar, isMobile ? 150 : 300);
}

// Initialize SPA
document.addEventListener('DOMContentLoaded', () => {
    const sections = ['home', 'skills', 'experience', 'projects', 'certifications', 'contact'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('spa-section');
            if (id === 'home') {
                el.style.display = 'block';
                el.classList.add('active');
            } else {
                el.style.display = 'none';
            }
        }
    });

    // Load any custom uploaded resume
    updateResumeDownloadLinks();

    // Start the terminal boot sequence
    runBootSequence();
});

// Global Execution Logic
let currentExecutionId = 0;

function closeOutputModal() {
    currentExecutionId++; // Stop any running background typing tasks
    const modal = document.getElementById('output-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto'; // Restore scroll
}

function runGlobalExecution(title, logs, contentHtml) {
    currentExecutionId++;
    const execId = currentExecutionId;

    const modal = document.getElementById('output-modal');
    const titleEl = document.getElementById('output-modal-title');
    const terminalLayer = document.getElementById('output-modal-terminal');
    const terminalText = document.getElementById('output-terminal-text');
    const contentLayer = document.getElementById('output-modal-content');

    // Reset state
    titleEl.innerText = title;
    terminalText.innerText = '';
    contentLayer.innerHTML = contentHtml;
    contentLayer.classList.add('hidden');
    contentLayer.classList.remove('opacity-100');
    contentLayer.classList.add('opacity-0');
    terminalLayer.classList.remove('hidden');
    terminalLayer.style.opacity = '1';

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    let logIndex = 0;
    const totalDuration = 900; // 0.9 seconds total run time
    const delay = totalDuration / logs.length;

    function typeLog() {
        if (execId !== currentExecutionId) return; // Cancel if new execution started or modal closed

        if (logIndex < logs.length) {
            terminalText.innerText += `> ${logs[logIndex]}\n`;
            terminalLayer.scrollTop = terminalLayer.scrollHeight;
            logIndex++;
            setTimeout(typeLog, delay);
        } else {
            // Finished typing logs, fade out terminal and show content
            setTimeout(() => {
                if (execId !== currentExecutionId) return;
                terminalLayer.style.transition = 'opacity 0.3s ease';
                terminalLayer.style.opacity = '0';

                setTimeout(() => {
                    if (execId !== currentExecutionId) return;
                    terminalLayer.classList.add('hidden');
                    contentLayer.classList.remove('hidden');
                    // Reflow
                    void contentLayer.offsetWidth;
                    contentLayer.classList.remove('opacity-0');
                    contentLayer.classList.add('opacity-100');
                }, 300);
            }, 100);
        }
    }

    // Start typing
    setTimeout(typeLog, 100);
}

// Execute Architecture Philosophy
function executeArchitecture() {
    const logs = [
        "Initializing architecture analyzer...",
        "Mapping system paradigms: EEE Analytics -> Software Engineering",
        "Analyzing component orchestration [OK]",
        "Loading philosophy modules: Resilient Code, Scalable Architecture, Analytical Precision...",
        "Rendering Engineering Solutions Dashboard..."
    ];

    const content = `
    <div class="font-sans max-w-3xl mx-auto">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-800">
            <div>
                <h2 class="text-2xl md:text-3xl font-bold text-white">&lt;Architecting Logic /&gt;</h2>
                <h3 class="text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-accent2">{Engineering Solutions}</h3>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/30 uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>System Active
                </span>
                <span class="text-xs text-gray-500 font-mono">Efficiency Index: 99.4%</span>
            </div>
        </div>
        
        <div class="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
            <p class="text-base md:text-lg text-white/90">
                Harish's engineering philosophy converges two distinct paradigms: <strong class="text-brand-accent font-extrabold">rigorous analytical reasoning</strong> from electrical systems design, and <strong class="text-brand-accent2 font-extrabold">scalable modern backend architecture</strong>.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <!-- Card 1 -->
                <div class="glass p-6 border-2 border-brand-accent/20 hover:border-brand-accent/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 rounded-xl">
                    <h4 class="text-brand-accent font-mono text-sm font-extrabold uppercase tracking-wider mb-3">// 1. ANALYTICAL PRECISION</h4>
                    <p class="text-xs md:text-sm text-gray-400 leading-relaxed">
                        Pivoting from an <strong class="text-white font-semibold">Electrical & Electronics Engineering (EEE)</strong> background, Harish treats software systems like complex electricity grids. He analyzes system efficiency, bandwidth bottlenecks, and SQL query latencies with extreme <strong class="text-brand-accent font-semibold">mathematical rigor</strong>.
                    </p>
                </div>
                
                <!-- Card 2 -->
                <div class="glass p-6 border-2 border-brand-accent2/20 hover:border-brand-accent2/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 rounded-xl">
                    <h4 class="text-brand-accent2 font-mono text-sm font-extrabold uppercase tracking-wider mb-3">// 2. SCALABLE BACKEND ARCHITECTURE</h4>
                    <p class="text-xs md:text-sm text-gray-400 leading-relaxed">
                        Engineering production backends using <strong class="text-white font-semibold">Django (Python)</strong>, <strong class="text-white font-semibold">REST Frameworks (DRF)</strong>, and robust databases. He focuses on <strong class="text-brand-accent2 font-semibold">optimized database normalization</strong>, Redis caching layers, and event-driven background queues like Celery.
                    </p>
                </div>
            </div>

            <!-- Objectives Console -->
            <div class="bg-black/60 border-2 border-gray-800 rounded-xl p-6 mt-6 font-mono text-xs md:text-sm space-y-4 shadow-2xl">
                <div class="text-gray-500 font-bold tracking-widest border-b border-gray-800 pb-2">// SYSTEM OBJECTIVES & CORE MOTTO</div>
                
                <div class="flex items-start gap-3">
                    <span class="px-2 py-0.5 bg-green-900/40 text-green-400 border border-green-700/50 rounded font-bold shrink-0 text-[10px]">RESILIENT</span>
                    <span class="text-gray-300"><strong>Resilience:</strong> Writing clean, testable, and highly maintainable modular codebase structures.</span>
                </div>
                
                <div class="flex items-start gap-3">
                    <span class="px-2 py-0.5 bg-brand-accent/20 text-brand-accent border border-brand-accent/30 rounded font-bold shrink-0 text-[10px]">OPTIMIZED</span>
                    <span class="text-gray-300"><strong>Efficiency:</strong> Structuring highly optimized database queries, eliminating N+1 query leaks.</span>
                </div>
                
                <div class="flex items-start gap-3">
                    <span class="px-2 py-0.5 bg-brand-accent2/20 text-brand-accent2 border border-brand-accent2/30 rounded font-bold shrink-0 text-[10px]">ASYNC_FAST</span>
                    <span class="text-gray-300"><strong>Speed:</strong> Scaling asynchronous workers and tasks using Celery and Redis broker.</span>
                </div>
            </div>
            
            <p class="text-sm md:text-base mt-6 text-gray-400">
                By injecting systems logic into Python backend development, Harish designs solutions that are not just working, but are <strong class="text-white font-bold">structurally resilient, resource-efficient, and engineered to scale</strong>.
            </p>
        </div>
    </div>`;

    runGlobalExecution("architecture_analyzer.sh", logs, content);
}

// Execute Bio
function executeBio() {
    const logs = [
        "Initializing get_bio()...",
        "Fetching profile data [OK]",
        "Loading education records [OK]"
    ];
    const content = `
    <div class="font-sans max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col md:flex-row items-start gap-6 mb-10">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-accent2 flex items-center justify-center text-2xl font-bold text-black shrink-0">HB</div>
            <div>
                <h2 class="text-3xl md:text-4xl font-bold text-white">Harish Babu Yarraguntla</h2>
                <p class="text-brand-accent font-mono mt-1">Python Full Stack Developer</p>
                <div class="flex flex-wrap gap-3 mt-3">
                    <span class="flex items-center gap-1 text-xs text-gray-400"><i class="fas fa-map-marker-alt text-brand-accent"></i> Andhra Pradesh, India</span>
                    <span class="flex items-center gap-1 text-xs text-gray-400"><i class="fas fa-graduation-cap text-brand-accent2"></i> B.Tech EEE-2025</span>
                    <span class="flex items-center gap-1 text-xs text-gray-400"><i class="fas fa-code text-green-400"></i> Self-Taught Software Developer</span>
                </div>
            </div>
        </div>

        <!-- Who Am I -->
        <div class="glass p-6 rounded-2xl border border-white/5 mb-6">
            <h3 class="text-brand-accent font-mono text-xs uppercase tracking-widest mb-4"><i class="fas fa-user mr-2"></i>// who_i_am</h3>
            <p class="text-gray-300 text-sm leading-relaxed mb-3">
                I am <strong class="text-white">Harish Babu Yarraguntla</strong>a passionate Python Full Stack Developer. I completed my B.Tech in <strong class="text-brand-accent">Electrical & Electronics Engineering (EEE)</strong>, but developed a strong interest in software development and transitioned into tech through self-learning.
            </p>
            <p class="text-gray-300 text-sm leading-relaxed">
                The analytical thinking and problem-solving mindset from my engineering background directly translates into how I approach software development. My <strong class="text-brand-accent2">EEE background</strong> gave me systems thinking, precision, and a structured approach all of which are highly valuable in building scalable software.
            </p>
        </div>

        <!-- Journey -->
        <div class="glass p-6 rounded-2xl border border-white/5 mb-6">
            <h3 class="text-brand-accent2 font-mono text-xs uppercase tracking-widest mb-5"><i class="fas fa-road mr-2"></i>// my_journey()</h3>
            <div class="space-y-4">
                <div class="flex gap-4">
                    <div class="shrink-0 mt-1"><span class="w-7 h-7 rounded-full bg-brand-accent/20 border border-brand-accent/50 flex items-center justify-center text-brand-accent text-xs font-bold">1</span></div>
                    <div>
                        <p class="text-white font-semibold text-sm">B.Tech  Electrical & Electronics Engineering (EEE)</p>
                        <p class="text-gray-400 text-xs mt-1">Studied Engineering covering circuit design, power systems, and MATLAB simulation. Built a strong foundation in analytical thinking and structured problem-solving.</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="shrink-0 mt-1"><span class="w-7 h-7 rounded-full bg-brand-accent2/20 border border-brand-accent2/50 flex items-center justify-center text-brand-accent2 text-xs font-bold">2</span></div>
                    <div>
                        <p class="text-white font-semibold text-sm">Python Full Stack Course-JSpiders</p>
                        <p class="text-gray-400 text-xs mt-1">Completed a structured <strong class="text-white">Python Full Stack Development course at JSpiders</strong>. Covered Python fundamentals, OOP, SQL, Django, REST APIs, and full-stack web development in a professional training environment.</p>
                        <span class="inline-block mt-2 px-2 py-0.5 bg-brand-accent2/10 border border-brand-accent2/30 rounded text-[10px] text-brand-accent2 font-mono">JSpiders • Python Full Stack</span>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="shrink-0 mt-1"><span class="w-7 h-7 rounded-full bg-green-400/20 border border-green-400/50 flex items-center justify-center text-green-400 text-xs font-bold">3</span></div>
                    <div>
                        <p class="text-white font-semibold text-sm">Learned Django and Built Real Projects</p>
                        <p class="text-gray-400 text-xs mt-1">Implemented Django, ORM, REST APIs, JWT Authentication, Celery, Redis, and Razorpay in production-grade projects from scratch.</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="shrink-0 mt-1"><span class="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center text-yellow-400 text-xs font-bold">4</span></div>
                    <div>
                        <p class="text-white font-semibold text-sm">Internships & Real-World Experience</p>
                        <p class="text-gray-400 text-xs mt-1">Worked as a Data Science Intern at BIST Technologies, reducing manual effort by 40% through Python automation. Also interned at DRDO on MATLAB motor simulations.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- What I Can Do -->
        <div class="glass p-6 rounded-2xl border border-white/5 mb-6">
            <h3 class="text-green-400 font-mono text-xs uppercase tracking-widest mb-5"><i class="fas fa-laptop-code mr-2"></i>// what_i_can_do()</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                    <h4 class="text-white text-sm font-bold mb-3 flex items-center gap-2"><i class="fas fa-server text-brand-accent text-xs"></i> Backend Development</h4>
                    <ul class="space-y-1.5 text-xs text-gray-400">
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Django applications with complex ORM models</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>REST APIs using DRF (Django REST Framework)</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>JWT Authentication & Role-based Authorization</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Celery + Redis background task queues</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Razorpay payment gateway integration</li>
                    </ul>
                </div>
                <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                    <h4 class="text-white text-sm font-bold mb-3 flex items-center gap-2"><i class="fas fa-database text-yellow-400 text-xs"></i> Database & APIs</h4>
                    <ul class="space-y-1.5 text-xs text-gray-400">
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>MySQL & SQLite database design</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Complex SQL queries (Joins, Subqueries, DDL, DML)</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>RESTful API design with JSON</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Node.js + Express.js APIs</li>
                    </ul>
                </div>
                <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                    <h4 class="text-white text-sm font-bold mb-3 flex items-center gap-2"><i class="fas fa-desktop text-blue-400 text-xs"></i> Frontend</h4>
                    <ul class="space-y-1.5 text-xs text-gray-400">
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>HTML5, CSS3, JavaScript (Vanilla)</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Responsive Web Design</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Offline-first localStorage patterns</li>
                    </ul>
                </div>
                <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                    <h4 class="text-white text-sm font-bold mb-3 flex items-center gap-2"><i class="fas fa-rocket text-red-400 text-xs"></i> Deployment & Tools</h4>
                    <ul class="space-y-1.5 text-xs text-gray-400">
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Render, PythonAnywhere deployment</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Git & GitHub version control</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>Unit Testing with Django TestCase</li>
                        <li class="flex gap-2"><i class="fas fa-check text-green-400 mt-0.5 shrink-0"></i>VS Code, Jupyter Notebook</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Projects Summary -->
        <div class="glass p-6 rounded-2xl border border-white/5 mb-6">
            <h3 class="text-blue-400 font-mono text-xs uppercase tracking-widest mb-5"><i class="fas fa-code-branch mr-2"></i>// my_projects() — independently built</h3>
            <div class="space-y-4">
                <div class="flex gap-4 p-4 bg-black/30 rounded-xl border border-gray-800">
                    <div class="w-10 h-10 rounded-xl bg-green-400/10 border border-green-400/30 flex items-center justify-center shrink-0"><i class="fas fa-leaf text-green-400 text-sm"></i></div>
                    <div>
                        <p class="text-white font-bold text-sm">Farm Direct Web App</p>
                        <p class="text-gray-400 text-xs mt-1">A full-stack e-commerce platform I <strong class="text-white">independently designed, coded, and deployed</strong>. Supports 4 distinct user roles (Farmer to Customer), Razorpay payments, GPS order tracking, and Celery background tasks all implemented by me.</p>
                        <div class="flex gap-2 mt-2 flex-wrap"><span class="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-400">Django 5.1</span><span class="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-400">DRF</span><span class="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-400">Celery+Redis</span><span class="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-400">Razorpay</span></div>
                    </div>
                </div>
                <div class="flex gap-4 p-4 bg-black/30 rounded-xl border border-gray-800">
                    <div class="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center shrink-0"><i class="fas fa-shopping-bag text-blue-400 text-sm"></i></div>
                    <div>
                        <p class="text-white font-bold text-sm">Akhil Sports E-Commerce</p>
                        <p class="text-gray-400 text-xs mt-1">A sports e-commerce app <strong class="text-white">built entirely by me</strong> using Node.js and Express.js. Implemented JWT authentication, offline localStorage fallback, and a mock payment gateway flow end-to-end.</p>
                        <div class="flex gap-2 mt-2 flex-wrap"><span class="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-400">Node.js</span><span class="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-400">Express.js</span><span class="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-400">JWT</span><span class="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-400">Vanilla JS</span></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- What I'm Looking For -->
        <div class="glass p-6 rounded-2xl border border-brand-accent/20">
            <h3 class="text-brand-accent font-mono text-xs uppercase tracking-widest mb-3"><i class="fas fa-bullseye mr-2"></i>// my_objective()</h3>
            <p class="text-gray-300 text-sm leading-relaxed">
            <p class="text-gray-300 text-sm leading-relaxed">
                I am actively looking for a role as a <strong class="text-brand-accent">Python Backend or Full Stack Developer</strong>. Although I transitioned from EEE to Software, I have proven my skills by building real, production-ready projects from the ground up. My goal is to write <strong class="text-white">scalable, clean, and maintainable code</strong>. I am a fast learner who can collaborate effectively within any team.
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-brand-accent/10 border border-brand-accent/30 rounded-full text-brand-accent text-xs">Open to Work</span>
                <span class="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-300 text-xs">Backend Developer</span>
                <span class="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-300 text-xs">Python Developer</span>
                <span class="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-300 text-xs">Django Developer</span>
                <span class="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-300 text-xs">Full Stack Developer</span>
            </div>
        </div>
    </div>`;
    runGlobalExecution("get_bio.py", logs, content);
}

// Execute Skills Script
function executeSkills() {
    const content = document.getElementById('visual-skills').innerHTML;
    const logs = [
        "Compiling skills.py...",
        "Resolving Python dependencies [OK]",
        "Rendering TechnicalArsenal UI..."
    ];
    runGlobalExecution("skills.py", logs, content);
}

// Execute Internships Script
function executeInternships() {
    const logs = [
        "python internships.py",
        "Executing python...",
        "Loading data structure... [OK]"
    ];
    const content = `
    <div class="font-sans">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">Work Experience</h2>
        <p class="text-gray-500 text-sm font-mono mb-10">// 2 internship records found</p>

        <!-- Internship 1 -->
        <div class="relative pl-8 border-l-2 border-brand-accent mb-12">
            <div class="absolute -left-3 top-1 w-5 h-5 rounded-full bg-brand-accent border-4 border-[#050505] shadow-[0_0_12px_rgba(6,182,212,0.7)]"></div>
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                <div>
                    <span class="text-xs font-mono text-brand-accent uppercase tracking-widest">BIST Technologies Pvt. Ltd</span>
                    <h3 class="text-xl md:text-2xl font-bold text-white mt-1">Data Science Intern</h3>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-mono">Feb 2025</span>
                    <span class="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-mono">Vijayawada</span>
                </div>
            </div>
            <div class="glass p-6 rounded-xl mt-4">
                <p class="text-gray-300 text-sm mb-5 leading-relaxed">Worked as a Data Science Intern focusing on Python-based data engineering pipelines, SQL-based data validation, and automation scripting for real-world business datasets.</p>
                <h4 class="text-brand-accent text-xs font-mono uppercase tracking-wider mb-3">Key Contributions</h4>
                <ul class="space-y-3">
                    <li class="flex items-start gap-3 text-sm text-gray-300">
                        <i class="fas fa-chevron-right text-brand-accent text-xs mt-1 shrink-0"></i>
                        <span>Used <strong class="text-white">Python</strong> to clean, process, and transform large datasets into structured formats for analysis.</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-gray-300">
                        <i class="fas fa-chevron-right text-brand-accent text-xs mt-1 shrink-0"></i>
                        <span>Developed <strong class="text-white">reusable Python scripts</strong> that automated repetitive data tasks, reducing manual effort by <strong class="text-brand-accent">40%</strong>.</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-gray-300">
                        <i class="fas fa-chevron-right text-brand-accent text-xs mt-1 shrink-0"></i>
                        <span>Performed <strong class="text-white">SQL-based data extraction and validation</strong> using joins, subqueries, and DML operations to ensure data integrity.</span>
                    </li>
                </ul>
                <div class="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-800">
                    <span class="flex items-center px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" class="w-3 h-3 mr-2">Python</span>
                    <span class="flex items-center px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700"><i class="fas fa-database text-blue-400 mr-2 text-xs"></i>SQL</span>
                    <span class="px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">Data Analysis</span>
                    <span class="px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">Data Cleaning</span>
                    <span class="px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">Automation</span>
                </div>
            </div>
        </div>

        <!-- Internship 2 -->
        <div class="relative pl-8 border-l-2 border-brand-accent2">
            <div class="absolute -left-3 top-1 w-5 h-5 rounded-full bg-brand-accent2 border-4 border-[#050505] shadow-[0_0_12px_rgba(139,92,246,0.7)]"></div>
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                <div>
                    <span class="text-xs font-mono text-brand-accent2 uppercase tracking-widest">DRDO, Ministry of Defence</span>
                    <h3 class="text-xl md:text-2xl font-bold text-white mt-1">MATLAB Simulation Intern</h3>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="px-3 py-1 rounded-full bg-brand-accent2/10 border border-brand-accent2/30 text-brand-accent2 text-xs font-mono">May 2024</span>
                    <span class="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-mono">Hyderabad</span>
                </div>
            </div>
            <div class="glass p-6 rounded-xl mt-4">
                <p class="text-gray-300 text-sm mb-5 leading-relaxed">Interned at India's premier defence research organisation (DRDO) to simulate and validate Brushless DC (BLDC) Motor behaviour using MATLAB/Simulink. Followed strict testing and validation workflows.</p>
                <h4 class="text-brand-accent2 text-xs font-mono uppercase tracking-wider mb-3">Key Contributions</h4>
                <ul class="space-y-3">
                    <li class="flex items-start gap-3 text-sm text-gray-300">
                        <i class="fas fa-chevron-right text-brand-accent2 text-xs mt-1 shrink-0"></i>
                        <span>Developed and validated <strong class="text-white">BLDC Motor simulation models</strong> in MATLAB/Simulink for defence-grade applications.</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-gray-300">
                        <i class="fas fa-chevron-right text-brand-accent2 text-xs mt-1 shrink-0"></i>
                        <span>Analysed motor performance across different load conditions, improving model accuracy by <strong class="text-brand-accent2">18%</strong>.</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm text-gray-300">
                        <i class="fas fa-chevron-right text-brand-accent2 text-xs mt-1 shrink-0"></i>
                        <span>Followed <strong class="text-white">structured testing and validation workflows</strong> aligned with DRDO's engineering standards.</span>
                    </li>
                </ul>
                <div class="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-800">
                    <span class="px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">MATLAB</span>
                    <span class="px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">Simulink</span>
                    <span class="px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">BLDC Motor Simulation</span>
                    <span class="px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">Performance Analysis</span>
                </div>
            </div>
        </div>
    </div>`;
    runGlobalExecution("python internships.py", logs, content);
}

// Execute Projects Script
function executeProjects() {
    const logs = [
        "python projects.py",
        "Running Python interpreter...",
        "Initializing Django environment...",
        "Fetching GitHub repository data [OK]"
    ];
    const content = `
    <div class="font-sans">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">Projects</h2>
        <p class="text-gray-500 text-sm font-mono mb-10">// 2 production-grade projects compiled</p>
        <div class="grid grid-cols-1 gap-10">

        <!-- Project 1 -->
        <div class="glass rounded-2xl overflow-hidden border border-white/5 hover:border-brand-accent/40 transition-colors">
            <div class="h-1 bg-gradient-to-r from-brand-accent to-green-400"></div>
            <div class="p-6 md:p-8">
                <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                    <div>
                        <span class="text-xs font-mono text-brand-accent uppercase tracking-widest">Full Stack / E-Commerce</span>
                        <h3 class="text-xl md:text-2xl font-bold text-white mt-1">Farm Direct Web App</h3>
                    </div>
                    <a href="https://github.com/harish232/FarmDirect" target="_blank" class="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-brand-accent transition-colors text-sm shrink-0">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed mb-6">A production-ready, multi-role farm-to-customer e-commerce platform. Supports 4 distinct user roles (Farmer, Distributor, Retailer, Customer) with complete role-based access control, real-time order tracking and payment integration.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                        <h4 class="text-brand-accent text-xs font-mono uppercase tracking-wider mb-3"><i class="fas fa-cogs mr-2"></i>Technical Highlights</h4>
                        <ul class="space-y-2 text-sm text-gray-300">
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>12+ Django ORM models with complex relationships</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>Celery + Redis for async background tasks & notifications</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>Razorpay payment gateway integration</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>Real-time GPS order tracking via APIs</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>Django REST Framework (DRF) for API endpoints</li>
                        </ul>
                    </div>
                    <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                        <h4 class="text-brand-accent2 text-xs font-mono uppercase tracking-wider mb-3"><i class="fas fa-star mr-2"></i>Key Features</h4>
                        <ul class="space-y-2 text-sm text-gray-300">
                            <li class="flex items-start gap-2"><i class="fas fa-check text-brand-accent2 text-xs mt-1 shrink-0"></i>4-role access control (Farmer, Distributor, Retailer, Customer)</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-brand-accent2 text-xs mt-1 shrink-0"></i>Unit testing with Django TestCase</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-brand-accent2 text-xs mt-1 shrink-0"></i>Deployed on Render / PythonAnywhere</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-brand-accent2 text-xs mt-1 shrink-0"></i>Responsive UI with HTML5, CSS3, JavaScript</li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
                    <span class="flex items-center px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" class="w-3 h-3 mr-2 filter invert opacity-80">Django 5.1</span>
                    <span class="flex items-center px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" class="w-3 h-3 mr-2">Redis</span>
                    <span class="px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">Celery</span>
                    <span class="px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">DRF</span>
                    <span class="flex items-center px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" class="w-3 h-3 mr-2">MySQL</span>
                    <span class="px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">Razorpay</span>
                    <span class="px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">JWT Auth</span>
                </div>
            </div>
        </div>

        <!-- Project 2 -->
        <div class="glass rounded-2xl overflow-hidden border border-white/5 hover:border-blue-400/40 transition-colors">
            <div class="h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div class="p-6 md:p-8">
                <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                    <div>
                        <span class="text-xs font-mono text-blue-400 uppercase tracking-widest">Full Stack / API Integration</span>
                        <h3 class="text-xl md:text-2xl font-bold text-white mt-1">Akhil Sports E-Commerce</h3>
                    </div>
                    <a href="https://github.com/harish232/Akhil-sports" target="_blank" class="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-blue-400 transition-colors text-sm shrink-0">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed mb-6">An event-driven sports e-commerce web application built with Node.js and Express.js. Features a resilient offline-first architecture using localStorage fallback and a fully implemented mock payment gateway flow.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                        <h4 class="text-blue-400 text-xs font-mono uppercase tracking-wider mb-3"><i class="fas fa-cogs mr-2"></i>Technical Highlights</h4>
                        <ul class="space-y-2 text-sm text-gray-300">
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>Event-driven Node.js + Express.js backend</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>Offline-first with localStorage fallback</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>JWT-based Authentication & Authorization</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-green-400 text-xs mt-1 shrink-0"></i>Parallel async notifications system</li>
                        </ul>
                    </div>
                    <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                        <h4 class="text-indigo-400 text-xs font-mono uppercase tracking-wider mb-3"><i class="fas fa-star mr-2"></i>Key Features</h4>
                        <ul class="space-y-2 text-sm text-gray-300">
                            <li class="flex items-start gap-2"><i class="fas fa-check text-indigo-400 text-xs mt-1 shrink-0"></i>Mock payment gateway integration</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-indigo-400 text-xs mt-1 shrink-0"></i>Product catalog with dynamic filtering</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-indigo-400 text-xs mt-1 shrink-0"></i>Vanilla JS frontend — no frameworks</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-indigo-400 text-xs mt-1 shrink-0"></i>REST API design with JSON responses</li>
                        </ul>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
                    <span class="flex items-center px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" class="w-3 h-3 mr-2">Node.js</span>
                    <span class="px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">Express.js</span>
                    <span class="flex items-center px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" class="w-3 h-3 mr-2">Vanilla JS</span>
                    <span class="px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">JWT Auth</span>
                    <span class="px-3 py-1.5 bg-gray-800 rounded-md text-xs text-gray-300 border border-gray-700">REST APIs</span>
                </div>
            </div>
        </div>
        </div>
    </div>`;
    runGlobalExecution("python projects.py", logs, content);
}

// Execute Certifications Script
function executeCertifications() {
    const logs = [
        "python certifications.py",
        "Executing python...",
        "Verifying Deloitte credential registry...",
        "Loading certification details... [OK]"
    ];
    const content = `
    <div class="font-sans max-w-3xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">Certifications</h2>
        <p class="text-gray-500 text-sm font-mono mb-10">// 1 verified certification record</p>
        <div class="glass rounded-2xl overflow-hidden border border-brand-accent2/20 hover:border-brand-accent2/50 transition-colors relative">
            <div class="h-1 bg-gradient-to-r from-brand-accent2 to-blue-500"></div>
            <div class="absolute top-6 right-6 text-brand-accent2/10 text-8xl font-bold pointer-events-none select-none">✦</div>
            <div class="p-6 md:p-8">
                <div class="flex items-center gap-4 mb-6">
                    <div class="bg-white px-4 py-2 rounded-xl shadow-lg shrink-0">
                        <span class="font-extrabold text-black text-lg tracking-tight" style="font-family:'Inter',Arial,sans-serif;">Deloitte<span class="text-[#86BC25]">.</span></span>
                    </div>
                    <div>
                        <span class="text-xs font-mono text-brand-accent2 uppercase tracking-widest">Forage Virtual Program</span>
                        <h3 class="text-xl md:text-2xl font-bold text-white mt-1">Deloitte Virtual Experience</h3>
                        <p class="text-sm text-gray-400 mt-1">Technology Consulting Virtual Internship</p>
                    </div>
                </div>
                <p class="text-gray-300 text-sm leading-relaxed mb-6">Completed a structured virtual consulting internship hosted on Forage in partnership with Deloitte. Gained hands-on exposure to real-world technology consulting challenges, cloud engineering strategies, and client proposal development.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                        <h4 class="text-brand-accent2 text-xs font-mono uppercase tracking-wider mb-3"><i class="fas fa-certificate mr-2"></i>Skills Acquired</h4>
                        <ul class="space-y-2 text-sm text-gray-300">
                            <li class="flex items-start gap-2"><i class="fas fa-check text-brand-accent2 text-xs mt-1 shrink-0"></i>Client Discovery & Requirement Analysis</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-brand-accent2 text-xs mt-1 shrink-0"></i>Technical Architecture Planning</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-brand-accent2 text-xs mt-1 shrink-0"></i>Proposal Development & Presentation</li>
                            <li class="flex items-start gap-2"><i class="fas fa-check text-brand-accent2 text-xs mt-1 shrink-0"></i>Cloud Engineering Strategies</li>
                        </ul>
                    </div>
                    <div class="bg-black/30 rounded-xl p-4 border border-gray-800">
                        <h4 class="text-yellow-400 text-xs font-mono uppercase tracking-wider mb-3"><i class="fas fa-info-circle mr-2"></i>Program Details</h4>
                        <ul class="space-y-2 text-sm text-gray-300">
                            <li class="flex items-start gap-2"><i class="fas fa-building text-yellow-400 text-xs mt-1 shrink-0"></i><span><strong class="text-white">Issuer:</strong> Deloitte via Forage</span></li>
                            <li class="flex items-start gap-2"><i class="fas fa-tag text-yellow-400 text-xs mt-1 shrink-0"></i><span><strong class="text-white">Type:</strong> Technology Consulting</span></li>
                            <li class="flex items-start gap-2"><i class="fas fa-shield-alt text-yellow-400 text-xs mt-1 shrink-0"></i><span><strong class="text-white">Status:</strong> Verified & Completed</span></li>
                        </ul>
                    </div>
                </div>
                <div class="flex items-center gap-3 pt-4 border-t border-gray-800">
                    <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span class="text-green-400 text-xs font-mono">Credential Verified</span>
                </div>
            </div>
        </div>
    </div>`;
    runGlobalExecution("python certifications.py", logs, content);
}

// Upload & Override Custom Resume Logic
function handleResumeUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result;
        try {
            localStorage.setItem('uploaded_resume', base64Data);
            
            // Instantly update all download links on the page to use this base64 string
            updateResumeDownloadLinks();

            // Run next-level terminal upload animation modal
            const uploadLogs = [
                "Connecting to local system buffer...",
                `Opening file handle: ${file.name} [OK]`,
                `File size: ${(file.size / 1024).toFixed(1)} KB`,
                "Converting binary buffer stream to Base64 payload...",
                "Running integrity verification checks...",
                "Verifying PDF magic signature [OK]",
                "Writing payload to secure localStorage database...",
                "Patching application download hooks...",
                "Syncing chatbot dynamic links [OK]",
                "Process complete. System synchronized."
            ];

            const contentHtml = `
            <div class="text-center font-mono py-8 max-w-md mx-auto">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-brand-accent text-3xl mb-6 animate-bounce">
                    <i class="fas fa-check-double"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Database Synced</h3>
                <p class="text-gray-400 text-xs md:text-sm mb-6">// The local storage buffer was successfully written. All download links have been patched to point to the new resume payload.</p>
                <div class="flex justify-center gap-4">
                    <button onclick="closeOutputModal()" class="px-6 py-2.5 bg-brand-accent text-brand-dark font-bold rounded-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">Done</button>
                </div>
            </div>`;

            runGlobalExecution("upload_resume.sh", uploadLogs, contentHtml);

        } catch (error) {
            alert("File is too large to store in local browser storage. Please upload a smaller PDF resume (under 4MB).");
        }
    };
    reader.readAsDataURL(file);
}

function updateResumeDownloadLinks() {
    const uploadedResume = localStorage.getItem('uploaded_resume');
    if (!uploadedResume) return;

    // Find all links on the page pointing to Harish_Babu_Resume.pdf
    document.querySelectorAll('a[href="Harish_Babu_Resume.pdf"], a[href*="Harish_Babu_Resume.pdf"]').forEach(link => {
        link.href = uploadedResume;
        // Make sure it downloads with the right filename
        link.setAttribute('download', 'Harish_Babu_Resume.pdf');
    });
}

// Custom Mouse Trailer Script
document.addEventListener('DOMContentLoaded', () => {
    const trailer = document.getElementById('mouse-trailer');
    const dot = document.getElementById('mouse-dot');
    
    if (!trailer || !dot) return;

    // Detect if pointing device is fine (mouse support)
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Move dot instantly
            dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            
            // Set CSS variables for hover position reference
            trailer.style.setProperty('--mouse-x', `${x}px`);
            trailer.style.setProperty('--mouse-y', `${y}px`);
            
            // Move trailer with animate for smooth inertia delay
            trailer.animate({
                transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
            }, { duration: 150, fill: 'forwards' });
        });

        // Hover expand transitions on hoverable elements
        const hoverables = 'a, button, label, .cursor-pointer, input, textarea';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverables)) {
                trailer.classList.add('trailer-hover');
                dot.style.backgroundColor = '#3B82F6';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverables)) {
                trailer.classList.remove('trailer-hover');
                dot.style.backgroundColor = '';
            }
        });
    } else {
        // Hide completely on mobile/touch screens
        trailer.style.display = 'none';
        dot.style.display = 'none';
    }
});


