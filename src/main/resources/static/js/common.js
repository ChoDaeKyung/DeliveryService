$(document).ready(function () {
    initLoginButton()
        .then(() => {
            console.log("로그인 버튼 초기화 완료");
        })
        .catch(error => {
            console.error("로그인 버튼 초기화 중 오류 발생:", error);
        });

    // 로그아웃 버튼 클릭 시 처리
    $(document).on('click', '#logout', function () {
        logOut();
    });

    // 사용자 아이콘 클릭 시 드롭다운 메뉴 토글
    $('.user_link').click(function (event) {
        const userLoggedInElement = $('.user_logged_in');

        // 클릭 시 active 클래스를 토글하여 드롭다운 메뉴 보이기
        userLoggedInElement.toggleClass('active');

        // 클릭 시 바깥을 클릭하면 드롭다운 메뉴 닫기
        $(document).click(function (e) {
            if (!$(e.target).closest('.user_logged_in').length) {
                userLoggedInElement.removeClass('active');
            }
        });

        event.stopPropagation(); // 클릭 이벤트 전파 방지
    });
});

// 로그인 상태를 확인하고 UI 업데이트
async function initLoginButton() {
    try {
        const isLoggedIn = await checkLoginStatus();
        console.log("로그인 상태:", isLoggedIn);

        const loggedInElement = document.querySelector('.user_logged_in');
        const notLoggedInElement = document.querySelector('.user_not_logged_in');

        // 로그인 상태에 따라 표시 여부 조정
        if (isLoggedIn) {
            loggedInElement.style.display = 'block';
            notLoggedInElement.style.display = 'none';
        } else {
            loggedInElement.style.display = 'none';
            notLoggedInElement.style.display = 'block';
        }
    } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
    }
}

// 로그인 상태를 확인하는 함수 (재사용 가능)
async function checkLoginStatus() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return false; // 토큰이 없으면 로그인 안된 상태
    }

    const isValid = await isTokenValid(token);
    if (isValid) {
        return true;
    } else {
        await handleTokenExpiration(); // 토큰 만료시 리프레시 토큰 처리
        return await checkLoginStatus(); // 토큰 갱신 후 다시 로그인 상태 확인
    }
}
// 리프레시 토큰을 처리하는 함수
let handleTokenExpiration = async () => {
    const refreshToken = localStorage.getItem("refreshToken");  // 리프레시 토큰 가져오기

    if (!refreshToken) {
        failed();  // 리프레시 토큰이 없으면 실패 처리
        return;
    }

    // 리프레시 토큰 요청
    $.ajax({
        type: 'POST',
        url: '/token/refresh-token',
        headers: {
            'Authorization': 'Bearer ' + refreshToken,  // Authorization 헤더에 리프레시 토큰 포함
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: (response) => {
            if (response.status === 1) {
                // 새로운 Access Token을 로컬스토리지에 저장
                localStorage.setItem('accessToken', response.accessToken);
            } else {
                failed();  // 토큰 갱신 실패
            }
        },
        error: () => {
            failed();  // 요청 실패 시 처리
        }
    });
}


let failed = () => {
    // 실패 시 기본 동작
    alert('로그인이 필요합니다. 다시 로그인해주세요.');
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
}

// 로그아웃 처리
function logOut() {
    // Spring Security 로그아웃 처리만 하고, 서버 로그아웃은 한번만 요청
    $.ajax({
        type: 'POST',
        url: '/member/api/logout',
        success: function() {
            console.log('Spring Security 로그아웃 성공');
            localStorage.removeItem('accessToken');
            deleteCookies();
            clearStorage();
        },
        error: function(error) {
            console.log('Spring Security 로그아웃 오류', error);
        }
    });

    // 서버 로그아웃 처리 후 리다이렉트
    serverLogout();
}

function serverLogout() {
    fetch('/member/api/server-logout', {
        method: 'POST',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        })
        .catch(error => console.error('Logout error:', error));
}

function deleteCookies() {
    document.cookie = "nid_autologin=; max-age=0; path=/; domain=.naver.com"; // 네이버 자동 로그인 쿠키
    document.cookie = "nid_session=; max-age=0; path=/; domain=.naver.com"; // 네이버 세션 쿠키 (예시)
    document.cookie = "access_token=; max-age=0; path=/";  // 액세스 토큰 쿠키 삭제
    document.cookie = "refresh_token=; max-age=0; path=/";  // 리프레시 토큰 쿠키 삭제

    // 모든 쿠키 삭제
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=; max-age=0; path=/";
    }
}

// 로컬 스토리지 및 세션 스토리지 삭제
function clearStorage() {
    localStorage.clear();   // 로컬 스토리지 삭제
    sessionStorage.clear(); // 세션 스토리지 삭제
}

function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        return null;
    }
}

// JWT 유효성 검사 함수 (비동기적으로 수정)
async function isTokenValid(token) {
    const decoded = decodeJWT(token);
    if (!decoded) {
        console.error('JWT 디코딩에 실패했습니다.');
        return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decoded.iat && currentTime <= decoded.exp;
}
