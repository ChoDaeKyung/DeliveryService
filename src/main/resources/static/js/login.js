$(document).ready(function () {
    $('.login-button').click(function () {
        const userId = $('#user-id').val();  // 입력된 ID 값
        const userPassword = $('#user-password').val();  // 입력된 비밀번호 값

        // ID와 비밀번호가 모두 입력되었는지 확인
        if (!userId || !userPassword) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        // 로그인 요청
        $.ajax({
            type: 'POST',
            url: `/member/api/login`,  // 로그인 요청 URL
            data: JSON.stringify({
                userId: userId,
                password: userPassword
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                // 로그인 성공 시
                if (response.accessToken) {
                    // 서버에서 받은 accessToken을 로컬 스토리지에 저장
                    localStorage.setItem('accessToken', response.accessToken);
                    alert('로그인 성공!')
                    // 로그인 후 원하는 페이지로 리디렉션 (예: 메인 페이지)
                    window.location.href = "/menu";  // 로그인 후 이동할 페이지
                } else {
                    alert('로그인 실패: 잘못된 아이디 또는 비밀번호입니다!');
                }
            },
            error: function (error) {
                // 로그인 실패 시
                console.log('로그인 오류', error);
                alert('로그인 요청에 실패했습니다. 다시 시도해 주세요.');
            }
        });
    });

    const LOGIN_SERVICE_URL =  document.body.dataset.loginServiceUrl;


    // Redirect to OAuth2 Login for Google, Kakao, Naver
    $('.web-neutral').click(function () {
        window.location.href = `${LOGIN_SERVICE_URL}/oauth2/authorization/google`;
    });


    // 카카오 로그인 클릭 시 세션 종료 후 로그인 페이지로 리디렉션
    $('.kakao-login').click(function () {
        document.cookie = "KAUTHID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        // clearKakaoSession();  // 카카오 세션 삭제
        window.location.replace(`${LOGIN_SERVICE_URL}/oauth2/authorization/kakao`);
    });

    // 네이버 로그인 클릭
    $('.naver').click(function () {
        deleteNaverCookies();
        window.location.href = `${LOGIN_SERVICE_URL}/oauth2/authorization/naver`;
    });
    function deleteNaverCookies() {
        document.cookie = "nid_autologin=; max-age=0; path=/; domain=.naver.com";
        document.cookie = "nid_session=; max-age=0; path=/; domain=.naver.com";
        document.cookie = "nid_ban=; max-age=0; path=/; domain=.naver.com";  // 예시로 추가
    }
    // 로그인 후 accessToken을 localStorage에 저장
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');

    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    // 로그아웃 버튼 클릭
    $('#logout-button').click(function () {
        logOut();
    });
});