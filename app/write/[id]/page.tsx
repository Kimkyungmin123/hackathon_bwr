"use client";
import {
  addRestaurantContent,
  getRestaurantContentById,
  updateRestaurantContent,
} from "@/apis";
import useUserStore from "@/store";
import { RestaurantListType } from "@/types";
import { trimFormValues } from "@/util/trimValue";
import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Rate,
  Space,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Dragger from "antd/es/upload/Dragger";
import { UploadFileStatus } from "antd/es/upload/interface";

type PageParams = {
  id: string;
};

interface ExtendedFile extends File {
  uid: string;
}

const Write = ({ params }: { params: PageParams }) => {
  const [formValue, setFormValue] = useState<RestaurantListType | null>(null);
  const [detailData, setDetailData] = useState<RestaurantListType>();
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [draggerConfig, setDraggerConfig] = useState<any>();
  const { uid, email, name } = useUserStore();
  const router = useRouter();
  const [form] = useForm();

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // const storageRef = ref(storage, "hackathon-93422");
  // const normFile = async (e: any) => {
  //   console.log("Upload event:", e);
  //   // if (Array.isArray(e)) {
  //   //   return e;
  //   // }

  //   const file = e?.file;
  //   const storageRef = ref(storage, `images/${file.name}`);

  //   await uploadBytes(storageRef, file).then((snapshot) => {
  //     console.log("snapshot", snapshot);
  //     console.log("Uploaded a blob or file!");
  //   });
  //   console.log("a");

  //   // await uploadBytes(storageChildRef, file);
  //   // const downloadURL = await getDownloadURL(storageChildRef);
  //   // return [{ url: downloadURL, name: file.name }];
  //   return [{ name: file.name }];
  // };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurantContentById(params.id);
        setDetailData(data);
      } catch (error) {
        console.log("Error fetching users data:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   form.setFieldsValue({ ...detailData });
  // }, [detailData, form]);

  // const getDfaultFileList = (initialValues: any) =>
  //   initialValues
  //     ? (initialValues?.images as string[])?.map((el: string, i: number) => {
  //         const fileForm = {
  //           uid: `${-i}`,
  //           name: el.split("/")[el.split("/").length - 1],
  //           status: "done",
  //           url: el,
  //         };
  //         return fileForm as UploadFile;
  //       })
  //     : [];

  // // useEffect(() => {
  // //   id && setFileList(getDfaultFileList(initialValues));
  // // }, []);

  // useEffect(() => {
  //   const draggerProps: UploadProps = {
  //     name: "file",
  //     multiple: true,
  //     defaultFileList: getDfaultFileList(detailData),
  //     fileList,
  //     listType: "picture",

  //     onChange: (info) => {
  //       info.file.status === "removed" && setFileList(info.fileList);
  //     },

  //     customRequest: async ({ file, onSuccess, onError }) => {
  //       try {
  //         // const s3Url = await onFileUpload(
  //         //   file as File,
  //         //   S3FolderType.PRODUCT_ATTACHED_FILES
  //         // );

  //         // console.log("Upload event:", e);
  //         // if (Array.isArray(e)) {
  //         //   return e;
  //         // }
  //         console.log("file", file);

  //         // const file = e?.file;
  //         // const storageRef = ref(storage, `images/${file.name}`);

  //         // await uploadBytes(storageRef, file).then((snapshot) => {
  //         //   console.log("snapshot", snapshot);
  //         //   console.log("Uploaded a blob or file!");
  //         // });
  //         console.log("a");

  //         // await uploadBytes(storageChildRef, file);
  //         // const downloadURL = await getDownloadURL(storageChildRef);
  //         // return [{ url: downloadURL, name: file.name }];

  //         const updatedFile = {
  //           uid: (file as ExtendedFile).uid,
  //           name: (file as File).name as string,
  //           // url: s3Url,
  //           status: "done" as UploadFileStatus,
  //         };

  //         setFileList((prevList) =>
  //           prevList ? [...prevList, updatedFile] : [updatedFile]
  //         );
  //       } catch (error) {
  //         console.error(error);
  //         // message.error(`${file} 파일 업로드 실패`);
  //       }
  //     },
  //   };

  //   setDraggerConfig(draggerProps);
  // }, [fileList, setFileList, setDraggerConfig]);

  const handleFormValues = (value: any) => {
    const formValues = form.getFieldsValue();

    setFormValue(formValues);
  };

  const onSubmit = () => {
    const trimValue = trimFormValues<RestaurantListType>(
      formValue as RestaurantListType
    );

    if (formValue)
      updateRestaurantContent(
        {
          ...newData,
          ...trimValue,
          uid: uid as string,
          email: email as string,
          name: name as string,
        },
        params.id
      );
    alert("게시글이 업로드되었습니다");
    router.push("/restaurant-list");
  };

  const newData: RestaurantListType = {
    id: "",
    uid: "",
    title: "",
    name: "",
    email: "",
    content: "",
    images: [],
    rating: 5,
    address: "",
    restaurant_name: "",
    created_at: new Date(),
    updated_at: null,
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          padding: "5px 10px 5px 01",
        }}
      >
        <Button onClick={router.back}> 뒤로가기</Button>
      </div>
      <Form
        form={form}
        labelCol={{ span: 3 }}
        style={{ maxWidth: "calc(100% - 12rem)", paddingTop: "10px" }}
        layout="horizontal"
        onFinish={onSubmit}
        onValuesChange={handleFormValues}
        initialValues={params ? detailData : newData}
      >
        <Form.Item
          label="식당명"
          name="restaurant_name"
          rules={[
            { required: true, message: "식당명을 입력해주세요" },
            { type: "string" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="제목"
          name="title"
          rules={[
            { required: true, message: "제목을 입력해주세요" },
            { type: "string" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="내용"
          name="content"
          rules={[
            { required: true, message: "내용을 입력해주세요" },
            { type: "string" },
          ]}
        >
          <TextArea rows={20} />
        </Form.Item>
        <Form.Item label="이미지">
          <Form.Item
            name="images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            {/* <Dragger {...draggerConfig}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                클릭 또는 드래그로 이미지를 업로드해 주세요
              </p>
            </Dragger> */}
            <Upload.Dragger name="files">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                클릭 또는 드래그로 이미지를 업로드해 주세요
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="rating"
          label="별점"
          rules={[
            { required: true, message: "별점을 입력해주세요" },
            { type: "number" },
          ]}
        >
          <Rate />
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Space>
            <Button type="primary" htmlType="submit">
              등록하기
            </Button>
            <Button htmlType="reset">초기화</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default Write;
