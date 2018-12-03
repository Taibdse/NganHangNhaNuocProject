class SuperDepartmentService{
  static async getSuperDepartment() {
    let url = `${APP_DOMAIN}SMIApi/GetSuperDepartment.php`;
    let method = 'post';
    let data = null;
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }
}