class CarService{
    // http://115.79.27.219/SMIApi/GetCar.php
    static async getCars() {
      let url = `${APP_DOMAIN}SMIApi/GetCar.php`;
      let method = 'post';
      let data = null;
      try {
        let res = await $.ajax({ url, method, data });
        return CommonService.handleData(res);
      } catch (error) {
        return CommonService.handleError(error);
      }
    }
    // http://115.79.27.219/SMIApi/InsertCar.php
    // {"sLogicalCode":"111331", "sCarName":"11212121", "sCarPlate":"1", "bCarMoney":"1",
    //  "iSuperDepartmentID":"3", "iDepartmentID":"3", "sUserUsed":"Vũ Hoàng", "bStatus":"1"}
    static async insertCar(sentData) {
        let url = `${APP_DOMAIN}SMIApi/InsertCar.php`;
        let method = 'post';
        let data = JSON.stringify(sentData);
        try {
            let res = await $.ajax({ url, method, data });
            return CommonService.handleData(res);
        } catch (error) {
            return CommonService.handleError(error);
        }
    }

    // http://115.79.27.219/SMIApi/deleteCar.php
    static async deleteCar(sentData) {
        let url = `${APP_DOMAIN}SMIApi/deleteCar.php`;
        let method = 'post';
        let data = JSON.stringify(sentData);
        try {
            let res = await $.ajax({ url, method, data });
            return CommonService.handleData(res);
        } catch (error) {
            return CommonService.handleError(error);
        }
    }

    // http://115.79.27.219/SMIApi/UpdateCar.php
    // {"sLogicalCode":"111331", "sCarName":"1124f12121", "sCarPlate":"1ddd",
    //  "bCarMoney":"1", "iSuperDepartmentID":"3",
    //  "iDepartmentID":"3", "sUserUsed":"Vũ Hoàng", "bStatus":"1"}
    static async updateCar(sentData) {
        let url = `${APP_DOMAIN}SMIApi/UpdateCar.php`;
        let method = 'post';
        let data = JSON.stringify(sentData);
        try {
            let res = await $.ajax({ url, method, data });
            return CommonService.handleData(res);
        } catch (error) {
            return CommonService.handleError(error);
        }
    }

    // http://115.79.27.219/SMIApi/getCarOnsite.php
    static async getCarOnsite() {
        let url = `${APP_DOMAIN}SMIApi/getCarOnsite.php`;
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