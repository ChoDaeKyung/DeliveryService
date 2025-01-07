$(document).ready(function () {

    const decodeJWT = (token) => {
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
    };

    const token = localStorage.getItem("accessToken");

    // 토큰이 존재하는지 확인
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    let userId = null;
    const decoded = decodeJWT(token);

    if (decoded && decoded.sub) {
        console.log("Decoded JWT:", decoded); // 디코딩된 전체 객체 출력
        console.log("Decoded sub:", decoded.sub); // sub 필드 값 확인
        console.log("Type of sub:", typeof decoded.sub); // 타입 확인

        userId = JSON.stringify(decoded.sub);// 문자열로 변환
        console.log("Type of sub:", typeof userId);
        console.log("UserId as string:", userId); // 변환된 값 확인
    } else {
        alert("로그인해주세요.");
        return;
    }

    console.log('userId :: ', userId);

    // Ajax로 데이터 가져오기
    $.ajax({
        url: '/webs/api/cart/getCartList', type: 'GET', data: {nickName: userId}, success: function (response) {
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
    const fixedCategoryOrder = ['bread', 'vegetable', 'meat', 'source', 'cheese'];

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
    alert('hi');

    let payPrice = 0;
    $('.rectangle').each(function () {
        const totalPrice = parseFloat($(this).data('total-price')) || 0;
        payPrice += totalPrice;
    });

    if (payPrice === 0) {
        alert('장바구니에 상품을 먼저 담아주세요.');
        window.location.href = '/mypage/cartList';
        return;
    }

    const clientKey = "test_ck_vZnjEJeQVxeEnpv2LGobrPmOoBN0";
    const tossPayments = TossPayments(clientKey);

    async function requestPayment() {
        try {
            await tossPayments.requestPayment({
                method: "CARD",
                amount: 50000,
                orderId: "4nvQh0QW-7Pqp4YwxLwHT",
                orderName: "토스 티셔츠 외 2건",
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",
                customerEmail: "customer123@gmail.com",
                customerName: "김토스",
                customerMobilePhone: "01012341234",
                card: {
                    useEscrow: false,
                    flowMode: "DEFAULT",
                    useCardPoint: false,
                    useAppCardOnly: false,
                },
            });
        } catch (error) {
            console.error('결제 요청 중 오류:', error);
            alert('결제 요청에 실패했습니다. 다시 시도해주세요.');
        }
    }

    requestPayment();
});