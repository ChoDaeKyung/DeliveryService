// let riderUpdateInterval = null; // ❗ 중복 실행 방지용 변수
// let map;
// let  userMarker,deliveryMarker , polyline;
// const API_BASE = "/api/location";
// let timeout = 60000;
// let lastLat = null;
// let lastLng = null;
// let userLat, userLng;
// const infoDiv = document.getElementById("info");
// let lastRiderLat,lastRiderLng;
// $(document).ready(function () {
//
//     displayCurrentLocationMap();
// // ✅ 채팅 목록 아이템 클릭 이벤트
// $(document).on("click", ".chat-list-item", function () {
//     $('#chatContainer').empty();
//
//     lastTimestamp = -1;
//     const riderId = $(this).data("rider-id");
//     const userId = $(this).data("user-id");
//     const status = $(this).data("status");
//     const messageBody = $(this).data("items");
//     orderId = $(this).data("order-id"); // 선택한 orderId 업데이트
//
//     console.log('선택한 주문:', { orderId, userId, riderId, status });
//
//     $("#new-message").val("");
//     updateOrderDetails({ orderId, status, items: messageBody });
//
//     fetchMessages(orderId); // 선택한 orderId에 맞는 메시지 가져오기
//
//     if (decoded.role === 'ROLE_RIDER') {
//         $(".deliver-btn").remove(); // 기존 버튼 제거 후 다시 추가
//         const orderHtml = `
//                 <button class="deliver-btn" style="background-color: #068acb;
//     border: none;
//     color: #bce9ff;
//     padding: 10px 20px;
//     border-radius: 5px;
//     margin-left: 20px;
//     font-size: 14px;"
//                     data-order-id="${orderId}"
//                     data-user-id="${userId}"
//                     data-message-body="${messageBody}"
//                     data-status="${status}">
//                     ${status}
//                 </button>
//             `;
//         $("#orderList").append(orderHtml);
//
//
//         //지도 업데이트
//
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const userLat = position.coords.latitude;
//                 const userLng = position.coords.longitude;
//
//                 console.log("checkMap", "userLat", userLat, "userLng", userLng, "userId", userId);
//
//                 if (decoded.role === "ROLE_RIDER") {
//
//                     initializeRiderMap(userLat, userLng, userId);
//
//                 } else if (decoded.role === "ROLE_USER") {
//
//                     initializeUserMap(userLat, userLng, riderId);
//
//
//                 }
//             },
//             (error) => {
//                 console.error("위치 정보를 가져오는 데 실패했습니다:", error);
//             }
//         );
//
//     }
// });
//     const mapContainer = document.getElementById("map");
//     map = new kakao.maps.Map(mapContainer, {
//         center: new kakao.maps.LatLng(userLat, userLng),
//         level: 4,
//     });
//
//
//
//
//     function initializeUserMap(userLat, userLng, riderId) {
//         console.log('🚀 고객 지도 초기화 - userLat:', userLat, 'userLng:', userLng, 'riderId:', riderId);
//         console.log("🚀 지도 초기화:", lat, lng);
//         const mapContainer = document.getElementById("map");
//         map = new kakao.maps.Map(mapContainer, {
//             center: new kakao.maps.LatLng(lat, lng),
//             level: 4,
//         });
//         // 기존 고객 마커 제거
//         if (userMarker) {
//             userMarker.setMap(null);
//         }
//
//         // ✅ 고객 위치 마커 생성
//         userMarker = new kakao.maps.Marker({
//             position: new kakao.maps.LatLng(userLat, userLng),
//             map: map,
//             title: "고객 위치",
//         });
//
//         // ✅ 고객 마커 클릭 시 위치 정보 및 주소 표시
//         addMarkerClickEvent(userMarker, userLat, userLng, "고객 위치");
//
//         // 🚀 1분마다 배달원 위치 가져오기
//         setInterval(() => {
//             fetchDeliveryLocation(userLat, userLng, riderId);
//         }, timeout);
//     }
//
// // ✅ 현재 위치 가져오기 (콜백 방식)
//     function getUserLocation(callback) {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     userLat = position.coords.latitude;
//                     userLng = position.coords.longitude;
//                     console.log("📍 현재 위치:", userLat, userLng);
//                     if (callback) callback();
//                 },
//                 (error) => {
//                     console.error("❌ 위치 정보를 가져오는 데 실패했습니다:", error);
//                     alert("🚨 현재 위치를 가져올 수 없습니다.");
//                 }
//             );
//         } else {
//             alert("🚨 현재 브라우저에서 위치 정보를 지원하지 않습니다.");
//         }
//     }
// // ✅ 배달원 지도 초기화
//     function initializeRiderMap(riderLat, riderLng, userId) {
//         console.log("🚀 배달원 지도 초기화:", riderLat, riderLng, userId);
//
//         if (!riderLat || !riderLng) {
//             console.error("🚨 오류: 배달원 좌표가 유효하지 않음");
//             return;
//         }
//
//         // ✅ 기존 마커 삭제 후 새로 추가
//         if (deliveryMarker) deliveryMarker.setMap(null);
//         deliveryMarker = new kakao.maps.Marker({
//             position: new kakao.maps.LatLng(riderLat, riderLng),
//             map: map,
//             title: "배달원 위치",
//         });
//
//         addMarkerClickEvent(deliveryMarker, riderLat, riderLng, "배달원 위치");
//
//         // ✅ 배달원 위치 저장
//         saveDeliveryLocation(riderLat, riderLng);
//         fetchDistanceAndTime(userLat, userLng, riderLat, riderLng);
//
//         lastRiderLat = riderLat;
//         lastRiderLng = riderLng;
//
//         // ✅ 기존 인터벌 제거 후 새로운 인터벌 실행
//         if (riderUpdateInterval) clearInterval(riderUpdateInterval);
//         riderUpdateInterval = setInterval(() => {
//             console.log("⏳ 배달원 위치 갱신 실행 중...");
//             getUserLocation(() => {
//                 if (lastRiderLat !== userLat || lastRiderLng !== userLng) {
//                     saveDeliveryLocation(userLat, userLng);
//                     lastRiderLat = userLat;
//                     lastRiderLng = userLng;
//                 }
//                 fetchDeliveryLocation(userLat, userLng, userId);
//                 fetchDistanceAndTime(userLat, userLng, riderLat, riderLng);
//             });
//         }, timeout);
//     }
//
//     // ✅ 배달원 위치 가져오기
//     function fetchDeliveryLocation(userLat, userLng, riderId) {
//         console.log("📡 배달원 위치 요청:", riderId);
//         fetch(`${API_BASE}/get-delivery-location?deliveryPersonId=${riderId}`)
//             .then((response) => response.json())
//             .then((data) => {
//                 const { latitude, longitude } = data;
//                 if (!latitude || !longitude) {
//                     console.error("❌ 배달원 위치 데이터 없음");
//                     return;
//                 }
//
//                 if (deliveryMarker) deliveryMarker.setMap(null);
//                 deliveryMarker = new kakao.maps.Marker({
//                     position: new kakao.maps.LatLng(latitude, longitude),
//                     map: map,
//                     title: "배달원 위치",
//                 });
//
//                 addMarkerClickEvent(deliveryMarker, latitude, longitude, "배달원 위치");
//                 fetchDistanceAndTime(userLat, userLng, latitude, longitude);
//             })
//             .catch((error) => console.error("❌ 배달원 위치 가져오기 실패:", error));
//     }
//     /** 배달원 위치 서버 저장 */
//     // ✅ 배달원 위치 저장
//     function saveDeliveryLocation(latitude, longitude) {
//         if (latitude === lastLat && longitude === lastLng) {
//             console.log("📍 위치 변경 없음, 업데이트 생략");
//             return;
//         }
//         lastLat = latitude;
//         lastLng = longitude;
//         console.log("💾 배달원 위치 저장:", latitude, longitude);
//
//         fetch(`${API_BASE}/update-location`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ deliveryPersonId: "RIDER_ID", latitude, longitude }),
//         }).catch((error) => console.error("❌ 배달원 위치 저장 실패:", error));
//     }
// // ✅ 거리 및 예상 시간 계산
//     function fetchDistanceAndTime(userLat, userLng, deliveryLat, deliveryLng) {
//         console.log("📏 거리 계산 요청:", userLat, userLng, deliveryLat, deliveryLng);
//
//         if (!deliveryLat || !deliveryLng) {
//             console.error("🚨 오류: 배달원 위치 없음");
//             return;
//         }
//
//         fetch(`${API_BASE}/get-distance-and-time?userLat=${userLat}&userLng=${userLng}&deliveryLat=${deliveryLat}&deliveryLng=${deliveryLng}`)
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log("📩 API 응답 데이터:", data);
//                 let distance = (data.distance / 1000).toFixed(2);
//                 let duration = Math.ceil(data.duration / 60);
//
//                 if (distance < 0.01) distance = "0.01";
//                 if (duration < 1) duration = "1";
//
//                 infoDiv.innerHTML = `
//                 <strong>🚀 배달원과의 거리:</strong> ${distance} km<br>
//                 <strong>⏳ 예상 도착 시간:</strong> ${duration} 분
//             `;
//
//                 drawPolyline(userLat, userLng, deliveryLat, deliveryLng);
//             })
//             .catch((error) => console.error("❌ 거리 계산 실패:", error));
//     }
//
//
//     /** 지도에 경로 표시 */
//     // 지도와 경로를 그리기 위한 함수
//
//     async function getKakaoApiKey() {
//         const response = await fetch('/getKakaoApiKey');
//         return await response.text();  // API 키를 반환
//     }
//
//     function drawPolyline(userLat, userLng, deliveryLat, deliveryLng) {
//         if (polyline) {
//             polyline.setMap(null);
//         }
//
//         // 🎯 경로가 너무 짧은 경우 예외 처리
//         const distanceThreshold = 10;  // 10m 이내면 경로 요청 안 함
//         const distX = Math.abs(userLng - deliveryLng) * 100000;
//         const distY = Math.abs(userLat - deliveryLat) * 100000;
//         const approxDistance = Math.sqrt(distX * distX + distY * distY);
//
//         if (approxDistance < distanceThreshold) {
//             alert("🚨 출발지와 목적지가 너무 가까워 경로를 표시할 수 없습니다.");
//             return;
//         }
//
//         // 카카오 길찾기 API URL 설정
//         const directionsUrl = `https://apis-navi.kakaomobility.com/v1/directions?origin=${userLng},${userLat}&destination=${deliveryLng},${deliveryLat}&priority=RECOMMEND&car_fuel=GASOLINE&car_hipass=false&alternatives=false&road_details=false`;
//
//         getKakaoApiKey().then(apiKey => {
//             fetch(directionsUrl, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `KakaoAK ${apiKey}`
//                 }
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log("📩 API 응답 데이터:", data);
//
//                     if (!data.routes || data.routes.length === 0) {
//                         alert('🚨 경로를 찾을 수 없습니다. (routes 없음)');
//                         return;
//                     }
//
//                     const route = data.routes[0];
//
//                     if (!route.sections || route.sections.length === 0) {
//                         alert('🚨 경로 데이터가 유효하지 않습니다. (sections 없음)');
//                         return;
//                     }
//
//                     const section = route.sections[0];
//
//                     if (!section.roads || section.roads.length === 0) {
//                         alert('🚨 경로 데이터가 유효하지 않습니다. (roads 없음)');
//                         return;
//                     }
//
//                     // ✅ vertexes 데이터를 이용하여 경로 생성
//                     let path = [];
//                     section.roads.forEach(road => {
//                         for (let i = 0; i < road.vertexes.length; i += 2) {
//                             const lat = road.vertexes[i + 1];
//                             const lng = road.vertexes[i];
//                             path.push(new kakao.maps.LatLng(lat, lng));
//                         }
//                     });
//
//                     if (path.length === 0) {
//                         alert('🚨 경로 데이터가 유효하지 않습니다. (vertexes 없음)');
//                         return;
//                     }
//
//                     // ✅ Polyline 생성하여 지도에 경로 표시
//                     polyline = new kakao.maps.Polyline({
//                         path: path,
//                         strokeWeight: 5,
//                         strokeColor: "#FF0000",
//                         strokeOpacity: 0.7,
//                         strokeStyle: "solid",
//                     });
//
//                     polyline.setMap(map);
//                 })
//                 .catch(error => {
//                     console.error('❌ Error fetching directions:', error);
//                     alert('🚨 경로를 가져오는 데 오류가 발생했습니다.');
//                 });
//         }).catch(error => {
//             console.error('❌ Error fetching API key:', error);
//             alert('🚨 카카오 API 키를 가져오는 데 오류가 발생했습니다.');
//         });
//     }
//
//
//
//
//
//
//     /** JWT 디코딩 */
//     function decodeJWT(token) {
//         try {
//             const base64Url = token.split(".")[1];
//             const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//             const jsonPayload = decodeURIComponent(
//                 atob(base64)
//                     .split("")
//                     .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//                     .join("")
//             );
//             return JSON.parse(jsonPayload);
//         } catch (error) {
//             console.error("JWT 디코딩 실패:", error);
//             return null;
//         }
//     }
// });
//
//
//
//
//
// // ✅ 카카오 지도 API를 사용하여 현재 위치를 지도에 표시
// function displayCurrentLocationMap() {
//     console.log("🚀 현재 위치 지도 표시 함수 호출");
//
//     // 1️⃣ 현재 위치 가져오기
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const userLat = position.coords.latitude;
//                 const userLng = position.coords.longitude;
//
//                 console.log("📍 현재 위치:", userLat, userLng);
//
//                 // 2️⃣ 지도 객체가 없으면 새로 생성
//                 if (!map) {
//                     console.warn("🚨 map 객체가 초기화되지 않아 새로 생성합니다.");
//                     map = new kakao.maps.Map(document.getElementById("map"), {
//                         center: new kakao.maps.LatLng(userLat, userLng),
//                         level: 4,
//                     });
//                 } else {
//                     // ✅ 기존 지도 객체가 있으면 중심 좌표 업데이트
//                     map.setCenter(new kakao.maps.LatLng(userLat, userLng));
//                 }
//
//                 // 3️⃣ 기존 마커 삭제 (새로운 위치로 갱신)
//                 if (userMarker) {
//                     userMarker.setMap(null);
//                 }
//
//                 // 4️⃣ 새로운 마커 생성 및 지도에 추가
//                 userMarker = new kakao.maps.Marker({
//                     position: new kakao.maps.LatLng(userLat, userLng),
//                     map: map,
//                     title: "내 위치",
//                 });
//
//                 // 5️⃣ 지도 컨트롤 추가 (확대/축소)
//                 const zoomControl = new kakao.maps.ZoomControl();
//                 map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
//
//                 // 6️⃣ 지도에 표시할 사용자 위치 정보 출력
//                 const infoDiv = document.getElementById("info");
//                 if (infoDiv) {
//                     infoDiv.innerHTML = `
//                         <strong>📍 내 위치:</strong> 위도 ${userLat.toFixed(6)}, 경도 ${userLng.toFixed(6)}
//                     `;
//                 }
//             },
//             (error) => {
//                 console.error("❌ 위치 정보를 가져오는 데 실패했습니다:", error);
//                 alert("🚨 현재 위치를 가져올 수 없습니다.");
//             }
//         );
//     } else {
//         alert("🚨 현재 브라우저에서 위치 정보를 지원하지 않습니다.");
//     }
//
// }
// // ✅ 마커 클릭 시 위치 정보 표시
// function addMarkerClickEvent(marker, lat, lng, title) {
//     const infoWindow = new kakao.maps.InfoWindow({ removable: true });
//
//     kakao.maps.event.addListener(marker, "click", function () {
//         console.log(`📍 ${title} 마커 클릭됨: 위도 ${lat}, 경도 ${lng}`);
//
//         getAddressFromCoords(lat, lng, (address) => {
//             if (!address) address = "주소 정보를 가져올 수 없음";
//
//             const content = `
//                 <div style="padding:10px;">
//                     <strong>${title}</strong><br>
//                     위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}<br>
//                     주소: ${address}
//                 </div>
//             `;
//             infoWindow.setContent(content);
//             infoWindow.open(map, marker);
//         });
//     });
// }
//
// // ✅ 좌표 → 주소 변환 함수
// function getAddressFromCoords(lat, lng, callback) {
//     const geocoder = new kakao.maps.services.Geocoder();
//     geocoder.coord2Address(lng, lat, function (result, status) {
//         if (status === kakao.maps.services.Status.OK) {
//             const address = result[0]?.address?.address_name || "주소 정보 없음";
//             callback(address);
//         } else {
//             console.error("❌ 주소 변환 실패");
//             callback("주소 정보 없음");
//         }
//     });
// }
//
//
// // ✅ 상대방(배달원) 위치 업데이트 및 마커 추가
// function updateDeliveryLocation(deliveryLat, deliveryLng) {
//     console.log("📍 배달원 위치 업데이트:", deliveryLat, deliveryLng);
//
//     if (!map) {
//         map = new kakao.maps.Map(document.getElementById("map"), {
//             center: new kakao.maps.LatLng(deliveryLat, deliveryLng),
//             level: 4,
//         });
//     }
//
//     if (deliveryMarker) {
//         deliveryMarker.setMap(null);
//     }
//
//     deliveryMarker = new kakao.maps.Marker({
//         position: new kakao.maps.LatLng(deliveryLat, deliveryLng),
//         map: map,
//         title: "배달원 위치",
//     });
//
//     addMarkerClickEvent(deliveryMarker, deliveryLat, deliveryLng, "배달원 위치");
// }
// function adjustMarkerPosition(lat, lng, offset = 0.0001) {
//     return { lat: lat + offset, lng: lng + offset };
// }
//
// /** 배달원 & 고객 마커 추가 */
// function updateMarkers(riderLat, riderLng, customerLat, customerLng) {
//     console.log("📌 마커 업데이트 - 배달원:", riderLat, riderLng, "고객:", customerLat, customerLng);
//
//     // 🚀 마커가 겹치는 경우 좌표 조정
//     if (riderLat === customerLat && riderLng === customerLng) {
//         const adjusted = adjustMarkerPosition(customerLat, customerLng);
//         customerLat = adjusted.lat;
//         customerLng = adjusted.lng;
//     }
//
//     // 🚀 기존 마커 제거
//     if (deliveryMarker) deliveryMarker.setMap(null);
//     if (userMarker) userMarker.setMap(null);
//
//     // 🚀 배달원 마커 추가
//     deliveryMarker = new kakao.maps.Marker({
//         position: new kakao.maps.LatLng(riderLat, riderLng),
//         map: map,
//         title: "배달원 위치",
//     });
//
//     // 🚀 고객 마커 추가
//     userMarker = new kakao.maps.Marker({
//         position: new kakao.maps.LatLng(customerLat, customerLng),
//         map: map,
//         title: "고객 위치",
//     });
//
//     addMarkerClickEvent(deliveryMarker, riderLat, riderLng, "배달원 위치");
//     addMarkerClickEvent(userMarker, customerLat, customerLng, "고객 위치");
//
//     // 🚀 지도 자동 이동 (배달원과 고객 중간 위치)
//     const centerLat = (riderLat + customerLat) / 2;
//     const centerLng = (riderLng + customerLng) / 2;
//     map.setCenter(new kakao.maps.LatLng(centerLat, centerLng));
// }