import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TabPane } from "@douyinfe/semi-ui";
import { Tabs } from "@douyinfe/semi-ui";
import CommonTable from "./CommonTable";
import CustomFormBody, { type CustomBodyRefProps } from "./CustomBodyJsonEdtor";
import { Form } from "@douyinfe/semi-ui";
import { trim } from "lodash";
import styled from "styled-components";
import { Divider } from "@douyinfe/semi-ui";
import { BodyType, type ComposeRefProps, type TableItem, type RefProps, type DataType } from "./types";

const TabPaneWrapper = styled(TabPane)`
  overflow: inherit;
`




type InitialDataType = Record<string, string>;
const Body = forwardRef<ComposeRefProps, {data: DataType}>(({data}, ref) => {
    const formDataRef = useRef<RefProps>(null);
    const xformDataRef = useRef<RefProps>(null);
    const jsonDataRef = useRef<CustomBodyRefProps>(null);
    const rawDataRef = useRef<CustomBodyRefProps>(null);
    const [activeKey, setActiveKey] = useState("none")
    const [initialData, setInitialData] = useState<InitialDataType>({});

    useImperativeHandle<ComposeRefProps, ComposeRefProps>(ref, () => {
        return {
            getValue: () => {
                switch (activeKey) {
                    case BodyType.NONE:
                        return null;
                    case BodyType.JSON: {
                        try {
                            return { data: JSON.parse(jsonDataRef.current?.getValue() ?? "{}"), type: BodyType.JSON, originStr: jsonDataRef.current?.getValue() ?? "{}" }
                        } catch (error) {
                            console.error(error);
                            return { data: null, type: BodyType.JSON };
                        }
                    }
                    case BodyType.FormData: {
                        const bodyData = formDataRef.current?.getValue() ?? [];
                        const data = (bodyData).reduce((acc: Record<string, string|File|undefined >, cur: TableItem) => {
                          if(typeof cur.value === "object") { 
                            cur.value.forEach((file, i) => {
                              acc[`file_${i}/${trim(cur.keys)}`] = file;
                            })
                           }  else {
                            acc[trim(cur.keys)] = trim(cur.value);
                          } 
                          return acc;
                        }, {})
                        const formData = new FormData();
                        for(const key in data) {
                            if(key.startsWith("file_")) {
                                formData.append(key.split('/')[1], data[key] as File)
                            } else {
                                formData.append(key, data[key] as string)
                            }
                        }
                        return {data: formData, type: BodyType.FormData}
                    }
                    case BodyType.XFormUrl: {
                        const xformData = xformDataRef.current?.getValue() ?? [];
                        const data = (xformData).reduce((acc: Record<string, string>, curr: TableItem) => {
                          acc[trim(curr.keys)] = trim(curr.value as string);
                          return acc;
                        }, {})
                         const searchParams = new URLSearchParams();
                        for(const key in data) {
                            searchParams.append(key, data[key])
                        }
                        return {data: searchParams, type: BodyType.XFormUrl}
                    }
                    case BodyType.Raw: {
                        try {
                            const rawValue = rawDataRef.current?.getValue();
                            return {data: rawValue !== undefined ? rawValue : null, type: BodyType.Raw};
                        } catch (error) {
                            console.error(error);
                            return {data: null, type: BodyType.Raw}
                        }
                    }
                    default:
                        return null;
                }
            }
        }
    }, [activeKey])

    useEffect(() => {
        if(data) {
            setActiveKey(data.type as string)
            setInitialData({[data.type as string]: data.originStr ?? data.data as string})
        } else {
            setActiveKey(BodyType.NONE)
            setInitialData({})
        }
    }, [data])
    return (
        <Form>
            <Tabs type="line" activeKey={activeKey} onChange={(v: string) => {
                setActiveKey(v)
            }}>
                <TabPaneWrapper tab="none" itemKey="none">
                    <Divider margin='32px' align='center' dashed>
                         This request does not have a body
                    </Divider>
                </TabPaneWrapper>
                <TabPaneWrapper tab="json" itemKey="json">
                    <CustomFormBody ref={jsonDataRef} id="body-json-editor" mode="json" defaultValue={initialData[BodyType.JSON] ?? [
            '{'
        , '\n'
        , '}'
        ].join('\n')}/>
                </TabPaneWrapper>
                <TabPaneWrapper tab="form-data" itemKey="form-data">
                    <CommonTable ref={formDataRef} data={initialData[BodyType.FormData] as unknown as DataType} type={BodyType.FormData}/>
                </TabPaneWrapper>
                <TabPaneWrapper tab="x-www-form-urlencoded" itemKey="x-www-form-urlencoded">
                    <CommonTable ref={xformDataRef} data={initialData[BodyType.XFormUrl] as unknown as DataType}/>
                </TabPaneWrapper>
                <TabPaneWrapper tab="raw" itemKey="raw">
                    <CustomFormBody ref={rawDataRef} id="body-raw-editor" mode="text" defaultValue={initialData[BodyType.Raw] ? JSON.stringify(initialData[BodyType.Raw]) : ''}/>
                </TabPaneWrapper>
            </Tabs>
        </Form>
    );
});

export default Body;