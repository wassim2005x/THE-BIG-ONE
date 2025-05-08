document.addEventListener("DOMContentLoaded", function () {
    // Extract formName from URL
    const urlParams = new URLSearchParams(window.location.search);
    const formName = urlParams.get("formName");

    // Display formName in an <h1> tag at the top
    const formTitle = document.createElement("h1");
    formTitle.id = "formTitle";

    if (!formName || formName === "undefined") {
        formTitle.textContent = "Error: No form specified.";
        document.body.prepend(formTitle);
        document.getElementById("formContainer").innerHTML = "<p>Error: No form specified.</p>";
        return;
    }

    formTitle.textContent = `Form: ${formName}`;
    document.body.prepend(formTitle);

    // Fetch form data from backend
    fetch(`http://localhost:8080/form/${encodeURIComponent(formName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Form not found');
            }
            return response.text(); // Change to .text() to handle potential JSON string
        })
        .then(data => {
            try {
                // Parse the JSON string
                const parsedData = JSON.parse(data);
                renderForm(parsedData, formName);
            } catch (error) {
                console.error("Error parsing form data:", error);
                document.getElementById("formContainer").innerHTML = "<p>Error parsing form data.</p>";
            }
        })
        .catch(error => {
            console.error("Error loading form:", error);
            document.getElementById("formContainer").innerHTML = `<p>Error: ${error.message}</p>`;
        });
});

// Function to render form dynamically
function renderForm(fields, formName) {
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = ""; // Clear previous content

    const form = document.createElement("form");
    form.id = "userForm";

    // Create hidden input to store formName
    const formNameInput = document.createElement("input");
    formNameInput.type = "hidden";
    formNameInput.name = "formName";
    formNameInput.value = formName;
    form.appendChild(formNameInput);

    fields.forEach(field => {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.classList.add("form-group");

        const label = document.createElement("label");
        label.textContent = field.label;
        label.setAttribute("for", field.name);
        
        let input;
        
        // Handle different field types
        if (field.type === "select" && field.options) {
            if (field.multiple) {
                // Multiple select
                input = document.createElement("select");
                input.name = field.name;
                input.id = field.name;
                input.multiple = true;
                
                field.options.forEach(option => {
                    const optionElement = document.createElement("option");
                    optionElement.value = option.value || option.label;
                    optionElement.textContent = option.label;
                    input.appendChild(optionElement);
                });
            } else {
                // Single select
                input = document.createElement("select");
                input.name = field.name;
                input.id = field.name;

                // Add default option
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Select an option";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                input.appendChild(defaultOption);

                // Add options from field configuration
                field.options.forEach(option => {
                    const optionElement = document.createElement("option");
                    optionElement.value = option.value || option.label;
                    optionElement.textContent = option.label;
                    input.appendChild(optionElement);
                });
            }
        } else if (field.type === "textarea") {
            input = document.createElement("textarea");
            input.name = field.name;
            input.id = field.name;
            input.rows = 4;
        } else if (field.type === "checkbox-group" && field.options) {
            // Create a wrapper for checkbox group
            input = document.createElement("div");
            input.className = "checkbox-group";
            
            field.options.forEach((option, index) => {
                const checkboxWrapper = document.createElement("div");
                checkboxWrapper.className = "checkbox-option";
                
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = `${field.name}[${index}]`;
                checkbox.id = `${field.name}_${index}`;
                checkbox.value = option.value || option.label;
                
                const checkboxLabel = document.createElement("label");
                checkboxLabel.textContent = option.label;
                checkboxLabel.setAttribute("for", `${field.name}_${index}`);
                
                checkboxWrapper.appendChild(checkbox);
                checkboxWrapper.appendChild(checkboxLabel);
                input.appendChild(checkboxWrapper);
            });
        } else if (field.type === "checkbox") {
            input = document.createElement("input");
            input.type = "checkbox";
            input.name = field.name;
            input.id = field.name;
        } else {
            input = document.createElement("input");
            input.type = field.type || "text";
            input.name = field.name;
            input.id = field.name;
        }

        // Set common attributes for input elements
        if (input.tagName === "INPUT" || input.tagName === "TEXTAREA" || input.tagName === "SELECT") {
            input.required = field.required || false;
            if (field.placeholder) {
                input.placeholder = field.placeholder;
            }

            // Add validation attributes if exists
            if (field.validation) {
                Object.keys(field.validation).forEach(validationKey => {
                    switch(validationKey) {
                        case 'minLength':
                            input.minLength = field.validation.minLength;
                            break;
                        case 'maxLength':
                            input.maxLength = field.validation.maxLength;
                            break;
                        case 'min':
                            input.min = field.validation.min;
                            break;
                        case 'max':
                            input.max = field.validation.max;
                            break;
                        case 'pattern':
                            input.pattern = field.validation.pattern;
                            break;
                    }
                });
            }
        }

        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(input);
        form.appendChild(fieldWrapper);
    });

   // Submit button
   const submitButton = document.createElement("button");
   submitButton.textContent = "Submit";
   submitButton.type = "submit";
   form.appendChild(submitButton);

   // Handle form submission
   form.addEventListener("submit", function (event) {
       event.preventDefault();
       submitForm(formName, fields);
   });

   formContainer.appendChild(form);
}

// Function to submit form data
function submitForm(formName, fields) {
    const formData = {}; // Object to store user input

    // Collect form data
    fields.forEach(field => {
        // Special handling for consent field
        if (field.name === "consenttocontact") {
            const consentInput = document.getElementById(field.name);
            if (consentInput) {
                // Store as a boolean value directly
                formData[field.name] = consentInput.checked;
            }
        }
        // Handle checkbox groups
        else if (field.type === "checkbox-group" && field.options) {
            const selectedValues = [];
            field.options.forEach((option, index) => {
                const checkbox = document.getElementById(`${field.name}_${index}`);
                if (checkbox && checkbox.checked) {
                    selectedValues.push(checkbox.value);
                }
            });
            formData[field.name] = selectedValues;
        } 
        else if (field.type === "select" && field.multiple) {
            // Handle multi-select
            const selectElement = document.getElementById(field.name);
            if (selectElement) {
                formData[field.name] = Array.from(selectElement.selectedOptions).map(option => option.value);
            }
        } 
        else if (field.type === "checkbox") {
            // Handle single checkbox
            const input = document.getElementById(field.name);
            if (input) {
                formData[field.name] = input.checked;
            }
        } 
        else {
            // Handle other input types
            const input = document.getElementById(field.name);
            if (input) {
                formData[field.name] = input.value;
            }
        }
    });

    console.log("Form data to submit:", formData);

    // Send data to the correct API endpoint
    fetch(`http://localhost:8080/submit?formName=${encodeURIComponent(formName)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Submission failed');
        }
        return response.text();
    })
    .then(data => {
        alert("Form submitted successfully!");
        // Optional: Reset form or redirect
        document.getElementById("userForm").reset();
    })
    .catch(error => {
        console.error("Submission error:", error);
        alert("Error submitting form: " + error.message);
    });
}