class SelectComponent{

  static async renderSuperDepartment(className, all){
    if(!className) className = 'selectSuperDep';
    let $ele = $(`.${className}`);
    $ele.html('');
    let arr = await SuperDepartmentService.getSuperDepartment();
    if(!arr) return;
    if(all) $ele.append(`<option value="0">Tắt cả</option>`);
    arr.forEach(item => {
      let { iSuperDepartmentID, sSuperDepartmentName } = item;
      $ele.append(`<option value="${iSuperDepartmentID}">${sSuperDepartmentName}</option>`);
    })
    return arr;
  }

  static async renderDepartment(sentData, className, all){
    if(!className) className = 'selectDep';
    let $ele = $(`.${className}`);
    $ele.html('');
    let arr = await DepartmentService.getDepartment(sentData);
    if(!arr) return;
    if(all) $ele.append(`<option value="0">Tất cả</option>`);
    arr.forEach(item => {
      let { iDepartmentID, sDepartmentName } = item;
      $ele.append(`<option value="${iDepartmentID}">${sDepartmentName}</option>`);
    })
    return arr;
  }

  static async renderUser(sentData, className, all){
    if(!className) className = 'selectUser';
    let $ele = $(`.${className}`);
    $ele.html('');
    let arr = await UserService.getUserComboboxData(sentData);
    if(!arr) return;
    console.log(arr);
    if(all) $ele.append(`<option value="0">Tất cả</option>`);
    arr.forEach(item => {
      let { sLogicalCode, sLastName, sFirstName } = item;
      let fullname = `${sFirstName} ${sLastName}`;
      $ele.append(`<option value="${sLogicalCode}">${fullname}</option>`);
    })
    return arr;
  }

  static async renderPosition(className, all){
    if(!className) className = 'selectPos';
    let $ele = $(`.${className}`);
    $ele.html('');
    let arr = await PositionService.getPosition();
    if(!arr) return;
    if(all) $ele.append(`<option value="0">Tất cả</option>`);
    arr.forEach(item => {
      let { iPositionID, sPositionName } = item;
      $ele.append(`<option value="${iPositionID}">${sPositionName}</option>`);
    })
    return arr;
  }

  static async renderMonths(className, all){
    if(!className) className = 'selectMonth';
    let $ele = $(`.${className}`);
    $ele.html('');
    if(all) $ele.append(`<option value="0">Tất cả</option>`);
    arrMonths.forEach((m, index) => {
      $ele.append(`<option value="${index + 1}">${m}</option>`);
    })
  }

}