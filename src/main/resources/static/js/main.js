$(document).ready(function () {
    checkModel();
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
        showSection(sectionId);
    } else {
        showSection('menu'); // 기본 섹션 ID
    }

}

window.getSectionId = function () {
    return section;
};



