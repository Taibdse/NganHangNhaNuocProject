class PositionService{

  static async getPosition() {
    let url = `${APP_DOMAIN}SMIApi/GetPosition.php`;
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