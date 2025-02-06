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
        $('#hiddenUserId').val(userId); // 상품 이름 출력 가공
    } else {
        alert("로그인해주세요.");
        return;
    }

    console.log('userId :: ', userId);

    $.ajax({
        url: '/webs/api/cart/getCartList',
        type: 'GET',
        data: {nickName: userId},
        success: function (response) {
            console.log('response :: ', response);

            // 가져온 데이터를 처리
            renderCartList(response);

            // 렌더링 이후에 amount와 products 계산
            let products = [];
            let amount = 0;

            $('.rectangle').each(function () {
                const totalPrice = parseFloat($(this).data('total-price')) || 0;
                const product = $(this).data('name');
                amount += totalPrice;

                if (product) {
                    products.push(product); // 상품 이름 배열에 추가
                }
            });

            console.log('amount :: ', amount);
            console.log('products :: ', products);

            // 상품 개수 가공
            let displayProducts;
            if (products.length > 1) {
                displayProducts = `${products[0]} 외 ${products.length - 1}개 상품`;
            } else if (products.length === 1) {
                displayProducts = products[0];
            } else {
                displayProducts = '상품이 없습니다.';
            }

            console.log('displayProducts :: ', displayProducts);

            // HTML input 요소에 값 주입
            $('#hiddenTotalMoney').val(amount);       // 총 금액 설정
            $('#hiddenProducts').val(displayProducts); // 상품 이름 출력 가공
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
            success: function (data) {

            }

        });
    });



// 모달 열기
function openModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'flex';
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
}

// '주문하기' 버튼 클릭 이벤트
$(document).on('click', '.orderButton', function (event) {
    event.preventDefault(); // 기본 동작 방지
    alert('hi')
    openModal();
});
