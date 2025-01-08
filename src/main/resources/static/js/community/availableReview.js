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
let createReview = (orderId, productName) => {
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