
$(async () => {
  
    $selectSuperDep.change(e => {
      let superDepID = e.target.value;
      showDepList(superDepID, null, true);
      filterCarData(false);
    });
  
    $btnUpdateCar.click(updateCar);
    $btnInsertCar.click(insertCar);
    $btnInsertCarModal.click(showInsertCarModal);
  
    $('.selectSuperDepUpdate').change(async (e) => {
      let insert = e.target == $('#selectSuperDepInsert')[0];
      changeDepVsUserList(insert);
    });

    

    $('.selectDepUpdate').change((e) => {
        console.log('12345');
        let insert = e.target == $('#selectDepInsert')[0];
        filterUser(insert);
    });
  
    $selectDep.change(() => {
      filterCarData(true);
    });

    $('#txtFilterCarName').on('input', () => {
      filterCarData(true);
    });

    $('#txtFilterCarPlate').on('input', () => {
      filterCarData(true);
    });
  
    $btnPrintOnNewBrowserTab.click(openPrintReportWindow);
  
    $btnPrintCarList.click(printUserList);
  
    showCarsListTable();
  
    await SelectComponent.renderSuperDepartment(null, true);
    SelectComponent.renderSuperDepartment('selectSuperDepUpdate', false);
   
    showDepListJustAll();
    await showUsersCombobox();
    $('#selectSuperDepInsert').trigger('change');
    $('#selectSuperDepUpdate').trigger('change');
  
  })
  
  let arrSuperDep = [];
  let arrDep = [];
  let arrPos = [];
  let arrCars = [];
  let arrUsersCombobox = [];
  let arrFilteredCars = [];
  
  let currentCar = null;
  // btnPrintCarList
  let $selectSuperDep = $('#selectSuperDep');
  let $selectDep = $('#selectDep');
  let $btnUpdateCar = $('#btnUpdateUser');
  let $btnInsertCar = $('#btnInsertCar');
  let $btnInsertCarModal = $('#btnInsertCarModal');
  let $btnPrintOnNewBrowserTab = $('#btnPrintOnNewBrowserTab');
  let $btnPrintCarList = $('#btnPrintCarList');
  
  async function showUsersCombobox(){
    arrUsers = await UserService.getUserComboboxData();
    console.log(arrUsers);
    renderUserListCombobox(arrUsers, $('.selectUser'));
  }

  async function changeDepVsUserList(insert){
    let superDepID = $('#selectSuperDepInsert').val();
    if(!insert) superDepID = $('#selectSuperDepUpdate').val();
    await showDepList(superDepID, 'selectDepUpdate');
    filterUser(insert);
  }

  function filterUser(insert){
    let depID = $('#selectDepInsert').val();
    let $ele = $('#selectUserInsert');
    if(!insert) {
        depID = $('#selectDepUpdate').val();
        $ele = $('#selectUserUpdate');
    }
    arrFilteredUsers = arrUsers.filter(u => u.iDepartmentID == depID);
    renderUserListCombobox(arrFilteredUsers, $ele);
  }

  function renderUserListCombobox(arr, $ele){
    $ele.html('');
    arr.forEach(item => {
        let { sLogicalCode, sLastName, sFirstName } = item;
        let fullname = `${sFirstName} ${sLastName}`;
        $ele.append(`<option value="${sLogicalCode.trim()}">${fullname}</option>`);
    })
  }

  async function showDepList(superDepID, className, all){
    if(superDepID == 0) return showDepListJustAll();
    let sentData = { iSuperDepartmentID: superDepID };
    await SelectComponent.renderDepartment(sentData, className, all);
  }
  
  function showDepListJustAll(){
    $('.selectDep').html('');
    $('.selectDep').append(`<option value="0">Tất cả</option>`)
  }
  
  async function showUpdateCarModal(car){
    currentCar = Object.assign({}, car);
    let { bCarMoney, sCarName, sCarPlate, sLogicalCodeCar, 
      sLogicalCodeUser, iSuperDepartmentID, iDepartmentID} = car;
    $('#txtUpdateCarLogicalCode').val(sLogicalCodeCar);     
    $('#txtUpdateCarName').val(sCarName);     
    $('#txtUpdateCarPlate').val(sCarPlate);     
    $('#selectSuperDepUpdate').val(iSuperDepartmentID);   
    await changeDepVsUserList(false);
    $('#selectDepUpdate').val(iDepartmentID);
    setTimeout(() => {
      filterUser(false);
    }, 200);
    setTimeout(() => {
      $('#selectUserUpdate').val(sLogicalCodeUser);
    }, 400);
    $('#checkboxUpdateCarMoney').prop({ 'checked': bCarMoney == '1' });
    $('#modalUpdateUser').modal('show');
  }
  
