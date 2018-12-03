// http://115.79.27.219/SMIApi/UserSystem.php
class UserManagementService{

    static async getUserSystem() {
      let url = `${APP_DOMAIN}SMIApi/UserSystem.php`;
      let method = 'get';
      let data = null;
      try {
        let res = await $.ajax({ url, method, data });
        return CommonService.handleData(res);
      } catch (error) {
        return CommonService.handleError(error);
      }
    }
    // http://115.79.27.219/SMIApi/InsertUserSystem.php

    static async insertUserSystem(sentData) {
        let url = `${APP_DOMAIN}SMIApi/InsertUserSystem.php`;
        let method = 'post';
        let data = JSON.stringify(sentData);
        try {
          let res = await $.ajax({ url, method, data });
          return res;
        } catch (error) {
          return CommonService.handleError(error);
        }
      }

    //   http://115.79.27.219/SMIApi/UpdateUserSystem.php
      static async updateUserSystem(sentData) {
        let url = `${APP_DOMAIN}SMIApi/UpdateUserSystem.php`;
        let method = 'post';
        let data = JSON.stringify(sentData);
        try {
          let res = await $.ajax({ url, method, data });
          return res;
        } catch (error) {
          return CommonService.handleError(error);
        }
      }

  }