import { useAuth } from "@reactivers/hooks";
import RegisterForm from "components/vehicle/RegisterForm";

const Vehicle = () => {
  const { user } = useAuth();

  if (["owner", "sale"].includes(user.userInfo.role)) {
    return <RegisterForm />;
  }

  return (
    <div>
      <p>You don't have access to create a vehicle</p>
    </div>
  );
};

export default Vehicle;
