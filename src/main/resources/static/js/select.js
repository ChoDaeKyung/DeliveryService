$(document).ready(function () {

    getProducts();

    let mainList = []; // 전체 상품 리스트 저장

    // 상품 클릭 이벤트
    $(document).on("click", ".sandwich-item", function () {
        const itemName = $(this).find("h3").text();
        const price = $(this).find("p").text();
        const category = this.closest(".modal").id.replace("Modal", "");

        const isSelected = $(this).hasClass("selected");
        if (isSelected) {
            $(this).removeClass("selected");
            mainList = mainList.filter(
                item => item.name !== itemName || item.category !== category || item.price !== price
            );
        } else {
            $(this).addClass("selected");
            mainList.push({ name: itemName, category: category, price: price });
        }

        renderSectionData();
        console.log("mainList", mainList);
    });

    function renderSectionData() {
        const choiceSection = $(".choiceSection");
        const items = mainList;

        // 초기화
        choiceSection.find(".breadSection, .vegetableSection, .meatSection, .sourceSection, .drinkSection").html(function () {
            const category = $(this).attr("class").replace("Section", "");
            return `${category.charAt(0).toUpperCase() + category.slice(1)} :`;
        });

        // 렌더링
        items.forEach(item => {
            const choiceHTML = `
            <div class="choice-item" data-name="${item.name}" data-category="${item.category}">
                ${item.name}
            </div>`;
            choiceSection.find(`.${item.category}Section`).append(choiceHTML);
        });

        // 선택 상태 반영
        $(".sandwich-item").each(function () {
            const itemName = $(this).find("h3").text();
            const itemCategory = this.closest(".modal").id.replace("Modal", "");
            const isSelected = items.some(item => item.name === itemName && item.category === itemCategory);

            $(this).toggleClass("selected", isSelected);
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
        mainList = []; // mainList를 빈 배열로 초기화

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

        const productsList = Object.values(mainList).flat().map(item => ({
            name: item.name,
            category: item.category,
            price: parseInt(item.price, 10),
            buyer: 'buyer',
        }));

        // AJAX 요청 보내기
        $.ajax({
            type: "POST",
            url: "/webs/api/cart",
            data: JSON.stringify({
                productsList: productsList,
                name: '나만의 샌드위치',
                totalPrice: totalPrice,
                buyer:'buyer',
                productId: new Date().toISOString() + 'buyer'
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

})

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
