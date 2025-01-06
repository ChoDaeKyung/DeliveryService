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

$(function () {
    $('#checkNicknameButton').on('click', function () {
        const newNickname = $('#newNickname').val();

        if (!newNickname) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/user/check-nickname', // 프론트엔드 컨트롤러 API
            contentType: 'application/json',
            data: JSON.stringify({ nickname: newNickname }),
            success: function (response) {
                console.log(response);
                if (response) {
                    alert('이미 사용 중인 닉네임입니다.');
                } else {
                    alert('사용 가능한 닉네임입니다!');
                }
            },
            error: function (xhr, status, error) {  // xhr, status, error 인자를 추가
                console.error('에러 발생:', xhr.responseText);  // xhr.responseText로 에러 메시지 출력
                alert('중복 검사 중 오류가 발생했습니다.');
            }
        });
    });
});

function updateNickname() {
    const newNickname = document.getElementById('newNickname').value;
    const userid = document.getElementById('userid').value;
    if (!newNickname) {
        alert('닉네임을 입력해 주세요.');
        return;
    }
    // 버튼 비활성화 (중복 클릭 방지)
    const updateButton = document.getElementById('updateNicknameButton');
    updateButton.disabled = true;

    // AJAX 요청: 닉네임 수정
    $.ajax({
        type: 'POST',
        url: '/user/update-nickname',
        contentType: 'application/json',
        data: JSON.stringify({ nickname: newNickname, userId: userid  }),
        success: function(response) {
            console.log('응답:', response); // 응답 확인
            if (response === "success") {
                alert('닉네임이 성공적으로 변경되었습니다!');
                window.location.replace('/mypage');

            } else {
                alert('닉네임 변경에 실패했습니다.');
            }
        },
        error: function(xhr, status, error) {
            console.error('닉네임 수정 실패:', xhr.responseText);
            alert('닉네임 수정 중 오류가 발생했습니다.');
        },
        complete: function() {
            // 요청이 끝난 후 버튼 활성화
            updateButton.disabled = false;
        }
    });

}

$(function () {
    $('#updateNicknameButton').on('click', function () {
        updateNickname();
    });
});









