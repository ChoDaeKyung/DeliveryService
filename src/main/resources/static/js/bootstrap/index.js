$(document).ready(function () {

    getProducts();

    // 페이지가 로드되면 메뉴 데이터를 가져옴
    $.ajax({
        url: '/webs/api/menu', // 서버에서 메뉴 목록을 가져오는 API URL
        method: 'GET',
        dataType: 'json', // 응답 데이터 타입은 JSON
        success: function(data) {
            console.log('data :: ', data);

            // 동적으로 추가할 상품들만 관리하기 위해 기본 상품을 제외하고 나머지를 초기화
            const dynamicItemsContainer = $('.filters-content .grid');
            dynamicItemsContainer.find('.dynamic-item').remove(); // 동적으로 추가된 항목만 제거

            data.forEach(item => {
                // 각 메뉴 항목에 대한 HTML 구조를 생성
                const menuItemHTML = `
              <div class="col-sm-6 col-lg-4 all dynamic-item" style="cursor: pointer" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-detail="${item.detail}">
                <div class="box">
                  <div>
                    <div class="img-box">
                      <img src="${item.image}" alt="${item.name}" class="sandwich-image">
                    </div>
                    <div class="detail-box">
                      <h5>
                        ${item.name}
                      </h5>
                      <p>
                        ${item.detail || '메뉴 설명이 없습니다.'}
                      </p>
                      <div class="options">
                        <h6>
                          ${item.price}원
                        </h6>
                        <a class="Cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-detail="${item.detail}">
                          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 456.029 456.029" style="enable-background:new 0 0 456.029 456.029;" xml:space="preserve">
                            <g>
                              <g>
                                <path d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248
                             c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z" />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48
                             C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064
                             c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4
                             C457.728,97.71,450.56,86.958,439.296,84.91z" />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296
                             c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z" />
                              </g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                            <g>
                            </g>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;

                // 생성한 메뉴 항목을 메뉴 컨테이너에 추가
                dynamicItemsContainer.append(menuItemHTML);
            });
        },
        error: function(xhr, status, error) {
            console.error("메뉴 데이터를 가져오는 데 실패했습니다.", error);
        }
    });

    $(document).on('click', '.dynamic-item', function () {
        // 선택한 아이템의 데이터를 가져옴
        const name = $(this).data('name');
        const price = $(this).data('price');
        const image = $(this).data('image');
        const detail = $(this).data('detail');

        $.ajax({
            url: '/webs/api/menu/getProducts', // 서버에서 메뉴 목록을 가져오는 API URL
            method: 'GET',
            dataType: 'json', // 응답 데이터 타입은 JSON
            data:{name:name},
            success: function(data) {
                console.log('data :: ', data);

                // 카테고리별로 제품 그룹화
                const categories = {
                    bread: [],
                    vegetable: [],
                    meat: [],
                    source: []
                };

                // 데이터를 카테고리별로 그룹화
                data.forEach(item => {
                    if (item.category === 'bread') {
                        categories.bread.push(item);
                    } else if (item.category === 'vegetable') {
                        categories.vegetable.push(item);
                    } else if (item.category === 'meat') {
                        categories.meat.push(item);
                    } else if (item.category === 'source') {
                        categories.source.push(item);
                    }
                });

                // 모달의 제품 정보에 카테고리별로 나열
                let modalProductsHtml = '';
                for (const category in categories) {
                    if (categories[category].length > 0) {
                        // 각 카테고리 이름을 한 줄로 표시하고, 그 아래에 해당 카테고리의 이름들과 이미지를 나열
                        modalProductsHtml += `<p><strong>${category}:</strong>`;
                        categories[category].forEach(item => {
                            modalProductsHtml += `
                            <img src="${item.image}" alt="${item.name}" class="modalImage">
                            <span>${item.name}</span>
                        `;
                        });
                        modalProductsHtml += `</p>`;
                    }
                }

                // #modal-products에 생성된 HTML을 삽입
                $('#modal-products').html(modalProductsHtml);
            },
            error: function(xhr, status, error) {
                console.error("메뉴 데이터를 가져오는 데 실패했습니다.", error);
            }
        });

        // 모달의 내용을 동적으로 설정
        $('#modal-title').text(name);
        $('#modal-price').text(price + '원');
        $('#modal-detail').text(detail);
        $('#modal-image').attr('src', image);

        // 버튼 컨테이너를 비우고 버튼을 동적으로 생성
        const buttonContainer = $('.modal-buttons');
        buttonContainer.empty(); // 기존 버튼 제거

// '장바구니' 버튼 생성
        const cartButton = $('<button>')
            .addClass('insertCartButton')
            .text('장바구니');

// '주문하기' 버튼 생성
        const orderButton = $('<button>')
            .addClass('orderButton')
            .text('주문하기');

// 버튼 컨테이너에 버튼 추가
        buttonContainer.append(cartButton, orderButton);

        // 모달을 표시
        $('#Modal').css('display', 'flex');

        // 모달이 열리면 body의 스크롤을 비활성화
        $('body').css('overflow', 'hidden');
    });

    $(document).on('click', '.custom', function () {
        // 버튼 컨테이너를 비우고 버튼을 동적으로 생성
        const buttonContainer = $('.modal-buttons');
        buttonContainer.empty(); // 기존 버튼 제거

// '장바구니' 버튼 생성
        const cartButton = $('<button>')
            .addClass('insertCustomCartButton')
            .text('장바구니');

// '주문하기' 버튼 생성
        const orderButton = $('<button>')
            .addClass('orderButton')
            .text('주문하기');

// 버튼 컨테이너에 버튼 추가
        buttonContainer.append(cartButton, orderButton);
    });

// 모달 닫기 버튼 클릭 시 모달 닫기
    $(document).on('click', '.closeMenu', function () {
        $('#Modal').css('display', 'none');

        // 모달이 닫히면 body의 스크롤을 다시 활성화
        $('body').css('overflow', 'auto');
        clearModalState();
    });

// // 모달 외부 클릭 시 모달 닫기
//     $(window).on('click', function (event) {
//         if ($(event.target).is('#Modal')) {
//             $('#Modal').css('display', 'none');
//
//             // 모달이 닫히면 body의 스크롤을 다시 활성화
//             $('body').css('overflow', 'auto');
//             clearModalState();
//         }
//     });

    // modal창의 cart버튼 함수
    $(document).on('click', '.insertCartButton', function () {
        const name = $('#modal-title').text();
        const price = $('#modal-price').text().replace('원', '');

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
            alert("로그인해주세요.");
            return;
        }

        $.ajax({
            url: '/webs/api/cart/completeProduct', // 서버에서 메뉴 목록을 가져오는 API URL
            method: 'POST',
            contentType: 'application/json',  // Content-Type을 JSON으로 설정
            data: JSON.stringify({
                name: name,
                price:price,
                buyer: userId,
                productId:new Date().toISOString() + userId
            }),
            success: function (response) {
                if (response === "success") {
                    const userResponse = confirm("장바구니 담기 성공! 장바구니 페이지로 이동하시겠습니까?");
                    if (userResponse) {
                        // 확인을 누른 경우 장바구니 페이지로 이동
                        window.location.href = "/mypage/cartList";
                    }
                } else {
                    alert("장바구니 담기에 실패하였습니다.");
                }
            },
            error: function (xhr, status, error) {
                console.error("에러 발생:", error); // 에러 디버깅
                alert("서버와 통신 중 문제가 발생했습니다.");
            }
        })
    });

    // index 화면에서의 cart버튼 함수
    $(document).on('click', '.Cart', function (event) {
        event.stopPropagation(); // 부모로 이벤트 전파 중단
        event.preventDefault(); // a 태그 기본 동작 방지
        const name = $(this).data('name');
        const price = $(this).data('price');
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
            alert("로그인해주세요.");
            return;
        }

        $.ajax({
            url: '/webs/api/cart/completeProduct', // 서버에서 메뉴 목록을 가져오는 API URL
            method: 'POST',
            contentType: 'application/json',  // Content-Type을 JSON으로 설정
            data: JSON.stringify({
                name: name,
                price: price,
                buyer: userId,
                productId:new Date().toISOString() + userId
            }),
            success: function (response) {
                if (response === "success") {
                    // Confirm 창 표시
                    const userResponse = confirm("장바구니 담기 성공! 장바구니 페이지로 이동하시겠습니까?");
                    if (userResponse) {
                        // 확인을 누른 경우 장바구니 페이지로 이동
                        window.location.href = "/mypage/cartList";
                    }
                } else {
                    alert("장바구니 담기에 실패하였습니다.");
                }
            },
            error: function (xhr, status, error) {
                console.error("에러 발생:", error); // 에러 디버깅
                alert("서버와 통신 중 문제가 발생했습니다.");
            }
        })
    });

    $(document).on('click', '.insertCustomCartButton', function () {

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
            alert("로그인해주세요.");
            return;
        }

        // CompleteCartRequestDTO 생성
        const completeCart = {
            name: $('#modal-title').text(),
            price: parseInt($('#modal-price').text().replace('원', ''), 10),
            buyer: userId,
            productId: new Date().toISOString() + userId
        };

        // 카테고리별 데이터를 수집 (mainList 사용)
        const customProducts = mainList.map(item => ({
            name: item.name,
            category: item.category,
            price: parseInt(item.price, 10), // 가격이 문자열일 경우 변환
            buyer: userId
        }));

        const hasBread = customProducts.some(product => product.category === 'bread');

        if (!hasBread) {
            alert('빵은 필수입니다. 빵을 골라주세요.');
            breadModal.style.display = "block";
            return; // AJAX 호출 방지
        }

        // CustomCartRequestDTO 생성
        const customCartRequestDTO = {
            completeCartRequestDTO: completeCart,
            customProductsRequestDTO: customProducts
        };

        // 서버로 데이터 전송
        $.ajax({
            url: '/webs/api/cart/custom',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(customCartRequestDTO),
            success: function (response) {
                if (response === "success") {
                    const userResponse = confirm("장바구니 담기 성공! 장바구니 페이지로 이동하시겠습니까?");
                    if (userResponse) {
                        window.location.href = "/mypage/cartList";
                    }
                } else {
                    alert("장바구니 담기에 실패하였습니다.");
                }
            },
            error: function (xhr, status, error) {
                console.error("에러 발생:", error);
                alert("서버와 통신 중 문제가 발생했습니다.");
            }
        });
    });

    $(document).on('click', '.custom', function () {

        $('#modal-title').empty(); // 제목 초기화
        $('#modal-detail').empty(); // 상세 내용 초기화
        $('#modal-price').empty(); // 가격 정보 초기화
        $('#modal-image').empty(); // 가격 정보 초기화
        $('#modal-products').empty();

        $('#modal-title').text('나만의 샌드위치');
        $('#modal-detail').text('나만의 샌드위치를 커스텀해보세요!');

        const totalPrice = Object.values(mainList).flat().reduce((sum, product) => sum + parseInt(product.price, 10), 0);
        console.log('totalPrice :: ' ,totalPrice)

        let customButtonHtml= '';
            customButtonHtml = `
        <button id="selectCustom" class="btn btn-primary">재료 선택하기</button>
        `;


        $('#modal-price').append(customButtonHtml);

        // 모달을 표시
        $('#Modal').css('display', 'flex');

        // 모달이 열리면 body의 스크롤을 비활성화
        $('body').css('overflow', 'hidden');
    });

    let mainList = []; // 전체 상품 리스트 저장

    // 상품 클릭 이벤트
    $(document).on("click", ".sandwich-item", function () {
        const itemName = $(this).find("h3").text();
        const price = $(this).find("p").text();
        const category = this.closest(".modal").id.replace("Modal", "");
        const image = $(this).find("img").attr("src"); // 이미지의 src 값을 가져옵니다.

        const isSelected = $(this).hasClass("selected");
        if (isSelected) {
            $(this).removeClass("selected");
            mainList = mainList.filter(
                item => item.name !== itemName || item.category !== category || item.price !== price
            );
        } else {
            $(this).addClass("selected");
            mainList.push({ name: itemName, category: category, price: price, image: image });
        }

        renderSectionData();
        renderSelectedProducts(); // 선택한 제품 모달에 출력
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

    function renderSelectedProducts() {
        // 카테고리별로 데이터를 그룹화
        const categories = {
            bread: [],
            vegetable: [],
            meat: [],
            source: [],
            drink: []
        };

        // mainList를 카테고리별로 분류
        mainList.forEach(item => {
            if (categories[item.category]) {
                categories[item.category].push(item);
            }
        });

        // 카테고리별로 HTML 생성
        let modalProductsHtml = '';
        for (const category in categories) {
            if (categories[category].length > 0) {
                // 카테고리 제목 추가
                modalProductsHtml += `<p><strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong>`;

                // 각 아이템에 대한 HTML 추가
                categories[category].forEach(item => {
                    modalProductsHtml += `
                        <img src="${item.image || '#'}" alt="${item.name}" class="modalImage">
                        <span>${item.name}</span>
                `;
                });
                modalProductsHtml += `</p>`;
            }
        }

        if (mainList.length > 0) { // 상품이 선택된 경우에만 버튼 추가
            modalProductsHtml += `
            <button id="selectCustom" class="btn btn-primary" style="margin-top: 15px;">
                재료 추가하기
            </button>
        `;
        }

        // #modal-products에 결과 출력
        $('#modal-products').html(modalProductsHtml);
    }

    function updateAddProductsField() {
        totalPrice = Object.values(mainList).flat().reduce((sum, product) => sum + parseInt(product.price, 10), 0);

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
        if(totalPrice > 0) {
            outputString += `\n총 가격: ${totalPrice}원`;
        }else {
            let customButtonHtml= '';
            customButtonHtml = `
        <button id="selectCustom" class="btn btn-primary">재료 선택하기</button>
        `;


            $('#modal-price').append(customButtonHtml);
        }

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

    $(document).on("click", "#selectCustom", function () {
        $("#addproductsModal").css("display", "block");
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

    closeBreadButton.addEventListener("click", function () {
        breadModal.style.display = "none";
        // clearModalState();

    });

    closeVegetableButton.addEventListener("click", function () {
        vegetableModal.style.display = "none";
        // clearModalState();
    });

    closeMeatButton.addEventListener("click", function () {
        meatModal.style.display = "none";
        // clearModalState();
    });

    closeSourceButton.addEventListener("click", function () {
        sourceModal.style.display = "none";
        // clearModalState();
    });

    closeDrinkButton.addEventListener("click", function () {
        drinkModal.style.display = "none";
        // clearModalState();
    });


    closeaddproductsButton.addEventListener("click", function () {
        $('#modal-price').empty();
        const totalPrice = Object.values(mainList).flat().reduce((sum, product) => sum + parseInt(product.price, 10), 0);
        console.log('totalPrice :: ' ,totalPrice)

        if(totalPrice > 0){
        let customButtonHtml= totalPrice + `원`;
            $('#modal-price').append(customButtonHtml);
        }else {
            let customButtonHtml= '';
            customButtonHtml = `
        <button id="selectCustom" class="btn btn-primary">재료 선택하기</button>
        `;


            $('#modal-price').append(customButtonHtml);
        }

        // $('#modal-price').append(customButtonHtml);
        addproductsModal.style.display = "none";

        // clearModalState();
    });


    $('.completeSelectCustom').on('click', function () {
        $('#modal-price').empty();
        const totalPrice = Object.values(mainList).flat().reduce((sum, product) => sum + parseInt(product.price, 10), 0);
        console.log('totalPrice :: ' ,totalPrice)

        if(totalPrice > 0) {
            let customButtonHtml = totalPrice + `원`;

            $('#modal-price').append(customButtonHtml);
        }else {
            let customButtonHtml= '';
            customButtonHtml = `
        <button id="selectCustom" class="btn btn-primary">재료 선택하기</button>
        `;


            $('#modal-price').append(customButtonHtml);
        }

        breadModal.style.display = "none";
        vegetableModal.style.display = "none";
        meatModal.style.display = "none";
        sourceModal.style.display = "none";
        drinkModal.style.display = "none";
        addproductsModal.style.display = "none";
    });

});

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
                            <img src="${product.image}" alt="${product.name}" class="custom-sandwich-image">
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