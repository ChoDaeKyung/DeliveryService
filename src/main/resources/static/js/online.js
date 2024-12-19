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
          <div class="sandwich-item" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-detail="${item.detail}">
            <img src="${item.image}" alt="${item.name}" class="sandwich-image">
            <div class="sandwich-text">
              <h3>${item.name}</h3>
              <p>${item.price}원</p>
              <input type="hidden" value="${item.detail}">
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

    $(document).on('click', '.sandwich-item', function () {

        // 선택한 아이템의 데이터를 가져옴
        const name = $(this).data('name');
        const price = $(this).data('price');
        const image = $(this).data('image');
        const detail = $(this).data('detail');

        $.ajax({
            url: '/webs/api/menu/getProducts', // 서버에서 메뉴 목록을 가져오는 API URL
            method: 'GET',
            dataType: 'json', // 응답 데이터 타입은 JSON
            data:{name:name},
            success: function(data) {
                console.log('data :: ', data);

                // 카테고리별로 제품 그룹화
                const categories = {
                    bread: [],
                    vegetable: [],
                    meat: [],
                    source: []
                };

                // 데이터를 카테고리별로 그룹화
                data.forEach(item => {
                    if (item.category === 'bread') {
                        categories.bread.push(item);
                    } else if (item.category === 'vegetable') {
                        categories.vegetable.push(item);
                    } else if (item.category === 'meat') {
                        categories.meat.push(item);
                    } else if (item.category === 'source') {
                        categories.source.push(item);
                    }
                });

                // 모달의 제품 정보에 카테고리별로 나열
                let modalProductsHtml = '';
                for (const category in categories) {
                    if (categories[category].length > 0) {
                        // 각 카테고리 이름을 한 줄로 표시하고, 그 아래에 해당 카테고리의 이름들과 이미지를 나열
                        modalProductsHtml += `<p><strong>${category}:</strong>`;
                        categories[category].forEach(item => {
                            modalProductsHtml += `
                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-left: 10px;">
                            <span>${item.name}</span>
                        `;
                        });
                        modalProductsHtml += `</p>`;
                    }
                }

                // #modal-products에 생성된 HTML을 삽입
                $('#modal-products').html(modalProductsHtml);
            },
            error: function(xhr, status, error) {
                console.error("메뉴 데이터를 가져오는 데 실패했습니다.", error);
            }
        });

        // 모달의 내용을 동적으로 설정
        $('#modal-title').text(name);
        $('#modal-price').text(price + '원');
        $('#modal-detail').text(detail);
        $('#modal-image').attr('src', image);

        // 모달을 표시
        $('#Modal').css('display', 'flex');
    });

// 모달 닫기 버튼 클릭 시 모달 닫기
    $(document).on('click', '.close', function () {
        $('#Modal').css('display', 'none');
    });

// 모달 외부 클릭 시 모달 닫기
    $(window).on('click', function (event) {
        if ($(event.target).is('#Modal')) {
            $('#Modal').css('display', 'none');
        }
    });

    $(document).on('click', '.insertCartButton', function () {
        const name = $('#modal-title').text();
        const price = $('#modal-price').text().replace('원', '');
        $.ajax({
            url: '/webs/api/cart/completeProduct', // 서버에서 메뉴 목록을 가져오는 API URL
            method: 'POST',
            contentType: 'application/json',  // Content-Type을 JSON으로 설정
            data: JSON.stringify({
                name: name,
                price:price,
                buyer: 'buyer',
                productId:new Date().toISOString() + 'buyer'
            }),
            success: function (response) {
                if (response === "success") {
                    alert("장바구니 담기에 성공하셨습니다!");
                } else {
                    alert("장바구니 담기에 실패하였습니다.");
                }
            },
            error: function (xhr, status, error) {
                console.error("에러 발생:", error); // 에러 디버깅
                alert("서버와 통신 중 문제가 발생했습니다.");
            }
        })
    });

});