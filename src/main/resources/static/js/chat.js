let riderUpdateInterval = null; // ❗ 중복 실행 방지용 변수
let map;
let  userMarker,deliveryMarker , polyline;
const API_BASE = "/api/location";
let timeout = 15000;
let lastLat = null;
let lastLng = null;
let userLat, userLng;
const infoDiv = document.getElementById("info");
let lastRiderLat,lastRiderLng;
let lastLatitude = null;
let lastLongitude = null;
const coordinates = [
    {minute: 1, latitude: 37.5381655, longitude: 127.1263928},
    {minute: 2, latitude: 37.537995, longitude: 127.1373118},
    {minute: 3, latitude: 37.5378245, longitude: 127.1482308},
    {minute: 4, latitude: 37.5376539, longitude: 127.1591498},
    {minute: 5, latitude: 37.5374834, longitude: 127.1700688},
    {minute: 6, latitude: 37.5373129, longitude: 127.1809879},
    {minute: 7, latitude: 37.5371424, longitude: 127.1919069},
    {minute: 8, latitude: 37.5369718, longitude: 127.2028259},
    {minute: 9, latitude: 37.5368013, longitude: 127.2137449},
    {minute: 10, latitude: 37.5366308, longitude: 127.2246639}
];


let currentIndex = 0;
$(document).ready(function () {
    displayCurrentLocationMap();
    let orderId = $(".hidden-order-id").text().trim();
    const firstOrderElement = $(`.chat-list-item[data-order-id="${orderId}"]`);

    // ✅ 페이지 로드 시 첫 번째 채팅 아이템 자동 클릭
    if (firstOrderElement.length > 0) {
        firstOrderElement.trigger('click');
    }

    const token = localStorage.getItem("accessToken");

    // ✅ JWT 토큰이 없거나 유효하지 않으면 로그인 페이지로 이동
    if (!token || !isTokenValid(token)) {
        alert('로그인이 필요합니다.');
        location.href = "/login";
        return;
    }

    const decoded = decodeJWT(token);
    let chatMessages = [];
    let lastTimestamp = -1;

    chatList();
    fetchMessages(orderId);

    // ✅ 채팅 목록 가져오기
    function chatList() {
        console.log("현재 사용자 ID:", decoded.sub);
        $.ajax({
            url: '/orderList/orderList',
            method: 'GET',
            data: { userId: decoded.sub, role: decoded.role },
            success: function (data) {
                const $chatListContainer = $("#chatListContainer");
                $chatListContainer.empty();

                data.forEach(order => {
                    let name = '';
                    if (decoded.role === 'ROLE_RIDER') {
                        name = `<p>고객명: ${order.userId}</p>`;
                    } else if (decoded.role === 'ROLE_USER') {
                        name = `<p>배달원명: ${order.riderId}</p>`;
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
                            <p>${order.status}</p>
                        </div>
                    `;
                    $chatListContainer.append(orderHtml);
                });
                // ✅ 첫 번째 채팅방 자동 선택 및 클릭 이벤트 트리거
                $(".chat-list-item").first().trigger("click");
            },
            error: function (error) {
                console.error('채팅 목록 가져오기 실패:', error);
            }
        });
    }

    // ✅ 채팅 목록 아이템 클릭 이벤트
    $(document).on("click", ".chat-list-item", function () {
        //삭제
        currentIndex = 0;
        $('#chatContainer').empty();

        lastTimestamp = -1;
        const riderId = $(this).data("rider-id");
        const userId = $(this).data("user-id");
        const status = $(this).data("status");
        const messageBody = $(this).data("items");
        orderId = $(this).data("order-id"); // 선택한 orderId 업데이트

        console.log('선택한 주문:', { orderId, userId, riderId, status });

        $("#new-message").val("");
        updateOrderDetails({ orderId, status, items: messageBody });

        fetchMessages(orderId); // 선택한 orderId에 맞는 메시지 가져오기

        if (decoded.role === 'ROLE_RIDER') {
            $(".deliver-btn").remove(); // 기존 버튼 제거 후 다시 추가
            const orderHtml = `
                <button class="deliver-btn" style="background-color: #068acb;
    border: none;
    color: #bce9ff;
    padding: 10px 20px;
    border-radius: 5px;
    margin-left: 20px;
    font-size: 14px;"
                    data-order-id="${orderId}" 
                    data-user-id="${userId}"
                    data-message-body="${messageBody}" 
                    data-status="${status}">
                    ${status}
                </button>
            `;
            $("#orderList").append(orderHtml);
        }

            //지도 업데이트

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    console.log("checkMap", "userLat", userLat, "userLng", userLng, "userId", userId);

                    if (decoded.role === "ROLE_RIDER") {

                        initializeRiderMap(userLat, userLng, userId);

                    } else if (decoded.role === "ROLE_USER") {

                        initializeUserMap(userLat, userLng, riderId);


                    }
                },
                (error) => {
                    console.error("위치 정보를 가져오는 데 실패했습니다:", error);
                }
            );


    });

    // ✅ 배달 상태 업데이트 버튼 클릭 이벤트
    $(document).on("click", ".deliver-btn", function () {
        const $button = $(this);
        const orderId = $button.data("order-id");
        const userId = $button.data("user-id");
        const messageBody = $button.data("message-body");
        const currentStatus = $button.data("status");

        if (confirm(`주문 상태를 업데이트 하시겠습니까? 현재 상태: ${currentStatus}`)) {
            takeDelivery(orderId, userId, messageBody, currentStatus);
        }
    });

    // ✅ 주문 상태 업데이트 요청
    function takeDelivery(orderId, userId, messageBody, currentStatus) {
        if (decoded.role !== 'ROLE_RIDER') {
            alert('라이더만 이 작업을 수행할 수 있습니다.');
            return;
        }

        let nextStatus = currentStatus === '배달전' ? '배달중' :
            currentStatus === '배달중' ? '배달완료' : '배달끝';

        const orderData = {
            riderId: decoded.sub,
            orderId,
            userId,
            message: messageBody,
            status: nextStatus
        };

        $.ajax({
            url: '/orderList/orderSend',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData),
            success: function () {
                console.log(`✅ 주문 상태 업데이트 완료: ${nextStatus}`);
                if(nextStatus==='배달끝'){
                sendOrderComplete(orderId, '배달끝');

                }
                chatList();
            },
            error: function () {
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        });
    }

    // ✅ 메시지 자동 갱신 (5초마다 실행)
    setInterval(() => {
        fetchMessages(orderId);
    }, 10000);

    // ✅ 메시지 가져오기
    function fetchMessages(orderId) {
        if (!orderId) return;
        $.ajax({
            url: '/api/chat/messages',
            method: 'GET',
            data: { orderId, fromTimestamp: lastTimestamp },
            success: function (data) {
                const userMessages = data.ROLE_USER || [];
                const riderMessages = data.ROLE_RIDER || [];
                const newMessages = mergeMessages(userMessages, riderMessages);
                chatMessages = [...chatMessages, ...newMessages];
                displayChatMessages(newMessages);

                if (newMessages.length > 0) {
                    lastTimestamp = Math.max(...newMessages.map(msg => msg.timestamp), lastTimestamp);
                }
            },
            error: function (error) {
                console.error('메시지 가져오기 실패:', error);
            }
        });
    }

    // ✅ 메시지 화면에 표시
    function displayChatMessages(messages) {
        const chatContainer = $('#chatContainer');
        messages.forEach(message => {
            const messageElement = $('<div class="message"></div>')
                .addClass(message.role === 'ROLE_USER' ? 'user-message' : 'rider-message')
                .text(message.message);
            chatContainer.append(messageElement);
        });
        chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
    }
    function updateOrderDetails(order) {
        const $orderDetails = $(".order-details");
        $orderDetails.empty();

        console.log("🔍 주문 상세 정보 업데이트:", order); // 디버깅 로그

        // ✅ 주문번호 및 상태 정보
        const orderId = order.orderId || '알 수 없음';
        const orderStatus = order.status || '알 수 없음';

        // ✅ items 값이 없을 경우 기본값 설정
        const items = order.items ? order.items.trim() : "";
        let name = "알 수 없음";
        let price = "0원";

        if (items.includes("message=") && items.includes("price=")) {
            const messageMatch = items.match(/message=([^,]*)/);
            const priceMatch = items.match(/price=([^,]*)/);

            name = messageMatch ? messageMatch[1].trim() : "알 수 없음";
            price = priceMatch ? priceMatch[1].trim() + "원" : "0원";
        }
        // ✅ items 문자열을 분리 및 파싱하여 HTML 생성
        // ✅ 주문 상세 정보 HTML 생성
        const itemsHtml = `
        <div class="card-content">
            <div class="order-details">
                <div>
                    <p class="restaurant-name" style="width: auto">제품명: ${name}</p>
                    <hr style="background: gold">
                </div>
                <div>
                    <p class="text-right font-bold">총 결제금액: ${price}</p>
                </div>
            </div>
        </div>
    `;

        // ✅ 주문 상세 정보 HTML 업데이트
        const orderDetailsHtml = `
        <div>
            <p class="restaurant-name" style="width: auto">주문번호: ${orderId}</p>
            <p class="text-sm text-gray-500" style="width: auto">상태: ${orderStatus}</p>
        </div>
        ${itemsHtml || '<p>주문 내역이 없습니다.</p>'}
    `;

        $orderDetails.html(orderDetailsHtml);
    }
// ✅ 배달 완료 요청을 별도 함수로 분리하여 재사용성 증가
    function sendOrderComplete(orderData) {
        console.log("🚀 배달 완료 요청 데이터:", orderData);

        $.ajax({
            url: '/orderList/orderSend',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData),
            success: function () {
                console.log('✅ 배달 완료 메시지 전송 성공');
                window.location.href = /*[[ @{/chat} ]]*/ '/chat'; // ✅ Thymeleaf 적용 가능하도록 변경
            },
            error: function () {
                alert('배달완료 오류가 발생했습니다. 다시 시도해주세요.');
            }
        });
    }

// ✅ 채팅 메시지 병합 함수 (성능 최적화)
    function mergeMessages(userMessages, riderMessages) {
        return [...userMessages.map(msg => ({ ...msg, role: 'ROLE_USER' })),
            ...riderMessages.map(msg => ({ ...msg, role: 'ROLE_RIDER' }))]
            .sort((a, b) => a.timestamp - b.timestamp); // ✅ timestamp 기준 정렬
    }

// ✅ 메시지 입력 및 전송
    $('#message-form').on('submit', function (e) {
        e.preventDefault();

        if (!orderId) {
            alert("⚠️ 채팅방을 선택하세요!");
            return;
        }

        const $messageInput = $('#new-message');
        const newMessage = $messageInput.val().trim();

        if (!newMessage) return;

        // ✅ 메시지 전송 버튼 비활성화 (중복 클릭 방지)
        const $submitButton = $('#message-form button[type="submit"]');
        $submitButton.prop('disabled', true);

        const chatRequestDTO = {
            orderId: orderId,
            userId: decoded.sub,
            role: decoded.role,
            message: newMessage
        };

        console.log("📩 메시지 전송 요청:", chatRequestDTO);

        $.ajax({
            url: '/api/chat/send',
            method: 'POST',
            data: JSON.stringify(chatRequestDTO),
            contentType: 'application/json',
            success: function () {
                console.log("✅ 메시지 전송 성공");
                $messageInput.val('');
                fetchMessages(orderId);
            },
            error: function () {
                alert('❌ 메시지 전송 실패');
            },
            complete: function () {
                // ✅ 메시지 전송 버튼 다시 활성화
                $submitButton.prop('disabled', false);
            }
        });
    });



    // ✅ JWT 유효성 검사
    function isTokenValid(token) {
        const decoded = decodeJWT(token);
        return decoded && Date.now() / 1000 < decoded.exp;
    }



    if (!navigator.geolocation) {
        alert("현재 브라우저에서 위치 정보를 지원하지 않습니다.");

    }






    /** JWT 디코딩 */
    function decodeJWT(token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("JWT 디코딩 실패:", error);
            return null;
        }
    }
});



// ✅ 현재 위치 가져오기
function getUserLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;
                console.log("📍 현재 위치:", userLat, userLng);
                if (callback) callback();
            },
            (error) => {
                console.error("❌ 위치 정보를 가져오는 데 실패했습니다:", error);
                alert("🚨 현재 위치를 가져올 수 없습니다.");
            }
        );
    } else {
        alert("🚨 현재 브라우저에서 위치 정보를 지원하지 않습니다.");
    }
}

// ✅ 지도 초기화
function initializeMap(lat, lng) {
    console.log("🚀 지도 초기화:", lat, lng);
    const mapContainer = document.getElementById("map");
    map = new kakao.maps.Map(mapContainer, {
        center: new kakao.maps.LatLng(lat, lng),
        level: 4,
    });
}

// ✅ 배달원 지도 초기화
function initializeRiderMap(riderLat, riderLng, userId) {
    console.log("🚀 배달원 지도 초기화:", riderLat, riderLng, userId);
    if (!riderLat || !riderLng) {
        console.error("🚨 오류: 배달원 좌표가 유효하지 않음");
        return;
    }

    clearPreviousData();

    // deliveryMarker = new kakao.maps.Marker({
    //     position: new kakao.maps.LatLng(riderLat, riderLng),
    //     map: map,
    //     title: "배달원 위치",
    // });

    //addMarkerClickEvent(deliveryMarker, riderLat, riderLng, "배달원 위치");
    //saveDeliveryLocation(riderLat, riderLng);
    //fetchDistanceAndTime(userLat, userLng, riderLat, riderLng);

    lastRiderLat = riderLat;
    lastRiderLng = riderLng;


    //삭제
    function updateDeliveryLocation() {
        if (currentIndex >= coordinates.length) {
            console.log("🚀 모든 위치 업데이트 완료. Interval 종료.");
            clearInterval(riderUpdateInterval);
            return;
        }

        const { latitude, longitude } = coordinates[currentIndex];

        // 이전 위치와 비교하여 너무 짧은 이동이면 갱신 생략
        if (lastLatitude !== null && lastLongitude !== null) {
            const distance = calculateDistance(lastLatitude, lastLongitude, latitude, longitude);
            if (distance < 0.05) {  // 50m 이하이면 업데이트 생략
                console.warn(`🚨 이동 거리 (${distance.toFixed(3)} km) 가 너무 짧아 갱신 생략`);
                return;
            }
        }
        function updateRiderMarker(latitude, longitude) {
            if (!map) {
                console.warn("🚨 지도 객체가 존재하지 않음!");
                return;
            }

            // 기존 배달원 마커 제거 후 새 마커 생성
            if (deliveryMarker) deliveryMarker.setMap(null);

            deliveryMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(latitude, longitude),
                map: map,
                title: "배달원 위치"
            });

            console.log("🗺️ 지도에서 배달원 위치 갱신 완료:", latitude, longitude);
        }
        /**
         * 두 지점 간 거리 계산 (Haversine 공식 적용)
         */
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // 지구 반지름 (km)
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // 거리 (km)
        }
        console.log(`📍 ${currentIndex + 1}분차 배달원 위치 업데이트:`, latitude, longitude);

        fetch(`${API_BASE}/update-location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deliveryPersonId: "RIDER_ID",
                latitude,
                longitude
            }),
        }).then(() => {
            console.log("✅ 배달원 위치 저장 완료:", latitude, longitude);
            updateRiderMarker(latitude, longitude);
            fetchDistanceAndTime(userLat, userLng, latitude, longitude);
        }).catch(error => console.error("❌ 배달원 위치 저장 실패:", error));

        lastLatitude = latitude;
        lastLongitude = longitude;
        currentIndex++;
    }



// ✅ 1분마다 배달원 위치 업데이트 실행
    if (riderUpdateInterval) clearInterval(riderUpdateInterval);
    riderUpdateInterval = setInterval(updateDeliveryLocation, timeout);

// ✅ 초기 실행 (1분 기다리지 않고 첫 번째 위치 즉시 업데이트)
    updateDeliveryLocation();

    //위까지 삭제
    //
    // if (riderUpdateInterval) clearInterval(riderUpdateInterval);
    // riderUpdateInterval = setInterval(() => {
    //     console.log("⏳ 배달원 위치 갱신 실행 중...");
    //     getUserLocation(() => {
    //         if (lastRiderLat !== userLat || lastRiderLng !== userLng) {
    //             saveDeliveryLocation(userLat, userLng);
    //             lastRiderLat = userLat;
    //             lastRiderLng = userLng;
    //         }
    //         fetchDeliveryLocation(userLat, userLng, userId);
    //         fetchDistanceAndTime(userLat, userLng, riderLat, riderLng);
    //     });
    // }, timeout);
}

// ✅ 기존 마커 및 경로 제거
function clearPreviousData() {
    if (deliveryMarker) deliveryMarker.setMap(null);
    if (polyline) polyline.setMap(null);
}
//
// function updateDeliveryLocation() {
//     if (currentIndex >= coordinates.length) {
//         console.log("🚀 모든 위치 업데이트 완료. Interval 종료.");
//         clearInterval(riderUpdateInterval);  // 모든 위치가 업데이트되면 종료
//         return;
//     }
//
//     const { latitude, longitude } = coordinates[currentIndex];
//     console.log(`📍 ${currentIndex + 1}분차 배달원 위치 업데이트:`, latitude, longitude);
//
//     fetch(`${API_BASE}/update-location`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             deliveryPersonId: "RIDER_ID",
//             latitude,
//             longitude
//         }),
//     }).then(() => {
//         console.log("✅ 배달원 위치 저장 완료:", latitude, longitude);
//         fetchDeliveryLocation(latitude, longitude, "RIDER_ID");  // 배달원 위치 갱신
//     }).catch(error => console.error("❌ 배달원 위치 저장 실패:", error));
//
//     currentIndex++;  // 다음 좌표로 이동
// }
// ✅ 배달원 위치 가져오기
function fetchDeliveryLocation(userLat, userLng, riderId) {
    console.log("📡 배달원 위치 요청:", riderId);
    fetch(`${API_BASE}/get-delivery-location?deliveryPersonId=${riderId}`)
        .then((response) => {
            if (!response.ok) throw new Error(`🚨 서버 응답 오류: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            const { latitude, longitude } = data;
            if (!latitude || !longitude) {
                console.error("❌ 배달원 위치 데이터 없음");
                return;
            }

            console.log("📍 배달원 위치 업데이트:", latitude, longitude);

            // ✅ 기존 배달원 마커 제거 후 새로 추가
            if (deliveryMarker) {
                deliveryMarker.setMap(null);
            }
            deliveryMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(latitude, longitude),
                map: map,
                title: "배달원 위치",
            });

            addMarkerClickEvent(deliveryMarker, latitude, longitude, "배달원 위치");

            // ✅ 거리 및 예상 시간 계산
            fetchDistanceAndTime(userLat, userLng, latitude, longitude);
        })
        .catch((error) => console.error("❌ 배달원 위치 가져오기 실패:", error));
}


// ✅ 배달원 위치 저장
function saveDeliveryLocation(latitude, longitude) {
    if (latitude === lastLat && longitude === lastLng) {
        console.log("📍 위치 변경 없음, 업데이트 생략");
        return;
    }
    lastLat = latitude;
    lastLng = longitude;
    console.log("💾 배달원 위치 저장:", latitude, longitude);

    fetch(`${API_BASE}/update-location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryPersonId: "RIDER_ID", latitude, longitude }),
    }).catch((error) => console.error("❌ 배달원 위치 저장 실패:", error));
}

// ✅ 거리 및 예상 시간 계산
function fetchDistanceAndTime(userLat, userLng, deliveryLat, deliveryLng) {
    console.log("📏 거리 계산 요청:", userLat, userLng, deliveryLat, deliveryLng);
    if (!deliveryLat || !deliveryLng) {
        console.error("🚨 오류: 배달원 위치 없음");
        return;
    }

    fetch(`${API_BASE}/get-distance-and-time?userLat=${userLat}&userLng=${userLng}&deliveryLat=${deliveryLat}&deliveryLng=${deliveryLng}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("📩 API 응답 데이터:", data);
            let distance = (data.distance / 1000).toFixed(2);
            let duration = Math.ceil(data.duration / 60);

            if (distance < 0.01) distance = "0.01";
            if (duration < 1) duration = "1";

            infoDiv.innerHTML = `
                <strong>🚀 배달원과의 거리:</strong> ${distance} km<br>
                <strong>⏳ 예상 도착 시간:</strong> ${duration} 분
            `;

            drawPolyline(userLat, userLng, deliveryLat, deliveryLng);
        })
        .catch((error) => console.error("❌ 거리 계산 실패:", error));
}

// ✅ 지도에 경로 표시
function drawPolyline(userLat, userLng, deliveryLat, deliveryLng) {
    if (polyline) {
        polyline.setMap(null);
    }

    console.log("🚀 경로 요청:", userLat, userLng, deliveryLat, deliveryLng);

    // 🚨 경로가 너무 짧은 경우 예외 처리
    const distanceThreshold = 10;
    const distX = Math.abs(userLng - deliveryLng) * 100000;
    const distY = Math.abs(userLat - deliveryLat) * 100000;
    const approxDistance = Math.sqrt(distX * distX + distY * distY);

    if (approxDistance < distanceThreshold) {
        console.warn("🚨 출발지와 목적지가 너무 가까워 경로를 표시하지 않습니다.");
        return;
    }
    async function getKakaoApiKey() {
        const response = await fetch('/getKakaoApiKey');
        return await response.text();  // API 키를 반환
    }

    // ✅ 카카오 길찾기 API 요청
    getKakaoApiKey().then(apiKey => {
        const directionsUrl = `https://apis-navi.kakaomobility.com/v1/directions?origin=${userLng},${userLat}&destination=${deliveryLng},${deliveryLat}&priority=RECOMMEND`;

        fetch(directionsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `KakaoAK ${apiKey}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("📩 API 응답 데이터:", data);

                if (!data.routes || data.routes.length === 0) {
                    console.error("🚨 경로 데이터 없음");
                    return;
                }

                const route = data.routes[0];
                if (!route.sections || route.sections.length === 0) {
                    console.error("🚨 경로 데이터 없음 (sections 없음)");
                    return;
                }

                const path = [];
                route.sections[0].roads.forEach(road => {
                    for (let i = 0; i < road.vertexes.length; i += 2) {
                        const lat = road.vertexes[i + 1];
                        const lng = road.vertexes[i];
                        path.push(new kakao.maps.LatLng(lat, lng));
                    }
                });

                if (path.length === 0) {
                    console.error("🚨 경로 데이터 없음 (vertexes 없음)");
                    return;
                }

                polyline = new kakao.maps.Polyline({
                    path: path,
                    strokeWeight: 5,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.7,
                    strokeStyle: "solid",
                });

                polyline.setMap(map);
            })
            .catch(error => console.error("❌ 경로 요청 실패:", error));
    }).catch(error => console.error("❌ 카카오 API 키 가져오기 실패:", error));
}

function getAddressFromCoords(lat, lng, callback) {
    const geocoder = new kakao.maps.services.Geocoder();
    const coord = new kakao.maps.LatLng(lat, lng);

    geocoder.coord2Address(lng, lat, function (result, status) {
        console.log("📡 주소 변환 요청 결과:", result, "상태:", status);

        if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const address = result[0]?.address?.address_name || "주소 정보를 가져올 수 없습니다.";
            console.log("📍 변환된 주소:", address);
            callback(address);
        } else {
            console.error("❌ 주소 변환 실패 또는 결과 없음");
            callback("주소 정보를 가져올 수 없습니다.");
        }
    });
}

// ✅ 마커 클릭 시 정보 표시
function addMarkerClickEvent(marker, lat, lng, title) {
    const infoWindow = new kakao.maps.InfoWindow({ removable: true });

    kakao.maps.event.addListener(marker, "click", function () {
        console.log(`📍 ${title} 마커 클릭됨: 위도 ${lat}, 경도 ${lng}`);

        getAddressFromCoords(lat, lng, (address) => {
            console.log("🏡 변환된 주소:", address);

            if (!address || address.trim() === "") {
                address = "주소 정보를 가져올 수 없습니다.";
            }

            const content = `
                <div style="padding:10px;">
                    <strong>${title}</strong><br>
                    위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}<br>
                    주소: ${address}
                </div>
            `;

            console.log("📝 정보창 내용:", content);

            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });
    });
}

// ✅ 고객 지도 초기화
function initializeUserMap(userLat, userLng, riderId) {
    console.log('🚀 고객 지도 초기화 - userLat:', userLat, 'userLng:', userLng, 'riderId:', riderId);

    // ✅ 지도 객체가 없으면 생성
    if (!map) {
        console.warn("🚨 map 객체가 없어서 새로 생성합니다.");
        const mapContainer = document.getElementById("map");
        map = new kakao.maps.Map(mapContainer, {
            center: new kakao.maps.LatLng(userLat, userLng),
            level: 4,
        });
    }

    // ✅ 기존 고객 마커 제거 후 새로 추가
    if (userMarker) {
        userMarker.setMap(null);
    }
    userMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(userLat, userLng),
        map: map,
        title: "고객 위치",
    });

    // ✅ 고객 마커 클릭 이벤트 추가
    addMarkerClickEvent(userMarker, userLat, userLng, "고객 위치");

    // ✅ 1분마다 배달원 위치 가져오기
    if (riderUpdateInterval) clearInterval(riderUpdateInterval);
    riderUpdateInterval = setInterval(() => {
        console.log("⏳ 배달원 위치 갱신 중...");
        fetchDeliveryLocation(userLat, userLng, riderId);
    }, timeout);

    // ✅ 배달원 위치 가져오기
    fetchDeliveryLocation(userLat, userLng, riderId);
}

// ✅ 현재 위치를 지도에 표시
function displayCurrentLocationMap() {
    console.log("🚀 현재 위치 지도 표시 함수 호출");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;

                console.log("📍 현재 위치:", userLat, userLng);

                // ✅ 지도가 없으면 새로 생성
                if (!map) {
                    console.warn("🚨 map 객체가 초기화되지 않아 새로 생성합니다.");
                    map = new kakao.maps.Map(document.getElementById("map"), {
                        center: new kakao.maps.LatLng(userLat, userLng),
                        level: 4,
                    });
                } else {
                    // ✅ 기존 지도 객체가 있으면 중심 좌표 업데이트
                    map.setCenter(new kakao.maps.LatLng(userLat, userLng));
                }

                // ✅ 기존 마커 삭제
                if (userMarker) userMarker.setMap(null);

                // ✅ 새로운 마커 생성 및 지도에 추가
                userMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(userLat, userLng),
                    map: map,
                    title: "내 위치",
                });

                // ✅ 지도 컨트롤 추가 (확대/축소)
                const zoomControl = new kakao.maps.ZoomControl();
                map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

                // ✅ 사용자 위치 정보 표시
                const infoDiv = document.getElementById("info");
                if (infoDiv) {
                    infoDiv.innerHTML = `
                        <strong>📍 내 위치:</strong> 위도 ${userLat.toFixed(6)}, 경도 ${userLng.toFixed(6)}
                    `;
                }
            },
            (error) => {
                console.error("❌ 위치 정보를 가져오는 데 실패했습니다:", error);
                alert("🚨 현재 위치를 가져올 수 없습니다.");
            }
        );
    } else {
        alert("🚨 현재 브라우저에서 위치 정보를 지원하지 않습니다.");
    }
}
