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

    console.log('✅ decodeJWT1:', decodeJWT1);

    // ✅ 개수 가져와서 UI 업데이트
    function updateCountDisplay(url, element) {
        $.ajax({
            url: url,
            type: 'GET',
            success: function (count) {
                console.log("✅ 개수 조회 성공:", count);
                element.text(count + "개"); // ✅ 개수 표시 업데이트
            },
            error: function (xhr, status, error) {
                console.error("🚨 개수 조회 실패:", error);
                element.text("0개");
            }
        });
    }

    // ✅ 주문 & 채팅 개수 업데이트 실행 (페이지 로드 시)
    updateCountDisplay(
        `/orderList/orderCount?userId=${encodeURIComponent(decodeJWT1.sub)}&role=${encodeURIComponent(decodeJWT1.role)}`,
        orderCountElement
    );
    updateCountDisplay(
        `/orderList/chatListCount?userId=${encodeURIComponent(decodeJWT1.sub)}&role=${encodeURIComponent(decodeJWT1.role)}`,
        chatCountElement
    );

    // ✅ 클릭 시 개수 확인 후 페이지 이동
    function checkCountAndRedirect(url, countElement, alertMessage) {
        const countText = countElement.text(); // ✅ 현재 표시된 개수 가져오기
        const count = parseInt(countText); // ✅ 숫자로 변환

        if (isNaN(count) || count === 0) {
            alert(alertMessage); // 🚨 0개일 경우 알림 표시
        }

        window.location.href = url; // ✅ 개수가 있으면 이동
    }

    // ✅ 주문 목록 버튼 클릭 이벤트
    $(".membership-card button").on("click", function (e) {
        e.preventDefault();
        checkCountAndRedirect("/order", orderCountElement, "🚨 주문 내역이 없습니다!");
    });

    // ✅ 채팅 목록 버튼 클릭 이벤트
    $(".sub-card button").on("click", function (e) {
        e.preventDefault();
        checkCountAndRedirect("/chat", chatCountElement, "🚨 채팅 내역이 없습니다!");
    });
});

// ✅ JWT 디코딩 함수
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

// ✅ JWT 유효성 검사 함수
function isTokenValid(token) {
    const decoded = decodeJWT(token);
    if (!decoded) {
        console.error('JWT 디코딩에 실패했습니다.');
        return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decoded.iat && currentTime <= decoded.exp;
}
