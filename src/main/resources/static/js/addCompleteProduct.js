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
                &nbsp${item.name}&nbsp
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

        updateAddProductsField();
    }

    function updateAddProductsField() {
        const totalPrice = Object.values(mainList).flat().reduce((sum, product) => sum + parseInt(product.price, 10), 0);

        // 각 카테고리의 이름을 정의
        const categoryNames = {
            bread: "빵",
            vegetable: "채소",
            meat: "고기",
            source: "소스",
            drink: "음료"
        };

        // mainList의 상품을 카테고리별로 그룹화
        const groupedProducts = mainList.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item.name);
            return acc;
        }, {});

        // 문자열 조합 (각 줄마다 카테고리와 상품 출력)
        let outputString = "";
        for (let category in groupedProducts) {
            const categoryName = categoryNames[category] || category; // 한글 이름 매칭
            const items = groupedProducts[category].join(", "); // 해당 카테고리 상품 조합
            outputString += `${categoryName}: ${items}\n`; // 줄바꿈 추가
        }

        // 총 가격 줄 추가
        outputString += `\n총 가격: ${totalPrice}원`;

        // 결과를 #addproducts 입력 필드에 출력
        const textarea = $("#addproducts");
        textarea.val(outputString.trim());

        // 높이를 텍스트 내용에 맞게 조절
        adjustTextareaHeight(textarea);
    }

    function adjustTextareaHeight(textarea) {
        // 높이를 초기화한 후 scrollHeight에 맞게 조절
        textarea.css('height', 'auto');
        textarea.css('height', textarea.prop('scrollHeight') + 'px');
    }

// 초기화 시 이벤트 리스너
    $(document).ready(function () {
        const textarea = $("#addproducts");

        // 입력 필드에 변화가 있을 때 높이 조절
        textarea.on('input', function () {
            adjustTextareaHeight($(this));
        });

        // 페이지 로딩 시에도 높이 초기화
        adjustTextareaHeight(textarea);
    });

    document.addEventListener('DOMContentLoaded', function () {
        const textarea = document.getElementById('addproducts');

        // 초기 높이 설정 (텍스트 초기화 상태에서 정확히 한 줄로 설정)
        textarea.style.overflow = 'hidden';
        textarea.style.height = 'auto';

        function adjustTextareaHeight() {
            // 높이 초기화 후 스크롤 높이 반영
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }

        // 입력 시마다 높이 조절
        textarea.addEventListener('input', adjustTextareaHeight);

        // 폰트, 패딩 등에 따라 초기 한 줄 높이 반영
        adjustTextareaHeight();
    });

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

    const breadModal = document.getElementById("breadModal");
    const vegetableModal = document.getElementById("vegetableModal");
    const meatModal = document.getElementById("meatModal");
    const sourceModal = document.getElementById("sourceModal");
    const drinkModal = document.getElementById("drinkModal");
    const addproductsModal = document.getElementById("addproductsModal");
    const closeBreadButton = document.querySelector("#breadClose");
    const closeVegetableButton = document.querySelector("#vegetableClose");
    const closeMeatButton = document.querySelector("#meatClose");
    const closeSourceButton = document.querySelector("#sourceClose");
    const closeDrinkButton = document.querySelector("#drinkClose");
    const closeaddproductsButton = document.querySelector("#addproductsClose");

    function activateDefaultSection() {
        // modal이 열리면 자동으로 sectionId=0을 클릭하도록 설정
        const defaultSection = $(".choiceSection[data-sectionid='0']");
        if (defaultSection.length) {
            defaultSection.trigger("click"); // 클릭 이벤트를 트리거
            defaultSection.addClass("active"); // 직접 'active' 클래스 추가
            setActiveSection(defaultSection);  // setActiveSection에서 스타일 추가
        }
    }



    $(".completeaddproducts").on("click", function () {
        breadModal.style.display = "none";
        vegetableModal.style.display = "none";
        meatModal.style.display = "none";
        sourceModal.style.display = "none";
        drinkModal.style.display = "none";
        addproductsModal.style.display = "none";
    });


    $("#addproducts").on("click", function () {
        addproductsModal.style.display = "block";
    });

    $("#breadSelect").on("click", function () {
        breadModal.style.display = "block";
        activateDefaultSection();
    });

    $(".gotoBreadModal").on("click", function () {
        vegetableModal.style.display = "none";
        breadModal.style.display = "block";
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
        breadModal.style.display = "none";
    });

    closeVegetableButton.addEventListener("click", function () {
        vegetableModal.style.display = "none";
    });

    closeMeatButton.addEventListener("click", function () {
        meatModal.style.display = "none";
    });

    closeSourceButton.addEventListener("click", function () {
        sourceModal.style.display = "none";
    });

    closeDrinkButton.addEventListener("click", function () {
        drinkModal.style.display = "none";
    });


    closeaddproductsButton.addEventListener("click", function () {
        addproductsModal.style.display = "none";
    });

    $('.addcompleteproduct').on('click', function () {
        // 모든 sectionId에 해당하는 모든 상품들의 가격 합을 계산

        const name = $("input[placeholder='상품명을 입력해주세요']").val(); // 상품명
        const detail = $("textarea[placeholder='상품 설명을 입력해주세요']").val(); // 상품 설명
        const price = parseInt($("input[placeholder='가격을 입력해주세요']").val(), 10); // 가격

        const fileInput = $("#productImage")[0]; // 파일 input 요소
        const file = fileInput.files[0]; // 선택된 첫 번째 파일

        // FormData 객체 생성
        let formData = new FormData();

        // 폼 데이터에 추가
        formData.append("name", name);
        formData.append("price", price);
        formData.append("detail", detail);
        formData.append("productsList", JSON.stringify(mainList));  // 이미 존재하는 구성품 리스트
        formData.append("image", file);  // 이미지 파일 추가

        console.log('formData :: ', formData)

        // AJAX 요청 보내기
        $.ajax({
            type: "POST",
            url: "/webs/api/admin/addcompleteproducts",
            data: formData,
            processData: false, // 파일을 FormData로 전송 시 필수 (jQuery가 자동으로 처리하지 않도록 설정)
            contentType: false, // 파일 전송 시 content-type을 자동으로 설정하지 않도록 설정
            success: function (response) {
                if (response === "success") {
                    alert("장바구니 담기에 성공하셨습니다!");
                } else {
                    alert("장바구니 담기에 실패하였습니다.");
                }
            },
            error: function (xhr, status, error) {
                console.error("에러 발생:", error); // 에러 디버깅
                alert("서버와 통신 중 문제가 발생했습니다.");
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

