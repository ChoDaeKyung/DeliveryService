$(document).ready(function() {
    // 아이디 중복 검사
    let isIdAvailable = false;
    let isNicknameAvailable = false;
    let isEmailVerify = false;
    let userId = "";
    let nickName =  "";
    let email = "";

    // 버튼 비활성화 및 색상 변경 함수
    function disableButtonWithDelay(button, delay) {
        button.prop("disabled", true).css('background-color', '#cccccc'); // 버튼 비활성화 및 색상 변경
        setTimeout(function() {
            button.prop("disabled", false).css('background-color', ''); // 5초 후 버튼 활성화 및 색상 원래대로
        }, delay);
    }

    $('#check-id-btn').click(function() {
        userId = $('#user-id').val().trim(); // 앞뒤 공백 제거
        if (userId.length < 7) {
            alert("아이디는 7자 이상이어야 합니다.");
            return; // 폼 제출을 막음
        }
        userId = userId.replace(/\s+/g, ''); // 띄어쓰기를 모두 제거

        // 버튼 비활성화 및 색상 변경
        disableButtonWithDelay($(this), 5000);

        $.ajax({
            type: 'POST',
            url: '/member/api/check-id',
            data: JSON.stringify({id: userId}),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response.available) {
                    $('#id-status').text('사용 가능한 아이디입니다.').css('color', 'green');
                    isIdAvailable = true;
                } else {
                    $('#id-status').text('이미 사용 중인 아이디입니다.').css('color', 'red');
                    isIdAvailable = false;
                }
            },
            error: function (error) {
                console.log('아이디 중복 검사 실패', error);
                $('#id-status').text('아이디 검사 중 오류가 발생했습니다.').css('color', 'red');
                isIdAvailable = false;
            }
        });
    });

    // 닉네임 중복 검사
    $('#check-nickname-btn').click(function() {
        nickName = $('#nick-name').val();

        if (!nickName) {
            $('#nickname-status').text('닉네임을 입력해주세요.');
            return;
        }

        // 버튼 비활성화 및 색상 변경
        disableButtonWithDelay($(this), 5000);

        $.ajax({
            type: 'POST',
            url: '/member/api/check-nickname',
            data: JSON.stringify({ nickName: nickName }),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                if (response.available) {
                    $('#nickname-status').text('사용 가능한 닉네임입니다.').css('color', 'green');
                    isNicknameAvailable = true;
                } else {
                    $('#nickname-status').text('이미 사용 중인 닉네임입니다.').css('color', 'red');
                    isNicknameAvailable = false;
                }
            },
            error: function(error) {
                console.log('닉네임 중복 검사 실패', error);
                $('#nickname-status').text('닉네임 검사 중 오류가 발생했습니다.').css('color', 'red');
                isNicknameAvailable = false;
            }
        });
    });

    // 이메일 인증 버튼 클릭 시
    $('#send-verification-btn').click(function() {
        email = $('#email').val();

        if (!email) {
            $('#email-status').text('이메일을 입력해주세요.').css('color', 'red');
            return;
        }

        // 버튼 비활성화 및 색상 변경
        disableButtonWithDelay($(this), 5000);

        $.ajax({
            type: 'POST',
            url: '/member/api/send-verification-email',
            credentials: 'include',
            data: JSON.stringify({ email: email }),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                if (response.success) {
                    $('#email-status').text(response.message).css('color', 'green');
                } else {
                    $('#email-status').text(response.message).css('color', 'red');
                }
            },
            error: function(error) {
                console.log('이메일 전송 오류', error);
                $('#email-status').text(error.message).css('color', 'red');
            }
        });
    });

    // 인증번호 확인 버튼 클릭 시
    $('#verify-button').click(function() {
        var verificationCode = $('#verification-code').val();

        if (!verificationCode) {
            alert("인증번호를 입력해주세요.");
            return;
        }

        // 버튼 비활성화 및 색상 변경
        disableButtonWithDelay($(this), 5000);

        $.ajax({
            type: 'POST',
            url: '/member/api/verify-email',
            data: JSON.stringify({ verificationCode: verificationCode }),
            credentials: 'include',
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    isEmailVerify = true;
                    $('#email-status-num').text(response.message).css('color', 'green');
                } else {
                    alert(response.message);
                    isEmailVerify = false;
                    $('#email-status-num').text(response.message).css('color', 'red');
                }

            },
            error: function(error) {
                console.log('인증번호 확인 오류', error);
            }
        });
    });

    // 회원가입 버튼 클릭 시
    $('#submit-button').click(function(event) {
        let userid = $('#user-id').val().trim();
        let nickname = $('#nick-name').val().trim();
        let emails = $('#email').val().trim();
        let password = $('#password').val().trim();
        let userName = $('#user-name').val().trim();
        let role = $('#role').val();

        // 중복 검사 통과 확인
        if (!isIdAvailable && userId === userid) {
            alert("아이디 중복 검사를 먼저 진행해주세요.");
            event.preventDefault();
            return;
        }

        if (password.length < 7) {
            alert("비밀번호는 7자 이상이어야 합니다.");
            event.preventDefault();
            return;
        }

        if (!isNicknameAvailable && nickname === nickName) {
            alert("닉네임 중복 검사를 먼저 진행해주세요.");
            event.preventDefault();
            return;
        }

        if (!isEmailVerify && emails === email) {
            alert("이메일 유효 검사를 먼저 진행해주세요.");
            event.preventDefault();
            return;
        }

        password = password.replace(/\s+/g, '');

        var formData = {
            userId: userid,
            password: password,
            userName: userName,
            nickName: nickname,
            role: role,
            email: emails
        };

        $.ajax({
            type: 'POST',
            url: '/member/api/join',
            data: JSON.stringify(formData),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                console.log('회원가입 성공', response);
                alert("회원가입 성공!");
                location.href = '/login';
            },
            error: function(error) {
                console.log('회원가입 실패', error);
                alert("회원가입 실패! 다시 시도해주세요.");
            }
        });

        event.preventDefault(); // 기본 폼 동작 막기

        $('#user-id').val(userid);
        $('#nick-name').val(nickname);
        $('#email').val(emails);
        $('#password').val(password);
        $('#user-name').val(userName);
        $('#role').val(role);
    });
});
