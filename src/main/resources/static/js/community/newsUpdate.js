let updateNews = () => {
    console.log('updateNews 함수 호출됨');
    //document.getElementById('newsupdate').style.display = 'block'; // 업데이트 화면 표시

    let title = $('#title').val();
    let content = $('#content').val();
    let files = $('#image')[0].files;
    let postId = $('#postId').val();

    let formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('postId', postId);

    // 이미지가 선택되었을 때만 FormData에 추가
    if (files.length > 0) {
        Array.from(files).forEach((file, index) => {
            formData.append('images', file); // 여러 이미지 추가
        });
    }

    console.log('title ::', title);
    console.log('content ::', content);
    console.log('images ::', files);
    console.log('postId ::', postId);

    $.ajax({
        method: 'POST',
        url: `/webs/api/news/update`,
        data: formData,
        processData: false,
        contentType: false, // 응답을 문자열로 처리
        success: (response) => {
            console.log('response :: ', response);
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