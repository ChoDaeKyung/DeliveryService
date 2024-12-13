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

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.select-news');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// 선택된 항목 삭제
function deleteSelected() {
    const selectedCheckboxes = document.querySelectorAll('.select-news:checked');
    if (selectedCheckboxes.length === 0) {
        alert("삭제할 항목을 선택해주세요.");
        return;
    }

    if (confirm("선택한 항목을 삭제하시겠습니까?")) {
        const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.id);

        // 서버로 삭제 요청 (AJAX 예시)
        fetch('/deleteNews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: selectedIds })
        })
            .then(response => {
                if (response.ok) {
                    alert("삭제되었습니다.");
                    location.reload(); // 페이지 새로고침
                } else {
                    alert("삭제에 실패했습니다.");
                }
            })
            .catch(error => console.error('Error:', error));
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



let updateNews = () => {
    console.log('updateNews 함수 호출됨');
    //document.getElementById('newsupdate').style.display = 'block'; // 업데이트 화면 표시

    let title = $('#title').val();
    let content = $('#content').val();
    let img = $('#image').val();
    let postId = $('#postId').val();

    let sendData = {
        title: title,
        content: content,
        img: img,
        id: postId
    };

    console.log('title ::', title);
    console.log('content ::', content);
    console.log('img ::', img);
    console.log('id ::', postId);

    $.ajax({
        method: 'PUT',
        url: `/webs/api/news`,
        data: JSON.stringify(sendData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'text', // 응답을 문자열로 처리
        success: (response, status, xhr) => {
            console.log('response :: ', response);  // 서버 응답 확인
            try {
                const jsonResponse = JSON.parse(response);  // 응답을 JSON으로 파싱
                console.log('Parsed response:', jsonResponse);
                document.getElementById('newsupdate').style.display = 'none';
                alert(jsonResponse.message || '뉴스가 성공적으로 업데이트되었습니다.');
                console.log('페이지 이동을 시작합니다.');
                window.location.href = '/main';
            } catch (e) {
                console.error('응답 파싱 오류:', e);
                alert('응답 처리 중 오류가 발생했습니다.');
            }
        },
        error: (xhr) => {
            if (xhr.status === 419) {
                handleTokenExpiration();
                alert('다시 한번 시도해주세요.');
            } else {
                console.error('요청 오류 발생:', xhr);
                alert('뉴스 업데이트 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    });

};


