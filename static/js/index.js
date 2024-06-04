document.querySelector('.read-more').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector('.more').style.display = 'inline';
    event.target.style.display = 'none';
});