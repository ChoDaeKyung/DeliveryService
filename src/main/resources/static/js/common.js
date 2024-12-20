window.addEventListener('scroll', function () {
    const menu = document.getElementById('menuList'); // 메뉴를 가져옴
    const triggerPoint = 155; // 메뉴가 스크롤로 고정될 지점(px 단위)

    if (window.scrollY >= triggerPoint) {
        menu.classList.add('fixed'); // 고정 클래스 추가
    } else {
        menu.classList.remove('fixed'); // 고정 클래스 제거
    }
});
// 페이지 로드 시 로그인 상태 확인
$(document).ready(function () {
    initLoginButton()
        .then(() => {
            console.log("로그인 버튼 초기화 완료");
        })
        .catch(error => {
            console.error("로그인 버튼 초기화 중 오류 발생:", error);
        });
});

// 로그인 버튼 상태를 초기화하는 함수
async function initLoginButton() {
    try {
        const response = await checkLoginStatus(); // 로그인 상태 확인
        console.log("로그인 상태:", response);

        const loginButton = $('#loginButton'); // 버튼 요소 선택
        if (response === true) {
            loginButton.text("로그아웃").off('click').on('click', logOut);
        } else {
            loginButton.text("로그인").off('click').on('click', function () {
                window.location.href = '/login';
            });
        }
    } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
    }
}

// 로그인 상태를 확인하는 함수 (재사용 가능)
async function checkLoginStatus() {
    try {
        const response = await $.ajax({
            url: '/member/api/check-login',
            method: 'GET',
            xhrFields: {
                withCredentials: true, // 쿠키 포함 요청
            },
        });

        return response === true; // 로그인된 상태이면 true 반환
    } catch (error) {
        // 서버에서 401 Unauthorized가 반환된 경우
        if (error.status === 401) {
            // 리프레쉬 토큰이 없거나 만료되었을 때, 로그인 버튼만 변경
            if (error.responseText === "RefreshToken not found") {
                // 리프레쉬 토큰이 없을 경우
               return false;
            } else if (error.responseText === "Invalid or expired refresh token") {
                // 리프레쉬 토큰이 만료되었을 경우 재발급
                handleTokenExpiration();
                return false;
            }
        }
        throw error; // 다른 오류는 다시 던짐
    }
}

let setupAjax = () => {
    $.ajaxSetup({
        beforeSend: (xhr) => {
            let token = localStorage.getItem("accessToken");
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        }
    });
}


let checkToken = () => {
    let token = localStorage.getItem("accessToken");
    if (token == 'undefined' || token == null || token.trim() === '') {
        localStorage.removeItem('accessToken');
        handleTokenExpiration();
    }
}
let handleTokenExpiration = () => {
    $.ajax({
        type: 'POST',
        url: '/refresh-token', // 새로운 Access Token 요청을 처리하는 엔드포인트
        contentType: 'application/json; charset=utf-8', // 전송 데이터의 타입
        dataType: 'json', // 서버에서 받을 데이터의 타입
        xhrFields: {
            withCredentials: true // 쿠키를 포함한 요청을 보냄
        },
        success: (response) => {
            console.log('res :: ', response.accessToken)
            if(response.status === 1) {
                // 새로운 Access Token을 로컬스토리지에 저장
                localStorage.setItem('accessToken', response.accessToken);
            }else{
                failed();
            }
        },
        error: (error)=>{
            failed();
        }
    });
}

let failed=() => {
    // 실패 시 기본 동작
    alert('로그인이 필요합니다. 다시 로그인해주세요.');
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
}

let getUserInfo = () => {
    return new Promise( (resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/user/info',
            success: (response) => {
                resolve(response);
            },
            error: (xhr) => {
                if (xhr.status === 401) {
                    handleTokenExpiration();
                } else {
                    reject(xhr); // 오류가 발생한 경우 Promise를 거부
                }
            }
        });
    });
}

function logOut(){
    $.ajax({
        type: 'POST',
        url: '/member/api/logout',  // Spring Security 로그아웃 URL
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

