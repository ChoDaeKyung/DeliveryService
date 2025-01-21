// 카카오 지도 API가 로드된 후 실행되는 함수
$(document).ready(function () {
    loadMap();
    function loadMap(){
        const mapContainer = document.getElementsByClassName("map-placeholder")[0]; // 첫 번째 요소 선택
        const storeList = document.getElementById("storeList");


        // Geolocation 지원 여부 확인
        if (!navigator.geolocation) {
            alert("현재 브라우저에서 위치 정보를 지원하지 않습니다.");
            return;
        }

        // 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;

                // 지도 초기화
                const map = new kakao.maps.Map(mapContainer, {
                    center: new kakao.maps.LatLng(latitude, longitude),
                    level: 3,
                });

                // 현재 위치 마커
                const marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(latitude, longitude),
                    map: map,
                    title: "현재 위치",
                });

                // 카카오 검색 API로 Subway 매장 검색
                fetchSubwayStores(latitude, longitude, map, storeList);
            },
            (error) => {
                alert("위치 정보를 가져오는 데 실패했습니다.");
                console.error(error);
            }
        );
    };

    // 카카오 검색 API 호출
    function fetchSubwayStores(latitude, longitude, map, storeList) {
        const query = "Subway";
        const radius = 1000; // 반경 1km
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&x=${longitude}&y=${latitude}&radius=${radius}`;

        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "KakaoAK 118f545aa38dcd31bad414ade22b9cd6",  // 카카오 REST API 키를 사용
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.documents.length === 0) {
                    alert("주변에 Subway 매장을 찾을 수 없습니다.");
                    return;
                }

                storeList.innerHTML = ""; // 기존 리스트 초기화

                // 매장 리스트 표시 및 지도 마커 추가
                data.documents.forEach((store) => {
                    const {place_name, road_address_name, x, y} = store;

                    // 리스트 추가
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `
                    <strong>${place_name}</strong><br>
                    ${road_address_name}
                `;
                    storeList.appendChild(listItem);

                    // 지도 마커 추가
                    new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(y, x),
                        map: map,
                        title: place_name,
                    });
                });
            })
            .catch((error) => {
                alert("매장 정보를 가져오는 데 실패했습니다.");
                console.error(error);
            });

    }
});