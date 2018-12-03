class DepartmentService{
  static async getDepartment(sentData) {
    let url = `${APP_DOMAIN}SMIApi/GetDepartment.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  } 
  // http://115.79.27.219/SMIApi/GetDepartment.php
}