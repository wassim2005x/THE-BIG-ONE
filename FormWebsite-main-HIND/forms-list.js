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