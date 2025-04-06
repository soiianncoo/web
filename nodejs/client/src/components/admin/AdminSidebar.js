import React, { Fragment, memo, useState } from "react";
import logo from "assets/logo.png";
import { adminSidebar } from "ultils/contants";
import { NavLink } from "react-router-dom";
import icons from "ultils/icons";
import path from "ultils/path";
import { Link } from "react-router-dom";
const { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } = icons;

const Active =
  "flex items-center gap-2 border-b w-full bg-gray-700 text-white hover:bg-gray-600 hover:text-white transition-all";
const notActive =
  "flex items-center gap-2 border-b w-full hover:bg-gray-500 hover:text-white transition-all";

const AdminSidebar = () => {
  const [activeClick, setActiveClick] = useState(false);

  return (
    <div className="w-[17%] float-none fixed top-0 bottom-0">
      <div className="w-full flex flex-col items-center justify-center gap-2 p-6 border-b bg-gray-700">
      <Link to={`/${path.HOME}`} className="flex items-center">
          <img src={logo} alt="logo" className="w-[150px] object-contain" />
        </Link>
      </div>
      <div className="flex flex-col size-full bg-th text-tht font-semibold">
        {adminSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({ isActive }) =>
                  isActive ? `py-2 px-4 ${Active}` : `py-2 px-4 ${notActive}`
                }
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}
            {el.type === "PAREMT" && (
              <div className="w-full">
                <div
                  className={`py-2 px-4 ${notActive} flex justify-between cursor-pointer`}
                  onClick={() => setActiveClick((prev) => !prev)}
                >
                  <span className="flex gap-2 items-center">
                    <span>{el.icon}</span>
                    <span>{el.text}</span>
                  </span>
                  {activeClick ? (
                    <MdOutlineKeyboardArrowDown size={20} />
                  ) : (
                    <MdOutlineKeyboardArrowRight size={20} />
                  )}
                </div>
                {activeClick && (
                  <div className="w-full flex flex-col">
                    {el.submenu.map((el, index) => (
                      <NavLink
                        key={index}
                        to={el.path}
                        className={({ isActive }) =>
                          isActive
                            ? `py-2 px-6 ${Active}`
                            : `py-2 px-6 ${notActive}`
                        }
                      >
                        <span>{el.subIcon}</span>
                        <span>{el.text}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
