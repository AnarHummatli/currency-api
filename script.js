const allButtons = document.querySelectorAll(".currencies button");

allButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let clickedButton = e.target;
        let parentContainer = clickedButton.closest(".currencies");
        let currentActive = parentContainer.querySelector(".active");

        if (currentActive) {
            currentActive.classList.remove("active");
        }
        
        clickedButton.classList.add("active");
    });
});