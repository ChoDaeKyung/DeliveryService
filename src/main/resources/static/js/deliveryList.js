
    $(document).ready(function () {
    let interval = null;

    // 모달 열기
    window.openModal = function (userId) {
    $('#modal').fadeIn(); // 모달 열기

    // 기존 반복 요청 정리
    if (interval) {
    clearInterval(interval);
}

    // 5초마다 데이터 요청
    interval = setInterval(function () {
    $.ajax({
    url: '/orderList/receiveUserIdMessages',
    type: 'GET',
    data: { userId: userId },
    success: function (data) {
    console.log('받은 데이터:', data);

    // 데이터를 모달에 표시
    if (data && data.length > 0) {
    const messages = data.map(item => `<p>주문 번호: ${item.orderId}, 메시지: ${item.messageBody}</p>`).join('');
    $('#modalContent').html(messages);
} else {
    $('#modalContent').html('<p>새로운 메시지가 없습니다.</p>');
}
},
    error: function () {
    console.error('데이터를 가져오는 데 실패했습니다.');
    $('#modalContent').html('<p>데이터를 가져오는 중 오류가 발생했습니다.</p>');
},
});
}, 5000); // 5초마다 실행
};

    // 모달 닫기
    $('#closeModal').on('click', function () {
    $('#modal').fadeOut(); // 모달 닫기
    if (interval) {
    clearInterval(interval); // 반복 요청 중단
}
});
});

