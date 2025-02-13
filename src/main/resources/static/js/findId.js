

$(document).ready(function () {
        let resetToken = $("#resetToken").val();
        console.log("resetToken 값:", resetToken); // 디버깅용 콘솔 출력

        // resetToken 값이 있을 때 비밀번호 변경 UI 표시
        if (resetToken && resetToken.trim() !== "") {
            $("#resetPasswordContainer").show();
        }
    // 📌 모달 열기
    $('#forgot-password-btn').click(() => $('#forgot-password-modal').show());
    $('#find-id-btn').click(() => $('#find-id-modal').show());

    // 📌 모달 닫기 버튼
    $('.close').click(() => $('.modal').hide());

    // 📌 비밀번호 변경 처리
    $('#resetPasswordForm').submit(function (event) {
        event.preventDefault();

        let newPassword = $('#newPassword').val().trim();
        let confirmPassword = $('#confirmPassword').val().trim();
        let resetToken = $('#resetToken').val();

        if (!newPassword || !confirmPassword) {
            showErrorMessage("비밀번호를 입력해주세요.", '#message');
            return;
        }
        if (newPassword !== confirmPassword) {
            showErrorMessage("비밀번호가 일치하지 않습니다!", '#message');
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/password/reset/update-password',
            data: JSON.stringify({ resetToken, newPassword }),
            contentType: 'application/json; charset=utf-8',
            success: function () {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                window.location.href = "/login";
            },
            error: function (xhr) {
                alert("비밀번호가 변경 실패");
                $('#newPassword').val('');
                $('#confirmPassword').val('');
            }
        });
    });

    // 📌 아이디 찾기 요청
    $('#findIdForm').submit(function (event) {
        event.preventDefault();
        const email = $('#find-email').val().trim();

        if (!email) {
            showErrorMessage("이메일을 입력해주세요.", '#find-id-result');
            return;
        }

        $.ajax({
            url: '/member/api/find-id',
            type: 'POST',
            data: JSON.stringify({ email }),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                alert('이메일 전송 성공')
                window.location.href="/login"
            },
            error: function () {
                // alert('이메일 전송 실패')
                $('#email').val('');
            }
        });
    });

    // 📌 비밀번호 찾기 요청
    $('#resetPasswordRequestForm').submit(function (event) {
        event.preventDefault();
        const email = $('#reset-email').val().trim();
        const userId = $('#reset-userId').val().trim();

        if (!email || !userId) {
            showErrorMessage("이메일을 입력해주세요.", '#reset-password-result');
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/password/reset/request',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ email, userId }),
            success: function () {
                alert('비밀번호 재설정 이메일이 전송되었습니다.');
                window.location.href = "/login";
            },
            error: function (xhr) {
                // alert('이메일 전송 실패. 다시 시도해주세요.');
                $('#reset-email').val('');
                $('#reset-userId').val('');

            }
        });
    });
});

// 📌 오류 메시지 표시 함수
function showErrorMessage(message, selector) {
    $(selector).addClass('error').removeClass('success').text(message);
}

// 📌 서버 응답 처리 함수
function handleResponse(response, selector) {
    $(selector).removeClass('error').addClass(response.success ? 'success' : 'error').text(response.message);
}
