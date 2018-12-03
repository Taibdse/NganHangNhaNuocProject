class AlertService{
  
  static showAlertError(title, text, timer){
    swal({
      title: title,
      text: text,
      icon: "error",
      button: "Close!",
      timer: timer
    });
  }
  
  static showAlertSuccess(title, text, timer){
    swal({
      title: title,
      text: text,
      icon: "success",
      button: "Close!",
      timer: timer
    });
  }
  
  static async showAlertWarning(title, text, buttons){
    if(!buttons) buttons = true;
    // if(!dangerMode) dangerMode = true;
    let sure = await swal({
      title: title,
      text: text,
      icon: "warning",
      buttons: buttons,
      dangerMode: true,
    })
    return sure;
  }
}