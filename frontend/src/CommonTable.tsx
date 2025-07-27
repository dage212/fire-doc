import { Button, Input, Table } from "@douyinfe/semi-ui";
import { IconMinusCircle, IconPlusCircle } from '@douyinfe/semi-icons';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import { cloneDeep } from "lodash";

export type DataSource = {
    keys: string;
    value: string;
    uuid: string;
}


const CommonTable = forwardRef((_, ref) => {

    const [dataSource, setDataSource] = useState<DataSource[]>([{keys: '', value: '', uuid: `${new Date().getTime()}_${0}`}]);

    const add = useCallback((val: DataSource) => {
        setDataSource((prev) => {
            return [...prev, val];
        })
    }, [])
    const update = useCallback((key: "keys" | "value", value: string, _: DataSource,index: number) => {
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
            dataIndex: 'keys',
            width: 300,
            render: (_: string, record: DataSource, index: number) => {
                return (
                    <Input value={dataSource[index]['keys']} onChange={(value:string) => update("keys", value, record, index)} key={record.uuid}/>
                )
            }
        },
        {
            title: 'value',
            dataIndex: 'value',
            width: 300,
            render: (_: string, record: DataSource, index: number) => {
                return (
                    <Input value={dataSource[index]['value']} onChange={(value:string) => update("value", value, record, index)} key={record.uuid}/>
                )
            }
        },
        
        {
            title: 'action',
            dataIndex: 'action',
            render: (_: string, record: DataSource, index: number) => {
                return (
                    <>
                        <Button icon={<IconPlusCircle />} onClick={() => add({keys: '', value: '', uuid: `${new Date().getTime()}_${index}`})}></Button>
                        <Button 
                        icon={<IconMinusCircle />} 
                        type='danger'
                        onClick={() => {
                            if(dataSource.length <= 1){
                                return;
                            }
                            remove(record)
                        }}>
                        </Button>
                    </>
                )
            }
        },
    ], [add, remove, update, dataSource]);


    useImperativeHandle(ref, () => ({
        getValue: () => dataSource,
    }),[dataSource]);
    return (
        <Table
                style={{ minHeight: 350, width: 700}}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
            />
    )
})

export default CommonTable;