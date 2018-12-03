
$(async () => {

  $selectSuperDep.change(e => {
    showDepList(e, null, true);
    filterCarData(false);
  });

  $btnInsertUser.click(updateCar);
  $btnInsertUser.click(insertCar);
  $btnInsertUserModal.click(showInsertCarModal);

  $('#selectSuperDepUpdate').change((e) => {
    showDepList(e, 'selectDepUpdate');
  });

  $txtFilterUserName.on('input', () => {
    filterCarData(true);
  });

  $txtFilterUserID.on('input', () => {
    filterCarData(true);
  });

  $selectDep.change(() => {
    filterCarData(true);
  });

  $btnPrintOnNewBrowserTab.click(openPrintReportWindow);

  $('#btnPrintUserList').click(printUserList);

  $btnFilterInOutListByDateRange.click(filterInOutListByDateRange);

  showCarsListTable();

  await SelectComponent.renderSuperDepartment(null, true);
  SelectComponent.renderSuperDepartment('selectSuperDepUpdate', false);
  SelectComponent.renderPosition();
  showDepListJustAll();

})

let arrSuperDep = [];

let arrDep = [];
let arrPos = [];
let arrUsers = [];
let arrFilteredUsers = [];
let arrInOutList = [];

let currentUser = null;

let $txtFilterUserName = $('#txtFilterUserName');
let $txtFilterUserID = $('#txtFilterUserID');
let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let $tblInOutList = $('#tblInOutList');
let $modalInOutList = $('#modalInOutList');
let $btnUpdateUser = $('#btnUpdateUser');
let $btnInsertUser = $('#btnInsertUser');
let $btnInsertUserModal = $('#btnInsertUserModal');
let $txtFilterByStartDateInOutList = $('#txtFilterByStartDateInOutList');
let $txtFilterByEndDateInOutList = $('#txtFilterByEndDateInOutList');
let $btnFilterInOutListByDateRange = $('#btnFilterInOutListByDateRange');
let $btnPrintOnNewBrowserTab = $('#btnPrintOnNewBrowserTab');


function filterInOutListByDateRange(){
  let start = $txtFilterByStartDateInOutList.val();
  let end = $txtFilterByEndDateInOutList.val();
  let { valid, msgErr } = ValidationService.checkDate(start, end)
  if(!valid){
    renderTblInOutList(arrInOutList);
    return AlertService.showAlertError('', msgErr);
  }
  if(!ValidationService.checkTimeStartVsTimeEnd(start, end, false)) 
    return AlertService.showAlertError('Ngày không họp lệ', 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 5000);
  let arr = arrInOutList.filter(item => {
    let { DateInOut } = item;
    let cond = ValidationService.checkTimeStartVsTimeEnd(start, DateInOut, true) && ValidationService.checkTimeStartVsTimeEnd(DateInOut, end, true)
    return cond;
  });
  renderTblInOutList(arr);
}

function showDepList(e, className, all){
  let superDepID = e.target.value;
  if(superDepID == 0) return showDepListJustAll();
  let sentData = { iSuperDepartmentID: superDepID };
  SelectComponent.renderDepartment(sentData, className, all);
}

function showDepListJustAll(){
  $('.selectDep').html('');
  $('.selectDep').append(`<option value="0">Tất cả</option>`)
}

function showUpdateModalUser(user){
  currentCar = user;
  fillFormUser(user);
  $('#modalUpdateUser').modal('show');
}

function showInsertCarModal(){
  $('#modalInsertUser').modal('show');
}

