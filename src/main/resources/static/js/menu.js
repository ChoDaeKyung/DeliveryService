$(document).ready(function () {
    // 페이지가 로드되면 메뉴 데이터를 가져옴

    $.ajax({
        url: '/webs/api/menu', // 서버에서 메뉴 목록을 가져오는 API URL
        method: 'GET',
        dataType: 'json', // 응답 데이터 타입은 JSON
        success: function(data) {
            console.log('data :: ',data)
            // 성공적으로 데이터를 받았을 때, 받은 데이터를 기반으로 메뉴를 동적으로 추가
            const menuContainer = $('.sandwich-container');
            menuContainer.empty();  // 기존에 있는 메뉴 항목을 초기화

            data.forEach(item => {
                // 각 메뉴 항목에 대한 HTML 구조를 생성
                const menuItemHTML = `
          <div class="sandwich-item">
            <img src="${item.image}" alt="${item.name}" class="sandwich-image">
            <div class="sandwich-text">
              <h3>${item.name}</h3>
              <p>${item.price}원</p>
            </div>
          </div>
        `;

                // 생성한 메뉴 항목을 메뉴 컨테이너에 추가
                menuContainer.append(menuItemHTML);
            });
        },
        error: function(xhr, status, error) {
            console.error("메뉴 데이터를 가져오는 데 실패했습니다.", error);
        }
    });
});