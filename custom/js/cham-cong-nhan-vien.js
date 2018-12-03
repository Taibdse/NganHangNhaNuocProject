$(async () => {

  $btnViewAttendance.click(() => {
    currentReportType = $selectReportType.val();
    if(currentReportType == 1) return showAttendanceInOutTime();
    if(currentReportType == 2) return showAttendanceWorkMoreTime();
    if(currentReportType == 3) return showAttendanceLateSoon();
  });

  $btnPrintAttendance.click(openPrintReportWindow);

  $selectReportType.change(e => {
    let txt = getCurrentTypeOfBC().toLowerCase();
    $btnPrintAttendance.text(`In ` + txt);
  })

  $selectSuperDep.change(e => {
    showDepList(e);
    filterUserData(false);
  });

  $selectDep.change(() => {
    filterUserData(true);
  })

  SelectComponent.renderMonths();

  $txtLateMin.val('15');
  $txtYear.val(new Date().getFullYear());
  $selectMonth.val(new Date().getMonth() + 1);
  
  showDepListJustAll();
  SelectComponent.renderPosition();
  SelectComponent.renderSuperDepartment(null, true);
  showAttendanceInOutTime();

})

let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let $selectMonth = $('#selectMonth');
let $txtLateMin = $('#txtLateMin');
let $txtYear = $('#txtYear');
let $btnPrintAttendance = $('#btnPrintAttendance');
let $btnViewAttendance = $('#btnViewAttendance');
let $selectReportType = $('#selectReportType');

let arrOnSites = [];
let arrFilteredOnSites = [];
let currentReportType = 1;


let currentTotalTimeOTAllUsersInMonth = '';

function filterUserData(filterByDep){
  let depID = $selectDep.val();
  let superDepID = $selectSuperDep.val();
  if(!arrOnSites || arrOnSites.length == 0) return;
  if(filterByDep) filterByDepID(depID);
  else filterBySuperDepID(superDepID);
  // showPagination(arrFilteredOnSites);
}

function filterByDepID(depID){
  let type = $selectReportType.val();
  let superDepID = $selectSuperDep.val();
  if(depID == '0' || !depID) return filterBySuperDepID(superDepID);

  arrFilteredOnSites = arrOnSites.filter(item => {
    let obj = item.TimeAttendanceAll; 
    if(typeof item.TimeAttendanceAll == 'string') obj = JSON.parse(item.TimeAttendanceAll);
    return obj.iDepartmentID == depID;
  })
  showPagination(arrFilteredOnSites, type);
}

function filterBySuperDepID(superDepID){
  let type = $selectReportType.val();
  if(superDepID == '0' || !superDepID) return showPagination(arrOnSites, type);
  arrFilteredOnSites = arrOnSites.filter(item => {
    let obj = item.TimeAttendanceAll; 
    if(typeof item.TimeAttendanceAll == 'string') obj = JSON.parse(item.TimeAttendanceAll);
    return obj.iSuperDepartmentID == superDepID;
  })
  showPagination(arrFilteredOnSites, type);
}

function showDepListJustAll(){
  $('.selectDep').html('');
  $('.selectDep').append(`<option value="0">Tất cả</option>`)
}

function showDepList(e, className){
  let superDepID = e.target.value;
  if(superDepID == 0) return showDepListJustAll();
  let sentData = {iSuperDepartmentID: superDepID};
  SelectComponent.renderDepartment(sentData, className);
}

function getClassNameHighLightCol(y, m, d){
  let weekend = TimeService.checkWeekendInMonth(y, m, d);
  let className = '';
  if(weekend) className = 'highlight-td-th';
  return className;
}

function getInOutArr(data){
  let arrTemp = [];
  let m = +$selectMonth.val();
  let y = +$txtYear.val();
  let l = TimeService.getNumOfDayInMonth(m, y);
  for(let i = 1; i <= l; i++){
    arrTemp.push({});
  }
  data.forEach(item => {
    let { dTimeIN, dTimeOUT, dDate } = item;
    arrTemp[Number(dDate) - 1] = { dTimeIN, dTimeOUT };
  });
  return arrTemp;
}

function getTimeOfTimeStr(timeStr){
  let arr = timeStr.split(':');
  let hour = Number(arr[0].trim());
  let min = Number(arr[1].trim());
  let time = getTimeStamp(hour, min);
  return time;
}

