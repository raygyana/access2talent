// document ready function ends here
$(document).ready(function () {

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })



  //Input foucus JS starts here 
  $('.foucus-input').focus(function () {
    $(this).parent().addClass('foucus');
  });

  $('.foucus-input').blur(function () {
    $(this).parent().removeClass('foucus');
  }); //Input foucus JS ends here


  //Date JS starts here
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  var newDate = new Date();
  newDate.setDate(newDate.getDate());
  $('#Date').html(dayNames[newDate.getDay()] + " , " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
  //DateJS starts here




}); // document ready function ends here
