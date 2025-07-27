import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { TabPane } from "@douyinfe/semi-ui";
import { Tabs } from "@douyinfe/semi-ui";
import CommonTable, { type DataSource } from "./CommonTable";
import CustomFormBody, { type CustomBodyRefProps } from "./CustomBodyJsonEdtor";
import type { RefProps } from "./Page";
import { Form } from "@douyinfe/semi-ui";
import { trim } from "lodash";

type JSONTYPE = {
    [key:string]: unknown
};
export type ComposeRefProps = {
    getValue: () =>
        | { data: JSONTYPE | null; type: BodyType }
        | { data: FormData | null; type: BodyType }
        | { data: URLSearchParams | null; type:BodyType }
        | { data: string | undefined | null; type: BodyType }
        | null
};

export const BodyType = {
    JSON: "json",
    FormData: "form-data",
    XFormUrl: "x-www-form-urlencoded",
    Raw: "raw",
} as const;

export type BodyType = typeof BodyType[keyof typeof BodyType];

const Body = forwardRef<ComposeRefProps>((_, ref) => {
    const formDataRef = useRef<RefProps>(null);
    const xformDataRef = useRef<RefProps>(null);
    const jsonDataRef = useRef<CustomBodyRefProps>(null);
    const rawDataRef = useRef<CustomBodyRefProps>(null);
    const [activeKey, setActiveKey] = useState("json")

    useImperativeHandle(ref, () => {
        return {
            getValue: (): 
                | { data: JSONTYPE | null; type: BodyType }
                | { data: FormData | null; type: BodyType }
                | { data: URLSearchParams | null; type: BodyType }
                | { data: string | undefined | null; type: BodyType }
                | null => {
                switch (activeKey) {
                    case BodyType.JSON: {
                        try {
                            return { data: JSON.parse(jsonDataRef.current?.getValue() ?? "{}"), type: BodyType.JSON}
                        } catch (error) {
                            console.error(error);
                            return {data: null, type: BodyType.JSON};
                        }
                    }
                    case BodyType.FormData: {
                        const bodyData = formDataRef.current?.getValue() ?? [];
                        const data = (bodyData).reduce((acc: Record<string, string>, curr: DataSource) => {
                          acc[trim(curr.keys)] = trim(curr.value);
                          return acc;
                        }, {})
                        const formData = new FormData();
                        for(const key in data) {
                            formData.append(key, data[key])
                        }
                        return {data: formData, type: BodyType.FormData}
                    }
                    case BodyType.XFormUrl: {
                        const xformData = xformDataRef.current?.getValue() ?? [];
                        const data = (xformData).reduce((acc: Record<string, string>, curr: DataSource) => {
                          acc[trim(curr.keys)] = trim(curr.value);
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
    return (
        <Form>
            <Tabs type="line" defaultActiveKey="json" onChange={(v: string) => {
                setActiveKey(v)
            }}>
                <TabPane tab="json" itemKey="json">
                    <CustomFormBody ref={jsonDataRef} id="body-json-editor" mode="json" defaultValue={[
            '{'
        , '\n'
        , '}'
        ].join('\n')}/>
                </TabPane>
                <TabPane tab="form-data" itemKey="form-data">
                    <CommonTable ref={formDataRef}/>
                </TabPane>
                <TabPane tab="x-www-form-urlencoded" itemKey="x-www-form-urlencoded">
                    <CommonTable ref={xformDataRef}/>
                </TabPane>
                <TabPane tab="raw" itemKey="raw">
                    <CustomFormBody ref={rawDataRef} id="body-raw-editor" mode="text" defaultValue=""/>
                </TabPane>
            </Tabs>
        </Form>
    );
});

export default Body;