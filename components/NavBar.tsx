import React from "react";
import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import Link from "next/link";
import { Input } from "@nextui-org/input";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

const NavBar = () => {
  return (
    <Navbar className=" bg-slate-950" isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <a href="/">
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
          </a>
          <p className="hidden sm:block font-bold text-inherit">Anime</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
          <NavbarItem>
            <Link color="foreground" href="#">
              Film
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page" color="secondary">
              Anime
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="" justify="end">
        <Input
          classNames={{
            base: "max-w-full ml-10 sm:max-w-[150rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal",
          }}
          placeholder="Tape le nom d'un anime..."
          size="sm"
          type="search"
        />
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