function fillFormUser(user){
  let { sFirstName, sLastName, iSuperDepartmentID, iDepartmentID, iPositionID, sIdNumber, bDimuonVesom , bTinhTrang} = user;
  $('#txtFirstNameUpdateUser').val(sFirstName);
  $('#txtLastNameUpdateUser').val(sLastName);
  $('#txtIDNumberUpdateUser').val(sIdNumber);
  $('#selectPosUpdate').val(iPositionID);
  $('#selectSuperDepUpdate').val(iSuperDepartmentID);
  $('#selectSuperDepUpdate').trigger('change');
  $('#selectDepUpdate').val(iDepartmentID);
  $('#checkBoxUpdateReportStatus').prop('checked', true);
  $('#checkBoxUpdateWorkingStatus').prop('checked', true);
  if(bDimuonVesom) $('#checkBoxUpdateReportStatus').prop('checked', false);
  if(bTinhTrang) $('#checkBoxUpdateWorkingStatus').prop('checked', false);
}

function checkCarInput(sFirstName, sLastName, sIdNumber){
  let valid = true;
  let errMsg = '';
  if(!ValidationService.checkNotEmpty(sFirstName)){
    valid = false;
    errMsg += 'Họ không đuọc dể trống\n';
  }
  if(!ValidationService.checkNotEmpty(sLastName)){
    valid = false;
    errMsg += 'Tên không đuọc dể trống\n';
  }
  if(!ValidationService.checkNotEmpty(sIdNumber)){
    valid = false;
    errMsg += 'Mã nhân viên không đuọc dể trống\n';
  }
  return { valid, errMsg };
}

async function updateCar() {
  let { sLogicalCode } = currentCar;
  let sFirstName = $('#txtFirstNameUpdateUser').val();
  let sLastName = $('#txtLastNameUpdateUser').val();
  let sIdNumber = $('#txtIDNumberUpdateUser').val();
  let iPositionID = $('#selectPosUpdate').val();
  let iDepartmentID = $('#selectDepUpdate').val();
  let iSuperDepartmentID = $('#selectSuperDepUpdate').val();
  let checkBoxUpdateWorkingStatus =  $('#checkBoxUpdateWorkingStatus').prop('checked');
  let checkedReportStatus = $('#checkBoxUpdateReportStatus').prop('checked');
  let { valid, errMsg } = checkCarInput(sFirstName, sLastName, sIdNumber);
  if(!valid) return AlertService.showAlertError('Dũ liệu không đúng', errMsg);
  let bDimuonVesom = '1';
  let bTinhTrang = '1';
  if(checkedReportStatus) bDimuonVesom = '0';
  if(checkBoxUpdateWorkingStatus) bTinhTrang = '0';
  let sentData = { sLogicalCode, sLastName, sFirstName, sIdNumber, iSuperDepartmentID, iDepartmentID, iPositionID, bDimuonVesom, bTinhTrang };
  let res = await UserService.updateUser(sentData);
  $('#modalUpdateUser').modal('hide');
  AlertService.showAlertSuccess('Cập nhật thành công', '', 4000);
  showCarsListTable();
}

async function insertCar(){
  //let { sLogicalCode } = currentUser;
  let sLogicalCode = $('#txtLogicalCodeInsertUser').val();
  let sFirstName = $('#txtFirstNameInsertUser').val();
  let sLastName = $('#txtLastNameInsertUser').val();
  let sIdNumber = $('#txtIDNumberInsertUser').val();
  let iPositionID = $('#selectPosUpdate').val();
  let iDepartmentID = $('#selectDepUpdate').val();
  let iSuperDepartmentID = $('#selectSuperDepUpdate').val();
  let checkBoxUpdateWorkingStatus =  $('#checkBoxInsertWorkingStatus').prop('checked');
  let checkedReportStatus = $('#checkBoxInsertReportStatus').prop('checked');
  let { valid, errMsg } = checkCarInput(sFirstName, sLastName, sIdNumber);
  if(!valid) return AlertService.showAlertError('Dũ liệu không đúng', errMsg);
  let bDimuonVesom = '1';
  let bTinhTrang = '1';
  if(checkedReportStatus) bDimuonVesom = '0';
  if(checkBoxUpdateWorkingStatus) bTinhTrang = '0';
  let sentData = { sLogicalCode, sLastName, sFirstName, sIdNumber, iSuperDepartmentID, iDepartmentID, iPositionID, bDimuonVesom, bTinhTrang };
  let res = await UserService.insertUser(sentData);
  $('#modalInsertUser').modal('hide');
  AlertService.showAlertSuccess('Cập nhật thành công', '', 4000);
  showCarsListTable();
}

