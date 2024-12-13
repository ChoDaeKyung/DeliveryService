$(document).ready(function () {
    checkModel();

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

let section = null;

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

// `section` 값 반환 함수
window.getSectionId = function () {
    return section;
};

function checkModel() {
    const sectionId = $('#hiddenSectionId').val();
    if (sectionId !== '' && sectionId !== null) {
    let sectionId = $('#hiddenSectionId').val();
    console.log('sectionId :: ', sectionId)
    if(sectionId !== "" || sectionId !== null){
        showSection(sectionId);
    } else {
        showSection('menu'); // 기본 섹션 ID
    }else{
        showSection('menu');
    }

}

window.getSectionId = function () {
    return section;
};




}