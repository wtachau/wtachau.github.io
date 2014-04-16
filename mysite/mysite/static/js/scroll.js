// This is a functions that scrolls to #{blah}link
function goToByScroll(id){
  console.log(id);
    offset = 0;
      // Scroll
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top - offset},
        'slow');
}


$("#morelink").click(function(e) { 
  console.log("here");
      // Prevent a page reload when a link is pressed
    e.preventDefault(); 
      // Call the scroll function
    goToByScroll("page2");           
});