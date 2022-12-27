import { Image } from "antd";
import clsx from "clsx";
// import Image from "next/image";

const VehicleItem = ({
  value,
  title,
  color,
  type = "text",
}: {
  value: string;
  title: string;
  color?: string;
  type?: string;
}) => {
  return (
    <div className="flex items-center bg-gray-50">
      <div className="flex items-center justify-center py-1 mt-1 mr-2 bg-gray-200 text-md w-52">
        {title}
      </div>
      {type === "image" ? (
        <div className="pt-2 ml-2">
          <Image
            width={120}
            className="rounded-lg"
            alt="vehicle"
            src={`${process.env.SITE_URL}/uploads/${value}`}
            fallback="/placeholders/nocar.png"
          />
        </div>
      ) : (
        <span
          className={clsx(
            "p-1 pl-2 mt-1 text-md w-72",
            color && `bg-${color}-100`
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export default VehicleItem;
