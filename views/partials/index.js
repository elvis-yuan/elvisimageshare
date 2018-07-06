$(document).ready(function(){
    console.log("working")
    $(".comment-btn").click(function(){
        console.log("click");
        $(".comment-sec").toggle();
    });
});