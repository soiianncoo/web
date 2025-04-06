import React, { Fragment, memo } from "react";
import Avatar from "assets/user.png";
import { memberSidebar } from "ultils/contants";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux'
const Active =
  "flex items-center gap-2 border-b w-full bg-blue-600 text-white hover:bg-blue-600 hover:text-white transition-all";
const notActive =
  "flex items-center gap-2 border-b w-full hover:bg-blue-600 hover:text-white transition-all";

const MemberSidebar = () => {
const {current} = useSelector(state=>state.user)
  return (
    <div className="w-[17%] bg-white h-full py-4 flex-none">
      <div className="w-full flex flex-col items-center justify-center gap-2 p-6 border-b">
        <img
          src={current?.avatar || Avatar}
          alt="Logo"
          className={`w-[100px] h-[100px] object-contain rounded-full border p-1 ${
            current?.isBlocked ? "border-main" : "border-green-500"
          }`}
        />
        <small className="capitalize text-center">
          {`không gian làm việc của ${current?.firstname} ${current?.lastname}`}
        </small>
      </div>
      <div className="flex flex-col w-full items-start justify-center">
        {memberSidebar.map((el) => (
          <Fragment key={el.id}>
            <NavLink
              to={el.path}
              className={({ isActive }) =>
                isActive ? `py-2 px-4 ${Active}` : `py-2 px-4 ${notActive}`
              }
            >
              <span>{el.icon}</span>
              <span>{el.text}</span>
            </NavLink>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(MemberSidebar);
