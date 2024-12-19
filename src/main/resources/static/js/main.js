$(document).ready(function () {
    checkToken();
    setupAjax();
    checkModel();
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

function checkModel() {
    let sectionId = $('#hiddenSectionId').val();
    console.log('sectionId :: ', sectionId)
    if(sectionId !== '' && sectionId !== null){
        window.location.href('/main');
        showSection(sectionId);
    }else{
        showSection('menu');
    }

}