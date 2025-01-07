$(document).ready(function () {
    const rowsPerPage = 10;
    let currentPage = 1;
    let totalPages = 1;
    let currentImageIndex = 0;

    // 초기 데이터 로드
    fetchReviewList();



    // 페이지네이션 렌더링
    function renderPagination(currentPage, totalPages) {
        const paginationContainer = $("#paginationContainer");
        paginationContainer.empty();

        const pagination = $('<div class="pagination"></div>');
        const maxVisiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        const prevBtn = $('<button class="prev-btn">이전</button>');
        prevBtn.prop('disabled', currentPage === 1);
        prevBtn.on('click', function () {
            if (currentPage > 1) {
                currentPage--;
                fetchReviewList(currentPage);
            }
        });
        pagination.append(prevBtn);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = $('<button class="page-btn" data-page="' + i + '">' + i + '</button>');
            if (i === currentPage) {
                pageButton.addClass('active');
            }
            pageButton.on('click', function () {
                if (currentPage !== i) {
                    currentPage = i;
                    fetchReviewList(currentPage);
                }
            });
            pagination.append(pageButton);
        }

        const nextBtn = $('<button class="next-btn">다음</button>');
        nextBtn.prop('disabled', currentPage === totalPages);
        nextBtn.on('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                fetchReviewList(currentPage);
            }
        });
        pagination.append(nextBtn);

        paginationContainer.append(pagination);
    }

    // 리뷰 목록 가져오기
    function fetchReviewList(page = 1, pageSize = 8) {
        const token = localStorage.getItem("accessToken");

        $.ajax({
            url: '/webs/api/review',
            type: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (data) {
                if (data && data.reviewList) {
                    renderReviewList(data);
                    renderPagination(data.page, data.allPage);
                } else {
                    alert("데이터를 불러오는 중 문제가 발생했습니다.");
                }
            },
            error: function (xhr, status, error) {
                alert("리뷰를 가져오는 데 실패했습니다.");
            }
        });
    }

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

    // 리뷰 목록 렌더링
    function renderReviewList(reviewListDTO) {
        const reviewContainer = $("#reviewContainer");
        reviewContainer.empty();

        const cardContainer = $('<div class="review-grid"></div>');

        reviewListDTO.reviewList.forEach(review => {
            const card = $(`
                <div class="review-card" data-id="${review.id}">
                    <div class="review-header">
                        <div class="review-author">
                            <i class="fa fa-user-circle"></i>
                            <span>${review.authorId.replace(/"/g, "")}</span>
                        </div>
                        <div class="review-rating">
                            ${renderStars(review.rating)}
                        </div>
                    </div>
                    <div class="review-body">
                        <h3 class="review-title">${review.title}</h3>
                        <div class="review-content">${review.content || '내용이 없음'}</div>
                    </div>
                    <div class="review-footer">
                        <div class="review-id">#${review.id}</div>
                        <div class="review-date">${review.createdAt || '날짜 정보 없음'}</div>
                    </div>
                </div>
            `);

            card.on("click", function() {
                fetchReviewDetail(review.id);
            });

            cardContainer.append(card);
        });

        reviewContainer.append(cardContainer);
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
});

// drawStar 함수
const drawStar = (target) => {
    // input range 값에 맞게 별 색상 조정
    const ratingValue = target.value;
    document.querySelector('.star span').style.width = `${ratingValue * 10}%`; // 5점을 100%로 맞추기 위해 10%로 곱함
    rating = parseFloat(ratingValue) / 2; // rating 값 업데이트
    console.log('현재 별점:', rating);
}

// JWT 디코딩 함수
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

// 리뷰 생성 함수
let createReview = () => {
    console.log('reviewcreate 함수 호출됨');
    let title = $('#title').val();
    let content = $('#content').val();
    // 제목, 내용, 별점 필수 입력 체크
    if (!title || !content || rating === 0) {
        alert('제목, 내용, 별점은 모두 필수 입력 항목입니다!');
        return;
    }
    // JWT 토큰을 로컬스토리지에서 가져옴
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
        alert("유효하지 않은 토큰입니다.");
        return;
    }
    let formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('rating', rating); // 별점 값 추가
    formData.append('userId', userId); // userId 추가
    let files = $('#image')[0].files;
    if (files.length > 0) {
        Array.from(files).forEach((file, index) => {
            formData.append('images', file); // 여러 이미지 추가
        });
    }
    $.ajax({
        method: 'POST',
        url: '/webs/api/review',
        data: formData,
        processData: false,  // jQuery가 데이터를 처리하지 않도록 설정
        contentType: false,  // jQuery가 contentType을 자동으로 설정하도록 설정
        enctype: 'multipart/form-data', // 추가 설정
        success: (response) => {
            console.log('formDate :: ', formData);
            console.log('response :: ', response);
            alert('리뷰가 성공적으로 생성되었습니다.');
            window.location.href = '/review';
        },
        error: (xhr) => {
            console.log('formDate :: ', formData);
            if (xhr.status === 419) {
                handleTokenExpiration();
                alert('다시 한번 시도해주세요.');
            } else {
                console.error('요청 오류 발생:', xhr);
                alert('리뷰 생성 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    });
};
// 리뷰 수정
const updateReview = () => {
    let title = $('#title').val();
    let content = $('#content').val();
    let rating = $('#rating').val();
    let files = $('#image')[0].files;
    let reviewId = $('#reviewId').val();

    let formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('rating', rating);
    formData.append('reviewId', reviewId);

    if (files.length > 0) {
        Array.from(files).forEach((file, index) => {
            formData.append('images', file);
        });
    }

    $.ajax({
        method: 'PUT',
        url: '/webs/api/review',
        data: formData,
        processData: false,
        contentType: false,
        success: (response) => {
            alert('리뷰가 성공적으로 수정되었습니다.');
            window.location.href = '/review';
        },
        error: (xhr) => {
            if (xhr.status === 419) {
                handleTokenExpiration();
                alert('다시 한번 시도해주세요.');
            } else {
                console.error('요청 오류 발생:', xhr);
                alert('리뷰 수정 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    });
};