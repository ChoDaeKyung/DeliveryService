window.addEventListener('scroll', function () {
    const menu = document.getElementById('menuList'); // 메뉴를 가져옴
    const triggerPoint = 155; // 메뉴가 스크롤로 고정될 지점(px 단위)

    if (window.scrollY >= triggerPoint) {
        menu.classList.add('fixed'); // 고정 클래스 추가
    } else {
        menu.classList.remove('fixed'); // 고정 클래스 제거
    }
});
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
