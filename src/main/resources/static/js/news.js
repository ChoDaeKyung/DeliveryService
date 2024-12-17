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
    let img = $('#image').val();

    let sendData = {
        title: title,
        content: content,
        img: img
    };
    console.log('title ::' + title);
    console.log('content ::' + content);
    console.log('img ::' + img);

    $.ajax({
        method: 'POST',
        url: '/webs/api/news',
        data: JSON.stringify(sendData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: (response) => {
            console.log('response :: ', response);
            document.getElementById('newscreate').style.display = 'none'; // 완료 후 숨김 처리
            alert('뉴스가 성공적으로 생성되었습니다.');

            // 메인 페이지로 이동
            window.location.href = '/main'; // 메인 페이지 URL로 수정
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