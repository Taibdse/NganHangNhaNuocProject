class UserService{

  static async getUsersData() {
    let url = `${APP_DOMAIN}SMIApi/GetUser.php`;
    let method = 'post';
    let data = null;
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  // http://115.79.27.219/SMIApi/getUserCombobox.php
  static async getUserComboboxData() {
    let url = `${APP_DOMAIN}SMIApi/getUserCombobox.php`;
    let method = 'post';
    let data = null;
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getUserInOut(sentData) {
    let url = `${APP_DOMAIN}SMIApi/GetUserInOut.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getOnSite() {
    let url = `${APP_DOMAIN}SMIApi/OnSite.php`;
    let method = 'post';
    let data = null;
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getAttendance(sentData) {
    let url = `${APP_DOMAIN}SMIApi/GetAttendance.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async updateUser(sentData) {
    let url = `${APP_DOMAIN}SMIApi/UpdateUser.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async insertUser(sentData) {
    let url = `${APP_DOMAIN}SMIApi/insertUser.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return res;
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getOnSiteDate(sentData) {
    let url = `${APP_DOMAIN}SMIApi/OnSiteDate.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

}