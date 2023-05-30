import { useQuery } from "@tanstack/react-query";
import { reportService } from "services/axios/report";

export const useReportListByUser = (data) => {
  return useQuery({
    queryKey: ["/reports-by-users", data],
    queryFn: () => {
      if (!data) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return reportService.getReportsByUser(data);
    },
    enabled: data ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useReportByID = ({
  report,
  type,
}: {
  report: number;
  type: number;
}) => {
  return useQuery({
    queryKey: ["/report-by-id", report, type],
    queryFn: () => {
      if (!report) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return reportService.getReportByID({ report, type });
    },
    enabled: report ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
export const useReportStatusByID = ({
  id,
  type,
}: {
  id: number;
  type: number;
}) => {
  return useQuery({
    queryKey: ["/report-status-by-id", id, type],
    queryFn: () => {
      if (!id) {
        throw new Error("[useItem] Invalid item_id parameter");
      }
      return reportService.getStatusByID({ id, type });
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
