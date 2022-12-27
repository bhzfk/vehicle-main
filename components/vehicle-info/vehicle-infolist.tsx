import { Spin } from "antd";
import { fixDateFormat, fixDateFormatSimple } from "utils/format";
import VehicleItem from "./vehicle-item";

const siteURL = process.env.SITE_URL;

const VehicleInfoList = ({ isLoading, vehicleInfo }) => {
  // const image = JSON.parse(vehicleInfo[0].jsn);
  let image = null;
  if (!isLoading) {
    if (vehicleInfo[0].jsn)
      image = JSON.parse(vehicleInfo[0].jsn)[0]?.fileName || null;
  }
  return (
    <div className="">
      {isLoading && <Spin tip="Loading vehicle data..." />}
      {!isLoading && (
        <>
          <VehicleItem title="Bild" type="image" value={image} />
          {/* <VehicleItem title="Image" value={vehicleInfo[0].} /> */}
          {vehicleInfo[0].vehicleNumber && (
            <VehicleItem
              title="Interne Fahrzeugnummer."
              value={vehicleInfo[0].vehicleNumber}
            />
          )}
          <VehicleItem title="Marke" value={vehicleInfo[0].brand} />

          <VehicleItem title="Modell" value={vehicleInfo[0].model} />
          <VehicleItem title="Kategorie" value={vehicleInfo[0].category} />
          <VehicleItem
            title="EZ"
            value={fixDateFormatSimple(vehicleInfo[0].firstRegisteration)}
          />
          <VehicleItem
            title="Fahrgestellnummer."
            value={vehicleInfo[0].identificationNumber}
          />
          <VehicleItem title="Käufer" value={vehicleInfo[0].customerName} />
          <VehicleItem title="Zulieferer" value={vehicleInfo[0].contractor} />
          <VehicleItem title="Kaufpreis" value={vehicleInfo[0].purchasePrice} />
          <VehicleItem
            title="Kaufdatum"
            value={fixDateFormatSimple(vehicleInfo[0].purchaseDate)}
          />
          {vehicleInfo[0].startDate && (
            <VehicleItem
              title="Bearbeitungsdatum"
              value={fixDateFormatSimple(vehicleInfo[0].startDate)}
            />
          )}
          {vehicleInfo[0].conditionId && (
            <VehicleItem
              title="Zustand"
              color={vehicleInfo[0].conditionColor}
              value={vehicleInfo[0].conditionTitle}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VehicleInfoList;
