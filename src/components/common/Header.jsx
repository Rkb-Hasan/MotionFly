import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#3F3F3F] bg-[#a0abe5] py-1">
      <div className="container flex  items-center justify-between ">
        <Link to="/">
          Home
          {/* <img
            className="max-w-[30px] md:max-w-10 lg:max-w-[60px] rounded-full "
            src={logo}
          /> */}
        </Link>

        <div className=" flex items-center justify-center gap-5 sm:gap-10 grow">
          <Link to="/" className="btn-primary ">
            home
            {/* <img className="w-[18px] md:w-6 lg:w-8" src={home} alt="Home" /> */}
          </Link>
          <button className="icon-btn ">
            {/* <img
              className="w-[18px] md:w-6 lg:w-8 "
              src={notification}
              alt="Notification"
            /> */}
          </button>

          {/* <Logout /> */}
        </div>

        <Link to="/tryon">
          <button className="flex-center  gap-2">
            TryOn
            {/* <span className="text-[10px] sm:text-base font-medium md:text-lg lg:text-xl  ">
              {user?.firstName} {user?.lastName}
            </span>
            <img
              className="h-8 w-8 md:h-12 md:w-12 lg:h-15 lg:w-15 rounded-full"
              src={`${import.meta.env.VITE_SERVER_BASE_URL}/${user?.avatar}`}
              alt="avatar"
            /> */}
          </button>
        </Link>
      </div>
    </nav>
  );
}
