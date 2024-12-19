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

                const newsUpdateElement = document.getElementById('newsupdate');
                if (newsUpdateElement) {
                    newsUpdateElement.style.display = 'none';  // 요소가 있을 경우에만 스타일 변경
                }

                alert(jsonResponse.message || '뉴스가 성공적으로 업데이트되었습니다.');
                console.log('페이지 이동을 시작합니다.');
                window.location.href = '/news';
            } catch (e) {
                console.error('응답 파싱 오류:', e);
                alert('응답 처리 중 오류가 발생했습니다.');
            }
        }

    });

};