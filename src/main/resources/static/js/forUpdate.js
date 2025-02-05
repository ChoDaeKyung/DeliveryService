

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


let isNicknameValid = false; // 닉네임 중복 체크 여부를 저장하는 변수

// 닉네임 중복 체크 버튼 클릭 이벤트
$(function () {
    $('#checkNicknameButton').on('click', function () {
        const newNickname = $('#newNickname').val();

        if (!newNickname) {
            alert('닉네임을 입력해주세요.');
            return;
        }
        console.log("중복 검사 시작"); // 중복 검사 시작 로그


        $.ajax({
            type: 'POST',
            url: '/user/check-nickname', // 프론트엔드 컨트롤러 API
            contentType: 'application/json',
            data: JSON.stringify({ nickname: newNickname }),
            success: function (response) {
                console.log("중복 검사 응답:", response); // 중복 검사 응답 로그
                if (response) {
                    alert('이미 사용 중인 닉네임입니다.');
                    isNicknameValid = false; // 중복된 닉네임인 경우 false
                } else {
                    alert('사용 가능한 닉네임입니다!');
                    isNicknameValid = true; // 사용 가능한 닉네임인 경우 true
                }
                console.log("isNicknameValid:", isNicknameValid); // 값 확인
                toggleUpdateButton(); // 수정 버튼 활성화 상태 업데이트
            },
            error: function (xhr, status, error) {
                console.error('에러 발생:', xhr.responseText);
                alert('중복 검사 중 오류가 발생했습니다.');
                isNicknameValid = false; // 오류 발생 시 false로 설정
                toggleUpdateButton(); // 버튼 비활성화
            }
        });
    });
});

// 닉네임 수정 버튼 활성화/비활성화 함수


// 수정 버튼 이벤트 등록
$(function () {
    $('#updateNicknameButton').on('click', function (event) {
        event.preventDefault(); // 폼 제출을 막고, AJAX 호출을 사용하도록
            updateNickname();
    });

    // 페이지 로드 시 기본적으로 수정 버튼 비활성화

});


// 닉네임 수정 버튼 클릭 이벤트
function updateNickname() {
    const newNickname = $('#newNickname').val();
    const userid = $('#userid').val();

    if (newNickname==='') {
        alert('닉네임을 입력해 주세요.');
        return;
    }
    console.log("isNicknameValid:", isNicknameValid); // 닉네임 유효성 체크


    if (!isNicknameValid) {
        alert('닉네임 중복 검사를 먼저 진행해 주세요.');
        return;
    }

    const updateButton = $('#updateNicknameButton');
    updateButton.prop('disabled', true); // 버튼 비활성화 (중복 클릭 방지)

    // AJAX 요청: 닉네임 수정
    $.ajax({
        type: 'POST',
        url: '/user/update-nickname',
        contentType: 'application/json',
        data: JSON.stringify({ nickname: newNickname, userId: userid }),
        success: function (response) {
            console.log('응답:', response);
            if (response === "success") {
                alert('닉네임이 성공적으로 변경되었습니다!');
                window.location.replace('/mypage');
            } else {
                alert('닉네임 변경에 실패했습니다.');
            }
        },
        error: function (xhr, status, error) {
            console.error('닉네임 수정 실패:', xhr.responseText);
            alert('닉네임 수정 중 오류가 발생했습니다.');
        },
        complete: function () {
            updateButton.prop('disabled', false); // 요청 완료 후 버튼 활성화
        }
    });
}












