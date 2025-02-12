document.addEventListener("DOMContentLoaded", function () {
    let map, userMarker, userPosition;
    let geocoder = new kakao.maps.services.Geocoder();
    let infowindows = []; // 여러 개의 infowindow를 관리
    let storeMarkers = []; // 매장 마커 관리
    let userInfoWindow; // 사용자 정보창 저장
    //loadMap();
    setDefaultLocation();
    function loadMap() {
        const mapContainer = document.querySelector(".map-placeholder");
        let storeList = document.getElementById("storeList");

        if (!navigator.geolocation) {
            alert("현재 브라우저에서 위치 정보를 지원하지 않습니다.");
            setDefaultLocation(); // 기본 위치 설정
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                initializeMap(latitude, longitude);
            },
            (error) => {
                console.warn("⚠ 위치 정보를 가져올 수 없습니다. 기본 좌표를 사용합니다.");
                setDefaultLocation();
            }
        );
    }

    function setDefaultLocation() {
        let latitude = 37.5381655;
        let longitude = 127.1263928;
        initializeMap(latitude, longitude);
    }

    function initializeMap(latitude, longitude) {
        const mapContainer = document.querySelector(".map-placeholder");
        let storeList = document.getElementById("storeList");

        userPosition = new kakao.maps.LatLng(latitude, longitude);

        map = new kakao.maps.Map(mapContainer, {
            center: userPosition,
            level: 3,
        });

        const markerImage = new kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
            new kakao.maps.Size(24, 35)
        );

        userMarker = new kakao.maps.Marker({
            position: userPosition,
            map: map,
            image: markerImage,
        });

        const userLabel = new kakao.maps.CustomOverlay({
            position: userPosition,
            content: `<div class="custom-label">현재 위치</div>`,
            yAnchor: 1.5
        });
        userLabel.setMap(map);

        userInfoWindow = new kakao.maps.InfoWindow({ zIndex: 2 });
        infowindows.push(userInfoWindow);

        kakao.maps.event.addListener(userMarker, 'click', function () {
            toggleInfoWindow(userInfoWindow, userMarker, userPosition, "현재 위치");
        });

        document.querySelector(".custom-label").addEventListener('click', function () {
            toggleInfoWindow(userInfoWindow, userMarker, userPosition, "현재 위치");
        });

        document.getElementById("moveToMyLocationBtn").addEventListener("click", function () {
            if (userPosition) {
                map.setCenter(userPosition);
                ensureAllMarkersVisible();
            }
        });

        fetchSubwayStores(latitude, longitude, map, storeList);
    }

    async function getKakaoApiKey() {
        const response = await fetch('/getKakaoApiKey');
        return await response.text();
    }

    function fetchSubwayStores(latitude, longitude, map, storeList) {
        const query = "Subway";
        const radius = 1000;
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&x=${longitude}&y=${latitude}&radius=${radius}`;

        getKakaoApiKey().then(apiKey => {
            fetch(url, {
                method: "GET",
                headers: { "Authorization": "KakaoAK " + apiKey },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.documents.length === 0) {
                        alert("주변에 Subway 매장을 찾을 수 없습니다.");
                        return;
                    }

                    storeList.innerHTML = "";
                    storeMarkers.forEach(marker => marker.setMap(null)); // 기존 매장 마커 삭제
                    storeMarkers = [];

                    data.documents.forEach((store) => {
                        const { place_name, road_address_name, x, y } = store;
                        const storePosition = new kakao.maps.LatLng(y, x);

                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                            <div class="store-item" data-lat="${y}" data-lng="${x}">
                                <strong class="store-name">${place_name}</strong><br>
                                <span class="store-address">${road_address_name}</span>
                            </div>
                        `;
                        storeList.appendChild(listItem);

                        const storeMarker = new kakao.maps.Marker({
                            position: storePosition,
                            map: map,
                            title: place_name,
                        });

                        storeMarkers.push(storeMarker);

                        const storeLabel = new kakao.maps.CustomOverlay({
                            position: storePosition,
                            content: `<div class="custom-label">${place_name}</div>`,
                            yAnchor: 1.5
                        });
                        storeLabel.setMap(map);

                        let storeInfoWindow = new kakao.maps.InfoWindow({ zIndex: 2 });
                        infowindows.push(storeInfoWindow);

                        kakao.maps.event.addListener(storeMarker, 'click', function () {
                            toggleInfoWindow(storeInfoWindow, storeMarker, storePosition, place_name, road_address_name);
                        });

                        document.querySelector(`.custom-label`).addEventListener('click', function () {
                            toggleInfoWindow(storeInfoWindow, storeMarker, storePosition, place_name, road_address_name);
                        });

                        listItem.addEventListener("click", function () {
                            map.setCenter(storePosition);
                            ensureAllMarkersVisible();
                            toggleInfoWindow(storeInfoWindow, storeMarker, storePosition, place_name, road_address_name);
                        });
                    });

                    ensureAllMarkersVisible();
                })
                .catch(error => {
                    alert("매장 정보를 가져오는 데 실패했습니다.");
                    console.error(error);
                });
        });
    }

    function toggleInfoWindow(infowindow, marker, position, title, address = null) {
        if (infowindow.getMap()) {
            infowindow.close();
        } else {
            closeAllInfoWindows();

            if (address) {
                infowindow.setContent(`<div style="padding:3px; font-size: 15px;">${title}<br>${address}</div>`);
            } else {
                geocoder.coord2Address(position.getLng(), position.getLat(), function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        const addr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
                        infowindow.setContent(`<div style="padding:5px;">${title}<br>${addr}</div>`);
                        infowindow.open(map, marker);
                    }
                });
                return;
            }
            infowindow.open(map, marker);
        }
    }

    function closeAllInfoWindows() {
        infowindows.forEach(iw => iw.close());
    }

    function ensureAllMarkersVisible() {
        if (userMarker) userMarker.setMap(map);
        storeMarkers.forEach(marker => marker.setMap(map));
    }
});
