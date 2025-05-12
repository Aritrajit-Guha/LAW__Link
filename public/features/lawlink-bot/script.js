document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const askButton = document.getElementById('askButton');
    const typingIndicator = document.getElementById('typingIndicator');

    // Focus input on load
    userInput.focus();

    // Handle ask button click
    askButton.addEventListener('click', askQuestion);
    
    // Handle Enter key press
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askQuestion();
    });

    // Add animation to button on hover
    askButton.addEventListener('mouseenter', () => {
        askButton.querySelector('i').style.transform = 'translateX(3px)';
    });
    
    askButton.addEventListener('mouseleave', () => {
        askButton.querySelector('i').style.transform = 'translateX(0)';
    });

    async function askQuestion() {
        const question = userInput.value.trim();
        if (!question) return;

        // Add user message to chat
        addMessage(question, 'user');
        userInput.value = '';
        
        // Show typing indicator
        typingIndicator.classList.add('active');
        
        try {
            // Simulate slight delay for more natural interaction
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) throw new Error('Network error');
            
            const data = await response.json();
            
            // Simulate typing effect
            await typeResponse(data.answer);
            
        } catch (error) {
            addMessage("Sorry, I encountered an error processing your request. Please try again later.", 'bot');
            console.error('Error:', error);
        } finally {
            typingIndicator.classList.remove('active');
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = sender === 'bot' ? 'LawLink' : 'You';
        
        const content = document.createElement('p');
        content.innerHTML = text.replace(/\n/g, '<br>');
        
        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom with smooth behavior
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    async function typeResponse(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = 'LawLink';
        
        const content = document.createElement('p');
        content.style.minHeight = '1em'; // Prevent layout shift
        
        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom before typing starts
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
        
        // Type out the message character by character
        let i = 0;
        const speed = 20; // typing speed in ms
        
        async function typeWriter() {
            if (i < text.length) {
                content.innerHTML = text.substring(0, i + 1) + '<span class="blinking-cursor">|</span>';
                i++;
                
                // Occasionally add slight random delays for more natural typing
                const delay = Math.random() > 0.9 ? speed * 3 : speed;
                
                setTimeout(typeWriter, delay);
            } else {
                content.innerHTML = text.replace(/\n/g, '<br>');
            }
        }
        
        await typeWriter();
    }
});