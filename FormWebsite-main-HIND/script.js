<<<<<<< HEAD
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

  
  
=======
// Variables to track form structure
let fieldCounter = 0;
const fieldTypes = {
  text: "Text",
  email: "Email",
  number: "Number",
  textarea: "Text Area",
  date: "Date",
  select: "Dropdown",
  checkbox: "Checkbox",
  radio: "Radio Button",
  checkbox_group: "Checkbox Group",
};

// Add new field with settings to the form builder
function addField() {
  fieldCounter++;
  const fieldsContainer = document.getElementById("fields-container");
  
  const fieldDiv = document.createElement("div");
  fieldDiv.className = "field-container";
  fieldDiv.id = `field-${fieldCounter}`;
  
  fieldDiv.innerHTML = `
    <div class="field-header">
      <h3>Field ${fieldCounter}</h3>
      <button type="button" class="delete-button" onclick="removeField(${fieldCounter})">Delete</button>
    </div>
    <div class="field-settings">
      <div class="field-row">
        <label for="field-label-${fieldCounter}">Label:</label>
        <input type="text" id="field-label-${fieldCounter}" class="field-label" placeholder="Enter field label">
      </div>
      <div class="field-row">
        <label for="field-name-${fieldCounter}">Name:</label>
        <input type="text" id="field-name-${fieldCounter}" class="field-name" placeholder="Enter field name">
      </div>
      <div class="field-row">
        <label for="field-type-${fieldCounter}">Type:</label>
        <select id="field-type-${fieldCounter}" class="field-type" onchange="toggleOptions(${fieldCounter})">
          ${Object.entries(fieldTypes).map(([value, label]) => 
            `<option value="${value}">${label}</option>`
          ).join('')}
        </select>
      </div>
      <div class="field-row">
        <label for="field-required-${fieldCounter}">Required:</label>
        <input type="checkbox" id="field-required-${fieldCounter}" class="field-required">
      </div>
      <div class="field-row options-container" id="options-container-${fieldCounter}" style="display: none;">
        <label for="field-options-${fieldCounter}">Options:</label>
        <textarea id="field-options-${fieldCounter}" class="field-options" placeholder="Enter options, one per line"></textarea>
      </div>
    </div>
  `;
  
  fieldsContainer.appendChild(fieldDiv);
}

// Show/hide options textarea based on field type
function toggleOptions(fieldId) {
  const fieldType = document.getElementById(`field-type-${fieldId}`).value;
  const optionsContainer = document.getElementById(`options-container-${fieldId}`);
  
  if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox_group') {
    optionsContainer.style.display = 'flex';
  } else {
    optionsContainer.style.display = 'none';
  }
}

// Remove a field from the form builder
function removeField(fieldId) {
  const fieldDiv = document.getElementById(`field-${fieldId}`);
  if (fieldDiv) {
    fieldDiv.remove();
  }
}

// Collect all field data and generate JSON structure
function collectFormData() {
  const formName = prompt("Enter a name for your form:", "My Form");
  if (!formName) return null;
  
  const description = prompt("Enter a description for your form:", "Form Description");
  
  const fields = [];
  const fieldDivs = document.querySelectorAll('.field-container');
  
  fieldDivs.forEach(fieldDiv => {
    const fieldId = fieldDiv.id.split('-')[1];
    const label = document.getElementById(`field-label-${fieldId}`).value;
    const name = document.getElementById(`field-name-${fieldId}`).value || label.toLowerCase().replace(/\s+/g, '_');
    const type = document.getElementById(`field-type-${fieldId}`).value;
    const required = document.getElementById(`field-required-${fieldId}`).checked;
    
    const field = {
      label,
      name,
      type,
      required
    };
    
    // Add options if applicable
    if (type === 'select' || type === 'radio' || type === 'checkbox_group') {
      const optionsText = document.getElementById(`field-options-${fieldId}`).value;
      const options = optionsText
        .split('\n')
        .map(option => option.trim())
        .filter(option => option.length > 0);
      
      field.options = options;
    }
    
    fields.push(field);
  });
  
  return {
    formName,
    description,
    fields: JSON.stringify(fields)
  };
}

// Handle form submission
document.getElementById('standard-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const formData = collectFormData();
  if (!formData) return;
  
  // Save form structure
  saveFormStructure(formData);
});

