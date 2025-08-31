import { Button, Input, Table } from "@douyinfe/semi-ui";
import { IconMinusCircle, IconPlusCircle } from '@douyinfe/semi-icons';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { cloneDeep } from "lodash";
import { BodyType, type DataType, type RefProps, type TableItem } from "./types";
import { InputGroup } from "@douyinfe/semi-ui";
import { Select } from "@douyinfe/semi-ui";
import MultiFileUpload from "./uploadFile";
import { useParams } from "react-router";
import axios from "axios";
import { prefixApi } from "./contexts";




const CommonTable = forwardRef<RefProps, {data: DataType, type?: BodyType }>(({data, type}, ref) => {
    const { id } = useParams();
    const [dataSource, setDataSource] = useState<TableItem[]>([{keys: '', value: '', uuid: `${new Date().getTime()}_${0}`}]);
    useEffect(() => {
        const fetchData = async () => {
            const initData:TableItem[] = [];
            for(const key in data) {
                if(key === "type") {
                    continue;
                }
                let valueType = "string"
                let value: string | File[] = data[key] ?? '';
                if(Object.prototype.toString.call(data[key]) === '[object Array]') {
                    valueType = "file"
                    try {
                        const response = await axios.get(`${prefixApi}/fire-doc/api/files?id=${id}&fileKey=${key}`)
                        if(!response.data) return;
                        const files = await Promise.all(response.data.map(async (fileData: { path: string, name: string}) => {
                            const blob = await fetch(`${prefixApi}/fire-doc/api${fileData.path}`).then(res => res.blob())
                            return new File([blob], fileData.name,{type: 'image/png'})
                        }))
                        value = files;
                    } catch (error) {
                        console.error('Error fetching files:', error);
                        value = [];
                    }
                }
                
                initData.push({keys: key, value: value, type: valueType, uuid: `${new Date().getTime()}_${initData.length}`})
            }
            if(!data) {
                setDataSource([{keys: '', value: '', type: 'string', uuid: `${new Date().getTime()}_${0}`}]);
                return;
            };
            if(initData.length === 0) return;
            setDataSource(initData);
        };

        fetchData();
    }, [data, id]);

    

    const add = useCallback((val: TableItem) => {
        setDataSource((prev) => {
            return [...prev, val];
        })
    }, [])

    const update = useCallback((key: "keys" | "value" | "type", value: string | File[], _: TableItem,index: number) => {
    
        setDataSource((prev: TableItem[]) =>{
                if(key === "value") {
                    prev[index][key] = value;
                }else {
                    prev[index][key] = value as string;
                }
                
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
                    <InputGroup style={{ width: '100%',display: 'flex', flexDirection: 'row'}}>
                        <Input style={{width: type === BodyType.FormData ? 'auto' : '100%'}} value={dataSource?.[index]?.['keys']} onChange={(value:string) => update("keys", value, record, index)} key={record.uuid}/>
                        
                        {type === BodyType.FormData ? <Select style={{ width: '100px' }} defaultValue='string' value={dataSource?.[index]?.['type']} onChange={(value:string) => update("type", value, record, index)}>
                            <Select.Option value='string'>String</Select.Option>
                            <Select.Option value='file'>File</Select.Option>
                            {/* <Select.Option value='blob'>Blob</Select.Option> */}
                        </Select>: null}
                    </InputGroup>
                )
            }
        },
        {
            title: 'value',
            dataIndex: 'value',
            render: (_: string, record: TableItem, index: number) => {
                return ( 
                    <>
                    {dataSource?.[index]?.['type'] === "string" ? 
                        <Input value={dataSource?.[index]?.['value']}   onChange={(value:string) => update("value", value, record, index)} key={record.uuid}/>
                        
                        : <MultiFileUpload value={(dataSource?.[index]?.['value'] ?? []) as File[]}   keys={dataSource?.[index]?.['keys']} key={record.uuid} onChange={(v) => update("value", v, record, index)} />
                    } 
                    </>
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
                        <Button icon={<IconPlusCircle />} onClick={() => add({keys: '', value: '', type: 'string', uuid: `${new Date().getTime()}_${index}`})}></Button>
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
    ], [add, remove, update, dataSource, type]);


    useImperativeHandle(ref, () => ({
        getValue: () => {
            return dataSource;
        },
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