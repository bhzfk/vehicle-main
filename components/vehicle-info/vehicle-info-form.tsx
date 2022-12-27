import { UploadOutlined } from "@ant-design/icons";
import {
  Spin,
  Form,
  message,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
} from "antd";
import clsx from "clsx";
import moment from "moment";
import { useState, useEffect } from "react";
import updateVehicle, {
  IUpdateVehiclePriceRates,
  updatePriceAndSetForSale,
  updateVehicleImage,
} from "services/vehicle-update.service";
import { getVehicle, IVehicle } from "services/vehicles.service";
import VehicleInfoList from "./vehicle-infolist";

const VehicleInfoControl = ({
  isLoading,
  vehicleInfo,
  id,
  token,
  gotoPreparation,
  showUpdatePrice = false,
  refetchVehicles,
  refresh = 0,
}) => {
  // console.log(vehicleInfo);
  const { Option } = Select;
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [inventoryCost, setInventoryCost] = useState<number>(0);
  const [processingCost, setProcessingCost] = useState<number>(0);
  const [sparePartsCost, setSparePartsCost] = useState<number>(0);
  const [workshopInternalCost, setWorkshopInternalCost] = useState<number>(0);
  const [workshopExternalCost, setWorkshopExternalCost] = useState<number>(0);
  const [standCost, setStandCost] = useState<number>(0);
  const [preparationCost, setPreparationCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [financed, setFinanced] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [saleDate, setSaleDate] = useState<string>("");
  const [identificationNumber, setIdentificationNumber] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");

  const onFormSubmit = async (values: any) => {
    // console.log(values);
    const updated: IUpdateVehiclePriceRates = {
      vehicleId: id as string,
      purchasePrice: values.purchasePrice.toString(),
      inevtoryCost: values.inventoryCosts,
      preparationCost: values.preparationCosts,
      processingCost: values.processingCosts,
      sparePartsTotalCost: values.sparePartsTotalCosts,
      standCosts: values.standCosts,
      workshop_i_cost: values.workshopInternalCost,
      workshop_e_cost: values.workshopExternalCost,
      financed,
      identificationNumber: values.identificationNumber,
      customerName: values.customerName,
    };
    await updateVehicle(updated);
    message.success("Update successful");
  };

  const getInitialValues = async () => {
    const initialValues = await getVehicle(id, token);

    console.log(initialValues);

    // setInventoryCost(+initialValues.purchasePrice);
    if (initialValues && initialValues.length) {
      console.log(initialValues);
      const values: IVehicle = initialValues[0];
      setPurchasePrice(+values.purchasePrice);
      setInventoryCost(values.inevtoryCost);
      setProcessingCost(values.processingCost);
      setSparePartsCost(values.sparePartsTotalCost);
      setWorkshopInternalCost(values.workshop_i_cost);
      setWorkshopExternalCost(values.workshop_e_cost);
      setStandCost(values.standCosts);
      setPreparationCost(values.preparationCost);
      setSalePrice(values.salePrice | 0);
      setStatus(values.status);
      setSaleDate(values.saleDate);
      setFinanced(values.financed);
      setIdentificationNumber(values.identificationNumber);
      setCustomerName(values.customerName);
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  async function onPriceFormSubmit(values) {
    const resp = await updatePriceAndSetForSale(
      values.date,
      +values.price,
      id + "",
      token
    );
    if (resp) {
      refetchVehicles();
      getInitialValues();
    }
  }

  useEffect(() => {
    refetchVehicles();
    getInitialValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    setTotalCost(
      +(
        purchasePrice +
        inventoryCost +
        processingCost +
        sparePartsCost +
        workshopInternalCost +
        workshopExternalCost +
        standCost +
        preparationCost
      ).toFixed(2)
    );

    setProfit(salePrice - totalCost);
    // profit > 0 ? setFinanced(true) : setFinanced(false);
  }, [
    purchasePrice,
    inventoryCost,
    processingCost,
    sparePartsCost,
    workshopExternalCost,
    workshopInternalCost,
    standCost,
    preparationCost,
    totalCost,
    salePrice,
    profit,
    identificationNumber,
    customerName,
  ]);

  return (
    <div className="flex ">
      <div className="flex flex-col w-1/3 px-8 ">
        <VehicleInfoList isLoading={isLoading} vehicleInfo={vehicleInfo} />
      </div>
      <div className="flex flex-col w-2/3 px-8 mt-2">
        {/* <h2 className="text-lg font-bold text-blue-300">Business data</h2> */}
        {isLoading && <Spin tip="Loading vehicle data..." />}
        {!isLoading && (
          <div>
            <Form
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              name="updateRates"
              className="flex w-full"
              onFinish={onFormSubmit}
              fields={[
                {
                  name: ["identificationNumber"],
                  value: identificationNumber,
                },
                {
                  name: ["customerName"],
                  value: customerName,
                },
                {
                  name: ["purchasePrice"],
                  value: purchasePrice,
                },
                {
                  name: ["inventoryCosts"],
                  value: inventoryCost,
                },
                {
                  name: ["processingCosts"],
                  value: processingCost,
                },
                {
                  name: ["sparePartsTotalCosts"],
                  value: sparePartsCost,
                },
                {
                  name: ["workshopExternalCost"],
                  value: workshopExternalCost,
                },
                {
                  name: ["workshopInternalCost"],
                  value: workshopInternalCost,
                },
                {
                  name: ["standCosts"],
                  value: standCost,
                },
                {
                  name: ["preparationCosts"],
                  value: preparationCost,
                },
              ]}
            >
              <div className="flex flex-col w-1/2">
                <Form.Item label="Käufer" name="customerName">
                  <Input
                    value={customerName}
                    placeholder={'Ankauf von'}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Fahrgestellnummer."
                  name="identificationNumber"
                >
                  <Input
                    value={identificationNumber}
                    placeholder={identificationNumber.toString()}
                    onChange={(e) => {
                      setIdentificationNumber(e.target.value);
                    }}
                  />
                </Form.Item>

                <Form.Item label="Kaufpreis" name="purchasePrice">
                  <Input
                    value={purchasePrice}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        setPurchasePrice(+e.target.value);
                      }
                    }}
                    placeholder={purchasePrice.toString()}
                  />
                </Form.Item>

                <Form.Item label="Standkosten" name="inventoryCosts">
                  <Input
                    value={inventoryCost}
                    onChange={(e) => setInventoryCost(+e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Vorbereitungskosten" name="processingCosts">
                  <Input
                    value={processingCost}
                    onChange={(e) => setProcessingCost(+e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Ersatzteilkosten(Summe)"
                  name="sparePartsTotalCosts"
                >
                  <Input
                    value={sparePartsCost}
                    onChange={(e) => setSparePartsCost(+e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Interne Werkstattkosten"
                  name="workshopInternalCost"
                >
                  <Input
                    value={workshopInternalCost}
                    onChange={(e) => setWorkshopInternalCost(+e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Externe Werkstattkosten"
                  name="workshopExternalCost"
                >
                  <Input
                    value={workshopExternalCost}
                    onChange={(e) => setWorkshopExternalCost(+e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Standkosten" name="standCosts">
                  <Input
                    value={standCost}
                    onChange={(e) => setStandCost(+e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Vorbereitungskosten" name="preparationCosts">
                  <Input
                    value={preparationCost}
                    onChange={(e) => setPreparationCost(+e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="image"
                  label="Bilder"
                  valuePropName="fileList"
                  extra="Bild hochladen"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return null;
                    } else {
                      if (e.fileList && e.fileList.length) {
                        let formData = new FormData();
                        formData.append("image", e.fileList[0].originFileObj);
                        updateVehicleImage(id, formData);
                      } else return null;
                    }
                  }}
                >
                  <Upload
                    name="images"
                    listType="picture"
                    className="upload-list-inline"
                  >
                    <Button icon={<UploadOutlined />}>Hochladen</Button>
                  </Upload>
                </Form.Item>
              </div>
              <div className="flex flex-col w-1/3 ml-12">
                <div className="flex">
                  <div className="w-2/3">
                    <p className="text-blue-600">Das gesamte Fahrzeugkosten:</p>
                    <p className="text-blue-600">Verkaufspreis:</p>
                    <p className="text-blue-600">Der Gesamtprofit :</p>
                    {/* <p className="text-blue-600">Revenue</p> */}
                    <p className="text-blue-600">Finanziert:</p>
                  </div>
                  <div className="w-1/3">
                    <p className="text-blue-600">{totalCost}</p>
                    <p className="text-blue-600">{salePrice}</p>
                    <p
                      className={clsx(
                        profit > 0 ? "text-green-600" : "text-red-500"
                      )}
                    >
                      {profit.toFixed(2)}
                    </p>
                    {/* <p className="text-blue-600"> {totalCost * 2}</p> */}
                    {/* <p className="text-blue-600">{financed ? "Yes" : "No"}</p> */}
                    <Select
                      onSelect={(e) => setFinanced(e === 1 ? 1 : 0)}
                      value={financed}
                      style={{ width: 120 }}
                    >
                      <Option value={1}>Yes</Option>
                      <Option value={0}>No</Option>
                    </Select>
                  </div>
                </div>
                <div>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        display: "block",
                        marginBottom: 10,
                      }}
                    >
                      Aktualisieren
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                refetchVehicles();
                getInitialValues();
              }}
            >
              Daten aktualisieren
            </Button>
            {showUpdatePrice && (
              <div className="flex flex-col w-full">
                <div className="w-1/2 p-4 mt-4 ml-8 bg-gray-100 rounded-lg ">
                  <div className="flex justify-center ">
                    <Button
                      className="mb-4"
                      onClick={gotoPreparation}
                      type="dashed"
                    >
                      Zurück zur Vorbereitung
                    </Button>
                  </div>
                  <Form
                    {...layout}
                    name="register-spare"
                    onFinish={onPriceFormSubmit}
                  >
                    <Form.Item name="price" label="Preis">
                      <Input />
                    </Form.Item>
                    <Form.Item name="date" label="Verkaufsdatum">
                      <DatePicker />
                    </Form.Item>
                    <Form.Item className="text-right ">
                      {status === "SOLD" ? (
                        <>
                          <p className="text-gray-400">
                            Das Fahrzeug ist verkauft am {saleDate}
                          </p>
                          <Button type="primary" htmlType="submit">
                            Preis aktualisieren
                          </Button>
                        </>
                      ) : (
                        <Button type="primary" htmlType="submit">
                          Als Verkauft markieren
                        </Button>
                      )}
                    </Form.Item>
                  </Form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleInfoControl;
