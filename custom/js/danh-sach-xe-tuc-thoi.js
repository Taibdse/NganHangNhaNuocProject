$(async () => {

    $selectSuperDep.change(e => {
        let superDepID = e.target.value;
        changeDepList(superDepID);
    });
  
    $selectDep.change(() => {
        filterCarData(true);
    })
  
    $btnInDanhSachTrongToaNha.click(printUserList);
  
    showOnSiteList();
  
    await SelectComponent.renderSuperDepartment(null, true);
    SelectComponent.renderPosition();
    showDepListJustAll();
  })
  
  let $selectSuperDep = $('#selectSuperDep');
  let $selectDep = $('#selectDep');
  let $btnInDanhSachTrongToaNha = $('#btnInDanhSachTrongToaNha');
  let arrOnSites = [];
  let arrFilteredOnSites = [];
  
  async function changeDepList(superDepID){
    await showDepList(superDepID);
    filterCarData(false);
  }

  function showDepListJustAll(){
    $('.selectDep').html('');
    $('.selectDep').append(`<option value="0">Tất cả</option>`)
  }
  
  function showDepList(superDepID, className){
    if(superDepID == 0) return showDepListJustAll();
    let sentData = { iSuperDepartmentID: superDepID };
    SelectComponent.renderDepartment(sentData, className, true);
  }
  
  function filterCarData(filterByDepID){
    let depID = $selectDep.val();
    let superDepID = $selectSuperDep.val();
    if(!arrOnSites) return;
    let arr1 = FilterService.filterByUserSuperDepID(arrOnSites, superDepID);
    if(filterByDepID) arrFilteredOnSites = FilterService.filterByUserDepID(arr1, depID);
    else arrFilteredOnSites = arr1.slice();
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
          <th class="trn">Tên Xe</th>
          <th class="trn">Logical Code</th>
          <th class="trn">Biển số xe</th>
          <th class="trn">Phòng ban</th>
          <th class="trn">Vụ</th>
          <th class="trn">Tên người dùng</th>
          <th class="trn">Loại xe</th>
        </tr>
      `
    )
    if (data) {
      data.forEach((item, index) => {
        const { bCarMoney, iDepartmentID, sCarName, sCarPlate, sDepartmentName, 
            sLogicalCodeCar, sSuperDepartmentName, sUserUsed } = item;
            let type = '';
            if(bCarMoney == 1) type = 'Xe chở tiền';
        $tbody.append(`
          <tr>
            <td>${index + 1}</td>
            <td>${sCarName}</td>
            <td>${sLogicalCodeCar}</td>
            <td>${sCarPlate}</td>
            <td>${sDepartmentName}</td>
            <td>${sSuperDepartmentName}</td>
            <td>${sUserUsed}</td>
            <td>${type}</td>
          </tr>
        `)
      })
    }
  
    $table.append($thead).append($tbody);
    return $table;
  }
  
  async function showOnSiteList() {
    arrOnSites = await CarService.getCarOnsite();
    console.log(arrOnSites);
    if (!arrOnSites) {
      AlertService.showAlertError("Không có dữ liệu", '', 4000);
      arrFilteredOnSites = [];
    }
    else arrFilteredOnSites = arrOnSites.slice();
    showPagination(arrOnSites);
  }
  
  function showPagination(data){
    if(!data || data.length == 0) return clearPagination();
    $('#pagingTotal').html(`<strong>Tổng số xe:</strong> ${data.length}`)
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
    $table.html('');
    let $thead = $('<thead></thead>');
    let $tbody = $('<tbody></tbody>');
    $thead.html(
      `
        <tr>
            <th class="trn">STT</th>
            <th class="trn">Tên Xe</th>
            <th class="trn">Logical Code</th>
            <th class="trn">Biển số xe</th>
            <th class="trn">Phòng ban</th>
            <th class="trn">Vụ</th>
            <th class="trn">Tên người dùng</th>
            <th class="trn">Loại xe</th>
        </tr>
      `
    )
    if (data) {
      data.forEach((item, index) => {
        const { bCarMoney, iDepartmentID, sCarName, sCarPlate, sDepartmentName, 
            sLogicalCodeCar, sSuperDepartmentName, sUserUsed } = item;
        let type = '';
        if(bCarMoney == 1) type = 'Xe chở tiền';
        $tbody.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${sCarName}</td>
                <td>${sLogicalCodeCar}</td>
                <td>${sCarPlate}</td>
                <td>${sDepartmentName}</td>
                <td>${sSuperDepartmentName}</td>
                <td>${sUserUsed}</td>
                <td>${type}</td>
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
    let filename = "danh-sach-xe-tuc-thoi";
    Export2ExcelService.export2Excel($table, filename);
  }
  