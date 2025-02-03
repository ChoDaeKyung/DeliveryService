$(document).ready(function () {
    if (!navigator.geolocation) {
        alert("현재 브라우저에서 위치 정보를 지원하지 않습니다.");
        return;
    }

    const mapContainer = document.getElementById("map");
    const infoDiv = document.getElementById("info");
    let map, userMarker, deliveryMarker, polyline;

    const API_BASE = "/api/location";
    const token = localStorage.getItem("accessToken");
    const decoded = decodeJWT(token);

    /** 고객용 지도 초기화 */
    window.initializeUserMap = function (map, userLat, userLng, riderId) {
        userMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(userLat, userLng),
            map: map,
            title: "사용자 위치",
        });

        fetchDeliveryLocation(map, userLat, userLng, riderId);
        setInterval(() => {
            fetchDeliveryLocation(map, userLat, userLng, riderId);
        }, 60000);
    };

    /** 배달원용 지도 초기화 */
    window.initializeRiderMap = function (map, riderLat, riderLng, userId) {
        console.log('riderLocationinit',map,riderLat,riderLng,userId);
        deliveryMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(riderLat, riderLng),
            map: map,
            title: "배달원 위치",
        });

        saveDeliveryLocation(riderLat, riderLng);
        fetchDeliveryLocation(map, riderLat, riderLng, userId);

        setInterval(() => {
            saveDeliveryLocation(riderLat, riderLng);
            fetchDeliveryLocation(map, riderLat, riderLng, userId);
        }, 60000);
    };

    /** 배달원 위치 가져오기 */
    function fetchDeliveryLocation(map, userLat, userLng, userInfo) {
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
            .then((response) => response.json())
            .then((data) => {
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
