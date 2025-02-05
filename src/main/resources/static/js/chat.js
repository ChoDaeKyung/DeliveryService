$(document).ready(function () {
    let orderId = $(".hidden-order-id").text().trim();
    const firstOrderElement = $(`.chat-list-item[data-order-id="${orderId}"]`);

    if (firstOrderElement.length > 0) {
        // 첫 번째 아이템을 자동으로 클릭한 것처럼 trigger
        firstOrderElement.trigger('click');
    }
    const token = localStorage.getItem("accessToken");

    if (!token) {
        alert('로그인이 필요합니다.');
        location.href = "/login";
        return;
    }
    if (!isTokenValid(token)) {
        alert('로그인이 필요합니다.');
        location.href = "/login";
        return;
    }

    const decoded = decodeJWT(token);
    let chatMessages = [];
    let lastTimestamp = -1;

    chatList();
    fetchMessages(orderId);

    function chatList() {
        console.log(decoded.sub)
        $.ajax({
            url: '/orderList/orderList',
            method: 'GET',
            data: { userId: decoded.sub, role: decoded.role },
            success: function (data) {
                const $chatListContainer = $("#chatListContainer");
                $chatListContainer.empty();

                data.forEach(order => {
                    // 고객명 또는 배달원명을 조건에 따라 결정
                    let name = '';
                    if (decoded.role === 'ROLE_RIDER') {
                        name = `
            <p>고객명: ${order.userId}</p>
            <p style="display: none;">배달원 ID: ${order.riderId}</p>
        `;
                    } else if(decoded.role === 'ROLE_USER'){
                        name = `
            <p style="display: none;">고객명: ${order.userId}</p>
            <p>배달원명: ${order.riderId}</p>
        `;
                    }

                    const orderHtml = `
    <div class="chat-list-item ${order.orderId === orderId ? 'current-order' : ''}" 
        data-order-id="${order.orderId}"
        data-user-id="${order.userId}"
        data-rider-id="${order.riderId}"
        data-status="${order.status}" 
        data-items="${order.messageBody || ''}">
        <h3>주문 번호: ${order.orderId}</h3>
        ${name}
        <p hidden>메시지: ${order.messageBody}</p>
        <p style="display: none">${order.riderId}</p>
        <p>${order.status}</p>
    </div>
`;
                    $chatListContainer.append(orderHtml);
                });
            },
            error: function (error) {
                console.error('채팅 목록 없음:', error);
            }
        });
    }

    $(document).on("click", ".chat-list-item", function () {
        const riderId = $(this).data("rider-id");
        const userId = $(this).data("user-id");
        console.log('userId',userId)
        console.log('riderId',riderId)
        $("#new-message").val("");
        updateOrderDetails({
            orderNumber: $(this).data('order-id'),
            status: $(this).data('status'),
            items: $(this).data('items'),
        });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;



                console.log('checkMap','userLat',userLat,'userLng',userLng,'userId',userId);
                if (decoded.role === "ROLE_RIDER") {
                    window.initializeRiderMap( userLat, userLng, userId);
                } else if (decoded.role === "ROLE_USER") {
                    window.initializeUserMap( userLat, userLng, riderId);
                }
            },
            (error) => {
                console.error("위치 정보를 가져오는 데 실패했습니다:", error);
            }
        );
    });


    function updateOrderDetails(order) {
        const $orderDetails = $(".order-details");
        $orderDetails.empty();
        // 디버깅: 전달된 order 객체 확인

        // order.items가 없는 경우 기본값 설정
        const items = order.items || ""; // items가 없을 경우 빈 문자열로 처리

        // items 문자열을 분리 및 파싱
        const itemsHtml = items.split('message=').filter(Boolean).map(item => {
            const parts = item.split(','); // ','로 분리
            const name = parts[0]?.trim(); // 첫 번째 부분은 제품명
            const price = parts[1]?.split('=')[1]?.trim() || '0'; // 두 번째 부분에서 가격 추출

            return `
            <div class="order-item">
                <p>제품명: ${name || '알 수 없음'}</p>
                <p class="text-right font-bold">가격: ${price}원</p>
            </div>
        `;
        }).join('');

        // 주문 상세 정보 HTML 업데이트
        const orderDetailsHtml = `
        <div>
            <p class="restaurant-name">주문번호: ${order.orderNumber || '알 수 없음'}</p>
            <p class="text-sm text-gray-500">상태: ${order.status || '알 수 없음'}</p>
        </div>
        ${itemsHtml || '<p>주문 내역이 없습니다.</p>'}
    `;

        $orderDetails.html(orderDetailsHtml);
    }

    setInterval(function () {
        fetchMessages(orderId);
    }, 5000);

    function displayChatMessages(messages) {
        const chatContainer = $('#chatContainer');
        messages.forEach(message => {
            let messageElement = $('<div class="message"></div>');
            if (message.role === 'ROLE_USER') {
                messageElement.addClass('user-message');
                messageElement.text(message.message);
            } else {
                messageElement.addClass('rider-message');
                messageElement.text(message.message);
            }
            chatContainer.append(messageElement);
        });
        chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
    }

    function fetchMessages(orderId) {
        if (!orderId) return;

        $.ajax({
            url: '/api/chat/messages',
            method: 'GET',
            data: { orderId: orderId, fromTimestamp: lastTimestamp },
            success: function (data) {
                const userMessages = data.ROLE_USER || [];
                const riderMessages = data.ROLE_RIDER || [];
                const newMessages = mergeMessages(userMessages, riderMessages);
                chatMessages = [...chatMessages, ...newMessages];
                displayChatMessages(newMessages);
                if (newMessages.length > 0) {
                    lastTimestamp = newMessages[newMessages.length - 1].timestamp;
                }
            },
            error: function (error) {
                console.error('메시지 가져오기 실패:', error);
            }
        });
    }

    function mergeMessages(userMessages, riderMessages) {
        let mergedMessages = [];
        let i = 0, j = 0;
        while (i < userMessages.length || j < riderMessages.length) {
            if (i < userMessages.length && (j >= riderMessages.length || userMessages[i].timestamp <= riderMessages[j].timestamp)) {
                mergedMessages.push({ ...userMessages[i], role: 'ROLE_USER' });
                i++;
            } else if (j < riderMessages.length) {
                mergedMessages.push({ ...riderMessages[j], role: 'ROLE_RIDER' });
                j++;
            }
        }
        return mergedMessages;
    }

    $('#message-form').on('submit', function (e) {
        e.preventDefault();
        if (!orderId) {
            alert("채팅방을 선택하세요!");
            return;
        }

        const newMessage = $('#new-message').val().trim();
        if (!newMessage) return;

        const chatRequestDTO = { orderId: orderId, userId: decoded.sub, role: decoded.role, message: newMessage };
        $.ajax({
            url: '/api/chat/send',
            method: 'POST',
            data: JSON.stringify(chatRequestDTO),
            contentType: 'application/json',
            success: function () {
                $('#new-message').val('');
                fetchMessages(orderId);
            },
            error: function () {
                alert('메시지 전송 실패');
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

        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime >= decoded.iat && currentTime <= decoded.exp;
    }
});
