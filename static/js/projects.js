function openModal(title, description) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-description').innerText = description;

    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('modal').classList.remove('active');
}