// Save form structure to backend
function saveFormStructure(formData) {
  const url = 'http://localhost:8080/save';
  
  fetch(url + `?formName=${encodeURIComponent(formData.formName)}&description=${encodeURIComponent(formData.description)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: formData.fields
  })
  .then(response => response.text())
  .then(data => {
    alert(data);
    generateFormPreview(formData);
  })
  .catch(error => {
    console.error('Error saving form:', error);
    alert('Error saving form. Please try again.');
  });
}

// Generate a preview of the form
function generateFormPreview(formData) {
  const generatedFormContainer = document.getElementById('generated-form-container');
  const fields = JSON.parse(formData.fields);
  
  // Create the form HTML
  let formHtml = `
    <div class="generated-form">
      <h2>${formData.formName}</h2>
      <p>${formData.description}</p>
      <form id="user-form" onsubmit="submitUserForm(event, '${formData.formName}')">
  `;
  
  // Add fields
  fields.forEach(field => {
    formHtml += `<div class="form-field">`;
    formHtml += `<label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>`;
    
    switch (field.type) {
      case 'text':
        formHtml += `<input type="text" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
        break;
      case 'email':
        formHtml += `<input type="email" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
        break;
      case 'number':
        formHtml += `<input type="number" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
        break;
      case 'date':
        formHtml += `<input type="date" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
        break;
      case 'textarea':
        formHtml += `<textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}></textarea>`;
        break;
      case 'checkbox':
        formHtml += `<input type="checkbox" id="${field.name}" name="${field.name}">`;
        break;
      case 'select':
        formHtml += `<select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
        formHtml += `<option value="">-- Select --</option>`;
        field.options.forEach(option => {
          formHtml += `<option value="${option}">${option}</option>`;
        });
        formHtml += `</select>`;
        break;
      case 'radio':
        field.options.forEach(option => {
          const optionId = `${field.name}_${option.replace(/\s+/g, '_')}`;
          formHtml += `
            <div class="radio-option">
              <input type="radio" id="${optionId}" name="${field.name}" value="${option}" ${field.required ? 'required' : ''}>
              <label for="${optionId}">${option}</label>
            </div>
          `;
        });
        break;
      case 'checkbox_group':
        field.options.forEach(option => {
          const optionId = `${field.name}_${option.replace(/\s+/g, '_')}`;
          formHtml += `
            <div class="checkbox-option">
              <input type="checkbox" id="${optionId}" name="${field.name}" value="${option}">
              <label for="${optionId}">${option}</label>
            </div>
          `;
        });
        break;
    }
    
    formHtml += `</div>`;
  });
  
  formHtml += `
      <div class="button-container">
        <button type="submit" class="button">Submit</button>
      </div>
    </form>
  </div>
  `;
  
  generatedFormContainer.innerHTML = formHtml;
}

// Submit user form data
function submitUserForm(event, formName) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = {};
  
  // Handle checkbox groups specially
  const checkboxGroups = {};
  
  // First pass: collect all form data
  for (const [name, value] of formData.entries()) {
    // Check if it's part of a checkbox group
    if (name.includes('_')) {
      const baseName = name.split('_')[0];
      const checkboxField = document.querySelector(`input[type="checkbox"][name="${name}"]`);
      
      if (checkboxField) {
        if (!checkboxGroups[baseName]) {
          checkboxGroups[baseName] = [];
        }
        checkboxGroups[baseName].push(value);
      } else {
        data[name] = value;
      }
    } else {
      // Handle regular fields
      if (data[name]) {
        // If we already have this name, convert to array
        if (!Array.isArray(data[name])) {
          data[name] = [data[name]];
        }
        data[name].push(value);
      } else {
        data[name] = value;
      }
    }
  }
  
  // Add checkbox groups to data
  for (const [groupName, values] of Object.entries(checkboxGroups)) {
    data[groupName] = values;
  }
  
  // Submit data to backend
  fetch(`http://localhost:8080/submit?formName=${encodeURIComponent(formName)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(responseData => {
    alert(responseData);
    form.reset();
  })
  .catch(error => {
    console.error('Error submitting form:', error);
    alert('Error submitting form. Please try again.');
  });
}
>>>>>>> 1fc2b01 (FormAi_V1_FINALE_Mido)