function filterCarData(filterByDepID){
  let name = $txtFilterUserName.val();
  let id = $txtFilterUserID.val();
  let depID = $selectDep.val();
  let superDepID = $selectSuperDep.val();
  let arr1;
  if(filterByDepID) {
    if(depID == 0 || !depID) arr1 = FilterService.filterByUserSuperDepID(arrCars, superDepID);
    else arr1 = FilterService.filterByUserDepID(arrCars, depID);
  }
  else 
    arr1 = FilterService.filterByUserSuperDepID(arrCars, superDepID);
  let arr2 = FilterService.filterByUserID(arr1, id);
  arrFilteredCars = FilterService.filterByUserName(arr2, name);
  showPagination(arrFilteredCars);
}

async function showInOutModal(user){
  let { sLogicalCode } = user;
  let sentData = { sLogicalCode };
  let data = await UserService.getUserInOut(sentData);
  //console.log(data);
  if(!data) return AlertService.showAlertError('Không có dữ liệu', '', 5000);
  showUserInfoOnModal(user);
  renderTblInOutList(data);
  arrInOutList = data.slice();
  $modalInOutList.modal('show');
}

function showUserInfoOnModal(user){
  let { sLogicalCode, sDepartmentName, sLastName, sFirstName, sSuperDepartmentName, sPositionName, sIdNumber } = user;
  let fullname = sFirstName + ' ' + sLastName;
  $('.fullname').text(fullname);
  $('.idNum').text(sIdNumber);
  $('.pos').text(sPositionName);
  $('.dep').text(sDepartmentName);
  $('.superDep').text(sSuperDepartmentName);
}

function renderTblInOutList(data){
  $tblInOutList.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th>STT</th>
      <th>Bộ điều khiển</th>
      <th>Ngày</th>
      <th>Thời gian</th>
    </tr>
    `
  )
  if(data){
    data.forEach((item, index) => {
      let { TimeInOut, SMI, DateInOut } = item;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${SMI}</td>
          <td>${DateInOut}</td>
          <td>${TimeInOut}</td>
        </tr>
      `)
    })
  }
  $tblInOutList.append($thead).append($tbody);
}

async function showCarsListTable(){
  arrCars = await UserService.getUsersData();
  if(!arrCars) {
    AlertService.showAlertError('Không có dữ liệu', '', 4000);
    arrFilteredCars = [];
  }
  else arrFilteredCars = arrCars.slice();
  showPagination(arrCars);
}

function checkIsAdmin(){
  let user = JSON.parse(sessionStorage.getItem('authenticatedUser'))[0];
  let { bAdmin } = user;
  return bAdmin == 1;
  // return true;
}

