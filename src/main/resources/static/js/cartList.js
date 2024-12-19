$(document).ready(function () {
    // Ajax로 데이터 가져오기
    $.ajax({
        url: '/webs/api/cart/getCartList',
        type: 'GET',
        data: { nickName: 'buyer' },
        success: function (response) {
            console.log('response :: ',response)
            // 가져온 데이터를 처리
            renderCartList(response);
        },
        error: function (xhr, status, error) {
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

    // 각 CompleteCartResponseDTO에 맞는 Product를 매핑
    completeCartList.forEach(cart => {
        // `id`에 맞는 CartProductResponseDTO 찾기
        const products = cartProductList.filter(product => product.id === cart.id);

        // `CompleteCartResponseDTO`를 렌더링
        const cartHtml = `
            <div class="rectangle">
                <div>
                    <strong>${cart.name}</strong> (총 가격: ${cart.totalPrice}원)
                </div>
                <div>
                    ${products.map(product => `
                        <div>
                            - ${product.name} (${product.category}): ${product.price}원
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // 컨테이너에 추가
        cartContainer.append(cartHtml);
    });
}
