import MobyLogo from "@/images/moby-landscape-logo.png";
import { Drawer } from "antd";
import Image from "next/image";
import { Fragment, useState } from "react";
import { FiMenu } from "react-icons/fi";

export const MainDrawer = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <Fragment>
      <FiMenu
        onClick={showDrawer}
        className="md:hidden block mr-2 cursor-pointer  text-primary"
      />
      <Drawer
        title={
          <Image src={MobyLogo} alt="Moby" width={100} className="w-50"></Image>
        }
        placement="left"
        onClose={onClose}
        open={open}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </Fragment>
  );
};
