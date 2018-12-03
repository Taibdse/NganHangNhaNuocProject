
// FirstName, IDNumber, LogicalCode, Name, idUser, type, ValidityDate; {date, timezone, timezone_type}

$(() => {
  showUsersData();
})

function resetTblUsersList() {
  $('#totalUsers').html('');
  $('#pagingUsersControl').html('');
  $('#tblUsers').find('tbody').html('');
}

function renderTblUsersList(users) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblUsers"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
	    	<th class="trn">ID.</th>
		    <th class="trn">Mã đăng kí</th>
			<th class="trn">Họ</th>
		    <th class="trn">Tên</th>
			<th class="trn">Loại thẻ</th>
			<th class="trn">Phòng ban</th>
			<th class="trn">Ngày khởi tạo</th>
		  <th class="trn">Ngày hiệu lực</th>
      </tr>
    `
  )
  if (users) {
    users.forEach((user) => {
      const { sFirstName, sLogicalCode, sLastName, sIdNumber, iTypeUser, dCreationDate, dValidityDate, sDepartmentName } = user;
      //const { date, timezone, timezone_type } = ValidityDate;
      $tbody.append(`
        <tr>
		      <td>${sIdNumber}</td>
		      <td>${sLogicalCode}</td>
          <td>${sFirstName}</td>
          <td>${sLastName}</td>
          <td>${iTypeUser}</td>
          <td>${sDepartmentName}</td>
          <td>${dCreationDate}</td>
		      <td>${dValidityDate}</td>
        </tr>
      `)
    })
  }
  $table.append($thead).append($tbody);
  return $table;
}

async function showUsersData() {
  let users = await Service.getUsersData();
  //console.log(users);

  if (users) {
    $('#totalUsers').html(`<strong>Tổng số:</strong> ${users.length}`)
    $('#pagingUsersControl').pagination({
      dataSource: users,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        // template method of yourself
        let $table = renderTblUsersList(data);
        $('.card-users .table-responsive').html($table);
      }
    })
  } else {
    resetTblUsersList();
    showAlertError("No data available", "", 3000);
  }
}
