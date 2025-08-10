import { Button, Input, Table } from "@douyinfe/semi-ui";
import { IconMinusCircle, IconPlusCircle } from '@douyinfe/semi-icons';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { cloneDeep } from "lodash";
import type { DataType, RefProps, TableItem } from "./types";




const CommonTable = forwardRef<RefProps, {data: DataType }>(({data}, ref) => {

    const [dataSource, setDataSource] = useState<TableItem[]>([{keys: '', value: '', uuid: `${new Date().getTime()}_${0}`}]);
    
    useEffect(() => {
        const initData:TableItem[] = [];
        for(const key in data) {
            initData.push({keys: key, value: data[key] ?? '', uuid: `${new Date().getTime()}_${initData.length}`})
        }
        if(!data) {
            setDataSource([{keys: '', value: '', uuid: `${new Date().getTime()}_${0}`}]);
            return
        };
        if(initData.length === 0) return;
        setDataSource(initData);
    }, [data]);
    
    const add = useCallback((val: TableItem) => {
        setDataSource((prev) => {
            return [...prev, val];
        })
    }, [])

    const update = useCallback((key: "keys" | "value", value: string, _: TableItem,index: number) => {
        setDataSource((prev: TableItem[]) =>{
            prev[index][key] = value;
            return cloneDeep(prev);
        })
    }, [])

    const remove = useCallback((record: TableItem) => {
        setDataSource((prev) => {
            if (prev.length === 1) {
                return [{keys: '', value: '', uuid: `${new Date().getTime()}_${0}`}];
            }
            return prev.filter((val) => val.uuid !== record.uuid);
        })
    }, [])


   

    const columns = useMemo(() => [
        {
            title: 'key',
            dataIndex: 'keys',
            render: (_: string, record: TableItem, index: number) => {
                return (
                    <Input value={dataSource?.[index]?.['keys']} onChange={(value:string) => update("keys", value, record, index)} key={record.uuid}/>
                )
            }
        },
        {
            title: 'value',
            dataIndex: 'value',
            render: (_: string, record: TableItem, index: number) => {
                return (
                    <Input value={dataSource?.[index]?.['value']} onChange={(value:string) => update("value", value, record, index)} key={record.uuid}/>
                )
            }
        },
        
        {
            title: 'action',
            dataIndex: 'action',
            width: 100,
            render: (_: string, record: TableItem, index: number) => {
                return (
                    <>
                        <Button icon={<IconPlusCircle />} onClick={() => add({keys: '', value: '', uuid: `${new Date().getTime()}_${index}`})}></Button>
                        <Button 
                        icon={<IconMinusCircle />} 
                        type='danger'
                        onClick={() => {
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
                style={{ minHeight: 350}}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
            />
    )
})

export default CommonTable;