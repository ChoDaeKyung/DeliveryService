$(document).ready(function() {
    // 아이디 중복 검사
    let isIdAvailable = false;
    let isNicknameAvailable = false;
    let isEmailVerify = false;
    let userId = "";
    let nickName =  "";
    let email = "";

    $('#check-id-btn').click(function() {
        userId = $('#user-id').val().trim(); // 앞뒤 공백 제거
        if (userId.length < 7) {
            alert("아이디는 7자 이상이어야 합니다.");
            return; // 폼 제출을 막음
        }
        userId = userId.replace(/\s+/g, ''); // 띄어쓰기를 모두 제거


        $.ajax({
            type: 'POST',
            url: '/member/api/check-id',  // 서버에서 처리하는 URL을 일치시켜야 함
            data: JSON.stringify({id: userId}),  // userId를 서버로 보냄
            contentType: 'application/json; charset=utf-8',  // JSON 형식으로 데이터 전송
            success: function (response) {
                // 서버에서 반환한 isAvailable 값을 확인
                if (response.available) {
                    $('#id-status').text('사용 가능한 아이디입니다.').css('color', 'green');
                    isIdAvailable = true;
                } else {
                    $('#id-status').text('이미 사용 중인 아이디입니다.').css('color', 'red');
                    isIdAvailable = false;
                }
            },
            error: function (error) {
                // 서버 오류 처리
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
    $('#send-verification-btn').click(function() {
        email = $('#email').val();

        if (!email) {
            $('#email-status').text('이메일을 입력해주세요.').css('color', 'red');
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/member/api/send-verification-email',
            headers: {
                'JSESSIONID': getSessionIdFromCookie()  // 쿠키에서 현재 세션 ID 가져오기
            },// 이메일 인증 번호 전송 API
            data: JSON.stringify({ email: email }),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                if (response.success) {
                    $('#email-status').text('인증번호가 이메일로 전송되었습니다.').css('color', 'green');
                } else {
                    $('#email-status').text('이메일 전송 실패. 다시 시도해 주세요.').css('color', 'red');
                }
            },
            error: function(error) {
                console.log('이메일 전송 오류', error);
                $('#email-status').text('이메일 전송 중 오류가 발생했습니다.').css('color', 'red');
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

        // 인증번호 확인 후 회원가입 버튼 활성화
        $.ajax({
            type: 'POST',
            url: '/member/api/verify-email',  // 이메일 인증번호 확인 API
            data: JSON.stringify({ verificationCode: verificationCode }),
            credentials: 'include',
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                if (response.valid) {
                    // 인증번호가 유효하면 회원가입 버튼 활성화
                    alert("인증번호가 유효합니다. 이제 회원가입을 진행할 수 있습니다.");
                    isEmailVerify=true;
                } else {
                    alert("유효하지 않은 인증번호입니다.");
                    isEmailVerify=false;
                }
            },
            error: function(error) {
                console.log('인증번호 확인 오류', error);
            }
        });
    });

    // 회원가입 버튼 클릭 시
    $('#submit-button').click(function(event) {
        let userid = $('#user-id').val().trim(); // 앞뒤 공백 제거
        let nickname = $('#nick-name').val().trim();
        let emails = $('#email').val().trim();
        // 중복 검사 통과했는지 확인
        if (!isIdAvailable&& userId===userid) {
            alert("아이디 중복 검사를 먼저 진행해주세요.");
            event.preventDefault(); // 폼 제출 막기
            return;
        }

        if (!isNicknameAvailable&&nickname===nickName) {
            alert("닉네임 중복 검사를 먼저 진행해주세요.");
            event.preventDefault(); // 폼 제출 막기
            return;
        }
        if (!isEmailVerify&&emails===email) {
            alert("이메일 유효 검사를 먼저 진행해주세요.");
            event.preventDefault(); // 폼 제출 막기
            return;
        }
        var password = $('#password').val().trim(); // 앞뒤 공백 제거
        var userName = $('#user-name').val().trim(); // 앞뒤 공백 제거
// 조건 체크

        if (password.length < 7) {
            alert("비밀번호는 7자 이상이어야 합니다.");
            return; // 폼 제출을 막음
        }
        password = password.replace(/\s+/g, '');
        // 중복 검사를 모두 통과한 경우 폼 제출
        var formData = {
            userId: userId,
            password: password,
            userName:userName,
            nickName:nickName,
            role: $('#role').val()
        };

        $.ajax({
            type: 'POST',
            url: '/member/api/join',
            data: JSON.stringify(formData),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                console.log('회원가입 성공', response);
                // 성공적인 회원가입 후 필요한 처리 (예: 리다이렉트)
                alert("회원가입 성공!")
                location.href = '/login';
            },
            error: function(error) {
                console.log('회원가입 실패', error);
            }
        });

        event.preventDefault(); // 폼 기본 동작 막기
    });
});
