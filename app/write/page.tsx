"use client";
import { addRestaurantContent } from "@/apis";
import useUserStore from "@/store";
import { RestaurantListType } from "@/types";
import { trimFormValues } from "@/util/trimValue";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, Rate, Space, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Write = () => {
  const [formValue, setFormValue] = useState<RestaurantListType | null>(null);
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

  const handleAddFormValues = (value: any) => {
    const formValues = form.getFieldsValue();

    setFormValue(formValues);
  };

  const onSubmit = () => {
    const trimValue = trimFormValues<RestaurantListType>(
      formValue as RestaurantListType
    );

    if (formValue)
      addRestaurantContent({
        ...newData,
        ...trimValue,
        uid: uid as string,
        email: email as string,
        name: name as string,
      });
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
        onValuesChange={handleAddFormValues}
        initialValues={newData}
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
            <Upload.Dragger name="files" action="/upload.do">
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
