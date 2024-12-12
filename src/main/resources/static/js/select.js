$(document).ready(function () {

    getProducts();

    let mainList = {}; // 전체 상품 리스트 저장
    let activeSection = null; // 활성화된 choiceSection 추적 (초기값은 null)
    let sectionCount = 0; // 각 choiceSection에 고유한 ID를 부여하기 위한 카운터
    let activeSectionId = null;

    // "추가주문" 버튼 클릭 이벤트
    $(".addSelect").on("click", function () {
        sectionCount++; // sectionCount 증가

        const newSection = $(`
        <div class="choiceSection choiceSection-${sectionCount}" data-sectionid="${sectionCount}">
            <h4>추가주문 ${sectionCount}</h4>
            <div class="breadSection">Bread :</div>
            <div class="vegetableSection">Vegetable :</div>
            <div class="meatSection">Meat :</div>
            <div class="sourceSection">Source :</div>
            <div class="drinkSection">Drink :</div>
        </div>
        `);

        // 각 모달에 생성된 choiceSection 추가
        $("#breadModal .choiceSectionContainer, #vegetableModal .choiceSectionContainer, #meatModal .choiceSectionContainer, #sourceModal .choiceSectionContainer, #drinkModal .choiceSectionContainer").append(newSection);

        // mainList에 해당 섹션 ID 초기화
        mainList[sectionCount] = [];
    });

    // 활성화된 영역 설정
    function setActiveSection(section) {
        if (activeSection) {
            activeSection.removeClass("active");
        }
        activeSection = section; // 클릭한 section을 activeSection으로 설정
        activeSection.addClass("active");
    }

    // 이벤트 위임 방식으로 choiceSection 클릭 이벤트 설정
    $(document).on("click", ".choiceSection", function () {
        $(".choiceSection").removeClass("active"); // 기존 활성화 제거
        $(this).addClass("active"); // 클릭된 섹션 활성화
        activeSectionId = $(this).data("sectionid"); // 활성화된 섹션 ID 저장
        const sectionId = $(this).data('sectionid'); // 클릭된 choiceSection의 data-sectionId 추출
        console.log("클릭된 sectionId:", sectionId); // sectionId가 정상적으로 출력되는지 확인
        setActiveSection($(this)); // 해당 section을 활성화
        // 선택된 섹션의 데이터 렌더링
        renderSectionData(sectionId);
    });

    function restoreActiveSection() {
        if (activeSectionId !== null) {
            // 저장된 sectionId에 해당하는 choiceSection에 active 클래스 추가
            $(`.choiceSection[data-sectionid="${activeSectionId}"]`).addClass("active");
        }
    }

    // 상품 클릭 이벤트
    $(document).on("click", ".sandwich-item", function () {
        const itemName = $(this).find("h3").text(); // 클릭한 상품 이름
        const category = this.closest(".modal").id.replace("Modal", ""); // 카테고리 추출
        const choiceSection = activeSection; // 현재 활성화된 섹션

        if (!choiceSection) {
            alert("주문란을 선택해주세요.");
            return;
        }

        const sectionId = choiceSection.data("sectionid"); // 활성화된 섹션 ID
        const isSelected = $(this).hasClass("selected"); // 선택 여부 확인
        if (isSelected) {
            // 선택 해제
            $(this).removeClass("selected");
            mainList[sectionId] = mainList[sectionId].filter(
                item => item.name !== itemName || item.category !== category
            );
        } else {
            // 선택 추가
            $(this).addClass("selected");
            if (!mainList[sectionId]) {
                mainList[sectionId] = [];
            }
            mainList[sectionId].push({
                name: itemName,
                category: category,
                price: 1, // 가격 임시 값
            });
        }

        renderSectionData(sectionId);

        console.log("mainList", mainList);
    });

// renderSectionData 함수 개선
    function renderSectionData(sectionId) {
        const choiceSection = $(`.choiceSection[data-sectionid="${sectionId}"]`);
        const items = mainList[sectionId] || [];

        // 모든 카테고리 섹션 초기화
        choiceSection.find(".breadSection, .vegetableSection, .meatSection, .sourceSection, .drinkSection").each(function () {
            const category = $(this).attr('class').replace('Section', ''); // bread, vegetable 등 카테고리 추출
            $(this).html(`${category.charAt(0).toUpperCase() + category.slice(1)} :`); // 기본 텍스트 유지
        });

        // 각 아이템 렌더링
        items.forEach(item => {
            const choiceHTML = `
        <div class="choice-item" data-name="${item.name}" data-category="${item.category}">
            ${item.name}
        </div>`;
            choiceSection.find(`.${item.category}Section`).append(choiceHTML); // 기본 텍스트 뒤에 추가
        });

        // 선택 상태를 상품에 반영
        $(".sandwich-item").each(function () {
            const itemName = $(this).find("h3").text();
            const itemCategory = this.closest(".modal").id.replace("Modal", ""); // 카테고리 추출
            const isSelected = items.some(
                item => item.name === itemName && item.category === itemCategory
            );

            if (isSelected) {
                $(this).addClass("selected");
            } else {
                $(this).removeClass("selected");
            }
        });
    }

    const breadModal = document.getElementById("breadModal");
    const vegetableModal = document.getElementById("vegetableModal");
    const meatModal = document.getElementById("meatModal");
    const sourceModal = document.getElementById("sourceModal");
    const drinkModal = document.getElementById("drinkModal");
    const closeBreadButton = document.querySelector("#breadClose");
    const closeVegetableButton = document.querySelector("#vegetableClose");
    const closeMeatButton = document.querySelector("#meatClose");
    const closeSourceButton = document.querySelector("#sourceClose");
    const closeDrinkButton = document.querySelector("#drinkClose");

    function clearModalState() {
        $(".sandwich-item").removeClass("selected"); // 선택된 상품 초기화
        mainList = {}; // mainList 초기화

        // 각 choiceSection에서 상품 초기화
        $(".choiceSection").each(function () {
            $(this).find(".breadSection, .vegetableSection, .meatSection, .sourceSection, .drinkSection").html(function() {
                const category = $(this).attr('class').replace('Section', '');
                return `${category.charAt(0).toUpperCase() + category.slice(1)} :`; // 기본 텍스트로 초기화
            });
        });
    }

    function activateDefaultSection() {
        // modal이 열리면 자동으로 sectionId=0을 클릭하도록 설정
        const defaultSection = $(".choiceSection[data-sectionid='0']");
        if (defaultSection.length) {
            defaultSection.trigger("click"); // 클릭 이벤트를 트리거
            defaultSection.addClass("active"); // 직접 'active' 클래스 추가
            setActiveSection(defaultSection);  // setActiveSection에서 스타일 추가
        }
    }

    $("#breadSelect").on("click", function () {
        breadModal.style.display = "block";
        activateDefaultSection();
    });

    $(".gotoBreadModal").on("click", function () {
            vegetableModal.style.display = "none";
            breadModal.style.display = "block";
        if (activeSection) {
            const sectionId = activeSection.data("sectionid");
            renderSectionData(sectionId);
        }
        restoreActiveSection();
    });

    $(".gotoVegetableModal").on("click", function () {
        if(breadModal.style.display === "block") {
            breadModal.style.display = "none";
            vegetableModal.style.display = "block";
        }else if(meatModal.style.display === "block") {
            meatModal.style.display = "none";
            vegetableModal.style.display = "block";
        }
        if (activeSection) {
            const sectionId = activeSection.data("sectionid");
            renderSectionData(sectionId);
        }
        restoreActiveSection();
    });

    $(".gotoMeatModal").on("click", function () {
        if(vegetableModal.style.display === "block") {
            vegetableModal.style.display = "none";
            meatModal.style.display = "block";
        }else if(sourceModal.style.display === "block") {
            sourceModal.style.display = "none";
            meatModal.style.display = "block";
        }
        if (activeSection) {
            const sectionId = activeSection.data("sectionid");
            renderSectionData(sectionId);
        }
        restoreActiveSection();
    });

    $(".gotoSourceModal").on("click", function () {
        if(meatModal.style.display === "block") {
            meatModal.style.display = "none";
            sourceModal.style.display = "block";
        }else if(drinkModal.style.display === "block") {
            drinkModal.style.display = "none";
            sourceModal.style.display = "block";
        }
        if (activeSection) {
            const sectionId = activeSection.data("sectionid");
            renderSectionData(sectionId);
        }
        restoreActiveSection();
    });

    $(".gotoDrinkModal").on("click", function () {
            sourceModal.style.display = "none";
            drinkModal.style.display = "block";
        if (activeSection) {
            const sectionId = activeSection.data("sectionid");
            renderSectionData(sectionId);
        }
        restoreActiveSection();
    });

    $("#vegetableSelect").on("click", function () {
        vegetableModal.style.display = "block";
        activateDefaultSection();
    });

    $("#meatSelect").on("click", function () {
        meatModal.style.display = "block";
        activateDefaultSection();
    });

    $("#sourceSelect").on("click", function () {
        sourceModal.style.display = "block";
        activateDefaultSection();
    });

    $("#drinkSelect").on("click", function () {
        drinkModal.style.display = "block";
        activateDefaultSection();
    });

    closeBreadButton.addEventListener("click", function () {
        clearModalState();
        breadModal.style.display = "none";
    });

    closeVegetableButton.addEventListener("click", function () {
        clearModalState();
        vegetableModal.style.display = "none";
    });

    closeMeatButton.addEventListener("click", function () {
        clearModalState();
        meatModal.style.display = "none";
    });

    closeSourceButton.addEventListener("click", function () {
        clearModalState();
        sourceModal.style.display = "none";
    });

    closeDrinkButton.addEventListener("click", function () {
        clearModalState();
        drinkModal.style.display = "none";
    });

    $('.selectOrder').on('click', function () {
        alert('hi');

        // 모든 sectionId에 해당하는 모든 상품들의 가격 합을 계산
        const totalPrice = Object.values(mainList).flat().reduce((sum, product) => sum + parseInt(product.price, 10), 0);

        // 현재 날짜와 시간을 ISO 형식으로 생성하여 orderId에 사용
        const orderId = new Date().toISOString() + 'buyer';

        // mainList를 List<List> 형태로 변환
        const productsList = Object.keys(mainList).map(sectionId => {
            const sectionItems = mainList[sectionId]; // 각 섹션의 상품들

            // 각 섹션의 아이템들에 대해 필요한 데이터를 반환
            return sectionItems.map((item, index) => ({
                name: item.name,
                category: item.category,
                price: parseInt(item.price, 10),
                sectionId: sectionId,
                buyer: 'buyer'
            }));
        });

        // AJAX 요청 보내기
        $.ajax({
            type: "POST",
            url: "/webs/api/select",
            data: JSON.stringify({
                productsList: productsList,
                completeProduct: '나만의 샌드위치',
                totalPrice: totalPrice,
                orderId: new Date().toISOString() + 'buyer'
            }),
            contentType: 'application/json',
            success: function (response) {
                mainList = {};  // 성공적으로 전송된 후 mainList 초기화
                alert('success');
                console.log('response', response);
            },
            error: function (error) {
                console.error('오류 발생:', error);
                alert('error');
            }
        });
    });

});

