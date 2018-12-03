$(async () => {
 
  $btnVIewOnsiteReportData.click(showOnSiteReport);
  $btnPrintOnsiteReportData.click(printOnsiteReportData);
  
  $selectSuperDep.change(e => {
    showDepList(e);
    filterData(false);
  });

  $selectDep.change(() => {
    filterData(true);
  })

  setDefaultStartEndTime();
  setDefaultCheckDate();
  showDepListJustAll();
  showOnSiteReport();
  SelectComponent.renderSuperDepartment(null, true);

})

let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let $txtCheckDate = $('#txtCheckDate');
let $txtStartTime = $('#txtStartTime');
let $txtEndTime = $('#txtEndTime');
let $btnVIewOnsiteReportData = $('#btnVIewOnsiteReportData');
let $btnPrintOnsiteReportData = $('#btnPrintOnsiteReportData');

let arrOnsiteReportData = [];
let arrFilteredOnsiteReportData = [];

function setDefaultStartEndTime(){
  let d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();
  $txtStartTime.val('00:00');
  let hour = h >= 10 ? h : '0' + h;
  let min = m >= 10 ? m : '0' + m;
  $txtEndTime.val(`${hour}:${min}`);
}

function setDefaultCheckDate(){
  let { year, month, day } = TimeService.getCurrentDate();
  month++;
  let y = year >= 10 ? year : '0' + year;
  let m = month >= 10 ? month : '0' + month;
  let d = day >= 10 ? day : '0' + day;
  $txtCheckDate.val(`${d}/${m}/${y}`);
}

function filterData(filterByDep){
  let depID = $selectDep.val();
  let superDepID = $selectSuperDep.val();
  if(!arrOnsiteReportData || arrOnsiteReportData.length == 0) return;
  let arr = FilterService.filterByUserSuperDepID(arrOnsiteReportData,superDepID);
  if(filterByDep) 
    arrFilteredOnsiteReportData = FilterService.filterByUserDepID(arr, depID);
  else arrFilteredOnsiteReportData = arr;
  showPagination(arrFilteredOnsiteReportData);
}

function showDepList(e, className){
  let superDepID = e.target.value;
  if(superDepID == 0) return showDepListJustAll();
  let sentData = {iSuperDepartmentID: superDepID};
  SelectComponent.renderDepartment(sentData, className, true);
}

function showDepListJustAll(){
  $('.selectDep').html('');
  $('.selectDep').append(`<option value="0">Tất cả</option>`)
}

async function showOnSiteReport(){
  let date = $txtCheckDate.val();
  if(date == '' || !date) return AlertService.showAlertError('Ngày kiểm tra không họp lệ', 'Vui lòng nhập lại ngày kiểm tra');
  let dDate = TimeService.changeFormatDateTime(date);
  let sentData = { dDate };
  arrOnsiteReportData = await UserService.getOnSiteDate(sentData);
  if(!arrOnsiteReportData) {
    AlertService.showAlertError('Không có dữ liệu', '', 5000);
    arrFilteredOnsiteReportData = [];
  }else{
    arrFilteredOnsiteReportData = arrOnsiteReportData.slice();
  }
  showPagination(arrOnsiteReportData);
}

function renderOnsiteReport(data){
  let $table = $(`<table class="table custom-table"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">STT</th>
        <th class="trn">Họ Tên</th>
        <th>Mã nhân viên</th>
        <th>Vị trí</th>
        <th>Phòng ban</th>
        <th>Vụ</th>
        <th></th>
      </tr>
    `
  )

  if (data) {
    data.forEach((item, index) => {
      let { sDepartmentName, sFirstName, sLastName, sPositionName, sSubDepartmentName, sSuperDepartmentName, sIdNumber } = item;
      let sFullname = sFirstName + ' ' + sLastName;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sFullname}</td>
          <td>${sIdNumber}</td>
          <td>${sPositionName}</td>
          <td>${sDepartmentName}</td>
          <td>${sSuperDepartmentName}</td>
          <td>${sSubDepartmentName}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showPagination(data){
  if(!data) return clearPagination();
  $('#pagingTotal').html(`<strong>Tổng số nhân viên:</strong> ${data.length}`)
  $('#pagingControl').pagination({
    dataSource: data,
    pageSize: 10,
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderOnsiteReport(data);
      $('#ÓniteReportDataArea.table-responsive').html($table);
    }
  })
}

function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#ÓniteReportDataArea').html('');
}

function renderTblPrintOnsiteReport(data){
  let $table = $(`#tblPrintOnsiteReport`);
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th class="trn">STT</th>
      <th class="trn">Họ Tên</th>
      <th>Mã nhân viên</th>
      <th>Vị trí</th>
      <th>Phòng ban</th>
      <th>Vụ</th>
      <th></th>
    </tr>
    `
  )
  if (data) {
    data.forEach((user, index) => {
      const { sLastName, sFirstName, sIdNumber, sPositionName, sDepartmentName, sSuperDepartmentName, sSubDepartmentName } = user;
      let fullname = sFirstName + ' ' + sLastName;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sIdNumber}</td>
          <td>${fullname}</td>
          <td>${sSuperDepartmentName}</td>
          <td>${sDepartmentName}</td>
          <td>${sPositionName}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
}

function printOnsiteReportData(){
  let arr = arrFilteredOnsiteReportData;
  if(!arr || arr.length == 0) return AlertService.showAlertError('Không có dữ liệu để in', '', 4000);
  renderTblPrintOnsiteReport(arrFilteredOnsiteReportData);
  let $table = $('#tblPrintOnsiteReport');
  let filename = "bao-cao-tuc-thoi";
  Export2ExcelService.export2Excel($table, filename);
}