$(document).ready(function () {
    const rowsPerPage = 10; // 한 페이지당 게시글 수
    let currentPage = 1; // 현재 페이지
    let totalPages = 1; // 총 페이지 수

    // JWT 디코딩 함수
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('JWT 디코딩 실패:', error);
            return null;
        }
    };

    // JWT 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
        return;
    }

    // 디코드된 JWT에서 유저 ID 추출
    const decoded = decodeJWT(token);
    if (decoded && decoded.sub) {
        const userId = JSON.stringify(decoded.sub); // 유저 ID
        console.log("User ID:", userId);

        // 작성 가능한 리뷰 가져오기
        fetchMyReviews(userId, currentPage, rowsPerPage);
    } else {
        alert('유저 정보를 불러오지 못했습니다. 다시 로그인해주세요.');
        return;
    }

    // 작성한 리뷰 리스트를 가져오는 함수
    function fetchMyReviews(userId, page = 1, pageSize = 10) {
        const token = localStorage.getItem("token");
        console.log('userid는 ',userId)
        $.ajax({
            url: '/webs/api/review/myReviewList',
            type: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: { id: userId, page: page, pageSize: pageSize },
            success: function (data) {
                console.log('Fetched Reviews:', data);

                if (data && data.myReviewList && data.myReviewList.length > 0) {
                    renderMyReviews(data.myReviewList); // 리뷰 리스트 렌더링
                    totalPages = Math.ceil(data.allPage / rowsPerPage); // 총 페이지 수 계산
                    renderPagination(currentPage, totalPages); // 페이지네이션 렌더링
                } else {
                    alert('작성한 리뷰가 없습니다.');
                }
            },
            error: function (xhr, status, error) {
                console.error('리뷰 리스트 조회 중 오류 발생:', error);
                alert('리뷰 리스트를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        });
    }

    // 리뷰 리스트 렌더링 함수
    function renderMyReviews(reviews) {
        const reviewContainer = $('#pending-review-list');
        reviewContainer.empty(); // 기존 리스트 초기화

        reviews.forEach(review => {
            const reviewItem = `
                <div class="review-item">
                    <div class="product-info">
                        <h2 class="product-title">상품 제목: ${review.product_info}</h2>
                        <p class="product-description">주문 번호: ${review.order_id}</p>
                    </div>
                    <button 
                        class="write-review-btn" 
                        data-order-id="${review.orderId}" 
                        data-product-name="${review.completeProduct}">
                        리뷰 작성
                    </button>
                </div>
            `;
            reviewContainer.append(reviewItem);
        });

        // 리뷰 작성 버튼 클릭 이벤트 핸들러 등록
        $('.write-review-btn').on('click', handleReviewButtonClick);
    }

    // 리뷰 작성 버튼 클릭 핸들러
    function handleReviewButtonClick() {
        const orderId = $(this).data('order-id');
        const productName = $(this).data('product-name');
        openModal(orderId, productName);
    }

    // 페이지네이션 렌더링 함수
    function renderPagination(current, total) {
        const paginationContainer = $('#pagination');
        paginationContainer.empty();

        for (let i = 1; i <= total; i++) {
            const pageButton = $(`<button class="page-btn">${i}</button>`);

            if (i === current) {
                pageButton.addClass('active');
            }

            pageButton.on('click', () => {
                currentPage = i;
                fetchMyReviews(decoded.sub, currentPage, rowsPerPage);
            });

            paginationContainer.append(pageButton);
        }
    }

    function openModal(orderId, productName) {
        // 모달 열기
        document.getElementById('reviewModal').style.display = 'flex';

        // 주문 번호와 상품 이름 설정
        document.getElementById('orderIdDisplay').textContent = orderId;
        document.getElementById('productNameDisplay').textContent = productName;

        console.log('리뷰 작성 모달 열림: 주문 번호', orderId, '상품 이름', productName);
    }

    // 페이지네이션 UI 렌더링 및 이벤트 연결
    function renderPagination(currentPage, totalPages) {
        const paginationContainer = $("#paginationContainer");
        paginationContainer.empty(); // 기존 UI 제거

        const pagination = $('<div class="pagination"></div>');
        const maxVisiblePages = 5; // 최대 표시할 페이지 수
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2)); // 시작 페이지
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1); // 끝 페이지

        // '이전' 버튼
        const prevBtn = $('<button class="prev-btn">이전</button>');
        prevBtn.prop('disabled', currentPage === 1); // 현재 페이지가 첫 번째 페이지일 경우 비활성화
        prevBtn.on('click', function () {
            if (currentPage > 1) {
                currentPage--;
                fetchPendingReviews(userId, currentPage, rowsPerPage); // 해당 페이지의 리뷰 리스트를 가져옴
            }
        });
        pagination.append(prevBtn);

        // 페이지 번호 버튼들
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = $('<button class="page-btn" data-page="' + i + '">' + i + '</button>');
            if (i === currentPage) {
                pageButton.addClass('active'); // 현재 페이지에는 'active' 클래스 추가
            }
            pageButton.on('click', function () {
                if (currentPage !== i) {
                    currentPage = i;
                    fetchPendingReviews(userId, currentPage, rowsPerPage); // 해당 페이지의 리뷰 리스트를 가져옴
                }
            });
            pagination.append(pageButton);
        }

        // '다음' 버튼
        const nextBtn = $('<button class="next-btn">다음</button>');
        nextBtn.prop('disabled', currentPage === totalPages); // 현재 페이지가 마지막 페이지일 경우 비활성화
        nextBtn.on('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                fetchPendingReviews(userId, currentPage, rowsPerPage); // 해당 페이지의 리뷰 리스트를 가져옴
            }
        });
        pagination.append(nextBtn);

        // 페이지네이션 컨테이너에 추가
        paginationContainer.append(pagination);
    }
});

function closeModal() {
    document.getElementById('reviewModal').style.display = 'none';
}