function renderUsersTbl(data) {
  let isAdmin = checkIsAdmin();
  let thBC = '';
  if(isAdmin) thBC = '<th class="font-weight-bold">BC</th>';

  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblUsers"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th class="font-weight-bold">STT</th>
      <th class="font-weight-bold">Họ và tên</th>
      <th class="font-weight-bold">Logical Code</th>
      <th class="font-weight-bold">Mã nhân viên</th>
      <th class="font-weight-bold">Chức vụ</th>
      <th class="font-weight-bold">Phòng ban</th>
      <th class="font-weight-bold">Vụ</th>
      ${thBC}
      <th class="font-weight-bold"></th>
    </tr>
    `
  )
  if (data) {
    data.forEach((user, index) => {
      const { sLogicalCode, sLastName, sFirstName, sIdNumber, sPositionName, sDepartmentName, sSuperDepartmentName, sSubDepartmentName, bDimuonVesom } = user;
      let fullname = sFirstName + ' ' + sLastName;
      let btnUpdate = '';
      let tdBC = '';
      if(isAdmin) {
        btnUpdate = '<button class="btn btn-custom btn-update border-radius-custom" style="text-transform: none; background-color: #353e4c">Cập nhật</button>';
        tdBC = `<td>${bDimuonVesom == 0 ? 'Không' : 'Có'}</td>`;
      }
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${fullname}</td>
          <td>${sLogicalCode}</td>
          <td>${sIdNumber}</td>
          <td>${sPositionName}</td>
          <td>${sDepartmentName}</td>
          <td>${sSuperDepartmentName}</td>
          ${tdBC}
          <td>
            <button class="btn btn-custom btn-view-inout border-radius-custom" style="margin-right: 5px; text-transform: none;background-color: #6785b2">Xem ra vào</button>
            ${btnUpdate}
          </td>
        </tr>
      `)
      if(isAdmin){
        $tbody.find('.btn.btn-update').last().click(() => {
          showUpdateModalUser(user);
        })
      }
      $tbody.find('.btn.btn-view-inout').last().click(() => {
        showInOutModal(user);
      })
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
      let $table = renderUsersTbl(data);
      $('#usersListArea.table-responsive').html($table);
    }
  })
}

function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#usersListArea').html('');
}

function renderTblPrintUsersList(data){
  let $table = $(`#tblPrintUsers`);
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th class="font-weight-bold">STT</th>
      <th class="font-weight-bold">Mã nhân viên</th>
      <th class="font-weight-bold">Họ và tên</th>
      <th class="font-weight-bold">Vụ</th>
      <th class="font-weight-bold">Phòng ban</th>
      <th class="font-weight-bold">Chức vụ</th>
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

function printUserList(){
  renderTblPrintUsersList(arrFilteredCars);
  let $table = $('#tblPrintUsers');
  let filename = "danh-sach-nhan-vien";
  Export2ExcelService.export2Excel($table, filename);
}

function renderHeadOfPage(){
  return `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- font awesome css -->
    <link rel="stylesheet" href="../plugins/font-awesome-4.7.0/css/font-awesome.min.css">

    <!-- Bootstrap core css -->
    <link rel="stylesheet" href="../MDB Free/css/bootstrap.min.css">

    <!-- Meterial Design Bootstrap -->
    <link rel="stylesheet" href="../MDB Free/css/mdb.min.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css" />

    <!-- datepicker css -->
    <link rel="stylesheet" href="../plugins/bootstrap-datetimepicker/css/bootstrap-datepicker3.min.css">

    <!-- bootstrap datetime picker css -->
    <link rel="stylesheet" href="../plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">

    <!-- pagination css -->
    <link rel="stylesheet" href="../plugins/paginationJs/pagination.css">

    <!-- main view custom css -->
    <link rel="stylesheet" href="../custom/css/main.css">
    
    <title>Danh sách nhân viên</title>

  </head>`
}

function getCurentDepName(){
  let val = $selectDep.val();
  return $selectDep.find(`option[value="${val}"]`).text();
}

function getCurentSuperDepName(){
  let val = $selectSuperDep.val();
  return $selectSuperDep.find(`option[value="${val}"]`).text();
}

function openPrintReportWindow(){
  let head = renderHeadOfPage();
  renderTblPrintUsersList(arrFilteredCars);
  let $table = $('#tblPrintUsers');
  let printtingArea = `
    <h1 class="text-center mt-4">Danh sách nhân viên</h1>
    <div class="row">
      <div class="col-md-6 text-center">
        <strong>VỤ: </strong> ${getCurentSuperDepName()}
      </div>
      <div class="col-md-6 text-center">
      <strong>PHÒNG: </strong> ${getCurentDepName()}
      </div>
    </div>
    <div class="table-responsive mt-4">
      <table class="table table-hover table-striped table-condensed text-center custom-table">
        ${$table.html()}
      </table>
    </div>
  `;
  setTimeout(() => {
    let html = `<html>
                    ${head}
                  <body>
                    ${printtingArea}
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

