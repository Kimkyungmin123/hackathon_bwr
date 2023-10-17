"use client";
import { useEffect, useState } from "react";
import { getRestaurantList } from "@/apis";
import { RestaurantListType } from "@/types";
import { useRouter } from "next/navigation";
import { Button, Form, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/config/firebase";

const RestaurantList = () => {
  const [data, setData] = useState<RestaurantListType[]>([]);
  const router = useRouter();
  const [form] = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getRestaurantList(setData);
      } catch (error) {
        console.log("Error fetching users data:", error);
      }
    };

    fetchData();
  }, []);

  const onWrite = () => {
    logEvent(analytics, "on_write");
    router.push("/write");
  };

  const columns: ColumnsType<RestaurantListType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 220,
      align: "center",

      render: (id: string, record: RestaurantListType, index: number) => (
        <div
          style={{ cursor: "pointer" }}
          className="transition duration-300 ease-in-out  hover:cursor-pointer hover:text-[#5c38ff]"
          onClick={() => router.push(`/restaurant-list/${id}`)}
        >
          {id}
        </div>
      ),
    },
    {
      title: "식당명",
      dataIndex: "restaurant_name",
      key: "restaurant_name",
      width: 200,
      align: "center",
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      width: 220,
      align: "center",
    },
    {
      title: "내용",
      dataIndex: "content",
      key: "content",
      width: 220,
      align: "center",
      render: (content: string, record: RestaurantListType, index: number) => (
        <p>{content.length > 20 ? `${content.slice(0, 30)}...` : content}</p>
      ),
    },
    {
      title: "작성자",
      dataIndex: "name",
      key: "name",
      width: 100,
      align: "center",
    },
    {
      title: "생성일",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      align: "center",
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      },
    },
    {
      title: "수정일",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 140,
      align: "center",
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateB.getTime() - dateA.getTime();
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "5px 10px 5px 0",
        }}
      >
        <Button onClick={onWrite}>글쓰기</Button>
      </div>
      <Form className="absolute dark:bg-[black]" form={form} component={false}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 20 }}
          scroll={{ y: "calc(100vh - 12em)" }}
        />
      </Form>
    </div>
  );
};

export default RestaurantList;
