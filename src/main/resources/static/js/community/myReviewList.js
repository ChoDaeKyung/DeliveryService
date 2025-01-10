$(document).ready(function () {
    const rowsPerPage = 10; // 한 페이지당 게시글 수
    let currentPage = 1; // 현재 페이지
    let totalPages = 1; // 총 페이지 수
    let userId;

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
        userId = JSON.stringify(decoded.sub); // 유저 ID
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
                    currentPage = page;
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
                        data-product-name="${review.completeProduct}"
                        data-id="${review.id}">
                        리뷰 보기
                    </button>
                    <button 
                        class="delete-review-btn" 
                        data-id="${review.id}">
                        리뷰 삭제
                    </button>
                </div>
            `;
            reviewContainer.append(reviewItem);
        });

        $('.write-review-btn').on('click', handleReviewButtonClick);
        $('.delete-review-btn').on('click', handleReviewDeleteButtonClick);
    }

    // 리뷰 관련 버튼 클릭 핸들러
    function handleReviewButtonClick() {
        const orderId = $(this).data('order-id');
        const productName = $(this).data('product-name');
        const id = $(this).data('id')
        fetchReviewDetail(id);
    }

    // 리뷰 삭제 버튼 클릭 핸들러
    function handleReviewDeleteButtonClick() {
        const id = $(this).data('id')
        DeleteReview(id);
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
                fetchMyReviews(userId, currentPage, rowsPerPage); // 해당 페이지의 리뷰 리스트를 가져옴
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
                    fetchMyReviews(userId, currentPage, rowsPerPage); // 해당 페이지의 리뷰 리스트를 가져옴
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
                fetchMyReviews(userId, currentPage, rowsPerPage); // 해당 페이지의 리뷰 리스트를 가져옴
            }
        });
        pagination.append(nextBtn);

        // 페이지네이션 컨테이너에 추가
        paginationContainer.append(pagination);
    }


    // 리뷰 상세 정보 가져오기
    function fetchReviewDetail(reviewId) {
        const token = localStorage.getItem("accessToken");
        console.log("Fetching review details for ID:", reviewId);

        $.ajax({
            url: `/webs/api/review/detail`,
            type: 'GET',
            data: {id : reviewId},
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            success: function(detailData) {
                showReviewModal(detailData);
            },
            error: function(xhr, status, error) {
                alert("리뷰 상세 정보를 불러오는데 실패했습니다.");
            }
        });
    }

// 리뷰 모달 표시
    function showReviewModal(reviewData) {
        console.log('reviewData', reviewData);
        const modal = $("#reviewModal");
        const modalAuthor = $("#modalAuthor");
        const modalTitle = $("#modalTitle");
        const modalContent = $("#modalContent");
        const modalDate = $("#modalDate");
        const modalId = $("#modalId");
        const modalRating = $(".modal-rating");
        const sliderContainer = $(".slider-container");

        // 데이터 채우기
        modalAuthor.text(reviewData.authorId.replace(/"/g, ""));
        modalTitle.text(reviewData.title);
        modalContent.text(reviewData.content);
        modalDate.text(reviewData.createdAt);
        modalId.text(`#${reviewData.id}`);
        modalRating.html(renderStars(reviewData.rating));

        // 슬라이더 컨테이너 초기화
        sliderContainer.empty();
        currentImageIndex = 0;

        if (reviewData.img && reviewData.img.length > 0) {
            // 이미지 로딩 상태 추적을 위한 변수
            let loadedImages = 0;

            reviewData.img.forEach((image, index) => {
                const imgWrapper = $('<div class="slider-image-wrapper"></div>');
                const img = $('<img>', {
                    src: image,
                    alt: "Review Image",
                    class: 'slider-image'
                });

                img.on('load', function() {
                    console.log("이미지 로드 성공:", image);
                    loadedImages++;

                    // 모든 이미지가 로드되면 첫 번째 이미지 표시
                    if (loadedImages === reviewData.img.length) {
                        updateSlider();
                    }
                });

                img.on('error', function() {
                    console.error("이미지 로드 실패:", image);
                    loadedImages++;
                });

                imgWrapper.append(img);
                sliderContainer.append(imgWrapper);
            });

            // 슬라이더 버튼 표시 및 이벤트 핸들러 재설정
            const sliderPrevBtn = $(".slider-prev-btn");
            const sliderNextBtn = $(".slider-next-btn");

            if (reviewData.img.length > 1) {
                sliderPrevBtn.show();
                sliderNextBtn.show();
            } else {
                sliderPrevBtn.hide();
                sliderNextBtn.hide();
            }
        } else {
            $(".slider-prev-btn").hide();
            $(".slider-next-btn").hide();
        }

        modal.fadeIn();
    }

// 이미지 슬라이더 업데이트
    function updateSlider() {
        const images = $(".slider-image-wrapper");
        images.hide();
        images.eq(currentImageIndex).show();
    }

// 이미지 슬라이더 이전 버튼
    $(".slider-prev-btn").on("click", function(e) {
        e.stopPropagation();
        const images = $(".slider-image-wrapper");
        if (images.length <= 1) return;

        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateSlider();
    });

// 이미지 슬라이더 다음 버튼
    $(".slider-next-btn").on("click", function(e) {
        e.stopPropagation();
        const images = $(".slider-image-wrapper");
        if (images.length <= 1) return;

        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateSlider();
    });

// 모달 닫기 버튼
    $(".close-modal").on("click", function() {
        $("#reviewModal").fadeOut();
    });

// 모달 외부 클릭시 닫기
    $(window).on("click", function(event) {
        const modal = $("#reviewModal");
        if (event.target === modal[0]) {
            modal.fadeOut();
        }
    });

// 별점 렌더링
    function renderStars(rating) {
        const percentage = (rating / 5) * 100;
        return `
            <div class="star-ratings">
                <div class="star-ratings-fill" style="width: ${percentage}%">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <div class="star-ratings-base">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
            </div>
            <span class="rating-number">${rating}</span>
        `;
    }

    // DELETE 요청 보내기
    function DeleteReview(id) {
        const token = localStorage.getItem("token");
        $.ajax({
            url: '/webs/api/review',
            type: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(id), // 단순 값 전송 (예: 123)
            success: function () {
                alert("리뷰가 삭제되었습니다.");
                $('tr[data-id="' + id + '"]').remove();
                window.location.href = '/mypage/myReviewList';
            },
            error: function (xhr, status, error) {
                console.error("오류 발생:", xhr.responseText);
                alert("리뷰 삭제 중 문제가 발생했습니다.");
            }
        });
    }



});



