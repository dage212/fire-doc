import React from 'react';
// import useSWRMutation from 'swr/mutation';
import styled from 'styled-components';
import { Form, Button, Tabs, TabPane, ArrayField, InputGroup, useFormApi } from '@douyinfe/semi-ui';
import { IconMinusCircle, IconPlusCircle } from '@douyinfe/semi-icons';
import CustomFormBody from './Body';
import Headers from './Headers';

const KeyValueContainer = styled.div`
  .semi-form-field{
    padding: 0px 0px;
  }
`
const KeyValueBtnContainer = styled.div`
  margin-top: 4px;
  gap: 4px;
  display: flex;
  flex-direction: row;
`

// async function updateUser(url: string, { arg }: { arg: {name: string}[] }) {
//     console.log('Updating user with data:', arg);
//   await fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(arg),
//   })
// }

// const SelectContainer = styled(Form.Item)`

// `
// const selectBefore = (
//   <Select 
//     options={[
//       { value: 'GET', label: 'GET' },
//       { value: 'POST', label: 'POST' },
//       { value: 'PUT', label: 'PUT' },
//       { value: 'DELETE', label: 'DELETE' },
//       { value: 'PATCH', label: 'PATCH' },
//       { value: 'OPTIONS', label: 'OPTIONS' },
//       { value: 'HEAD', label: 'HEAD' },
//     ]} 
//     defaultValue={'GET'}
//     style={{width: '100px'}}/>
// )

const initFormData = {
  method: 'POST',
  params: [
    { key: 'qwe', value: 'sdf' },]
}

const ComponentUsingFormApi = () => {
    const formApi = useFormApi();
    
    return (
        <div>
            <Button type="primary" htmlType="submit"  style={{marginTop: 4}} onClick={() => {
              
              console.log('Form state:', formApi.getValues());
            }}>
                Send
            </Button>
        </div>
    );
};

const FormArea: React.FC = () => {
    // const { trigger } = useSWRMutation('/api/user', updateUser)
    
    return (
       <Form  
        layout='vertical' 
        initValues={initFormData}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Form.Select field='method' label=' ' trigger='blur' style={{ width: '120px' }}>
              <Form.Select.Option value="GET">GET</Form.Select.Option>
              <Form.Select.Option value="POST">POST</Form.Select.Option>
              <Form.Select.Option value="PUT">PUT</Form.Select.Option>
              <Form.Select.Option value="DELETE">DELETE</Form.Select.Option>
              <Form.Select.Option value="PATCH">PATCH</Form.Select.Option>
              <Form.Select.Option value="OPTIONS">OPTIONS</Form.Select.Option>
              <Form.Select.Option value="HEAD">HEAD</Form.Select.Option>
            </Form.Select>
            <InputGroup>
              <Form.Select field='protocol' trigger='blur' label=" " style={{ width: '100px' }}>
                <Form.Select.Option value="http">http://</Form.Select.Option>
                <Form.Select.Option value="https">https://</Form.Select.Option>
              </Form.Select>
              <Form.Input field='' trigger='blur' style={{ minWidth: '400px'}}></Form.Input>
            </InputGroup>
            <ComponentUsingFormApi/>
            {/* <Button type="primary" htmlType="submit" className="btn-margin-right">
              Send
            </Button> */}
        </div>
        <Tabs type="button">
          <TabPane tab="Params" itemKey="1">
              <ArrayField field='params'>
                {({ arrayFields, addWithInitValue }) => (
                  <>
                  {
                    arrayFields.map(({ field, key, remove }) => (
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }} key={key}>
                        <KeyValueContainer style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                          <Form.Input prefix="Key" label=' ' field={`${field}.key`} trigger='blur'></Form.Input>
                          <Form.Input prefix="Value" label=' ' field={`${field}.value`} trigger='blur'></Form.Input>
                        </KeyValueContainer>
                        
                        <KeyValueBtnContainer>
                          <Button icon={<IconPlusCircle />} onClick={() => addWithInitValue({
                            key: ' ',
                            value: ' '
                          })}></Button>
                          <Button 
                            icon={<IconMinusCircle />} 
                            type='danger'
                            onClick={() => remove()}>
                          </Button>
                        </KeyValueBtnContainer>
                      </div>
                    ))
                  }
                  </>
                  
                )}
              </ArrayField>
          </TabPane>
          <TabPane tab="Body" itemKey="2">
              <CustomFormBody field="body"/>
          </TabPane>
          <TabPane tab="Headers" itemKey="3">
               <Headers/>
          </TabPane>
          <TabPane tab="Authorization" itemKey="4">
              Authorization
          </TabPane>
        </Tabs>
        
    </Form >
    )
};

export default FormArea;