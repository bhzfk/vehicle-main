import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import getBrands, { IBrand } from "services/brands.service";
import getModels, { IModel } from "services/models.service";
import getCategories, { ICategory } from "services/categories.service";
import { UploadOutlined } from "@ant-design/icons";
import submitVehicle from "services/vehicle-submit.service";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { fixDateFormat } from "utils/format";
import { getSingleFile } from "utils/helpers";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const RegisterForm = () => {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [models, setModels] = useState<IModel[]>([]);
  const [image, setImage] = useState();
  const [modelsDisabled, setModelsDisabled] = useState(true);
  const [categoryDisabled, setCategoryDisabled] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [form] = Form.useForm();
  const router = useRouter();
  const getBrandsData = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  const getModelsData = async (brandId: number) => {
    const data = await getModels(brandId.toString());
    setModels(data);
  };

  const getCategoriesData = async (modelId: number) => {
    const data = await getCategories(modelId.toString());
    setCategories(data);
  };

  useEffect(() => {
    getBrandsData();
  }, []);

  function onChangeBrand(value: number) {
    setModels([]);
    getModelsData(value);
    setModelsDisabled(false);
    form.setFieldsValue({ model: null, category: null });
  }

  const normFile = (e: any) => {
    const img = getSingleFile(e);
    if (img) setImage(img);
    else return;
  };

  const onFormSubmit = async (values: any) => {
    const formData = new FormData();

    formData.append("brandSelect", values.brand);
    formData.append("modelSelect", values.model);
    formData.append("categorySelect", values.category);
    formData.append("purchaseDate", fixDateFormat(values.purchaseDate._d));

    if (values.firstRegisteration === undefined) {
      formData.append("firstRegisteration", "");
    } else {
      formData.append(
        "firstRegisteration",
        fixDateFormat(values.firstRegisteration._d)
      );
    }

    formData.append(
      "constructionDate",
      fixDateFormat(values.constructionDate._d)
    );
    formData.append("customerName", values.customer);
    formData.append("contractor", values.contractor);
    formData.append("purchasePrice", values.price);
    formData.append("identificationNumber", values.id);
    formData.append("file", image);

    const resp = await submitVehicle(formData);
    if (resp.status === 200) router.push(`/vehicle-info/${resp.vehicleId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-12">
      <Form
        {...layout}
        form={form}
        name="register-vehicle"
        className="w-1/3"
        onFinish={onFormSubmit}
      >
        {/* <div className="flex items-center w-full mb-4">
          <Image
            src="/icons/vehicle.png"
            width={48}
            height={48}
            alt="fahrzeug definiren"
          />
          <h2 className="ml-2 text-lg text-blue-400">Fahrzeug definiren</h2>
        </div> */}
        <Form.Item name="brand" label="Marke" rules={[{ required: true }]}>
          <Select
            placeholder="Select vehicle's brand"
            showSearch
            optionFilterProp="children"
            onSelect={onChangeBrand}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {brands.map((brand) => (
              <Option key={uuidv4()} value={brand.id}>
                {brand.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="model" label="Modell" rules={[{ required: true }]}>
          <Select
            disabled={modelsDisabled}
            placeholder="Select brand's model"
            showSearch
            // allowClear
            optionFilterProp="children"
            onSelect={(id: number) => {
              setCategoryDisabled(false);
              getCategoriesData(id);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {models.map((model) => (
              <Option key={uuidv4()} value={model.id}>
                {model.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          label="Kategorie"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select category"
            showSearch
            disabled={categoryDisabled}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {categories.map((cat) => (
              <Option key={uuidv4()} value={cat.id}>
                {cat.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* <Form.Item name="customer" required label="Customer name">
          <Input />
        </Form.Item> */}
        <Form.Item
          name="contractor"
          required
          label="Käufer"
          rules={[{ required: true }]}
        >
          <Input placeholder={'Ankauf von'} />
        </Form.Item>
        <Form.Item
          name="purchaseDate"
          required
          label="Kaufdatum"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="price"
          required
          label="Preis"
          rules={[{ required: true }]}
        >
          <InputNumber
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item name="firstRegisteration" label="Erstzulassung">
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="constructionDate"
          required
          label="Baujahr"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="id"
          required
          label="Identifikationsnummer"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Bilder"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Bild hochladen"
        >
          <Upload
            name="images"
            listType="picture"
            className="upload-list-inline"
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 20 }}>
          <Button type="primary" htmlType="submit">
            Bestätigen
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