function getTimeStamp(hour, min){
  return hour*3600 + min*60;
}

function getTimeSpanString(timeStr1, timeStr2){
  let stamp1 = getTimeOfTimeStr(timeStr1);
  let stamp2 = getTimeOfTimeStr(timeStr2);
  let span = stamp1 - stamp2;
  if(span < 60) return null;
  return getTimeStringFromSeconds(span);
}

function getTimeStringFromSeconds(sec){
  let h, m;
  if(sec < 60*60) {
    h = 0;
    m = Math.floor(sec/60);
  }
  else if(sec >= 60*60) {
    h = Math.floor(sec/3600);
    m = Math.floor((sec%3600)/60);
  }
  return (h >= 10 ? h : `0${h}`) + ':' + (m >= 10 ? m : `0${m}`);
}

async function getDataAttendance(){
  let iMonth = $selectMonth.val();
  let iYear = $txtYear.val();
  let lateMin = $txtLateMin.val();
  
  if(!ValidationService.checkPositiveNumber(iYear)) return AlertService.showAlertError('Năm không hợp lệ', '', 5000);

  if(!ValidationService.checkPositiveNumber(lateMin)) return AlertService.showAlertError('Phút tính đi muộn không đúng', 'Vui lòng nhập lại', 5000);
  
  let sentData = { iMonth, iYear };
  let data = await UserService.getAttendance(sentData);
  return data;
}

function checkTimeInOutInput(start, end){
  let valid = true;
  let errMsg = '';
  if(!ValidationService.checkFormatTimeStr(start)){
    valid = false;
    errMsg += 'Thời gian làm bắt đầu không họp lệ\n';
  }
  if(!ValidationService.checkFormatTimeStr(end)){
    valid = false;
    errMsg += 'Thời gian làm kết thúc không họp lệ\n';
  }
  return { valid, errMsg };
}

// Tbl In Late Soon
async function showAttendanceLateSoon() {
  arrOnSites = await getDataAttendance();
  if(!arrOnSites) {
    AlertService.showAlertError('Không có dữ liệu', '', 4000);
    arrFilteredOnSites = [];
  }
  else arrFilteredOnSites = arrOnSites.slice();
  showPagination(arrOnSites, 3);
}

