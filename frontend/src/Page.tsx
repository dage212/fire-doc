import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Form, Button, Tabs, TabPane, useFormApi, Highlight, Divider, Modal } from '@douyinfe/semi-ui';
import axios from 'axios';
import { trim } from 'lodash';
import CommonTable from './CommonTable';
import CustomBodyJsonEdtor from './CustomBodyJsonEdtor';
import Body  from './Body';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router';
import { BodyType, type ComposeRefProps, type DataSource, type FireDocFile, type FormApi, type RefProps, type SendBtnProps, type TableItem } from './types';
import { MyContext, prefixApi } from './contexts';
import { SplitPaneStyle } from './Home';





const URlWrapper = styled.div`
& {
   display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    .semi-form-field[x-field-id="general.url"] {
      flex: 1;
    }
    #method{
      width: 120px;
    } 
    .button-group{
      width: 120px;
      gap: 10px;
      display: flex;
    }   
}
`

const initFormData = {
  general: {
    url: '',
    method: '',
    description: ''
  },
  headers: [
    { key: ' ', value: ' ' }],
  body: {
    params: [
      { key: ' ', value: ' ' }],
    body: {}
  },
  params: [
    { key: ' ', value: ' ' }]
}

const CustomFormResponse: React.FC<{value: string}> = ({ value }) => {
  return (
    <div>
      <Highlight
        sourceString={'Response'}
        searchWords={'Response'}
        highlightStyle={{
            fontSize: 24,
            marginRight: 4,
            paddingLeft: 4,
            paddingRight: 4,
            backgroundColor: 'rgba(var(--semi-teal-5), 1)',
            color: 'rgba(var(--semi-white), 1)'
        }}
      />
      <Divider margin='12px'/>
      <CustomBodyJsonEdtor defaultValue={value} mode="json" id="response-body-json-editor" height={'calc(100vh)'} readOnly={true}/>
    </div>
  );
};

function requestAll(formApi:FormApi, props: SendBtnProps) {
      const values = formApi.getValues()

      const body = props.body?.current?.getValue();

      const paramsData = props.params?.current?.getValue() || [];
      const params = (paramsData).reduce((acc: Record<string, string>, curr: TableItem) => {
        if(trim(curr.keys)) {
          acc[trim(curr.keys)] = trim(curr.value  as string);
        }
        return acc;
      }, {})

      const headersData = props.headers?.current?.getValue() || [];
      const headersVal = (headersData).reduce((acc: Record<string, string>, curr: TableItem) => {
        if(trim(curr.keys)) {
          acc[trim(curr.keys)] = trim(curr.value  as string);
        }
        return acc;
      }, {})

      

      const headers = {...headersVal};
      const bodyData: Record<string, FireDocFile[]|string> = {}
      if(body?.type === BodyType.JSON) {
        headers['Content-Type'] = 'application/json';
      } else if(body?.type === BodyType.XFormUrl) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if(body?.type === BodyType.FormData) {
        for(const [key, value] of (body.data as FormData)?.entries() ?? {}){
          if(typeof value !== 'object'){
            bodyData[key as string] = value;
            bodyData['type'] = "string"
          } else {
            bodyData[key as string] = [];
            bodyData['type'] = "file"
          }
        }
        headers['Content-Type'] = 'multipart/form-data';
      } else if(body?.type === BodyType.Raw) {
        headers['Content-Type'] = 'text/plain';
      }
      return {
        values,
        params,
        headers,
        body: {data: bodyData, type: body?.type, rawData: body?.data}
      }
}

function sendGetParams(formApi:FormApi, props: SendBtnProps) {
      const values = formApi.getValues()

      const body = props.body?.current?.getValue();

      const paramsData = props.params?.current?.getValue() || [];
      const params = (paramsData).reduce((acc: Record<string, string>, curr: TableItem) => {
        if(trim(curr.keys)) {
          acc[trim(curr.keys)] = trim(curr.value  as string);
        }
        return acc;
      }, {})

      const headersData = props.headers?.current?.getValue() || [];
      const headersVal = (headersData).reduce((acc: Record<string, string>, curr: TableItem) => {
        if(trim(curr.keys)) {
          acc[trim(curr.keys)] = trim(curr.value  as string);
        }
        return acc;
      }, {})

      

      const headers = {...headersVal};

      if(body?.type === BodyType.JSON) {
        headers['Content-Type'] = 'application/json';
      } else if(body?.type === BodyType.XFormUrl) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if(body?.type === BodyType.FormData) {
        headers['Content-Type'] = 'multipart/form-data';
      } else if(body?.type === BodyType.Raw) {
        headers['Content-Type'] = 'text/plain';
      }
      return {
        values,
        params,
        headers,
        body
      }
}



