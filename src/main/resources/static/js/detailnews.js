$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search); // URL 쿼리 파라미터 읽기
    const newsId = urlParams.get('id'); // 'id' 파라미터 추출
    console.log("newsId:", newsId); // 디버깅용

    if (newsId) {
        fetchNewsDetails(newsId); // ID로 뉴스 세부 정보 요청
    } else {
        alert("올바르지 않은 접근입니다.");
    }
});

function fetchNewsDetails(newsId) {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 인증 토큰 가져오기
    const url = `/webs/api/news/detail`;

    console.log("Fetching news details for ID:", newsId); // 디버깅용

    $.ajax({
        url: url,
        type: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        data: { id: newsId },
        success: function (data) {
            console.log('News Details:', data);

            // 데이터 검증
            if (data && data.title && data.content) {
                $("#newsTitle").text(data.title); // 제목 업데이트
                $("#newsContent").text(data.content); // 내용 업데이트

                // 이미지가 있을 경우, 이미지 추가
                if (data.img) {
                    const imageHtml = `<img src="${data.img}" alt="News Image" class="news-image">`;
                    $("#newsImageContainer").html(imageHtml); // #newsImageContainer에 이미지 추가
                } else {
                    console.log("No image available for this news item.");
                }
            } else {
                alert("서버로부터 유효하지 않은 데이터를 수신했습니다.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching news details:", error);
            alert("뉴스 데이터를 불러오는 데 실패했습니다.");
        }
    });
}





