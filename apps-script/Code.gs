function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Café Management System")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
