const APP_DOMAIN = 'http://115.79.27.219/';
const CENTER_POS_MAP_VIEW = [20.81715284, 106.77411238];
const TIME_OUT_SHOW_MAP_ON_MODAL = 0;
const arrMonths = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const arrPageNames = [
  "Danh sách nhân viên",
  "Danh sách tức thời",
  "Chấm công nhân viên",
  "Báo cáo tức thời",
  "Danh sách xe",
  "Danh sách xe tức thời",
  "Quản lý người dùng",
];

function checkLogin(sUsername, sPassword){
  let sentData = { sUsername, sPassword };
  //console.log(sentData);
  let url = `${APP_DOMAIN}SMIApi/Login.php`;
  console.log(url);
  let method = 'post';
  let data = JSON.stringify(sentData);
  return $.ajax({ url, method, data });
}

async function routingPage(){
  if(window.location.href.indexOf('login.html') > -1) return;
  let userStr = sessionStorage.getItem('authenticatedUser');
  if(!userStr || userStr.trim() == '') return redirectToLoginPage()
  let { sUsername } = JSON.parse(userStr)[0];
  if(!sUsername || sUsername == '') return redirectToLoginPage();
}

function redirectToLoginPage(){
  location.href = 'login.html';
}

// authenticated user
routingPage();

$('.datepicker').datepicker({
  todayBtn: "linked",
  format: 'dd/mm/yyyy',
  // autoclose: true,
  // language: 'vn',
  todayHighlight: true,
});

$('.datetimepicker').datetimepicker({
  format: 'dd/mm/yyyy hh:ii',
  todayBtn: "linked",
  // format: 'dd/mm/yyyy',
  // autoclose: true,
  // language: 'vn',
  todayHighlight: true,
})

$('.datetimepicker-bootstrap4').datetimepicker({
  // format: 'LT'
   format: 'HH:mm'
});



