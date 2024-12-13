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

let handleTokenExpiration = () => {
    $.ajax({
        type: 'POST',
        url: '/refresh-token',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 쿠키를 포함해서 요청을 보냄
        },
        success: (accessToken) => {
            console.log('response :: ', accessToken);
            localStorage.setItem('accessToken', accessToken);
        },
        error: () => {
            alert('로그인이 필요합니다. 다시 로그인해주세요.');
            localStorage.removeItem('accessToken');
            window.location.href = '/member/login';
        }
    });
}


let checkToken = () => {
    let token = localStorage.getItem("accessToken");
    if (token == null || token.trim() === '') {
        window.location.href = '/member/login';
    }
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


$(window).on('unload', function(event) {
    // 로컬 스토리지나 세션 스토리지에서 카카오 엑세스 토큰 확인
    const kakaoAccessToken = sessionStorage.getItem('kakaoAccessToken');

    // 카카오 엑세스 토큰이 있을 경우에만 로그아웃 처리
    if (kakaoAccessToken) {
        // 카카오 로그아웃

            sessionStorage.removeItem('kakaoAccessToken');

    }
});

$(document).ready(() => {

Kakao.init('306fad2bdfd3b5c98b04d336d0fa10b7');
}
);