function renderTblAttendance(data) {
  let $table = $(`<table class="table custom-table text-center"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  renderTheadAttendance_StartLateEndSoon($thead);
  if(data) renderTbodyAttendance(data, $tbody);

  $table.append($thead).append($tbody);
  return $table;
}

function renderTheadAttendance($thead){
  $thead.html(
    `
      <tr>
        <th class="trn">STT</th>
        <th class="trn">Họ Tên</th>
        <th></th>
      </tr>
    `
  )
  let m = +$selectMonth.val();
  let y = +$txtYear.val();
  let arrMonthHeaders = TimeService.getDayInMonth(m, y);
  arrMonthHeaders.forEach(item => {
    let className = getClassNameHighLightCol(y, m, item);
    $thead.find('tr').append(`<th class=${className}>${item}</th>`);
  });
}

function renderTheadAttendance_StartLateEndSoon($thead){
  $thead.html(
    `
      <tr>
        <th class="trn">STT</th>
        <th class="trn">Họ Tên</th>
        <th></th>
      </tr>
    `
  )
  let m = +$selectMonth.val();
  let y = +$txtYear.val();
  let arrMonthHeaders = TimeService.getDayInMonth(m, y);
  arrMonthHeaders.forEach(item => {
    let className = getClassNameHighLightCol(y, m, item);
    $thead.find('tr').append(`<th class=${className}>${item}</th>`);
  });
  $thead.find('tr').append(`<th>Ghi chú</th>`);
}

function renderTbodyAttendance(data, $tbody){
  let m = +$selectMonth.val();
  let y = +$txtYear.val();

  //clear total time of OT
  clearTimeOTAllUsersInMonth();
  let index = 0;
  data.forEach((item) => {
    let user = JSON.parse(item.TimeAttendanceAll);

    let { sLogicalCode, sFullname, Attendance, bDimuonVesom } = user;
    let arrInOut = getInOutArr(Attendance);
    let lateMin = Math.floor($txtLateMin.val()) + '';
    let startStr = `08:${lateMin}`;
    let endStr = `17:00`;
    let numOfStartLate = 0;
    let numOfEndSoon = 0;

    if(bDimuonVesom == '01'){

      $tbody.append(`
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2" class="name-highlight">${sFullname} <br> ${sLogicalCode}</td>
          <td>Đi muộn</td>
        </tr>
      `)

      index++;

      arrInOut.forEach((item, index) => {
        let val = '';
        if(item.dTimeIN)  {
          val = getTimeSpanString(item.dTimeIN, startStr);
          if(!val) val = '';
          else numOfStartLate++;
        }
        let className = getClassNameHighLightCol(y, m, index + 1);
        $tbody.find('tr').last().append(`<td class="${className}">${val}</td>`)
      });

      $tbody.find('tr').last().append(`<td class="">DM: ${numOfStartLate}</td>`)

      $tbody.append(`
        <tr>
          <td>Về sớm</td>
        </tr>
      `)

      arrInOut.forEach((item, index) => {
        let val = '';
        if(item.dTimeOUT)  {
          val = getTimeSpanString(endStr, item.dTimeOUT);
          if(!val) val = '';
          else numOfEndSoon++;
        }
        let className = getClassNameHighLightCol(y, m, index + 1);
        $tbody.find('tr').last().append(`<td class="${className}">${val}</td>`)
      });

      $tbody.find('tr').last().append(`<td class="">VS: ${numOfEndSoon}</td>`)
    }
  })
}

// Tbl In Out Time
async function showAttendanceInOutTime(){
  arrOnSites = await getDataAttendance();
  if(!arrOnSites) {
    AlertService.showAlertError('Không có dữ liệu', '', 4000);
    arrFilteredOnSites = [];
  }
  else arrFilteredOnSites = arrOnSites.slice();
  showPagination(arrOnSites, 1);
}

function renderTblAttendanceInOutTime(data) {
  let $table = $(`<table class="table custom-table text-center"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  renderTheadAttendance($thead);
  if(data) renderTbodyAttendanceInOutTime(data, $tbody);

  $table.append($thead).append($tbody);
  return $table;
}

function renderTbodyAttendanceInOutTime(data, $tbody){
  let m = +$selectMonth.val();
  let y = +$txtYear.val();

  //clear total time of OT
  clearTimeOTAllUsersInMonth();

  data.forEach((item, index) => {
    let user = JSON.parse(item.TimeAttendanceAll);

    let { sLogicalCode, sFullname, Attendance } = user;
    let arrInOut = getInOutArr(Attendance);

    $tbody.append(`
      <tr>
        <td rowspan="2">${index + 1}</td>
        <td rowspan="2" class="name-highlight">${sFullname} <br> ${sLogicalCode}</td>
        <td>Giờ vào</td>
      </tr>
    `)
    
    arrInOut.forEach((item, index) => {
      let { dTimeIN } = item;
      let val = dTimeIN ? dTimeIN : '';
      let className = getClassNameHighLightCol(y, m, index + 1);
      $tbody.find('tr').last().append(`<td class="${className}">${val}</td>`)
    })

    $tbody.append(`<tr><td>Giờ ra</td></tr>`)
    arrInOut.forEach((item, index) => {
      let { dTimeOUT } = item;
      let val = dTimeOUT ? dTimeOUT : '';
      let className = getClassNameHighLightCol(y, m, index + 1);
      $tbody.find('tr').last().append(`<td class="${className}">${val}</td>`)
    })
  })
}

//Tbl Work more time
async function showAttendanceWorkMoreTime(){
  arrOnSites = await getDataAttendance();
  if(!arrOnSites) {
    AlertService.showAlertError('Không có dữ liệu', '', 4000);
    arrFilteredOnSites = [];
  }
  else arrFilteredOnSites = arrOnSites.slice();
  showPagination(arrOnSites, 2);
}

function renderTheadAttendanceWorkMoreTime($thead){
  $thead.html(
    `
      <tr>
        <th class="trn">STT</th>
        <th class="trn">Họ Tên</th>
      </tr>
    `
  )
  let m = +$selectMonth.val();
  let y = +$txtYear.val();
  let arrMonthHeaders = TimeService.getDayInMonth(m, y);
  arrMonthHeaders.forEach(item => {
    let className = getClassNameHighLightCol(y, m, item);
    $thead.find('tr').append(`<th class=${className}>${item}</th>`);
  });
  $thead.find('tr').append(`<th>Giờ làm thêm</th>`);
}

function renderTblAttendanceWorkMoreTime(data) {
  let $table = $(`<table class="table custom-table text-center"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  renderTheadAttendanceWorkMoreTime($thead);
  if(data) renderTbodyAttendanceWorkMoreTime(data, $tbody);

  $table.append($thead).append($tbody);
  return $table;
}

function renderTbodyAttendanceWorkMoreTime(data, $tbody){
  let m = +$selectMonth.val();
  let y = +$txtYear.val();
  let arrOTAllUserInMonth = [];
  data.forEach((item, index) => {
    let user = JSON.parse(item.TimeAttendanceAll);

    let { sLogicalCode, sFullname, Attendance } = user;
    let arrInOut = getInOutArr(Attendance);
    let endStr = `17:00`;
    let arrOTPerUser = [];
    $tbody.append(`
      <tr>
        <td>${index + 1}</td>
        <td class="name-highlight">${sFullname} <br> ${sLogicalCode}</td>
      </tr>
    `)

    arrInOut.forEach((item, index) => {
      let val = '';
      if(item.dTimeOUT)  {
        val = getTimeSpanString(item.dTimeOUT, endStr);
        if(!val || !checkOvertimeIsValid(val)) val = '';
        else arrOTPerUser.push(val);
      }
      let className = getClassNameHighLightCol(y, m, index + 1);
      $tbody.find('tr').last().append(`<td class="${className}">${val}</td>`);
    })

    let totalOTPerUserStr = sumOfOverTimeInMonth(arrOTPerUser);
    if(totalOTPerUserStr != '') arrOTAllUserInMonth.push(totalOTPerUserStr);
    $tbody.find('tr').last().append(`<td>${totalOTPerUserStr}</td>`);
  })
  let allUsersOT = sumOfOverTimeInMonth(arrOTAllUserInMonth);
  setCurrentTimeOTAllUsersInMonth(allUsersOT)
}

//check if the time OT is over 1h30 min
function checkOvertimeIsValid(timespanStr){
  let arr = timespanStr.split(':');
  let h = Number(arr[0]);
  let m = Number(arr[1]);
  if(h < 1 ||  (h == 1 && m < 30)) return false;
  return true;
}

//cal sum of time OT in month
function sumOfOverTimeInMonth(arr){
  if(!arr || arr.length == 0) return '';
  let totalSeconds = 0;
  arr.forEach(item => {
    let arrTemp = item.split(':');
    let h = Number(arrTemp[0]);
    let m = Number(arrTemp[1]);
    let s = 3600*h + m*60;
    totalSeconds += s;
  })
  if(totalSeconds < 3600 + 1800) return ''; 
  return getTimeStringFromSeconds(totalSeconds);
}

//pagination
function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#chamCongArea').html('');
}

function showPagination(data, type){
  console.log(data);
  console.log(type);
  if(!data || data.length == 0) return clearPagination();
  $('#pagingTotal').html(`<strong>Tổng số nhân viên:</strong> ${data.length}`)
  $('#pagingControl').pagination({
    dataSource: data,
    pageSize: 10,
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table;
      if(type == 1) $table = renderTblAttendanceInOutTime(data);
      if(type == 2) $table = renderTblAttendanceWorkMoreTime(data);
      if(type == 3) $table = renderTblAttendance(data);
      $('#chamCongArea.table-responsive').html($table);
    }
  })
}

function printAttendanceData(){
  if(!arrFilteredOnSites || arrFilteredOnSites.length == 0) return AlertService.showAlertError('Không có dữ liệu để in', '', 5000);
  let $table, arrTemp = arrFilteredOnSites;
  if(currentReportType == 1) $table = renderTblAttendanceInOutTime(arrTemp)
  if(currentReportType == 3) $table = renderTblAttendance(arrTemp);
  let filename = "danh-sach-cham-cong";
  Export2ExcelService.export2Excel($table, filename);
}

function renderHeadOfPage(){
  let head = `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <!-- font awesome css -->
  <link rel="stylesheet" href="../plugins/font-awesome-4.7.0/css/font-awesome.min.css">

  <!-- Bootstrap core css -->
  <link rel="stylesheet" href="../MDB Free/css/bootstrap.min.css">

  <!-- Meterial Design Bootstrap -->
  <link rel="stylesheet" href="../MDB Free/css/mdb.min.css">

  <!-- datepicker css -->
  <link rel="stylesheet" href="../plugins/bootstrap-datetimepicker/css/bootstrap-datepicker3.min.css">

  <!-- bootstrap datetime picker css -->
  <link rel="stylesheet" href="../plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">

  <!-- pagination css -->
  <link rel="stylesheet" href="../plugins/paginationJs/pagination.css">

  <!-- main view custom css -->
  <link rel="stylesheet" href="../custom/css/main.css">
  <style>
    #chamCongArea table{
      margin-top: 5px!important;
    }
    #chamCongArea table th, #chamCongArea table td{
      border: 2px solid #ccc!important;
    }
    .highlight-td-th{
      background-color: rgba(0,0,0,0.09)!important;
    }
  </style>

  <title>Chấm công nhân viên</title>
</head>`
  return head;
}

function getSuperDepName(){
  let superDepID = $selectSuperDep.val();
  return $selectSuperDep.find(`option[value="${superDepID}"]`).text();
}

function getDepName(){
  let depID = $selectDep.val();
  return $selectDep.find(`option[value="${depID}"]`).text();
}

function setCurrentTimeOTAllUsersInMonth(val){
  let allUsersOTStr = `Tổng thời gian làm thêm: ${val}`;
  $('.overtime-in-month-all-users').text(allUsersOTStr);
  currentTotalTimeOTAllUsersInMonth = val;
}

function clearTimeOTAllUsersInMonth(){
  currentTotalTimeOTAllUsersInMonth = '';
  $('.overtime-in-month-all-users').text('');
}

function getCurrentTypeOfBC(){
  let val = $selectReportType.val();
  let txt = $selectReportType.find(`option[value="${val}"]`).text();
  return txt;
}

function openPrintReportWindow(){
  let head = renderHeadOfPage();
  let printtingArea;
  let m = +$selectMonth.val();
  let superDepName = getSuperDepName();  
  let depName = getDepName();  
  let headerTitle = `${getCurrentTypeOfBC().toUpperCase()} TRONG THÁNG ${m}`;
  let timeOT = '';
  if(currentTotalTimeOTAllUsersInMonth != '') timeOT = `Tổng thời gian làm thêm: ${currentTotalTimeOTAllUsersInMonth}`
  setTimeout(() => {
    if(currentReportType == 1) printtingArea = renderTblAttendanceInOutTime(arrFilteredOnSites);
    if(currentReportType == 2) printtingArea = renderTblAttendanceWorkMoreTime(arrFilteredOnSites);
    if(currentReportType == 3) printtingArea = renderTblAttendance(arrFilteredOnSites);
    let $table = `
      <div class="container-fluid">
        <div class="row mt-3">
          <div class="col-12 text-center">
            <h1>${headerTitle}</h1>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-4 text-center">
            <strong>VỤ: </strong> <span>${superDepName}</span>
          </div>
          <div class="col-md-4 text-center">
            <strong>PHÒNG: </strong> <span>${depName}</span>
          </div>
          <div class="col-md-4 text-center">
            <span>${timeOT}</span>
          </div>
        </div>
      </div>
      <div id="chamCongArea">
        <table class="table custom-table border">
          ${printtingArea.html()}
        </table>
      </div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 text-center">
            <strong>CHỦ QUẢN BỘ PHẬN</strong>
          </div>
          <div class="col-md-6 text-center">
            <strong>NGƯỜI CHẤM CÔNG</strong>
          </div>
        </div>
      </div>
      `
    let html = `<html>
                    ${head}
                  <body>
                    ${$table}
                  </body>
                </html>`;
    let windowObject = window.open("", "PrintWindow",
    "width=850,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
    windowObject.document.write(html);
    windowObject.document.write('<script type="text/javascript">$(window).load(function() { window.print(); window.close(); });</script>');
    windowObject.document.close();
    windowObject.focus();
  }, 500);
}


