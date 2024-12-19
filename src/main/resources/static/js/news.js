$(document).ready(function () {
    firstSection('newscreate');
});

function firstSection(sectionId) {
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    } else {
        console.error(`${sectionId} 요소를 찾을 수 없습니다.`);
    }
}


let createNews = () => {
    console.log('createNews 함수 호출됨');
    document.getElementById('newscreate').style.display = 'block';

    let title = $('#title').val();
    let content = $('#content').val();
    let files = $('#image')[0].files; // 선택된 파일들

    if (files.length === 0) {
        alert('이미지를 선택해주세요!');
        return;
    }

    let formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

        Array.from(files).forEach((file, index) => {
        formData.append('images', file); // 여러 이미지 추가
    });

    $.ajax({
        method: 'POST',
        url: '/webs/api/news',
        data: formData,
        processData: false,
        contentType: false,
        success: (response) => {
            console.log('response :: ', response);
            document.getElementById('newscreate').style.display = 'none';
            alert('뉴스가 성공적으로 생성되었습니다.');
            window.location.href = '/news';
        },
        error: (xhr) => {
            if (xhr.status === 419) {
                handleTokenExpiration();
                alert('다시 한번 시도해주세요.');
            } else {
                console.error('요청 오류 발생:', xhr);
                alert('뉴스 생성 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    });
};
