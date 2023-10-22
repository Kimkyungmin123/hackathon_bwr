"use client";
import {
  addReview,
  deleteRestaurantContent,
  deleteReview,
  getRestaurantContentById,
  getReviewList,
} from "@/apis";
import { RestaurantListType, ReviewType } from "@/types";
import { Button, Descriptions, Form } from "antd";
import { useRouter } from "next/navigation";
import { Rate } from "antd";
import { useEffect, useState } from "react";
import useUserStore from "@/store";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/config/firebase";
import { trimFormValues } from "@/util/trimValue";
import TextArea from "antd/es/input/TextArea";

type PageParams = {
  id: string;
};

const Detail = ({ params }: { params: PageParams }) => {
  const [detailData, setDetailData] = useState<RestaurantListType>();
  const [reviewData, setReviewData] = useState<ReviewType[]>([]);
  const [formValue, setFormValue] = useState<ReviewType | null>(null);

  const [form] = Form.useForm();
  const { uid, name, email } = useUserStore();
  const router = useRouter();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getReviewList(setReviewData);
      } catch (error) {
        console.log("Error fetching users data:", error);
      }
    };

    fetchData();
  }, []);

  const onUpdate = () => {
    logEvent(analytics, "on_update");
    router.push(`/write/${detailData?.id}`);
  };

  const onContentDelete = () => {
    deleteRestaurantContent(detailData?.id as string);
    logEvent(analytics, "on_content_delete");
    router.push("/restaurant-list");
  };

  const onReviewDelete = (id: string) => {
    deleteReview(id);
    logEvent(analytics, "on_review_delete");
  };

  const handleFormValues = (value: any) => {
    const formValues = form.getFieldsValue();

    setFormValue(formValues);
  };

  const onSubmit = () => {
    if (!name) {
      alert("로그인 후 등록가능합니다.");
      return;
    }
    const trimValue = trimFormValues<ReviewType>(formValue as ReviewType);

    if (formValue)
      addReview({
        ...newData,
        ...trimValue,
        uid: uid as string,
        email: email as string,
        name: name as string,
        restaurant_doc_id: params.id,
      });
  };

  const newData: ReviewType = {
    id: "",
    uid: "",
    name: "",
    email: "",
    content: "",
    restaurant_doc_id: "",
    created_at: new Date(),
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px 10px 5px 0",
        }}
      >
        <Button onClick={router.back}> 뒤로가기</Button>
        <div>
          {detailData?.uid === uid && (
            <>
              <Button onClick={onUpdate}> 수정하기</Button>
              <Button onClick={onContentDelete}> 삭제하기</Button>
            </>
          )}
        </div>
      </div>

      {detailData && (
        <Descriptions
          bordered
          size={"middle"}
          className="px-20 pt-4"
          labelStyle={{ width: "120px" }}
        >
          <Descriptions.Item label="식당명" span={1}>
            {(detailData.restaurant_name ??= "-")}
          </Descriptions.Item>
          <Descriptions.Item label="제목" span={1}>
            {(detailData.title ??= "-")}
          </Descriptions.Item>
          <Descriptions.Item label="별점" span={1}>
            {<Rate defaultValue={detailData.rating} disabled={true} />}
          </Descriptions.Item>
          <Descriptions.Item label="생성일" span={2}>
            {((detailData.created_at as string) ??= "-")}
          </Descriptions.Item>
          <Descriptions.Item label="수정일" span={2}>
            {((detailData.created_at as string) ??= "-")}
          </Descriptions.Item>
          <Descriptions.Item label="작성자" span={2}>
            {(detailData.name ??= "-")}
          </Descriptions.Item>
          <Descriptions.Item label="이메일" span={2}>
            {(detailData.email ??= "-")}
          </Descriptions.Item>
          {/* <Descriptions.Item label="주소" span={3}>
            {(detailData.address ??= "-")}
          </Descriptions.Item> */}
          <Descriptions.Item label="내용" span={3}>
            {(detailData.content ??= "-")}
          </Descriptions.Item>
          {/* <Descriptions.Item label="첨부이미지" span={3}>
            {(detailData.images ??= "-")}
          </Descriptions.Item> */}
        </Descriptions>
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          onValuesChange={handleFormValues}
          style={{ width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              gap: "20px",
              padding: "20px 0 ",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "60%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Form.Item name="content" style={{ width: "100%" }}>
                <TextArea placeholder="댓글을 입력하세요" />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                등록하기
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <div>
        {reviewData.map((item) => (
          <>
            {item.restaurant_doc_id === params.id && (
              <Descriptions
                bordered
                size={"middle"}
                className="px-20 pt-4"
                labelStyle={{ width: "120px" }}
                key={item.id}
              >
                <Descriptions.Item span={1} style={{ width: "400px" }}>
                  {item?.content}
                </Descriptions.Item>
                <Descriptions.Item span={1}>{item?.name}</Descriptions.Item>
                <Descriptions.Item span={1}>
                  {item?.created_at as string}
                </Descriptions.Item>
              </Descriptions>
            )}
            {item.restaurant_doc_id === params.id && item.uid === uid && (
              <Button type="default" onClick={() => onReviewDelete(item.id)}>
                삭제하기
              </Button>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Detail;
