import React, { useCallback, useRef, useState } from 'react';
// import useSWRMutation from 'swr/mutation';
import { Form, Button, Tabs, TabPane, InputGroup, useFormApi } from '@douyinfe/semi-ui';
import axios from 'axios';
import { trim } from 'lodash';
import CommonTable, { type DataSource } from './CommonTable';
import { Col } from '@douyinfe/semi-ui';
import { Row } from '@douyinfe/semi-ui';
import CustomJsonEditor from './CustomJsonEditor';
import Body, { BodyType, type ComposeRefProps } from './Body';





export type RefProps = {
  getValue: () => DataSource[]  | null
}

type RefPropsCurrent = {
  current: RefProps | null
}

type BodyRefPropsCurrent = {
  current: ComposeRefProps | null
}
type SendBtnProps = {
  params?: RefPropsCurrent;
  headers?: RefPropsCurrent;
  body?: BodyRefPropsCurrent
  setResponse: React.Dispatch<React.SetStateAction<string>>
}
const initFormData = {
  method: 'POST',
  params: [
    { key: ' ', value: ' ' }]
}

const CustomFormResponse: React.FC<{value: string}> = ({ value }) => {
  console.log('CustomFormResponse:', value)
  return (
    <div>
      <h3>Response</h3>
      <CustomJsonEditor value={value}/>
    </div>
  );
};
const SendBtn: React.FC<SendBtnProps> = (props:SendBtnProps) => {
    const formApi = useFormApi();
    const send = useCallback(() => {
      const values = formApi.getValues()

      const body = props.body?.current?.getValue();

    
      console.log('Sending body:', body)


      const paramsData = props.params?.current?.getValue() || [];
      const params = (paramsData).reduce((acc: Record<string, string>, curr: DataSource) => {
        acc[trim(curr.keys)] = trim(curr.value);
        return acc;
      }, {})

      const headersData = props.headers?.current?.getValue() || [];
      const headersVal = (headersData).reduce((acc: Record<string, string>, curr: DataSource) => {
        if(trim(curr.keys)) {
          acc[trim(curr.keys)] = trim(curr.value);
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
      }

      axios({
        method: values.method,
        url: values.url,
        params,
        headers,
        data: body?.data,
        withCredentials: true,
      }).then((response: { data: unknown}) => {
        console.log('Response:', response)
        props.setResponse(JSON.stringify(response.data, null, 2))
      }).catch((error: Error) => {
        console.error('Error:', error)
        props.setResponse(JSON.stringify(error.message, null, 2))
      });
    }, [formApi, props]);
    return (
        <div>
            <Button type="primary" htmlType="submit"  style={{marginTop: 4}} onClick={() => {
              send()
            }}>
                Send
            </Button>
        </div>
    );
};

const FormArea: React.FC = () => {
    const paramsRef = useRef<RefProps>(null);
    const headersRef = useRef<RefProps>(null);
    const bodyRef = useRef<ComposeRefProps>(null);
    const [response, setResponse] = useState<string>('')
    return (
       <Form  
        layout='vertical' 
        initValues={initFormData}
      >
        <Row gutter={20}>
          <Col span={12}>
            <h3>Request</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Form.Select 
                field='method' 
                label='' 
                noLabel
                trigger='blur' 
                style={{ width: '120px' }} 
                onChange={() => {
                  console.log('paramsRef?.current?.getValue():', paramsRef?.current?.getValue());
                }}
              >
                <Form.Select.Option value="GET">GET</Form.Select.Option>
                <Form.Select.Option value="POST">POST</Form.Select.Option>
                <Form.Select.Option value="PUT">PUT</Form.Select.Option>
                <Form.Select.Option value="DELETE">DELETE</Form.Select.Option>
                <Form.Select.Option value="PATCH">PATCH</Form.Select.Option>
                <Form.Select.Option value="OPTIONS">OPTIONS</Form.Select.Option>
                <Form.Select.Option value="HEAD">HEAD</Form.Select.Option>
              </Form.Select>
              <InputGroup>
                <Form.Input field='url' trigger='blur' noLabel label=" " style={{ minWidth: '400px'}}></Form.Input>
              </InputGroup>
              <SendBtn 
                params={paramsRef} 
                headers={headersRef}
                body={bodyRef}
                setResponse={setResponse}
              />
            </div>
            <Tabs type="card">
              <TabPane tab="Params" itemKey="1">
                  <CommonTable ref={paramsRef}/>
              </TabPane>
              <TabPane tab="Body" itemKey="2">
                  <Body ref={bodyRef}/>
              </TabPane>
              <TabPane tab="Headers" itemKey="3">
                  <CommonTable ref={headersRef} />
              </TabPane>
            </Tabs>
          </Col>
          <Col span={12}>
              <CustomFormResponse value={response}/>
          </Col>
        
        </Row>
        
        
    </Form >
    )
};

export default FormArea;