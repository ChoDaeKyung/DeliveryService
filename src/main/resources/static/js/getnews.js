$(document).ready(function () {
    const rowsPerPage = 10; // 한 페이지당 게시글 수
    let currentPage = 1; // 현재 페이지
    let totalPages = 1; // 총 페이지 수
    let isCheckboxVisible = false; // 체크박스 상태 (기본값: 숨김)

    // 뉴스 리스트를 가져오는 함수 (API 호출)
    function fetchNewsList(page = 1, pageSize = 10) {
        const token = localStorage.getItem("token"); // 로컬 스토리지에서 인증 토큰 가져오기
        const url = '/webs/api/news';

        if (showSection('news')) {
            currentPage = 1;
        }

        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function(data) {
                if (data && data.newsList) {
                    renderNewsList(data);
                    renderPagination(data.page, data.allPage);
                } else {
                    alert("데이터를 불러오는 중 문제가 발생했습니다.");
                }
            },
            error: function(xhr, status, error) {
                alert("뉴스를 가져오는 데 실패했습니다.");
            }
        });
    }

    // 뉴스 리스트를 화면에 렌더링하는 함수
    function renderNewsList(newsListDTO) {
        const newsContainer = $("#newsContainer");
        newsContainer.empty(); // 기존 컨텐츠 초기화

        // 테이블 생성
        const table = $('<table class="news-table">')
            .append('<thead><tr><th class="checkbox-column" style="display: ' + (isCheckboxVisible ? 'table-cell' : 'none') + '">선택</th><th>ID</th><th>제목</th><th>작성자</th><th>작성일</th></tr></thead>')
            .append('<tbody></tbody>');

        const tbody = table.find("tbody");

        // 뉴스 데이터 추가
        newsListDTO.newsList.forEach(news => {
            const row = $('<tr data-id="' + news.id + '">')
                .append('<td class="checkbox-column" style="display: ' + (isCheckboxVisible ? 'table-cell' : 'none') + '"><input type="checkbox" class="delete-checkbox"></td>')
                .append('<td>' + news.id + '</td>')
                .append('<td>' + news.title + '</td>')
                .append('<td>' + news.authorId + '</td>')
                .append('<td>' + new Date(news.createdAt).toLocaleString() + '</td>');

            // 클릭 이벤트 추가 (체크박스 제외)
            row.find('td:not(.checkbox-column)').on("click", function () {
                location.href = '/news/detail?id=' + news.id;
            });

            tbody.append(row);
        });

        newsContainer.append(table); // 테이블 렌더링

        totalPages = newsListDTO.allPage; // 총 페이지 수 업데이트
    }

    // 선택 삭제 버튼 클릭 이벤트
    $("#toggleCheckboxes").on("click", function () {
        isCheckboxVisible = !isCheckboxVisible; // 상태 토글
        $(".checkbox-column").css("display", isCheckboxVisible ? "table-cell" : "none"); // 체크박스 열 표시/숨김

        if (isCheckboxVisible) {
            $(this).text("삭제 취소"); // 버튼 텍스트 변경
            $("#executeDelete").show(); // "삭제 실행" 버튼 표시
        } else {
            $(this).text("선택 삭제");
            $("#executeDelete").hide(); // "삭제 실행" 버튼 숨김
            $(".delete-checkbox:checked").prop("checked", false); // 체크박스 초기화
        }
    });

    // 삭제 실행 버튼 클릭 이벤트
    $("#executeDelete").on("click", function () {
        const selectedIds = [];
        $('.delete-checkbox:checked').each(function () {
            const id = $(this).closest('tr').data('id');
            selectedIds.push(id);
        });

        if (selectedIds.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }

        if (!confirm("선택한 뉴스를 삭제하시겠습니까?")) {
            return;
        }

        // DELETE 요청 보내기
        const token = localStorage.getItem("token");
        $.ajax({
            url: '/webs/api/news',
            type: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(selectedIds), // 배열 데이터를 JSON으로 전송
            success: function () {
                alert("선택한 뉴스가 삭제되었습니다.");
                selectedIds.forEach(id => {
                    $('tr[data-id="' + id + '"]').remove();
                });
                fetchNewsList(currentPage);
            },
            error: function (xhr, status, error) {
                alert("뉴스 삭제 중 문제가 발생했습니다.");
            }
        });

        // 상태 초기화
        isCheckboxVisible = false;
        $(".checkbox-column").css("display", "none");
        $("#toggleCheckboxes").text("선택 삭제");
        $("#executeDelete").hide();
        $(".delete-checkbox:checked").prop("checked", false);
    });

    // 선택 수정 버튼 클릭 이벤트
    $("#updateCheckboxes").on("click", function () {
        isCheckboxVisible = !isCheckboxVisible; // 상태 토글
        $(".checkbox-column").css("display", isCheckboxVisible ? "table-cell" : "none"); // 체크박스 열 표시/숨김

        if (isCheckboxVisible) {
            $(this).text("수정 취소"); // 버튼 텍스트 변경
            $("#executeUpdate").show(); // "수정 실행" 버튼 표시
        } else {
            $(this).text("선택 수정");
            $("#executeUpdate").hide(); // "수정 실행" 버튼 숨김
            $(".delete-checkbox:checked").prop("checked", false); // 체크박스 초기화
        }
    });

    // 수정 실행 버튼 클릭 이벤트 (단, 수정할 항목은 하나만 선택 가능)
    $("#executeUpdate").on("click", function () {
        const selectedIds = [];
        $('.delete-checkbox:checked').each(function () {
            const id = $(this).closest('tr').data('id');
            selectedIds.push(id);
        });

        if (selectedIds.length === 0) {
            alert("수정할 항목을 선택해주세요.");
            return;
        } else if (selectedIds.length > 1) {
            alert("수정은 한 항목만 선택 가능합니다.");
            return;
        }

        // 수정할 뉴스 ID 가져오기
        const newsId = selectedIds[0];

        // 수정 페이지로 이동
        location.href = '/news/update?id=' + newsId;
    });

    // 페이지네이션 UI 렌더링 및 이벤트 연결
    function renderPagination(currentPage, totalPages) {
        const paginationContainer = $("#paginationContainer");
        paginationContainer.empty(); // 기존 UI 제거

        const pagination = $('<div class="pagination"></div>');
        const maxVisiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        const prevBtn = $('<button class="prev-btn">이전</button>');
        prevBtn.prop('disabled', currentPage === 1);
        prevBtn.on('click', function () {
            if (currentPage > 1) {
                currentPage--;
                fetchNewsList(currentPage);
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
                    fetchNewsList(currentPage);
                }
            });
            pagination.append(pageButton);
        }

        const nextBtn = $('<button class="next-btn">다음</button>');
        nextBtn.prop('disabled', currentPage === totalPages);
        nextBtn.on('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                fetchNewsList(currentPage);
            }
        });
        pagination.append(nextBtn);

        paginationContainer.append(pagination);
    }

    // 초기 데이터 로드
    fetchNewsList(); // 초기 데이터 로드
});
