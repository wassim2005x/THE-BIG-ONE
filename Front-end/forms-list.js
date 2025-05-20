document.addEventListener('DOMContentLoaded', () => {
    const formsList = document.getElementById('formsList');

    // Fetch all forms from backend
    function fetchForms() {
        fetch('http://localhost:8080/all-forms')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch forms');
                }
                return response.json();
            })
            .then(forms => {
                // Clear loading message
                formsList.innerHTML = '';

                if (forms.length === 0) {
                    formsList.innerHTML = '<div class="loading">No forms have been created yet.</div>';
                    return;
                }

                // Create form cards
                forms.forEach(form => {
                    const formCard = document.createElement('div');
                    formCard.classList.add('form-card');

                    const title = document.createElement('h2');
                    title.textContent = form.formName || 'Untitled Form';

                    const description = document.createElement('p');
                    description.textContent = form.description || 'No description provided';

                    const link = document.createElement('a');
                    link.href = `fillForm.html?formName=${encodeURIComponent(form.formName)}`;
                    link.textContent = 'Open Form';
                    link.classList.add('form-link');

                    formCard.appendChild(title);
                    formCard.appendChild(description);
                    formCard.appendChild(link);

                    formsList.appendChild(formCard);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                formsList.innerHTML = `<div class="loading">Error loading forms: ${error.message}</div>`;
            });
    }

    // Fetch forms when page loads
    fetchForms();
});
let captchaText = '';

function generateCaptcha() {
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate random text
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    captchaText = '';
    for (let i = 0; i < 6; i++) {
        captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text with random rotations and colors
    ctx.font = 'bold 35px Comic Neue';
    for (let i = 0; i < captchaText.length; i++) {
        const x = 30 + i * 25;
        const y = 45;
        const rotation = (Math.random() - 0.5) * 0.4;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
    }

    // Add noise
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
    }
}

// Initialize captcha
document.addEventListener('DOMContentLoaded', function() {
    generateCaptcha();
    
    // Refresh captcha button
    document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);
    
    // Verify captcha button
    document.getElementById('verifyCaptcha').addEventListener('click', function() {
        const input = document.getElementById('captchaInput').value;
        const messageElement = document.getElementById('captchaMessage');
        
        if (input === captchaText) {
            messageElement.textContent = 'Captcha verified successfully!';
            messageElement.style.color = 'green';
            document.getElementById('formGeneratorContainer').style.display = 'block';
            document.getElementById('captchaContainer').style.display = 'none';
        } else {
            messageElement.textContent = 'Incorrect captcha. Please try again.';
            messageElement.style.color = 'red';
            generateCaptcha();
            document.getElementById('captchaInput').value = '';
        }
    });
});