//   {"sLogicalCode":"111331", "sCarName":"11212121", "sCarPlate":"1", "bCarMoney":"1", 
//   "iSuperDepartmentID":"3", "iDepartmentID":"3", "sUserUsed":"Vũ Hoàng", "bStatus":"1"}
  function showInsertCarModal(){
    $('#txtInsertCarLogicalCode').val('');
    $('#txtInsertCarName').val('');
    $('#txtInsertCarPlate').val('');
    $('#checkboxCarMoney').prop({'checked': false});
    $('#modalInsertCar').modal('show');
  }

  async function deleteCar(car){
    let sure = await AlertService.showAlertWarning('bạn có chắc không?', '');
    if(sure){
        // let sCarName = '', sCarPlate = '', bCarMoney = '', 
        // iSuperDepartmentID = '', iDepartmentID = '', sLogicalCodeUser = '';
        let { sLogicalCodeCar } = car;
        let sentData = { sLogicalCode: sLogicalCodeCar };
        let res = await CarService.deleteCar(sentData);
        AlertService.showAlertSuccess('Xóa thành công', '', 4000);
        showCarsListTable();
    }
  }
  
 function checkCarInput(sLogicalCode, sCarName, sCarPlate){
    let errMsg = [];
    if(!ValidationService.checkNotEmpty(sLogicalCode)){
      errMsg.push('Logical code không đuọc dể trống\n');
    }
    if(!ValidationService.checkNotEmpty(sCarName)){
      errMsg.push('Tên không đuọc dể trống\n');
    }
    if(!ValidationService.checkNotEmpty(sCarPlate)){
      errMsg.push('Biển số xe không đuọc dể trống\n');
    }
    let valid = Object.keys(errMsg).length == 0;
    return { valid, errMsg };
  }
  
  async function updateCar(){
    let sLogicalCode = $('#txtUpdateCarLogicalCode').val();
    let sCarName = $('#txtUpdateCarName').val();
    let sCarPlate = $('#txtUpdateCarPlate').val();
    let bCarMoney = $('#txtUpdateCarLogicalCode').val();
    let iSuperDepartmentID = $('#selectSuperDepUpdate').val();
    let iDepartmentID = $('#selectDepUpdate').val();
    let sLogicalCodeUser = $('#selectUserUpdate').val();
    let bStatus = 1;
    bCarMoney = bCarMoney ? '1' : '0';
    let { valid, errMsg } = checkCarInput(sLogicalCode, sCarName, sCarPlate);
    if(!valid) return AlertService.showAlertError('Dũ liệu không đúng', errMsg.join(''), 5000);
    let sentData = { sLogicalCode, sCarName, sCarPlate, bCarMoney, 
        iSuperDepartmentID, iDepartmentID, sLogicalCodeUser, bStatus };
    let res = await CarService.updateCar(sentData);
    $('#modalUpdateUser').modal('hide');
    AlertService.showAlertSuccess('Cập nhật thành công', '', 4000);
    showCarsListTable();
  }
  
  async function insertCar(){
    let sLogicalCode = $('#txtInsertCarLogicalCode').val();
    let sCarName = $('#txtInsertCarName').val();
    let sCarPlate = $('#txtInsertCarPlate').val();
    let bCarMoney = $('#checkboxCarMoney').prop('checked');
    let iSuperDepartmentID = $('#selectSuperDepInsert').val();
    let iDepartmentID = $('#selectDepInsert').val();
    let sLogicalCodeUser = $('#selectUserInsert').val().trim();
    let bStatus = 1;
    bCarMoney = (bCarMoney) ? '1' : '0';
    let { valid, errMsg } = checkCarInput(sLogicalCode, sCarName, sCarPlate);
    if(!valid) return AlertService.showAlertError('Dữ liệu không họp lệ', errMsg.join(''), 5000);
    let sentData = { sLogicalCode, sCarName, sCarPlate, bCarMoney, 
        iSuperDepartmentID, iDepartmentID, sLogicalCodeUser, bStatus };
    console.log(JSON.stringify(sentData));
    let res = await CarService.insertCar(sentData);
    console.log(res);
    $('#modalInsertCar').modal('hide');
    AlertService.showAlertSuccess('Thêm thành công', '', 4000);
    showCarsListTable();
  }
  
  function filterCarData(filterByDepID){
    let carName = $('#txtFilterCarName').val();
    let carPlate = $('#txtFilterCarPlate').val();
    let depID = $selectDep.val();
    let superDepID = $selectSuperDep.val();
    let arr1;
    if(filterByDepID) {
      if(depID == 0 || !depID) arr1 = FilterService.filterByUserSuperDepID(arrCars, superDepID);
      else arr1 = FilterService.filterByUserDepID(arrCars, depID);
    }
    else arr1 = FilterService.filterByUserSuperDepID(arrCars, superDepID);
    let arr2 = FilterService.filterBySearchVal(arr1, 'sCarPlate', carPlate);
    arrFilteredCars = FilterService.filterBySearchVal(arr2, 'sCarName', carName);
    showPagination(arrFilteredCars);
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

  async function showCarsListTable(){
    let data = await CarService.getCars();
    arrFilteredCars.length = 0;
    if(!data) {
      AlertService.showAlertError('Không có dữ liệu', '', 4000);
    }else{
      arrCars = data.map(item => {
        item.sLogicalCodeUser = item.sLogicalCodeUser.trim();
        return item;
      })
      arrFilteredCars = arrCars.slice();
    }
    console.log(arrCars);
    showPagination(arrCars);
  }
  
  function checkIsAdmin(){
    let user = JSON.parse(sessionStorage.getItem('authenticatedUser'))[0];
    let { bAdmin } = user;
    return bAdmin == 1;
  }
  
  function renderCarsTbl(data) {
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
        <th class="font-weight-bold">Xe</th>
        <th class="font-weight-bold">Logical Code</th>
        <th class="font-weight-bold">Tên người dùng</th>
        <th class="font-weight-bold">Biển số xe</th>
        <th class="font-weight-bold">Phòng ban</th>
        <th class="font-weight-bold">Vụ</th>
        ${thBC}
        <th class="font-weight-bold"></th>
      </tr>
      `
    )
    if (data) {
      data.forEach((car, index) => {
        const { bCarMoney, sDepartmentName, sSuperDepartmentName,
             bStatus, sCarName, sCarPlate, sLogicalCodeCar, sUserUsed } = car;
        let btnUpdate = '';
        // let tdBC = '';
        if(isAdmin) {
          btnUpdate = '<button class="btn btn-custom btn-update border-radius-custom" style="text-transform: none; background-color: #353e4c">Cập nhật</button>';
          btnDelete = '<button class="btn btn-custom btn-delete border-radius-custom" style="text-transform: none; background-color: #f2a474">Xóa</button>';
        //   tdBC = `<td>${bDimuonVesom == 0 ? 'Không' : 'Có'}</td>`;
        }
        $tbody.append(`
          <tr>
            <td>${index + 1}</td>
            <td>${sCarName}</td>
            <td>${sLogicalCodeCar}</td>
            <td>${sUserUsed}</td>
            <td>${sCarPlate}</td>
            <td>${sDepartmentName}</td>
            <td>${sSuperDepartmentName}</td>
            <td>
              ${btnDelete}
              ${btnUpdate}
            </td>
          </tr>
        `)
        if(isAdmin){
          $tbody.find('.btn.btn-update').last().click(() => {
            showUpdateCarModal(car);
          })
          $tbody.find('.btn.btn-delete').last().click(() => {
            deleteCar(car);
          })
        }
      })
    }
  
    $table.append($thead).append($tbody);
    return $table;
  }
  
  function showPagination(data){
    if(!data) return clearPagination();
    $('#pagingTotal').html(`<strong>Tổng số xe:</strong> ${data.length}`)
    $('#pagingControl').pagination({
      dataSource: data,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        let $table = renderCarsTbl(data);
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
    let $table = $(`#tblPrintCars`);
    $table.html('');
    let $thead = $('<thead></thead>');
    let $tbody = $('<tbody></tbody>');
    $thead.html(
      `
      <tr>
        <th class="font-weight-bold">STT</th>
        <th class="font-weight-bold">Xe</th>
        <th class="font-weight-bold">Logical Code</th>
        <th class="font-weight-bold">Tên người dùng</th>
        <th class="font-weight-bold">Biển số xe</th>
        <th class="font-weight-bold">Phòng ban</th>
        <th class="font-weight-bold">Vụ</th>
        <th class="font-weight-bold"></th>
      </tr>
      `
    )
    if (data) {
      data.forEach((car, index) => {
        const { bCarMoney, sDepartmentName, sSuperDepartmentName,
          bStatus, sCarName, sCarPlate, sLogicalCodeCar, sUserUsed } = car;
        $tbody.append(`
          <tr>
            <td>${index + 1}</td>
            <td>${sCarName}</td>
            <td>${sLogicalCodeCar}</td>
            <td>${sUserUsed}</td>
            <td>${sCarPlate}</td>
            <td>${sDepartmentName}</td>
            <td>${sSuperDepartmentName}</td>
          </tr>
        `)
      })
    }
  
    $table.append($thead).append($tbody);
  }
  
  function printUserList(){
    renderTblPrintUsersList(arrFilteredCars);
    let $table = $('#tblPrintCars');
    let filename = "danh-sach-xe";
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
    
    <title>Danh sách xe</title>
  
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
    let $table = $('#tblPrintCars');
    let printtingArea = `
      <h1 class="text-center mt-4">Danh sách xe</h1>
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
  
  