$(document).ready(function () {

    $("#productImage").on("change", function (event) {
        const file = event.target.files[0]; // 선택한 파일 가져오기

        if (file) {
            const reader = new FileReader(); // FileReader 객체 생성

            // 파일 읽기 완료 시 이벤트
            reader.onload = function (e) {
                // 미리보기 이미지 업데이트
                $("#previewImage").attr("src", e.target.result);
                $("#previewImage").css("display", "block");

                // 라벨 숨기기
                $("#imageLabel").css("display", "none");
                $("#updateimageLabel").css("display", "display");
            };

            // 파일 읽기 시작
            reader.readAsDataURL(file);
        } else {
            // 파일이 선택되지 않았을 때 처리
            $("#previewImage").attr("src", "#");
            $("#previewImage").css("display", "none");

            // 라벨 다시 표시
            $("#imageLabel").css("display", "block");
            $("#updateimageLabel").css("display", "none");
        }
    });

    $('.addSideMenu').on('click', function () {
        // 모든 sectionId에 해당하는 모든 상품들의 가격 합을 계산

        const name = $("input[placeholder='상품명을 입력해주세요']").val(); // 상품명
        const category = $("select[id=categorySelect]").val();
        const detail = $("textarea[placeholder='상품 설명을 입력해주세요']").val(); // 상품 설명
        if(category === '' || category === null){
            alert('상품 종류를 선택해주세요.')
            return;
        }
        const price = parseInt($("input[placeholder='가격을 입력해주세요']").val(), 10); // 가격

        const fileInput = $("#productImage")[0]; // 파일 input 요소
        const file = fileInput.files[0]; // 선택된 첫 번째 파일

        // FormData 객체 생성
        let formData = new FormData();

        // 폼 데이터에 추가
        formData.append("name", name);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("detail", detail);
        formData.append("image", file);  // 이미지 파일 추가

        console.log('formData :: ', formData)

        // AJAX 요청 보내기
        $.ajax({
            url: '/webs/api/admin/addsidemenu',
            method: 'POST',
            data: formData,
            processData: false, // 파일을 FormData로 전송 시 필수 (jQuery가 자동으로 처리하지 않도록 설정)
            contentType: false, // 파일 전송 시 content-type을 자동으로 설정하지 않도록 설정
            success: function (response) {
                console.log("Response received:", response);
                if(response === "success") {
                    alert("장바구니 담기에 성공하셨습니다!");
                }
            },
            error: function (xhr, status, error) {
                console.error("에러 발생:", error); // 에러 디버깅
                alert("서버와 통신 중 문제가 발생했습니다.");
            }
        });
    });
})


