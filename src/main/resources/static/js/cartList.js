$(document).ready(function () {
    // Ajax로 데이터 가져오기
    $.ajax({
        url: '/webs/api/cart/getCartList', type: 'GET', data: {nickName: 'buyer'}, success: function (response) {
            console.log('response :: ', response)
            // 가져온 데이터를 처리
            renderCartList(response);
        }, error: function (xhr, status, error) {
            console.error('Error fetching cart data:', error);
        }
    });
});

// 데이터를 HTML에 렌더링하는 함수
function renderCartList(data) {
    // Container 요소 가져오기
    const cartContainer = $('#cartContainer');
    cartContainer.empty(); // 기존 내용 삭제

    // CompleteCartList와 CartProductList 가져오기
    const completeCartList = data.completeCartList;
    const cartProductList = data.cartProductList;

    // 고정된 카테고리 순서
    const fixedCategoryOrder = ['bread', 'vegetable', 'meat', 'source', 'drink'];

    // 각 CompleteCartResponseDTO에 맞는 Product를 매핑
    completeCartList.forEach(cart => {
        // `id`에 맞는 CartProductResponseDTO 찾기
        const products = cartProductList.filter(product => product.id === cart.id);

        // 카테고리별로 제품을 그룹화
        const categorizedProducts = products.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product.name);  // 상품 이름만 저장
            return acc;
        }, {});

        // `CompleteCartResponseDTO`를 렌더링
        const cartHtml = `
    <div class="rectangle" data-name="${cart.name}" data-total-price="${cart.totalPrice}">
        <div class="cart-header">
            <strong>${cart.name}</strong> (가격 : ${cart.totalPrice}₩)
        </div>
        <div class="category-container">
            ${fixedCategoryOrder.map(category => `
                ${categorizedProducts[category] ? `
                    <div class="category-section">
                        <strong>${category}:</strong> 
                        <span class="category-items">${categorizedProducts[category].join(', ')}</span>
                    </div>
                ` : ''}
            `).join('')}
        </div>
    </div>
`;

        // 컨테이너에 추가
        cartContainer.append(cartHtml);
    });
}

$(document).on('click', '.rectangle', function () {
    const name = $(this).data('name'); // data-name 속성에서 값 가져오기
    console.log('Clicked cart name:', name);

    $.ajax({
        url: '/webs/api/menu/getMenuListByName', // 서버에서 메뉴 목록을 가져오는 API URL
        method: 'GET',
        dataType: 'json', // 응답 데이터 타입은 JSON
        data: {name: name},
        success: function(data) {

        }

    });
});

$(document).on('click', '.orderButton', function () {
    let payPrice = 0;

    // 모든 .rectangle 요소의 data-total-price 값을 합산
    $('.rectangle').each(function () {
        const totalPrice = parseFloat($(this).data('total-price')) || 0;
        payPrice += totalPrice;
    });

    if(payPrice === 0){
        alert('장바구니에 상품을 먼저 담아주세요.');
        window.location.href='/mypage/cartList'
    }


});