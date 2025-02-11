$(document).ready(function () {


    if (!navigator.geolocation) {
        alert("현재 브라우저에서 위치 정보를 지원하지 않습니다.");
        return;
    }

    let timeout = 60000;
    const mapContainer = document.getElementById("map");
    const infoDiv = document.getElementById("info");
    let  userMarker, deliveryMarker, polyline;
    let map = new kakao.maps.Map(mapContainer, {
        center: new kakao.maps.LatLng(userLat, userLng),
        level: 4,
    });
    const API_BASE = "/api/location";
    const token = localStorage.getItem("accessToken");
    const decoded = decodeJWT(token);

    /** 고객용 지도 초기화 */
    window.initializeUserMap = function (userLat, userLng, riderId) {
        console.log('userLocationinit',map,riderLat,riderLng,userId);
        userMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(userLat, userLng),
            map: map,
            title: "사용자 위치",
        });

        fetchDeliveryLocation(userLat, userLng, riderId);
        setInterval(() => {
            fetchDeliveryLocation(userLat, userLng, riderId);
        }, timeout);
    };

        /** 배달원용 지도 초기화 */
        window.initializeRiderMap = function (riderLat, riderLng, userId) {
            console.log('riderLocationinit',map,riderLat,riderLng,userId);
            deliveryMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(riderLat, riderLng),
                map: map,
                title: "배달원 위치",
            });

            saveDeliveryLocation(riderLat, riderLng);
            fetchDeliveryLocation(riderLat, riderLng, userId);

            setInterval(() => {
                saveDeliveryLocation(riderLat, riderLng);
                fetchDeliveryLocation(riderLat, riderLng, userId);
            }, timeout);
        };

    /** 배달원 위치 가져오기 */
    function fetchDeliveryLocation(userLat, userLng, userInfo) {
        console.log('riderLocation',map,userLat,userLng,userInfo);
        fetch(`${API_BASE}/get-delivery-location?deliveryPersonId=${userInfo}`)
            .then((response) => response.json())
            .then((data) => {
                const { latitude, longitude } = data;

                if (deliveryMarker) {
                    deliveryMarker.setMap(null);
                }

                deliveryMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(latitude, longitude),
                    map: map,
                    title: "배달원 위치",
                });

                fetchDistanceAndTime(userLat, userLng, latitude, longitude);
            })
            .catch((error) => console.error("배달원 위치를 가져오는 데 실패했습니다:", error));
    }

    /** 배달원 위치 서버 저장 */
    function saveDeliveryLocation(latitude, longitude) {
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
        }).catch((error) => {
            console.error("배달원 위치 저장 실패:", error);
        });
    }

    /** 거리 및 예상 시간 계산 */
    function fetchDistanceAndTime(userLat, userLng, deliveryLat, deliveryLng) {
        fetch(`${API_BASE}/get-distance-and-time?userLat=${userLat}&userLng=${userLng}&deliveryLat=${deliveryLat}&deliveryLng=${deliveryLng}`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(`서버 오류: ${response.status} - ${text}`); });
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.distance || !data.duration) {
                    throw new Error("유효하지 않은 데이터 형식");
                }

                const distance = (data.distance / 1000).toFixed(2);
                const duration = Math.ceil(data.duration / 60);

                infoDiv.innerHTML = `
                <strong>배달원과의 거리:</strong> ${distance} km<br>
                <strong>도착 예상 시간:</strong> ${duration} 분
            `;

                drawPolyline(userLat, userLng, deliveryLat, deliveryLng);
            })
            .catch((error) => console.error("거리 계산 실패:", error));
    }


    /** 지도에 경로 표시 */
    // 지도와 경로를 그리기 위한 함수

    async function getKakaoApiKey() {
        const response = await fetch('/getKakaoApiKey');
        return await response.text();  // API 키를 반환
    }

    function drawPolyline(userLat, userLng, deliveryLat, deliveryLng) {
        // 기존 경로가 있으면 제거
        if (polyline) {
            polyline.setMap(null);
        }

        // 카카오 네비게이션 API 경로 요청 URL
        const directionsUrl = `https://apis-navi.kakaomobility.com/v1/directions?origin=${userLng},${userLat}&destination=${deliveryLng},${deliveryLat}&priority=RECOMMEND&car_fuel=GASOLINE&car_hipass=false&alternatives=false&road_details=false`;

        // fetch를 사용해 API 호출
        getKakaoApiKey().then(apiKey => {
            // API 키가 준비된 후 fetch 요청
            fetch(directionsUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `KakaoAK ${apiKey}`  // 가져온 API 키 사용
                }
            })
                .then(response => response.json())
                .then(data => {
                    // 경로가 없으면 오류 처리
                    if (!data.routes || data.routes.length === 0) {
                        alert('경로를 찾을 수 없습니다.');
                        return;
                    }

                    // 첫 번째 경로 데이터 추출
                    const route = data.routes[0];
                    const path = route.sections[0].road_path.map(point => {
                        return new kakao.maps.LatLng(point.y, point.x);  // 경로 좌표 변환
                    });

                    // 폴리라인으로 경로 그리기
                    polyline = new kakao.maps.Polyline({
                        path: path,
                        strokeWeight: 5,
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.7,
                        strokeStyle: "solid",
                    });

                    // 지도에 경로 표시
                    polyline.setMap(map);
                })
                .catch(error => {
                    console.error('Error fetching directions:', error);
                    alert('경로를 가져오는 데 오류가 발생했습니다.');
                });
        }).catch(error => {
            console.error('Error fetching API key:', error);
            alert('카카오 API 키를 가져오는 데 오류가 발생했습니다.');
        });
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
