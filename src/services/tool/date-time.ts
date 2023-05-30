class DateMethod {
  getTimeSinceByMiliSecond(dateSeconds) {
    var seconds = Math.floor((new Date().getTime() - dateSeconds) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " năm";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " tháng";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " ngày";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " giờ";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " phút";
    }
    return "Mới đây";
  }

  getTimeRelative(date: Date){
    var seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " năm";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " tháng";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " ngày";
    }
  }
}
export const dateService = new DateMethod();
