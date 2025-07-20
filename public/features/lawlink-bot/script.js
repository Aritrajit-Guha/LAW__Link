document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const askButton = document.getElementById('askButton');
    const typingIndicator = document.getElementById('typingIndicator');

    const baseURL = window.location.hostname.includes('localhost')
        ? 'http://localhost:5000'
        : 'https://law-link.onrender.com'; // ✅ Update this to your deployed URL

    userInput.focus();

    askButton.addEventListener('click', askQuestion);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askQuestion();
    });

    askButton.addEventListener('mouseenter', () => {
        askButton.querySelector('i').style.transform = 'translateX(3px)';
    });

    askButton.addEventListener('mouseleave', () => {
        askButton.querySelector('i').style.transform = 'translateX(0)';
    });

    async function askQuestion() {
        const question = userInput.value.trim();
        if (!question) return;

        addMessage(question, 'user');
        userInput.value = '';
        typingIndicator.classList.add('active');

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await fetch(`${baseURL}/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
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
        content.innerHTML = convertMarkdownLinks(text).replace(/\n/g, '<br>');

        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        chatContainer.appendChild(messageDiv);

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
        content.style.minHeight = '1em';

        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        chatContainer.appendChild(messageDiv);

        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });

        let i = 0;
        const speed = 20;

        async function typeWriter() {
            if (i < text.length) {
                content.innerHTML = convertMarkdownLinks(text.substring(0, i + 1)) + '<span class="blinking-cursor">|</span>';
                i++;
                const delay = Math.random() > 0.9 ? speed * 3 : speed;
                setTimeout(typeWriter, delay);
            } else {
                content.innerHTML = convertMarkdownLinks(text).replace(/\n/g, '<br>');
            }
        }

        await typeWriter();
    }

    function convertMarkdownLinks(text) {
        return text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    }
});
