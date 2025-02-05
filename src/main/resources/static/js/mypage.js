//주문 갯수
$(document).ready(function () {
    console.log("✅ jQuery document.ready 실행됨");

    const token = localStorage.getItem("accessToken");

    if (!token || !isTokenValid(token)) {
        alert('로그인이 필요합니다.');
        location.href = "/login";
        return;
    }

    let decodeJWT1 = decodeJWT(token);
    const orderCountElement = $('.orderCount');
    const chatCountElement = $('.chatCount');
    console.log('✅ orderCountElement:', orderCountElement);
    console.log('✅ decodeJWT1:', decodeJWT1);

    $.ajax({
        url: `/orderList/orderCount?userId=${encodeURIComponent(decodeJWT1.sub)}&role=${encodeURIComponent(decodeJWT1.role)}`,// userId를 쿼리 파라미터로 직접 추가
        type: 'GET',
        success: function (orders) {
            console.log("✅ AJAX 성공:", orders);
            orderCountElement.text(orders+"개"); // HTML 요소에 주문 개수 표시
        },
        error: function (xhr, status, error) {
            console.error("🚨 AJAX 에러:", error);
            alert(`${status} 상태의 주문 목록을 가져오는 데 실패했습니다.`);
        }
    });
    $.ajax({
        url: `/orderList/chatListCount?userId=${encodeURIComponent(decodeJWT1.sub)}&role=${encodeURIComponent(decodeJWT1.role)}`, // userId를 쿼리 파라미터로 직접 추가
        type: 'GET',
        success: function (orders) {
            console.log("✅ AJAX 성공:", orders);
            chatCountElement.text(orders+"개"); // HTML 요소에 채팅 개수 표시
        },
        error: function (xhr, status, error) {
            console.error("🚨 AJAX 에러:", error);
            alert(`${status} 상태의 주문 목록을 가져오는 데 실패했습니다.`);
        }
    });
});


// JWT 디코딩 함수
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

// JWT 유효성 검사 함수
function isTokenValid(token) {
    const decoded = decodeJWT(token);
    if (!decoded) {
        console.error('JWT 디코딩에 실패했습니다.');
        return false;
    }

    const currentTime = Math.floor(Date.now() / 1000); // 현재 시각 (초 단위)
    const issuedAt = decoded.iat; // 발급 시간
    const expiration = decoded.exp; // 만료 시간

    console.log(`현재 시각: ${currentTime}, iat: ${issuedAt}, exp: ${expiration}`);
    return currentTime >= issuedAt && currentTime <= expiration;
}