export interface FormApiRef {
    formApi: {
      validate: () => Promise<{description: string}>;
      setValues: (values: Record<string, object|string>) => void;
    } | null;
}
const ButtonGroup: React.FC<SendBtnProps> = (props:SendBtnProps) => {
    const formApi = useFormApi();
    const [visible, setVisible] = useState(false);
    const { setRefresh } = useContext(MyContext);
    const navigate = useNavigate();
    const descriptionRef = useRef<FormApiRef>(null);
    const handleOk = () => {
      descriptionRef.current?.formApi?.validate().then((res:{description: string}) => { 
        setVisible(false);
        confirm(res.description);
      }).catch((err: {description: string}) => {
        console.log('Description Validate Error:', err)
      });
    };
    const send = useCallback(() => {
      const { values, params, headers, body } = sendGetParams(formApi, props);
      axios({
        method: values.general.method,
        url: values.general.url,
        params,
        headers,
        data: body?.data,
        withCredentials: true,
      }).then((response: { data: unknown}) => {
        console.log('Send Succesful:', response)
        const str = JSON.stringify(response.data, null, 2)
        props.setResponse(str)
      }).catch((error: Error) => {
        console.error('Send Error:', error)
        const str = JSON.stringify(error.message, null, 2)
        props.setResponse(str)
      });
    }, [formApi, props]);

    
    const confirm = useCallback((description: string) => {
      const { values, params, headers, body } = requestAll(formApi, props);
      axios.post(`${prefixApi}/fire-doc/api/save`, {
        id: values.id,
        general: {
          url: values.general.url,
          method: values.general.method,
          description: description,
        },
        payload:{
          params: params,
          body: {data: body?.data, type: body?.type},
        },
        headers: headers,
        response: {

        },
      }).then((res) => {
        setRefresh((bool) => !bool)
        navigate(`/${res.data.data}`);
        console.log('POST Succesful:', body.rawData)
        if(body.type === BodyType.FormData) {
          const formData = new FormData();
          for(const [key, value] of (body.rawData as FormData)!.entries()){
            if(value instanceof File){
              formData.append("fileKey", key)
              formData.append("file", value);
            }
          }
          if(formData.keys().next().done === false) {
            formData.append("id", res.data.data)
            axios.post(`${prefixApi}/fire-doc/api/upload`, formData).then((res => {
              console.log('Upload Succesful:', res.data)
            }))
          }
        }
        
      })
    },[formApi, navigate, props, setRefresh]);


    return (
      <>
      <div className='button-group'>
        <Button type="primary" htmlType="submit" onClick={() => {
          send()
        }}>
            Send
        </Button>
        <Button onClick={() => setVisible(true)}>
          Save
        </Button>
      </div>
      <Modal
        title="HTTP Request Description"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        footerFill={true}
        okText={'Save'}
        cancelText={'Cancel'}
    >
      <Form ref={descriptionRef} initValues={{ description: props.description }}>
          <Form.TextArea
            label="Http Description"
            rules={[
                  { required: true, message: 'required error' },
              ]}
            field='description'
            placeholder='Enter required field description'
        />
      </Form>
    </Modal>
      </>
    );
};


const FormArea: React.FC = () => {
    const paramsRef = useRef<RefProps>(null);
    const headersRef = useRef<RefProps>(null);
    const bodyRef = useRef<ComposeRefProps>(null);
    const [response, setResponse] = useState<string>('')
    const { refresh } = useContext(MyContext);
    const formApiRef = useRef<FormApiRef>(null);
    const [data, setData] = useState<DataSource>({} as DataSource)
    const params = useParams();
    useEffect(() => { 
      axios.get(`${prefixApi}/fire-doc/api/get?id=${params.id}`).then((res) => {
            console.log(`Get ${params.id} Response:`, res.data)
            const data = res.data?.[0] ?? {};
            formApiRef.current?.formApi?.setValues(data);
            setResponse('')
            setData(data)
        }).catch((error) => {
            setData({} as DataSource);
            console.error('Error fetching data:', error);
        })
    }, [params.id, refresh])

   
    return (
      <div style={{position: 'relative', padding: '20px', height: '100%'}}>
       <Form  
        layout='vertical' 
        initValues={initFormData}
        ref={formApiRef}
      >
        <SplitPaneStyle split="vertical" minSize={500} defaultSize={700}>
          
            <div style={{margin: '0px 10px'}}>
              <div style={{ textAlign: 'right'}}>
                  <Highlight
                    sourceString={'Request'}
                    searchWords={'Request'}
                    highlightStyle={{
                        fontSize: 24,
                        marginRight: 4,
                        paddingLeft: 4,
                        paddingRight: 4,
                        backgroundColor: 'var(--semi-color-primary)',
                        color: 'rgba(var(--semi-white), 1)'
                    }}
                  />
                  <Divider margin='12px'/>
              </div>  
              <URlWrapper>
                
                <Form.Select 
                  style={{ width: 104 }}
                  field='general.method' 
                  noLabel
                  trigger='blur' 
                >
                  <Form.Select.Option value="GET">GET</Form.Select.Option>
                  <Form.Select.Option value="POST">POST</Form.Select.Option>
                  <Form.Select.Option value="PUT">PUT</Form.Select.Option>
                  <Form.Select.Option value="DELETE">DELETE</Form.Select.Option>
                  <Form.Select.Option value="PATCH">PATCH</Form.Select.Option>
                  <Form.Select.Option value="OPTIONS">OPTIONS</Form.Select.Option>
                  <Form.Select.Option value="HEAD">HEAD</Form.Select.Option>
                </Form.Select>
                <Form.Input field='general.url' trigger='blur' noLabel ></Form.Input>
                <Form.Input field='id' noLabel style={{ display: 'none'}} />
                <ButtonGroup
                  params={paramsRef} 
                  headers={headersRef}
                  body={bodyRef}
                  description={data.general?.description}
                  setResponse={setResponse}
                />
              </URlWrapper>
              <div>
                  <Tabs type="card">
                    <TabPane tab="Params" itemKey="1">
                        <CommonTable ref={paramsRef} data={data.payload?.params}/>
                    </TabPane>
                    <TabPane tab="Body" itemKey="2">
                        <Body ref={bodyRef} data={data.payload?.body}/>
                    </TabPane>
                    <TabPane tab="Headers" itemKey="3">
                        <CommonTable ref={headersRef} data={data.headers}/>
                    </TabPane>
                </Tabs>
              </div>
            </div>
            <div style={{margin: '0px 10px'}}>
                <CustomFormResponse value={response}/>
            </div>
        </SplitPaneStyle>
      </Form >
    </div>
    )
};

export default FormArea;