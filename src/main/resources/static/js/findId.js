$(document).ready(function () {
    // 폼 제출 시 아이디 찾기 요청을 보내는 함수
    $('#findIdForm').on('submit', function (event) {
        event.preventDefault(); // 폼 제출 기본 동작 방지
        handleFormSubmit($(this), getId);  // $(this)를 전달하여 폼 처리
    });

    // 비밀번호 재설정 요청 처리
    $('#password-reset-form').submit(function (event) {
        event.preventDefault(); // 폼 제출 기본 동작 방지
        handleFormSubmit($(this), resetPassword);  // $(this)를 전달하여 폼 처리
    });

    // 비밀번호 변경 처리
    $('#resetPasswordForm').submit(function (event) {
        event.preventDefault(); // 기본 폼 제출 동작을 막기

        var newPassword = $('#newPassword').val().trim();
        var confirmPassword = $('#confirmPassword').val().trim();
        var resetToken = $('#resetToken').val();

        // 비밀번호 일치 여부 체크
        if (newPassword !== confirmPassword) {
            $('#error-message').text("비밀번호가 일치하지 않습니다.").show();
            return;
        }
        // 비밀번호 재설정 Ajax 호출
        $.ajax({
            type: 'POST',
            url: '/password/reset/update-password', // 비밀번호 재설정 API
            data: JSON.stringify({ resetToken: resetToken, newPassword: newPassword }),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                location.href = '/login'; // 로그인 페이지로 리다이렉트
            },
            error: function (xhr) {
                var errorMessage = xhr.responseText || "알 수 없는 오류가 발생했습니다.";
                $('#error-message').text(errorMessage).show();
            }
        });
    });
});

// 공통 폼 제출 처리 함수 (버튼 비활성화 + AJAX 호출)
function handleFormSubmit($form, ajaxCall) {
    var button = $form.find('button');  // 폼 안의 버튼 선택
    button.prop('disabled', true);  // 버튼 비활성화
    button.addClass('disabled');  // 비활성화 클래스 추가

    ajaxCall();  // AJAX 호출

    // 5초 후에 버튼을 다시 활성화
    setTimeout(function () {
        button.prop('disabled', false);  // 버튼 활성화
        button.removeClass('disabled');  // 비활성화 클래스 제거
    }, 5000);  // 5000ms = 5초
}

// 아이디 찾기 Ajax 요청 함수
function getId() {
    var email = $('#email').val();  // 이메일 값 가져오기
    if (email==='' || email===null) {
        $('#result').addClass('error').text("이메일 없음");
        return;
    }
    $.ajax({
        url: '/member/api/find-id',
        type: 'POST',
        data: JSON.stringify({ email: email }),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            handleResponse(response);
        },
        error: function () {
            $('#result').text('서버 오류').css('color', 'red');
        }
    });
}

// 비밀번호 재설정 요청 함수
function resetPassword() {
    var email = $('#email').val();  // 이메일 값 가져오기
    var userId = $('#userId').val();
    if (email==='' || email===null) {
        $('#result').addClass('error').text("이메일 없음");
        return;
    }else if(userId==='' || userId===null) {
        $('#result').addClass('error').text("유저 ID 없음");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/password/reset/request',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ email: email,userId:userId }),
        success: function () {
            alert('비밀번호 재설정 이메일이 전송되었습니다.');
            $('#result').addClass('success').removeClass('error').text("이메일 전송 성공");
        },
        error: function (xhr) {
            alert('이메일 전송에 실패했습니다. 다시 시도해주세요.');
            if (xhr.status === 401) {
                $('#result').addClass('error').removeClass('error').removeClass('success').text(xhr.responseText);
            }
        }
    });
}

// 서버 응답 처리 함수 (아이디 찾기 결과)
function handleResponse(response) {
    if (response.success) {
        $('#result').addClass('success').removeClass('error').text(response.message);
    } else {
        $('#result').addClass('error').removeClass('success').text(response.message);
    }
}
