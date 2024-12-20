function idForUpdate() {
    // 비밀번호 확인 없이 그냥 페이지 리디렉션
    window.location.href = '/user/idForUpdate';  // 아이디 확인 페이지로 이동
}

function checkAndFetchNickname() {
    const userIdElement = document.getElementById('userId');
    const userId = userIdElement.value;

    if (!userId) {
        alert('아이디를 입력해 주세요.');
        return;
    }

    // AJAX 요청: 아이디 유효성 확인 및 닉네임 가져오기
    $.ajax({
        type: 'POST',
        url: '/user/check-id-and-fetch-nickname',  // 아이디 확인과 닉네임을 동시에 가져오는 API 경로
        data: JSON.stringify({ userId: userId }),
        contentType: 'application/json',
        success: function(response) {
            console.log('응답 성공:', response);
            if (response && response.nickname) {
                // 아이디와 닉네임을 URL 파라미터로 전달 (아이디는 필요 없으므로 닉네임만 전달)
                window.location.href = `/user/nicknameUpdate?nickname=${encodeURIComponent(response.nickname)}&userId=${encodeURIComponent(response.userId)}`;
            } else {
                alert('아이디가 올바르지 않거나 닉네임을 가져오는 데 실패했습니다. 다시 시도해 주세요.');
            }
        },
        error: function(xhr, status, error) {
            console.error('응답 실패:', xhr.responseText);
            alert('아이디가 올바르지 않습니다. 다시 시도해 주세요.');
        }
    });
}

$('#checkNicknameButton').on('click', function () {
    const newNickname = $('#newNickname').val(); // 새 닉네임 입력 값 가져오기

    if (!newNickname) {
        alert('닉네임을 입력해주세요.');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/user/check-nickname', // 서버 API 엔드포인트
        data: JSON.stringify({ nickname: newNickname }),
        contentType: 'application/json',
        success: function (response) {
            if (response.exists) {
                alert('이미 사용 중인 닉네임입니다.');
            } else {
                alert('사용 가능한 닉네임입니다!');
            }
        },
        error: function () {
            alert('중복 검사 중 오류가 발생했습니다.');
        }
    });
});







// updateNickname 함수
//     function updateNickname() {
//         const newNickname = document.getElementById('new-nickname').value;
//         const userId = document.getElementById('user-id').value;
//
//         if (!newNickname) {
//             alert('새 닉네임을 입력해 주세요.');
//             return;
//         }
//
//         $.ajax({
//             type: 'PATCH',
//             url: 'http://localhost:9010/user/update-nickname',  // 백엔드 포트 추가
//             data: JSON.stringify({
//                 userId: userId,
//                 newNickname: newNickname
//             }),
//             contentType: 'application/json',
//             success: function (response) {
//                 alert('닉네임이 성공적으로 변경되었습니다!');
//                 window.location.href = '/mypage';  // 변경된 페이지로 리디렉션
//             },
//             error: function (error) {
//                 alert('닉네임 변경에 실패했습니다. 다시 시도해 주세요.');
//             }
//         });
//     }

