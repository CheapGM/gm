"use client";

import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import { usePathname, useSearchParams } from "next/navigation";
import { MdCancel } from "react-icons/md";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "@/ui/components/link";
import Image from "@/ui/components/image";
import Container from "@/ui/components/container";
import { HEADER_MENU_LIST } from "@/utils/constant";
import { cn } from "@/utils";
import { LogoutIcon } from "@/ui/components/icon/LogoutIcon";

type MenuProps = { showMenu: boolean; setShowMenu: (value: boolean) => void };
const MobileMenu: React.FC<MenuProps> = ({ showMenu, setShowMenu }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const handleClose = () => setShowMenu(!showMenu);

  const connectWallet = () => {
    handleClose();
    openConnectModal && openConnectModal();
  };

  return (
    <div
      className={`!m-0 fixed h-full w-full py-4 transition-all duration-300 z-[500] left-0 top-0 bg-white/60 ${
        showMenu
          ? "visible opacity-100 backdrop-blur-md"
          : "invisible opacity-0"
      }`}
    >
      <Container>
        <div className="flex flex-col h-full gap-10">
          <div className="flex flex-col space-y-5">
            <div className="flex items-center justify-between pb-5">
              <Link href="/" onClick={handleClose} className="cursor-pointer">
                <Image
                  src="/img/cheap-logo.png"
                  alt="CheapGM logo"
                  className="rounded-full"
                  width={48}
                  height={48}
                />
              </Link>

              <button onClick={handleClose}>
                <MdCancel className="w-[35px] h-[35px] mobile:w-[30px] mobile:h-[30px] text-text3" />
              </button>
            </div>
            {!address && (
              <button
                onClick={connectWallet}
                className={`text-primary text-xl mobile:text-base font-normal cursor-pointer border border-primary rounded-lg py-2 text-center`}
              >
                Connect Wallet
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-5">
            {HEADER_MENU_LIST.map((menu, index) => {
              const isActive = menu.tab
                ? pathname === "/" &&
                  (menu.tab === searchParams.get("tab") ||
                    (menu.tab === "gm" && !searchParams.get("tab")))
                : pathname === menu.link;

              return (
                <Link
                  key={`navbar_menu_${index}`}
                  href={menu.link}
                  onClick={handleClose}
                  newTab={menu.external}
                  className={cn(
                    "animated-border relative hover:text-primary text-black",
                    "flex items-center gap-2",
                    "text-xl mobile:text-base",
                    isActive ? "text-primary font-medium" : "font-normal"
                  )}
                >
                  {menu.iconType === "component" ? (
                    <menu.icon className="w-5 h-5" />
                  ) : (
                    <Image
                      src={menu.icon as string}
                      alt={menu.name}
                      width={20}
                      height={20}
                    />
                  )}
                  {menu.name}
                </Link>
              );
            })}

            {address && (
              <button
                onClick={() => {
                  disconnect();
                  handleClose();
                }}
                className={cn(
                  "animated-border relative text-danger hover:text-danger/80",
                  "flex items-center gap-2",
                  "text-xl mobile:text-base font-normal"
                )}
              >
                <LogoutIcon />
                Disconnect Wallet
              </button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MobileMenu;
