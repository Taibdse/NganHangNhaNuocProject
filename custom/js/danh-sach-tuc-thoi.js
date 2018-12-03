$(async () => {

  $selectSuperDep.change(e => {
    showDepList(e);
    setTimeout(() => {
      filterUserData(false);
    }, 100);
  });

  $selectDep.change(() => {
    filterUserData(true);
  })

  $btnInDanhSachTrongToaNha.click(printUserList);

  showOnSiteList();

  await SelectComponent.renderSuperDepartment(null, true);
  SelectComponent.renderPosition();
  // showDepListWhenLoad();
  showDepListJustAll();
})

let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let $btnInDanhSachTrongToaNha = $('#btnInDanhSachTrongToaNha');
let arrOnSites = [];
let arrFilteredOnSites = [];

function showDepListJustAll(){
  $('.selectDep').html('');
  $('.selectDep').append(`<option value="0">Tất cả</option>`)
}

function showDepListWhenLoad(){
  let superDepID = $('#selectSuperDep').val();
  let sentData = { iSuperDepartmentID: superDepID };
  SelectComponent.renderDepartment(sentData);
}

function showDepList(e, className){
  let superDepID = e.target.value;
  if(superDepID == 0) return showDepListJustAll();
  let sentData = { iSuperDepartmentID: superDepID };
  SelectComponent.renderDepartment(sentData, className, true);
}

function filterUserData(filterByDepID){
  let depID = $selectDep.val();
  let superDepID = $selectSuperDep.val();
  if(!arrOnSites) return;
  let arr1 = FilterService.filterByUserSuperDepID(arrOnSites, superDepID);
  if(filterByDepID) arrFilteredOnSites = FilterService.filterByUserDepID(arr1, depID);
  else arrFilteredOnSites = arr1;
  showPagination(arrFilteredOnSites);
  $('#txtNumOfPeopleInHouse').val(arrFilteredOnSites.length);
}

function renderTblOnsiteList(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblOnsite"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">STT</th>
        <th class="trn">Họ tên</th>
        <th class="trn">Mã nhân viên</th>
        <th class="trn">Chức vụ</th>
        <th class="trn">Phòng ban</th>
        <th class="trn">Vụ</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((item, index) => {
      const { sDepartmentName, sFirstName, sIdNumber, sLastName, sLogicalCode, sPositionName, sSubDepartmentName, sSuperDepartmentName } = item;
      let fullname = sFirstName + ' ' + sLastName;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${fullname}</td>
          <td>${sIdNumber}</td>
          <td>${sPositionName}</td>
          <td>${sDepartmentName}</td>
          <td>${sSuperDepartmentName}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

async function showOnSiteList() {
  arrOnSites = await UserService.getOnSite();
  if (!arrOnSites) {
    AlertService.showAlertError("Không có dữ liệu", '', 4000);
    arrFilteredOnSites = [];
  }
  else arrFilteredOnSites = arrOnSites.slice();
  //console.log(arrOnSites);
  showPagination(arrOnSites);
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
      let $table = renderTblOnsiteList(data);
      $('#onSiteListArea.table-responsive').html($table);
    }
  })
}

function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#onSiteListArea').html('');
}

function renderTblPrintOnsiteList(data){
  let $table = $(`#tblPrintUsers`);
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th class="font-weight-bold">Họ tên</th>
      <th class="font-weight-bold">Mã nhân viên</th>
      <th class="font-weight-bold">Chức vụ</th>
      <th class="font-weight-bold">Phòng ban</th>
      <th class="font-weight-bold">Vụ</th>
      <th class="trn">Bộ ĐK</th>
    </tr>
    `
  )
  if (data) {
    data.forEach((item, index) => {
      const { sDepartmentName, sFirstName, sIdNumber, sLastName, sLogicalCode, sPositionName, sSubDepartmentName, sSuperDepartmentName } = item;
      let fullname = sFirstName + ' ' + sLastName;
      $tbody.append(`
        <tr>
          <td>${fullname}</td>
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
}

function printUserList(){
  if(!arrFilteredOnSites || arrFilteredOnSites.length == 0) return AlertService.showAlertError('Không có dữ liệu để in', '', 5000);
  renderTblPrintOnsiteList(arrFilteredOnSites);
  // $('#modalPrintUsers').modal('show');
  let $table = $('#tblPrintUsers');
  let filename = "danh-sach-tuc-thoi";
  Export2ExcelService.export2Excel($table, filename);
}
