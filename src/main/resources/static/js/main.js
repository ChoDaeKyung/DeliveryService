$(document).ready(function () {
    showSection();

    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close-button");

    $(".rectangle").on("click", function () {
        modal.style.display = "block";
    });

    closeButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

function showSection(sectionId) {
    // 모든 section을 숨김
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // 클릭한 메뉴에 해당하는 section만 표시
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}