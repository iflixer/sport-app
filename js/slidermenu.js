document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.querySelector('.menu-container');
    const menuItems = document.querySelectorAll('.menu-item');

    function getSelectedMenuItem() {
        return localStorage.getItem('selectedMenuItem');
    }

    function setSelectedMenuItem(index) {
        localStorage.setItem('selectedMenuItem', index);
    }

    const initiallySelectedIndex = getSelectedMenuItem();

    if (initiallySelectedIndex !== null) {
        menuItems.forEach((item, index) => {
                menuItems.forEach(i => i.classList.remove('active'));
        });
        menuItems[initiallySelectedIndex].classList.add('active');
        scrollToActiveItem(menuItems[initiallySelectedIndex]);
    }

    menuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            // event.preventDefault();

            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            setSelectedMenuItem(index);

            scrollToActiveItem(this);
        });
    });

    function scrollToActiveItem(item) {
        const scrollLeft = item.offsetLeft - (menuContainer.offsetWidth - item.offsetWidth) / 2;
        menuContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
});
