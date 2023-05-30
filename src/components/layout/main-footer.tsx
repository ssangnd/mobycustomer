import CertificateLogo from "@/images/certificate-cong-thuong.jpg";
import AndroidDownloadLogo from "@/images/download-on-android.png";
import AppleDownloadLogo from "@/images/download-on-apple-store.png";

import { useViewportSize } from "@mantine/hooks";
import { QRCode } from "antd";
import Image from "next/image";
import Link from "next/link";
import { withRouter } from "next/router";
import { Fragment } from "react";
import { FiFacebook, FiYoutube } from "react-icons/fi";

const MainFooter = () => {
  const { width } = useViewportSize();
  return (
    <Fragment>
      <div className="drop-shadow-2xl bg-white grid place-items-center py-5">
        <div className="gap-4 xl:w-[1280px] lg:w-[1024px] w-full grid md:grid-cols-5 grid-cols-1  p-4 ">
          <div className="md:col-span-2  flex flex-col gap-3">
            <div className="font-bold mb-2">Tải ứng dụng MOBY</div>
            <div className="flex gap-3">
              <QRCode
                size={125}
                color="#e759a0"
                errorLevel="H"
                value="https://ant.design/"
                icon={
                  "https://dsm01pap009files.storage.live.com/y4mxEahTOFsx_qum5m4LmUsT9Y4wrLMImjPJ-lMW8NUAu0sdPdZbjWpRYQs_m7pZK6CuwF31QduEEvES7QgD4EGNgecM-A9rprmHF8HXHiWMWZjpTFI0H97IlWrHdikIEkCve1miFblRYTlEswKBrO5bxCrz6EdtmHzUi47bdX3Wm3g-P62MCZ9t_nZAiRQsujQ?width=1033&height=1035&cropmode=none"
                }
              />
              <div className="flex flex-col gap-3">
                <Link href="/">
                  <Image
                    src={AppleDownloadLogo}
                    alt="Download on Apple Store"
                    width={140}
                    className="w-50"></Image>
                </Link>
                <Link href="/">
                  <Image
                    src={AndroidDownloadLogo}
                    alt="Download on Apple Store"
                    width={140}
                    className="w-50"></Image>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 no-underline">
            <div className="font-bold mb-2">Hỗ trợ khách hàng</div>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              Trung tâm trợ giúp
            </Link>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              An toàn mua sắm
            </Link>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              Quy định cần biết
            </Link>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              Quy chế quyền riêng tư
            </Link>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              Liên hệ hỗ trợ
            </Link>
          </div>
          <div className="flex flex-col gap-2 no-underline">
            <div className="font-bold mb-2">Về MOBY</div>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              Giới thiệu
            </Link>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              Tuyển dụng
            </Link>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              Truyền thông
            </Link>
            <Link
              href={"/"}
              className="text-sm no-underline text-gray-400 hover:text-primary">
              Blog
            </Link>
          </div>
          <div className="flex flex-col gap-2 no-underline">
            <div className="font-bold mb-2">Liên kết</div>
            <div className="flex gap-3">
              <Link
                href={"/"}
                className="text-sm no-underline text-blue-300 hover:text-primary">
                <FiFacebook className="text-2xl" />
              </Link>
              <Link
                href={"/"}
                className="text-sm no-underline text-red-300 hover:text-primary">
                <FiYoutube className="text-2xl" />
              </Link>
            </div>
            <div className="font-bold mb-2">Chứng nhận</div>
            <Image
              src={CertificateLogo}
              alt="Chứng nhận"
              width={140}
              className="w-50"></Image>
          </div>
        </div>
      </div>
      <div className="bg-primary text-white flex justify-center py-2">
        @Copyright by MOBY Group. Capstone Project - Spring 2023
      </div>
    </Fragment>
  );
};

export default withRouter(MainFooter);
