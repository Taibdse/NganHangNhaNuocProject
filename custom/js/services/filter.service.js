class FilterService{

  static filterByUserName(arr, filterVal){
    if(!ValidationService.checkNotEmpty(filterVal)) return arr;
    return arr.filter(user => {
      let {sLastName, sFirstName} = user;
      sFirstName = VNAccents.removeAccents(sFirstName).toLowerCase();
      sLastName = VNAccents.removeAccents(sLastName).toLowerCase();
      let fullname = sFirstName.trim() + ' ' + sLastName.trim();
      filterVal = CommonService.removeUnicode(filterVal).toLowerCase();
      return fullname.indexOf(filterVal) > -1;
    })
  }
  
  static filterByUserID(arr, filterVal){
    if(!ValidationService.checkNotEmpty(filterVal)) return arr;
    return arr.filter(user => {
      let { sIdNumber } = user;
      sIdNumber = (sIdNumber+'').toLowerCase();
      filterVal = CommonService.removeUnicode(filterVal).toLowerCase();
      return sIdNumber.indexOf(filterVal) > -1;
    })
  }
  
  static filterByUserDepID(arr, depID){
    if(depID == 0) return arr;
    return arr.filter(user => {
      let { iDepartmentID } = user;
      return depID == iDepartmentID;
    })
  }

  static filterByUserSuperDepID(arr, superDepID){
    if(superDepID == 0) return arr;
    return arr.filter(user => {
      let { iSuperDepartmentID } = user;
      return superDepID == iSuperDepartmentID;
    })
  }

  static filterByID(arr, prop, id){
    if(id == 0) return arr;
    return arr.filter(item => item[prop] == id);
  }

  static filterBySearchVal(arr, prop, val){
    if(!ValidationService.checkNotEmpty(val)) return arr;
    return arr.filter(item => {
      val = VNAccents.removeAccents(val).toLowerCase();
      let str = VNAccents.removeAccents(item[prop]).toLowerCase();
      return str.indexOf(val) > -1;
    })
  }

}