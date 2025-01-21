$(document).ready(function () {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert('로그인이 필요합니다.');
        location.href = "/login";
        return;
    }
    if (!isTokenValid(token)) {
        alert('로그인이 필요합니다.');
        location.href = "/login";
    }

    const decoded = decodeJWT(token);

    // 초기 로딩 시 모든 상태별 주문 데이터를 불러옴
    loadOrders("배달전", "before");
    loadOrders("배달중", "inProgress");
    loadOrders("배달완료", "completed");

    // 주문 목록을 가져오는 함수
    function loadOrders(status, tabId) {
        const requestData = {
            role: decoded.role,
            userId: decoded.sub,
            status: status
        };
        console.log(requestData);

        $.ajax({
            url: '/orderList/receiveStatus',
            type: 'GET',
            data: requestData,
            success: function (orders) {
                const $orderList = $(`#orderList-${tabId}`);
                $orderList.empty();
                orders.forEach(function (order) {
                    console.log("Order Data:", order);

                    const riderId = order.riderId ? order.riderId.replace(/"/g, '&quot;') : '';
                    const userId = order.userId ? order.userId.replace(/"/g, '&quot;') : '';

                    const isAuthorized = riderId === decoded.sub || userId === decoded.sub; // 권한 확인

                    const orderHtml = `
                <div id="order-${order.orderId}" class="order-card">
                    <h4>주문 번호: ${order.orderId}</h4>
                    <p>고객명: ${order.userId}</p>
                    <p>메시지: ${order.messageBody}</p>
                    <p style="display: none">${riderId}</p>
                    <button class="deliver-btn" 
                        data-order-id="${order.orderId}" 
                        data-user-id="${userId}"
                        data-message-body="${order.messageBody}" 
                        data-status="${status}">
                        ${status === '배달전' ? '배달 시작' : status === '배달중' ? '배달 완료' : '삭제'}
                    </button>
                    ${isAuthorized ? `
                    <button class="chat-btn" 
                        data-order-id="${order.orderId}">
                        채팅 이동
                    </button>` : ''}
                </div>
            `;
                    $orderList.append(orderHtml);
                });
            },
            error: function () {
                alert(`${status} 상태의 주문 목록을 가져오는 데 실패했습니다.`);
            }
        });
    }
    window.switchTab = function (tabId) {
        $(".tab-button").removeClass("active");
        $(".tab-content").removeClass("active");
        $(`.tab-button[onclick="switchTab('${tabId}')"]`).addClass("active");
        $(`#${tabId}`).addClass("active");
    };
    // 채팅 버튼 클릭 이벤트
    $(document).on("click", ".chat-btn", function () {
        const orderId = $(this).data("orderId");
        window.location.href = `/chat?orderId=${orderId}`;
    });
    // 버튼 클릭 이벤트 핸들러 설정
    $(document).on("click", ".deliver-btn", function () {
        const $button = $(this);
        const orderId = $button.data("orderId"); // 'data-order-id'는 'dataOrderId'로 변환
        const userId = $button.attr("data-user-id");
        const messageBody = $button.data("messageBody");
        const currentStatus = $button.data("status");

        console.log("Button Data:", { orderId, userId, messageBody, currentStatus }); // 버튼 데이터 확인

        if (confirm(`주문 상태를 업데이트 하시겠습니까? 현재 상태: ${currentStatus}`)) {
            takeDelivery(orderId, userId, messageBody, currentStatus);
        } else {
            console.log('상태 업데이트가 취소되었습니다.');
        }
    });


    // 주문 상태를 업데이트하는 함수
    function takeDelivery(orderId, userId, messageBody, currentStatus) {
        if (!decoded || decoded.role !== 'ROLE_RIDER') {
            alert('라이더만 이 작업을 수행할 수 있습니다.');
            return;
        }

        let nextStatus = '';
        if (currentStatus === '배달전') {
            nextStatus = '배달중';
        } else if (currentStatus === '배달중') {
            nextStatus = '배달완료';
        } else {
            nextStatus = '배달끝';
        }

        const orderData = {
            riderId: decoded.sub,
            orderId: orderId,
            userId: userId,
            message: messageBody,
            status: nextStatus
        };

        $.ajax({
            url: '/orderList/orderSend',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData),
            success: function () {
                const $orderCard = $(`#order-${orderId}`);

                // 현재 상태에서 카드 제거
                $orderCard.fadeOut(300, function () {
                    $(this).remove();

                    if (nextStatus !== '배달끝') {
                        // 새로운 상태에 카드 추가
                        const newTabId = getTabIdByStatus(nextStatus);
                        const $newTabList = $(`#orderList-${newTabId}`);

                        const newCardHtml = `
                        <div id="order-${orderId}" class="order-card">
                            <h4>주문 번호: ${orderId}</h4>
                            <p>고객명: ${userId}</p>
                            <p>메시지: ${messageBody}</p>
                            <button class="deliver-btn" 
                                data-order-id="${orderId}" 
                                data-user-id="${userId}"
                                data-message-body="${messageBody}" 
                                data-status="${nextStatus}">
                                ${nextStatus === '배달중' ? '배달 완료' : '삭제'}
                            </button>
                            <button class="chat-btn" data-order-id="${orderId}">채팅 이동</button>
                        </div>
                    `;
                        $newTabList.append(newCardHtml);
                    }
                });

                if (nextStatus === "배달끝") {
                    alert("주문 삭제 완료!");
                    return;
                }
                alert(`주문 상태가 '${nextStatus}'으로 업데이트되었습니다.`);
            },
            error: function () {
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        });
    }
// 상태에 따른 탭 ID를 반환하는 함수
    function getTabIdByStatus(status) {
        switch (status) {
            case '배달전':
                return 'before';
            case '배달중':
                return 'inProgress';
            case '배달완료':
                return 'completed';
            default:
                return '';
        }
    }

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
});
