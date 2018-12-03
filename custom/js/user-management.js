
$(() => {

    $('#checkboxUpdateAdminStatus').change(function(e){
        let checked = $(e.target).prop('checked');
        $('input[name="pageCanBeAccessed"]').prop('checked', checked);
    })

    $('#checkboxInsertAdminStatus').change(function(e){
        let checked = $(e.target).prop('checked');
        $('input[name="pageCanBeAccessedInsert"]').prop('checked', checked);
    })

    $('#btnUpdateUserSystem').click(updateUserSystem);
    $('#btnInsertUserSystem').click(insertUserSystem);
    $('#btnShowInsertUserSystem').click(showModalInsertUser);

    showUsersSystemListTable();

})


let currentUserSystem = {};
let arrUsers = [];

function renderUsersTbl(data) {
    let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblUserSystem"></table>`)
    let $thead = $('<thead></thead>');
    let $tbody = $('<tbody></tbody>');
    $thead.html(
      `
      <tr>
        <th class="font-weight-bold">STT</th>
        <th class="font-weight-bold">Họ và tên</th>
        <th class="font-weight-bold">Tên người dùng</th>
        <th class="font-weight-bold">Phân quyền</th>
        <th class="font-weight-bold">Trang truy cập</th>
      </tr>
      `
    )
    if (data) {
      data.forEach((user, index) => {
        const { bAdmin, iUserID, sFullName, sUsername } = user;
        
        $tbody.append(`
          <tr>
            <td>${index + 1}</td>
            <td>${sFullName}</td>
            <td>${sUsername}</td>
            <td>${bAdmin == 1 ? 'Admin' : 'Người dùng'}</td>
            <td>${getPageCanBeAccessed(user)}</td>
            <td>
              <button class="btn btn-custom btn-update-user-system border-radius-custom" style="margin-right: 5px; text-transform: none;background-color: #6785b2">Cập nhật</button>
            </td>
          </tr>
        `)
        $tbody.find('.btn.btn-update-user-system').last().click(() => {
            showUpdateModalUserSystem(user);
        })
        
      })
    }
  
    $table.append($thead).append($tbody);
    return $table;
}

function showModalInsertUser(){
    $('#modalInsertUserSystem').modal('show');
    $('#txtInsertUsername').val('');
    $('#txtInsertFullname').val('');
    $('#txtInsertPassword').val('');
    $('#checkboxInsertAdminStatus').prop('checked', false);
    $('input[name="pageCanBeAccessedInsert"]').eq(0).prop('checked', false);
    $('input[name="pageCanBeAccessedInsert"]').eq(1).prop('checked', false);
    $('input[name="pageCanBeAccessedInsert"]').eq(2).prop('checked', false);
    $('input[name="pageCanBeAccessedInsert"]').eq(3).prop('checked', false);
    $('input[name="pageCanBeAccessedInsert"]').eq(4).prop('checked', false);
    $('input[name="pageCanBeAccessedInsert"]').eq(5).prop('checked', false);
}

async function insertUserSystem(){
    let bPage1 = 1, bPage2 = 1, bPage3 = 1, bPage4 = 1, bPage5 = 1, bPage6 = 1;
    let sUsername = $('#txtInsertUsername').val();
    let sPassword = $('#txtInsertPassword').val();
    let sFullName = $('#txtInsertFullname').val();
    let { valid, errMsg } = checkValidInfo(sUsername, sPassword, sFullName);
    if(!valid) return AlertService.showAlertError('Dũ liệu không hợp lệ', errMsg);
    let bAdmin = $('#checkboxInsertAdminStatus').prop('checked') ? 1 : 0;
    if(bAdmin != "1") {
        let $ele = $('input[name="pageCanBeAccessedInsert"]');
        $ele.eq(0).prop('checked') ? '' : (bPage1 = 0);
        $ele.eq(1).prop('checked') ? '' : (bPage2 = 0);
        $ele.eq(2).prop('checked') ? '' : (bPage3 = 0);
        $ele.eq(3).prop('checked') ? '' : (bPage4 = 0);
        $ele.eq(4).prop('checked') ? '' : (bPage5 = 0);
        $ele.eq(5).prop('checked') ? '' : (bPage6 = 0);
    }
    let sentData = {  sUsername, sPassword, sFullName, bAdmin, 
      bPage1, bPage2, bPage3, bPage4, bPage5, bPage6 };
    //console.log(sentData);
    let res = await UserManagementService.insertUserSystem(sentData);
    AlertService.showAlertSuccess('Têm thành công', '', 5000);
    $('#modalInsertUserSystem').modal('hide');
    showUsersSystemListTable();
}

