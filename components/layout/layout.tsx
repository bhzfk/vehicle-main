import { useEffect } from "react";
import Navigation from "../shared/navigation/navigation";
import Footer from "../shared/footer/footer";
import { useAuth } from "@reactivers/use-auth";
import Login from "components/login";

const Layout = ({ children }) => {
  const { isLoggedIn, login, token } = useAuth();

  useEffect(() => {
    
    if (localStorage.getItem("vehicle_user_data") !== null && token === undefined) {
      const user_data = JSON.parse(localStorage.getItem("vehicle_user_data"));
      login({
        username: user_data.username,
        token: user_data.token,
        userInfo: { role: user_data.role },
      });
    }
  });

  if (!isLoggedIn) return <Login />;
  return (
    <div className="flex flex-col justify-between w-screen h-screen overflow-x-hidden-hidden">
      <Navigation />
      <div className="flex flex-col flex-1"> {children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
