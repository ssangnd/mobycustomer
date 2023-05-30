import { Button, Calendar, Card, TimePicker } from "antd";
import Link from "next/link";

const AdminPage = ({ Component, pageProps }) => {
  return (
    <div className="text-bold flex flex-col">
      <span className="mt-5 font-bold">dss</span>
      <span className="mt-5">dss</span>
      <Card>dsadsadas</Card>
      <Button type="primary">Loading</Button>
      {/* <Switch defaultChecked>AAA</Switch> */}
      <TimePicker></TimePicker>
      <Link href="/">Back</Link>
      <Calendar />
    </div>
  );
};

export default AdminPage;
