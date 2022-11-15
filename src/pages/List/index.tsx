import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

import GetRepos from "../../utils/axios";
import useFormatTime from "../../hooks/useFormatTime";

import "./index.css";
import { string } from "yargs";

interface DataType {
  key?: React.Key;
  name?: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
  authorImg?: string;
  languages?: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "名字",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "查看",
    key: "check",
    render: (row, record) => {
      return (
        <div className={"check"} onClick={() => checkMore(row, record.key)}>
          查看
        </div>
      );
    },
  },
];

const checkMore = (row: any, key: any) => {
  // 获取当前点击的列表信息，通过props传给子组件显示出来
  const obj = data.filter((_, index) => {
    return data[index].key === Number(key);
  });
};

let data: DataType[] = [];

const App: React.FC = () => {
  const [tableData, setTableData] = useState<Array<DataType>>();
  // 获取路由参数
  const getsearchState = useLocation().state;
  const searchState =
    getsearchState === null ? "lin" : getsearchState.searchState;
  // 获取接口数据
  useEffect(() => {
    GetRepos(searchState).then((response: any) => {
      data = [];
      for (let i = 0; i < response?.length; i++) {
        data.push({
          // key
          key: response[i].id,
          // 名字
          name: response[i].name,
          // 描述
          description: response[i].description || "作者太懒了，没有进行描述",
          // 起始时间
          // eslint-disable-next-line react-hooks/rules-of-hooks
          createTime: useFormatTime(response[i].created_at),
          // 更新时间
          // eslint-disable-next-line react-hooks/rules-of-hooks
          updateTime: useFormatTime(response[i].updated_at),
          // 作者图片
          authorImg: response[i].owner.avatar_url,
          // 语言
          languages: response[i].language_url,
        });
      }
      setTableData(data);
    });
  }, [searchState]);
  return (
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={{ pageSize: 50 }}
    />
  );
};

export default App;
