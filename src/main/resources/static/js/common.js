window.addEventListener('scroll', function () {
    const menu = document.getElementById('menuList'); // 메뉴를 가져옴
    const triggerPoint = 155; // 메뉴가 스크롤로 고정될 지점(px 단위)

    if (window.scrollY >= triggerPoint) {
        menu.classList.add('fixed'); // 고정 클래스 추가
    } else {
        menu.classList.remove('fixed'); // 고정 클래스 제거
    }
});

window.addEventListener('scroll', function () {
    const menubackground = document.getElementById('menubackground'); // 메뉴를 가져옴
    const triggerPoint = 155; // 메뉴가 스크롤로 고정될 지점(px 단위)

    if (window.scrollY >= triggerPoint) {
        menubackground.classList.add('fixed'); // 고정 클래스 추가
    } else {
        menubackground.classList.remove('fixed'); // 고정 클래스 제거
    }
});