class Export2ExcelService{
  static export2Excel($table, filename, name = "Report"){
    $table.table2excel({
      // exclude CSS class
      // exclude: ".noExl",
      name: name,
      filename: filename,//do not include extension
      // fileext: ".xls",
      // exclude_img: true,
      // exclude_links: true,
      // exclude_inputs: true
    });
  }
}