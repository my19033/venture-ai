// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Chat functionality
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const demoChat = document.querySelector('.demo-chat');
    const exampleBtns = document.querySelectorAll('.example-btn');
    
    // Send message function
    function sendMessage(text, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.innerHTML = isUser ? '<i class="fas fa-user"></i>' : 'AI';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.textContent = text;
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(textDiv);
        demoChat.appendChild(messageDiv);
        
        // Scroll to bottom
        demoChat.scrollTop = demoChat.scrollHeight;
        
        // If user sent message, show AI response after delay
        if (isUser) {
            setTimeout(() => {
                const responses = [
                    "I'll find the best options for that!",
                    "Great choice! Let me check availability...",
                    "Perfect! I'm searching for the ideal trip.",
                    "On it! Looking for the best deals now."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                sendMessage(randomResponse, false);
            }, 1000);
        }
    }
    
    // Send button click
    sendBtn.addEventListener('click', function() {
        if (chatInput.value.trim()) {
            sendMessage(chatInput.value, true);
            chatInput.value = '';
        }
    });
    
    // Enter key press
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            sendMessage(chatInput.value, true);
            chatInput.value = '';
        }
    });
    
    // Example buttons
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sendMessage(this.textContent, true);
        });
    });
    
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});