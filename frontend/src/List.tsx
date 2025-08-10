import { Table,  Descriptions, Tag } from '@douyinfe/semi-ui';
import { Button } from '@douyinfe/semi-ui';
import { IconMinusCircle } from '@douyinfe/semi-icons';
import { IconEditStroked } from '@douyinfe/semi-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { DataSource } from './types';



function del(id: string) {
    axios.delete(`/firedoc/del/${id}`).then((res) => {
        console.log('del response:', res)
    })
}


const columns = [
    {
        title: 'Url',
        dataIndex: 'url',
        render: (_: string, record: DataSource) => {
            return (
                <span>
                    {record.general?.url}
                </span>
            );
        },
    },
    {
        title: 'Method',
        dataIndex: 'method',
        width: 100,
        render: (_: string, record: DataSource) => {
            const text = record.general?.method;
            switch (text) {
                case 'GET':
                    return <Tag color="green">{text}</Tag>;
                case 'POST':
                    return <Tag color="blue">{text}</Tag>;
                case 'PUT':
                    return <Tag color="orange">{text}</Tag>;
                case 'DELETE':
                    return <Tag color="red">{text}</Tag>;
                case 'PATCH':
                    return <Tag color="purple">{text}</Tag>;
                case 'OPTIONS':
                    return <Tag color="grey">{text}</Tag>;
                case 'HEAD':
                    return <Tag color="cyan">{text}</Tag>;
                default:
                    return <Tag color="grey">{text}</Tag>;    
            }
        }
    },
    {
        title: 'Description',
        dataIndex: 'description',
        render: (_: string, record: DataSource) => {
            return record.general?.description || '-';
        }
    },
    {
        title: 'UpdateTime',
        dataIndex: 'updateTime',
        width: 150,
    },
    {
        title: 'Operate',
        dataIndex: 'operate',
        width: 150,
        render: (_: string, record: DataSource) => {
            return <>
                <Button  type='primary' icon={<IconEditStroked />}  style={{ marginRight: 8 }}></Button>
                <Button  type='danger' icon={<IconMinusCircle />}  onClick={() => del(record.id)} style={{ marginRight: 8 }}></Button>
            </>;
        },
    },
];

;

function ExpandRowRender(props: DataSource) {
    const { headers, payload } = props;
    const headersArray = []
    for(const key in headers) {
        headersArray.push({ key, value: headers[key] })
    }

    const paramsArray = [];
    for(const key in payload.params) {
        paramsArray.push({ key, value: payload.params[key] })
    }

    const bodyArray = [];
    for(const key in payload.body) {        
        bodyArray.push({ key, value: payload.body[key]})
    }


    return <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'start', width: '100%'}}>
        <Descriptions>
            <Descriptions.Item itemKey="General"></Descriptions.Item>
            <Descriptions.Item itemKey="Request URL:">{props.general.url}</Descriptions.Item>
            <Descriptions.Item itemKey="Request Method:">{props.general.method}</Descriptions.Item>
            <Descriptions.Item itemKey="Request Description:">{props.general.description}</Descriptions.Item>
        </Descriptions>
        <Descriptions>
            <Descriptions.Item itemKey="Request Headers"></Descriptions.Item>
            {headersArray.map((header, index) => (
                <Descriptions.Item key={index} itemKey={`${header.key}:`}>{header.value}</Descriptions.Item>
            ))}
        </Descriptions>
        <Descriptions>
            <Descriptions.Item itemKey="Payload Params"></Descriptions.Item>
            {paramsArray.map((param, index) => (
                <Descriptions.Item key={index} itemKey={`${param.key}:`}>{param.value}</Descriptions.Item>
            ))}
        </Descriptions>
        <Descriptions>
            <Descriptions.Item itemKey="Payload Body"></Descriptions.Item>
            {bodyArray.map((body, index) => (
                <Descriptions.Item key={index} itemKey={`${body.key}:`}>{body.value}</Descriptions.Item>
            ))}
        </Descriptions>
    </div>
}

const expandRowRender = (props: DataSource) => {
    return <ExpandRowRender {...props} />
};
function List() {
    const [data, setData] = useState([])

    const rowSelection = {
        // getCheckboxProps: record => ({
        //     key: record.key,
        // }),
        // onSelect: (record, selected) => {
        //     console.log(`select row: ${selected}`, record);
        // },
        // onSelectAll: (selected, selectedRows) => {
        //     console.log(`select all rows: ${selected}`, selectedRows);
        // },
        // onChange: (selectedRowKeys, selectedRows) => {
        //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        // },
    };

    useEffect(() => {
        axios.get('/firedoc/get').then((res) => {
            console.log('list response:', res.data)
            setData(res.data)
        }).catch((error) => {
            setData([])
            console.error('Error fetching data:', error);
        })
    }, [])


    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            expandedRowRender={expandRowRender}
            hideExpandedColumn={false}
            rowSelection={rowSelection}
            pagination={false}
        />
    );
}

export default List;