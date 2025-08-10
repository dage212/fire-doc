import { IconPlusCircle } from "@douyinfe/semi-icons";
import { IconSearch } from "@douyinfe/semi-icons";
import { Button } from "@douyinfe/semi-ui";
import { Tag } from "@douyinfe/semi-ui";

import { Input } from "@douyinfe/semi-ui";
import { ButtonGroup } from "@douyinfe/semi-ui";
import { List } from "@douyinfe/semi-ui";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams  } from 'react-router';
import styled from "styled-components";
import { MyContext } from "./contexts";
import type { DataSource } from "./types";

const ListItemWrapper = styled(List.Item)`
    &:hover {
        background-color: var(--semi-color-fill-0);
    }
    padding: 14px;
    cursor: pointer;
    &.selectd-item {
        background-color: var(--semi-color-fill-0);
    }
}
`

function TagColor({method}: {method: string}) {
    switch(method) {
        case 'GET': return <Tag color="blue">{method}</Tag>;
        case 'POST': return <Tag color="green">{method}</Tag>;
        case 'PUT': return <Tag color="orange">{method}</Tag>;
        case 'DELETE': return <Tag color="red">{method}</Tag>;
        case 'PATCH': return <Tag color="purple">{method}</Tag>;
        case 'OPTIONS': return <Tag color="grey">{method}</Tag>;
        case 'HEAD': return <Tag color="grey">{method}</Tag>;
        default:
        return <Tag color="green">{method}</Tag>
    }
}
function InnerList() {
    const [data, setData] = useState<DataSource[]>([])
    const [id, setId] = useState<string>('');
    const { refresh, setRefresh } = useContext(MyContext)
    
    const navigate = useNavigate()
    const params = useParams();
    useEffect(() => {
        axios.get('/firedoc/get').then((res) => {
            console.log('GET All Succesful:', res.data)
            setData(res.data)
        }).catch((error) => {
            setData([])
            console.error('GET All  Error:', error);
        })
    }, [refresh])

    const del = useCallback((id: string) => {
        setRefresh(bool => !bool)
        axios.delete(`/firedoc/del/${id}`).then(() => {
            navigate('/')
        })
        setData(data.filter((item) => item.id !== id))
    },[data, navigate, setRefresh])

    const search = useCallback((value: string) => {
        console.log('Search Value:', value)
        axios.get(`/firedoc/get?url=${value}`).then((res) => {
            console.log('Search Succesful:', res.data)
            setData(res.data)
        }).catch((error) => {
            setData([])
            console.error('Search Error:', error);
        })
    },[])

     return (
     <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px' }}>
            <Input prefix={<IconSearch />} showClear placeholder="Please input url" onChange={search}></Input>
            <Button icon={<IconPlusCircle />} onClick={() => {
                navigate(`/`);
            }}></Button>
        </div>
        <List
            dataSource={data}
            renderItem={(item:DataSource) => (
                <ListItemWrapper className={item.id === id || params.id === item.id ? 'selectd-item': ''} onClick={() => {
                    navigate(`/${item.id}`);
                    setId(item.id);
                }}>
                    <div style={{width: '100%'}}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <TagColor method={item.general.method as string}/>
                            <div style={{ 
                                color: 'var(--semi-color-text-0)', 
                                fontWeight: 500, marginLeft: 10, 
                                width: 'calc(100% - 80px)', 
                                overflow: 'hidden', 
                                whiteSpace: 'nowrap', 
                                textOverflow: 'ellipsis'
                            }} title={item.general.url}>
                                {item.general.url}
                            </div>
                        </div>
                        <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                                {item.general.description || 'No description provided.'}
                        </p>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <ButtonGroup size={'small'} type="tertiary" theme="borderless">
                            <Button style={{fontSize: 12, fontWeight: 'normal', color: 'var(--semi-color-primary)'}} onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                            }}>GoDoc</Button>
                            <Button style={{fontSize: 12, fontWeight: 'normal', color: 'var(--semi-color-danger)'}} onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                                del(item.id)
                            }}>Delete</Button>
                        </ButtonGroup>
                    </div>
                </ListItemWrapper>
            )}
        />
            
    </div>)
}   

export default InnerList;