function showSection(sectionId) {
    location.href='/main?sectionId=' + sectionId
}

let getProducts = () => {
    $.ajax({
        url: '/webs/api/select',
        type: 'GET',
        success: function (response) {
            console.log('response :: ', response);

            // 카테고리와 모달 ID 매핑
            const categories = {
                drink: '#drinkModal',
                meat: '#meatModal',
                source: '#sourceModal',
                vegetable: '#vegetableModal',
                bread: '#breadModal'
            };

            // 각 카테고리에 해당하는 DOM ID 초기화
            for (let category in categories) {
                const modalContainer = $(categories[category]).find('.sandwich-container');
                modalContainer.empty(); // 기존 상품 목록 비우기
            }

            // 응답 데이터를 카테고리별로 처리
            response.forEach(product => {
                const categoryContainer = categories[product.category];
                if (categoryContainer) {
                    const productHtml = `
                        <div class="sandwich-item">
                            <img src="${product.image}" alt="${product.name}" class="sandwich-image">
                            <div class="sandwich-text">
                                <h3>${product.name}</h3>
                                <p>${product.price}원</p>
                            </div>
                        </div>`;
                    $(categoryContainer).find('.sandwich-container').append(productHtml);
                }
            });
        },
        error: function (error) {
            console.error("Error fetching product data:", error);
        }
    });
};