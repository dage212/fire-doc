import { Button, Input, Table } from "@douyinfe/semi-ui";
import { IconMinusCircle, IconPlusCircle } from '@douyinfe/semi-icons';
import { useCallback, useMemo, useState } from "react";
import { cloneDeep } from "lodash";

type DataSource = {
    key: string;
    value: string;
    uuid: string;
}
function Headers() {
    const [dataSource, setDataSource] = useState<DataSource[]>([{key: '', value: '', uuid: `${new Date().getTime()}_${0}`}]);

    const add = useCallback((val: DataSource) => {
        console.log('add', val);
        setDataSource((prev) => {
            return [...prev, val];
        })
    }, [])
    const update = useCallback((key: "key" | "value", value: string, record: DataSource,index: number) => {
        console.log('update', key, value, record, index);
        setDataSource((prev: DataSource[]) =>{
            prev[index][key] = value;
            return cloneDeep(prev);
        })
    }, [])
    const remove = useCallback((record: DataSource) => {
        setDataSource((prev) => {
            return prev.filter((val) => val.uuid !== record.uuid);
        })
    }, [])
    const columns = useMemo(() => [
        {
            title: 'key',
            dataIndex: 'key',
            render: (key: string, record: DataSource, index: number) => {
                console.log('render key', key);
                return (
                    <Input value={dataSource[index]['key']} onChange={(value) => update("key", value, record, index)} key={record.uuid}/>
                )
            }
        },
        {
            title: 'value',
            dataIndex: 'value',
            render: (key: string, record: DataSource, index: number) => {
                console.log('render value', key);
                return (
                    <Input value={dataSource[index]['value']} onChange={(value) => update("value", value, record, index)} key={record.uuid}/>
                )
            }
        },
        
        {
            title: 'action',
            dataIndex: 'action',
            width: 200,
            render: (key: string, record: DataSource, index: number) => {
                console.log('render action', key);
                return (
                    <>
                        <Button icon={<IconPlusCircle />} onClick={() => add({key: '', value: '', uuid: `${new Date().getTime()}_${index}`})}></Button>
                        <Button 
                        icon={<IconMinusCircle />} 
                        type='danger'
                        onClick={() => remove(record)}>
                        </Button>
                    </>
                )
            }
        },
    ], [add, remove, update, dataSource]);
    console.log('dataSource', dataSource);
    return (
        <Table
                style={{ minHeight: 350 }}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
            />
    )
}
export default Headers;