function idForUpdate() {
    // 비밀번호 확인 없이 그냥 페이지 리디렉션
    window.location.href = '/user/idForUpdate';  // 아이디 확인 페이지로 이동
}

// checkId 함수는 DOMContentLoaded 외부에서 정의하여 전역적으로 사용 가능하게 합니다.
function checkId() {
    const userIdElement = document.getElementById('userId');

    // DOM 요소가 존재하는지 확인
    if (!userIdElement) {
        alert('아이디 입력 필드가 없습니다.');
        return;
    }

    const userId = userIdElement.value;

    if (!userId) {
        alert('아이디를 입력해 주세요.');
        return;
    }

    // AJAX 요청
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9010/user/check-id',  // 백엔드 포트 추가
        data: JSON.stringify({ userId: userId }),
        contentType: 'application/json',
        success: function () {
            // 아이디가 확인되면 닉네임 가져오기
            fetchNickname(userId);

            // 서버가 응답을 성공적으로 반환하면 폼 생성 후 전송
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/user/nicknameUpdate';

            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'userId';
            hiddenInput.value = userId;

            form.appendChild(hiddenInput);
            document.body.appendChild(form);
            form.submit();
        },
        error: function () {
            alert('아이디가 올바르지 않습니다. 다시 시도해 주세요.');
        }
    });
}

// DOMContentLoaded 이벤트 내에서 fetchNickname과 관련된 코드를 실행
document.addEventListener('DOMContentLoaded', () => {
    const currentNicknameInput = document.getElementById('current-nickname');
    const userId = '사용자가 입력한 아이디'; // 실제 아이디로 변경 필요

    // 닉네임 가져오기
    fetchNickname(userId);
});

// 닉네임 가져오는 함수
function fetchNickname(userId) {
    fetch(`http://localhost:9010/user/${userId}/nickname`)
        .then(response => response.text())
        .then(nickname => {
            // 닉네임을 화면에 표시
            document.getElementById('current-nickname').value = nickname;
        })
        .catch(error => {
            console.error('닉네임 가져오기 실패:', error);
        });
}

// updateNickname 함수
function updateNickname() {
    const newNickname = document.getElementById('new-nickname').value;
    const userId = document.getElementById('user-id').value;

    if (!newNickname) {
        alert('새 닉네임을 입력해 주세요.');
        return;
    }

    $.ajax({
        type: 'PATCH',
        url: 'http://localhost:9010/user/update-nickname',  // 백엔드 포트 추가
        data: JSON.stringify({
            userId: userId,
            newNickname: newNickname
        }),
        contentType: 'application/json',
        success: function(response) {
            alert('닉네임이 성공적으로 변경되었습니다!');
            window.location.href = '/mypage';  // 변경된 페이지로 리디렉션
        },
        error: function(error) {
            alert('닉네임 변경에 실패했습니다. 다시 시도해 주세요.');
        }
    });
}
