// This JavaScript adds subtle hover animations to each feature card.
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card');
    
    // Hover in and hover out effects
    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            card.querySelector('.card-image img').style.opacity = '0.8';
        });

        card.addEventListener('mouseout', function() {
            card.querySelector('.card-image img').style.opacity = '1';
        });
    });
});
