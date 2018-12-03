class Validation{
  static checkEmpty(value){
    if(value == null || value == undefined) return false;
    if(value.trim() == '') return false;
    return true;
  }
}