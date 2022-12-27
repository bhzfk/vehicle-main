import { useAuth } from "@reactivers/hooks";
import Image from "next/image";
import Link from "next/link";
import { menuItems } from "services/menus.service";

const Homepage = () => {
  const { user } = useAuth();
  return (
    <div className="grid grid-cols-3 gap-8">
      {menuItems.map(
        (item) =>
          item.roles.includes(user.userInfo.role) && (
            <Link key={item.id} href={`/${item.link}`} passHref>
              <div className="flex items-center p-8 transition-all duration-200 ease-in-out transform bg-gray-200 rounded-lg cursor-pointer hover:bg-blue-100 hover:scale-110">
                <Image
                  src={`/icons/${item.link}.png`}
                  width={81}
                  height={81}
                  alt={`vehicle ${item.link}`}
                  layout="fixed"
                />
                <div>
                  <h2 className="ml-8 text-lg font-bold text-gray-600">
                    {item.title_de}
                  </h2>
                </div>
              </div>
            </Link>
          )
      )}
    </div>
  );
};

export default Homepage;
