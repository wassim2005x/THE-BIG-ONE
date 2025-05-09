document.getElementById("fetchFormButton").addEventListener("click", fetchForm);

function fetchForm() {
    const userData = document.getElementById("userQuery").value;
    fetch("http://localhost:8080/generate-form", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: userData }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);

        if (!data || !data.fields) {
            console.error("Invalid API response: Missing 'fields' array.");
            return;
        }

        const formContainer = document.getElementById("formContainer");
        formContainer.innerHTML = ""; // Clear previous form content

        // Create title
        const title = document.createElement("h2");
        title.textContent = data.title || "Untitled Form";
        formContainer.appendChild(title);

        // Create description
        if (data.description) {
            const description = document.createElement("p");
            description.textContent = data.description;
            formContainer.appendChild(description);
        }

        // Create form element
        const form = document.createElement("form");
        form.setAttribute("id", "dynamicForm");

        data.fields.forEach(field => {
            const fieldWrapper = document.createElement("div");
            fieldWrapper.classList.add("form-group");

            const label = document.createElement("label");
            label.setAttribute("for", field.name);
            label.textContent = field.label;

            let input;

            // Handle different field types
            if (field.type === "select" && field.options) {
                input = document.createElement("select");
                input.name = field.name;
                input.id = field.name;

                // Add options to the select element
                field.options.forEach(option => {
                    const optionElement = document.createElement("option");
                    optionElement.value = option; // set string value
                    optionElement.textContent = option; // display string value
                    input.appendChild(optionElement);
                });
                
            } else if (field.type === "textarea") {
                input = document.createElement("textarea");
                input.name = field.name;
                input.id = field.name;
                input.rows = 4;
            } else if (field.type === "checkbox" && field.options) {
                input = document.createElement("div");
                field.options.forEach(option => {
                    const checkboxWrapper = document.createElement("div");
                    const checkboxInput = document.createElement("input");
checkboxInput.type = "checkbox";
checkboxInput.value = option;
checkboxInput.name = field.name;
checkboxInput.id = `${field.name}_${option}`;

const checkboxLabel = document.createElement("label");
checkboxLabel.textContent = option;
checkboxLabel.setAttribute("for", `${field.name}_${option}`);

                    checkboxWrapper.appendChild(checkboxInput);
                    checkboxWrapper.appendChild(checkboxLabel);
                    input.appendChild(checkboxWrapper);
                });
            } else {
                input = document.createElement("input");
                input.type = field.type;
                input.name = field.name;
                input.id = field.name;
                if (field.required) input.required = true;
            }

            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            form.appendChild(fieldWrapper);
        });

        // Submit button
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.setAttribute("type", "submit");
        form.appendChild(submitButton);

        form.addEventListener("submit", function(event) {
            event.preventDefault();
            submitForm(data.formTitle, data.description, data.fields);
        });

        formContainer.appendChild(form);

        // Save form to backend & generate shareable link
        saveForm(data.formTitle, data.description, data.fields);
    })
    .catch(err => console.error("Error fetching form:", err));
}

// Save form function
function saveForm(formName, description, fields) {
    fetch(`http://localhost:8080/save?formName=${encodeURIComponent(formName)}&description=${encodeURIComponent(description)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fields)
    })
    .then(response => response.text())
    .then(data => {
        console.log("Form saved:", data);

        // Generate and display the shareable link
        const shareLinkContainer = document.getElementById("shareLinkContainer");
        shareLinkContainer.innerHTML = ""; // Clear previous link if any

        const shareLink = document.createElement("a");
        shareLink.href = `http://127.0.0.1:5501/fillForm.html?formName=${encodeURIComponent(formName)}`;
        shareLink.textContent = "Share this form with users";
        shareLink.target = "_blank";

        shareLinkContainer.appendChild(shareLink);
    })
    .catch(err => console.error("Error saving form:", err));
}

// Submit form function
function submitForm(formName, description, fields) {
    const formData = {};

    fields.forEach(field => {
        if (field.type === "checkbox" && field.options) {
            formData[field.name] = [];
            field.options.forEach(option => {
                const checkbox = document.getElementById(`${field.name}_${option.value}`);
                if (checkbox.checked) {
                    formData[field.name].push(option.value);
                }
            });
        } else {
            const input = document.getElementById(field.name);
            formData[field.name] = input.value;
        }
    });

    console.log("Submitting responses:", formData);

    fetch(`http://localhost:8080/submit?formName=${encodeURIComponent(formName)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => console.log("Server Response:", data))
    .catch(err => console.error("Error submitting form:", err));
}

// Captcha related code
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
