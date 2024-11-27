$(document).ready(function () {

    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close-button");

    $(".rectangle").on("click", function () {
        modal.style.display = "block";
    });

    closeButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

function showSection(sectionId) {
    location.href='/main?sectionId=' + sectionId
        // $.ajax({
        //     url: `/gotoMain`, // 환율 API URL
        //     method: 'GET',
        //     data: {sectionId: sectionId},
        //     dataType: 'json',
        //     // success:function (response){
        //     //     window.location.href = response;
        //     // }
        // })
}