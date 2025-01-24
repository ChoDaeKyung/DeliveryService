document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("accessToken");

    // 토큰 유효성 검사
    if (!token || !isTokenValid(token)) {
        alert('로그인이 필요합니다.');
        location.href = "/login";
        return;
    }

    // JWT 디코딩
    const decoded = decodeJWT(token);

    const mapContainer = document.getElementById("map");
    const infoDiv = document.getElementById("info");
    let map, userMarker, deliveryMarker, polyline;

    const API_BASE = "/api/location";

    // 지도 초기화 및 위치 처리
    if (!navigator.geolocation) {
        alert("현재 브라우저에서 위치 정보를 지원하지 않습니다.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // 지도 초기화
            map = new kakao.maps.Map(mapContainer, {
                center: new kakao.maps.LatLng(latitude, longitude),
                level: 5,
            });

            // 사용자 역할에 따른 로직 실행
            if (decoded.role === "ROLE_USER") {
                initializeUserMap(map, latitude, longitude);
            } else if (decoded.role === "ROLE_RIDER") {
                initializeRiderMap(map, latitude, longitude);
            } else {
                alert("알 수 없는 역할입니다. 로그아웃 후 다시 로그인해주세요.");
                location.href = "/login";
            }
        },
        (error) => {
            alert("위치 정보를 가져오는 데 실패했습니다.");
            console.error(error);
        }
    );

    /** 고객용 지도 초기화 */
    function initializeUserMap(map, userLat, userLng) {
        // 사용자 위치 마커
        userMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(userLat, userLng),
            map: map,
            title: "사용자 위치",
        });

        // 배달원 위치 초기화 및 주기적 업데이트
        fetchDeliveryLocation(map, userLat, userLng);
        setInterval(() => {
            fetchDeliveryLocation(map, userLat, userLng);
        }, 60 * 1000);
    }

    /** 배달원용 지도 초기화 */
    function initializeRiderMap(map, riderLat, riderLng) {
        // 배달원 위치 마커
        deliveryMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(riderLat, riderLng),
            map: map,
            title: "배달원 위치",
        });

        // 배달원 위치 서버 저장 주기적 실행
        setInterval(() => {
            saveDeliveryLocation(riderLat, riderLng);
        }, 60 * 1000);
    }

    /** 배달원 위치 가져오기 */
    function fetchDeliveryLocation(map, userLat, userLng) {
        console.log('map',map,'userLat',userLat,'userLng',userLng)
        console.log('userId',decoded.sub)
        fetch(`${API_BASE}/get-delivery-location?deliveryPersonId=${decoded.sub}`)
            .then((response) => response.json())
            .then((data) => {
                const { latitude, longitude } = data;

                // 기존 배달원 마커 삭제
                if (deliveryMarker) {
                    deliveryMarker.setMap(null);
                }

                // 배달원 위치 마커 추가
                deliveryMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(latitude, longitude),
                    map: map,
                    title: "배달원 위치",
                });

                // 거리 및 예상 시간 계산
                fetchDistanceAndTime(userLat, userLng, latitude, longitude);
            })
            .catch((error) => console.error("배달원 위치를 가져오는 데 실패했습니다:", error));
    }

    /** 배달원 위치 서버 저장 */
    function saveDeliveryLocation(latitude, longitude) {
        console.log('decoded.sub',decoded.sub,'latitude',latitude,'longitude',longitude);
        fetch(`${API_BASE}/update-location`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                deliveryPersonId: decoded.sub,
                latitude: latitude,
                longitude: longitude,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("배달원 위치 저장 성공:", data);
            })
            .catch((error) => {
                console.error("배달원 위치 저장 실패:", error);
            });
    }


    /** 거리 및 예상 시간 계산 */
    function fetchDistanceAndTime(userLat, userLng, deliveryLat, deliveryLng) {
        console.log('userLat', userLat, userLng,'deliveryLat',deliveryLat,'deliveryLng',deliveryLng);
        fetch(`${API_BASE}/get-distance-and-time?userLat=${userLat}&userLng=${userLng}&deliveryLat=${deliveryLat}&deliveryLng=${deliveryLng}`)
            .then((response) => response.json())
            .then((data) => {
                const distance = (data.distance / 1000).toFixed(2);
                const duration = Math.ceil(data.duration / 60);

                // 거리 및 시간 정보 지도 위에 표시
                infoDiv.innerHTML = `
                    <strong>배달원과의 거리:</strong> ${distance} km<br>
                    <strong>도착 예상 시간:</strong> ${duration} 분
                `;

                // 지도에 폴리라인 추가
                drawPolyline(userLat, userLng, deliveryLat, deliveryLng);
            })
            .catch((error) => console.error("거리 계산 실패:", error));
    }

    /** 지도에 경로(폴리라인) 표시 */
    function drawPolyline(userLat, userLng, deliveryLat, deliveryLng) {
        if (polyline) {
            polyline.setMap(null);
        }

        const linePath = [
            new kakao.maps.LatLng(userLat, userLng),
            new kakao.maps.LatLng(deliveryLat, deliveryLng),
        ];

        polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: "#FF0000",
            strokeOpacity: 0.7,
            strokeStyle: "solid",
        });

        polyline.setMap(map);
    }

    /** JWT 디코딩 함수 */
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

    /** JWT 유효성 검사 함수 */
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