function showUpdateModalUserSystem(user){
    currentUserSystem = Object.assign({}, user);
    let { bAdmin, iUserID, sFullName, sUsername, bPage1, bPage2, 
      bPage3, bPage4, bPage5, bPage6 } = user;
    $('#modalpdateUserSystem').modal('show');
    $('#txtUpdateUsername').val(sUsername);
    $('#txtUpdateFullname').val(sFullName);
    $('#txtUpdatePassword').val('');
    if(bAdmin == 1){
        $('#checkboxUpdateAdminStatus').prop('checked', true);
        $('input[name="pageCanBeAccessed"]').prop('checked', true);
    } else{
        $('#checkboxUpdateAdminStatus').prop('checked', false);
        $('input[name="pageCanBeAccessed"]').eq(0).prop('checked', bPage1 == 1);
        $('input[name="pageCanBeAccessed"]').eq(1).prop('checked', bPage2 == 1);
        $('input[name="pageCanBeAccessed"]').eq(2).prop('checked', bPage3 == 1);
        $('input[name="pageCanBeAccessed"]').eq(3).prop('checked', bPage4 == 1);
        $('input[name="pageCanBeAccessed"]').eq(4).prop('checked', bPage5 == 1);
        $('input[name="pageCanBeAccessed"]').eq(5).prop('checked', bPage6 == 1);
    }
}

  async function updateUserSystem(){
    let { iUserID } = currentUserSystem;
    let bPage1 = 1, bPage2 = 1, bPage3 = 1, bPage4 = 1, bPage5 = 1, bPage6 = 1;
    let sUsername = $('#txtUpdateUsername').val();
    let sPassword = $('#txtUpdatePassword').val();
    let sFullName = $('#txtUpdateFullname').val();
    let { valid, errMsg } = checkValidInfo(sUsername, sPassword, sFullName);
    if(!valid) return AlertService.showAlertError('Dũ liệu không hợp lệ', errMsg);
    let bAdmin = $('#checkboxUpdateAdminStatus').prop('checked') ? 1 : 0;
    if(bAdmin != "1") {
        let $ele = $('input[name="pageCanBeAccessed"]');
        $ele.eq(0).prop('checked') ? '' : (bPage1 = 0);
        $ele.eq(1).prop('checked') ? '' : (bPage2 = 0);
        $ele.eq(2).prop('checked') ? '' : (bPage3 = 0);
        $ele.eq(3).prop('checked') ? '' : (bPage4 = 0);
        $ele.eq(4).prop('checked') ? '' : (bPage5 = 0);
        $ele.eq(5).prop('checked') ? '' : (bPage6 = 0);
    }
    let sentData = { iUserID, sUsername, sPassword, sFullName, bAdmin, 
      bPage1, bPage2, bPage3, bPage4, bPage5, bPage6 };
    //console.log(JSON.stringify(sentData));
    let res = await UserManagementService.updateUserSystem(sentData);
    AlertService.showAlertSuccess('Cập nhật thành công', '', 5000);
    $('#modalpdateUserSystem').modal('hide');
    showUsersSystemListTable();
  }

  function getPageCanBeAccessed(user){
    let { bPage1, bPage2, bPage3, bPage4, bPage5, bPage6 } = user;
    let arr = [];
    if(bPage1 == 1) arr.push(arrPageNames[0]);
    if(bPage2 == 1) arr.push(arrPageNames[1]);
    if(bPage3 == 1) arr.push(arrPageNames[2]);
    if(bPage4 == 1) arr.push(arrPageNames[3]);
    if(bPage5 == 1) arr.push(arrPageNames[4]);
    if(bPage6 == 1) arr.push(arrPageNames[5]);
    return arr.join('<br>');
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
        $('#userSystemArea.table-responsive').html($table);
      }
    })
  }
  
  function clearPagination(){
    $('#pagingTotal').html('');
    $('#pagingControl').html('');
    $('#userSystemArea').html('');
  }

  async function showUsersSystemListTable(){
    arrUsers = await UserManagementService.getUserSystem();
    //console.log(arrUsers);
    if(!arrUsers) {
      AlertService.showAlertError('Không có dữ liệu', '', 4000);
    }
    showPagination(arrUsers);
  }


  function checkValidInfo(username, pass, fullname){
      let errMsg = '';
      let valid = true;
      if(!ValidationService.checkNotEmpty(username)){
        errMsg += 'Tên người dùng không được để trống\n';
        valid = false;
      }
      if(!ValidationService.checkNotEmpty(pass)){
        errMsg += 'Mật khẩu không được để trống\n';
        valid = false;
      }
      if(!ValidationService.checkNotEmpty(fullname)){
        errMsg += 'Họ và tên không được để trống\n';
        valid = false;
      }
      return { valid, errMsg };
  }