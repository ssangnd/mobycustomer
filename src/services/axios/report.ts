import qs from "query-string";
import { mobyAxios } from "./axios";

class ReportMethod {
  async saveReport(data) {
    const operator = {
      operate: data.reportID === undefined ? mobyAxios.post : mobyAxios.put,
      params: data.reportID ?? "",
    };
    const res = await operator.operate(
      operator.params ? "Report/UpdateReport" : "Report/CreateReport",
      data
    );
    return res.data;
  }

  async approveReport(reportID) {
    const res = await mobyAxios.patch("Report/ApproveReport", { reportID });
    return res;
  }

  async denyReport(reportID, reason) {
    const res = await mobyAxios.patch("Report/DenyReport", {
      reportID,
      reason,
    });
    return res;
  }
  async getReportsByUser(data) {
    const res = await mobyAxios.post("Report/GetAllReportByUser", data);
    return res.data;
  }
  async getReport(data) {
    const res = await mobyAxios.post("Report/GetAllReportByUser", data);
    return res.data;
  }
  async deleteReport(reportId) {
    const res = await mobyAxios.patch(`Report/DeleteReport`, { reportId });
    return res.data;
  }
  async getReportByID({ report, type }: { report: number; type: number }) {
    const res = await mobyAxios.get(
      `Report/GetDetailReport?${qs.stringify({
        report,
        type,
      })}`
    );
    return res.data;
  }
  async getStatusByID({ id, type }: { id: number; type: number }) {
    const res = await mobyAxios.get(
      `Report/GetStatusAndReasonHiden?${qs.stringify({
        id,
        type,
      })}`
    );
    return res.data;
  }
}
export const reportService = new ReportMethod();
