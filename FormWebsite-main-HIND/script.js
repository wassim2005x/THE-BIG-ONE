// Function to add a new field
function addField() {
    const fieldsContainer = document.getElementById("fields-container");
  
    // Create a new field container
    const fieldDiv = document.createElement("div");
    fieldDiv.classList.add("field");
  
    // Create a label input
    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.placeholder = "Field Label";
    labelInput.required = true;
  
    // Create a field type select dropdown
    const typeSelect = document.createElement("select");
    typeSelect.innerHTML = `
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="textarea">Text Area</option>
    `;
  
    // Create a "Remove" button
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.innerText = "Remove";
    removeButton.onclick = function () {
        fieldsContainer.removeChild(fieldDiv);
    };
  
    // Append elements to the field container
    fieldDiv.appendChild(labelInput);
    fieldDiv.appendChild(typeSelect);
    fieldDiv.appendChild(removeButton);
  
    // Append the field container to the fields container
    fieldsContainer.appendChild(fieldDiv);
  }
  
  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page
  
    // Get all the fields
    const fields = document.querySelectorAll(".field");
    const formData = [];
  
    // Loop through each field and collect the data
    fields.forEach((field) => {
        const label = field.querySelector("input").value;
        const type = field.querySelector("select").value;
        formData.push({ label, type });
    });
  
    // Display the generated form on the page
    displayGeneratedForm(formData);
  }
  
  // Function to display the generated form
  function displayGeneratedForm(formData) {
    const generatedFormContainer = document.getElementById("generated-form-container");
    generatedFormContainer.innerHTML = "<h2>Generated Form</h2>";
  
    // Create a form element
    const generatedForm = document.createElement("form");
    generatedForm.id = "generated-form";
  
    // Loop through the form data and create form fields
    formData.forEach((field) => {
        const fieldDiv = document.createElement("div");
        fieldDiv.classList.add("generated-field");
  
        // Create a label
        const label = document.createElement("label");
        label.innerText = field.label;
        label.setAttribute("for", field.label.toLowerCase().replace(/ /g, "-"));
  
        // Create an input based on the field type
        let input;
        if (field.type === "textarea") {
            input = document.createElement("textarea");
            input.rows = 3;
        } else {
            input = document.createElement("input");
            input.type = field.type;
        }
        input.id = field.label.toLowerCase().replace(/ /g, "-");
        input.placeholder = `Enter ${field.label}`;
  
        // Append the label and input to the field container
        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
  
        // Append the field to the generated form
        generatedForm.appendChild(fieldDiv);
    });
  
    // Append the generated form to the container
    generatedFormContainer.appendChild(generatedForm);
  }
  
  // Add an event listener to the form
  document.getElementById("standard-form").addEventListener("submit", handleFormSubmit); 
  const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});

themeToggle.addEventListener('click', toggleTheme);