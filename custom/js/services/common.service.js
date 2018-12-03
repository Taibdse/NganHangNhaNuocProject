class CommonService{
  
  static handleData(data){
    if(!data) return null;
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static handleError(error){
    console.log(error.message);
    return null;
  }

  static removeUnicode(str){
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }
  
  static shuffleArray(arr){
    let l = arr.length;
    for (let index = 0; index < l; index++) {
      let randomInt = Math.floor(Math.random() * l);
      let temp = arr[index];
      arr[index] = arr[randomInt];
      arr[randomInt] = temp;
    }
    return arr;
  }

  static getPageSize(l){
    if(l < 100) return 10;
    if(l < 250) return 15;
    if(l < 400) return 20;
    if(l < 600) return 30;
    else return 50;
  }

  static getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
  }

}