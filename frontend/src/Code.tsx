import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import * as ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import { Button } from '@douyinfe/semi-ui';
import { IconSend } from "@douyinfe/semi-icons";
import { Col } from "@douyinfe/semi-ui";
import { Row } from "@douyinfe/semi-ui";
import { IconSave } from "@douyinfe/semi-icons";



const CodeEditor: React.FC  = () => {
    const [str, setStr] = useState<string>('');
    const [data, setData] = useState<object>({});
    useEffect(() => {
        // 初始化请求编辑器
        const requestEditor = ace.edit('code-request-editor');
        requestEditor.getSession().setMode('ace/mode/javascript');
        requestEditor.setTheme('ace/theme/monokai');
        requestEditor.setOptions({
            fontSize: '14px',
            showPrintMargin: false,
            highlightActiveLine: true,
            showGutter: true,
            tabSize: 2,
            enableAutoIndent: true,
            useSoftTabs: true,
            // readOnly: true,
        });
        const javascriptCode = `axios({
    method: 'post',
    url: '/api/example',
    data: {
        name: 'Fred',
        list: [{first: 'Fred', second: 'Wilson'}]
    }
}).then(function (response) {
    console.log(response);
    return response.data;
})
.catch(function (error) {
    console.log(error);
    return error;
});
`
        requestEditor.setValue(javascriptCode);
        requestEditor.session.on('change', function() {
            const str = requestEditor.getValue()
            setStr(str);
        });
        requestEditor.clearSelection();

        
    },[])

    useEffect(() => {
        // 初始化响应编辑器
        const responseEditor = ace.edit('code-response-editor');
        responseEditor.getSession().setMode('ace/mode/javascript');
        responseEditor.setTheme('ace/theme/monokai');
        responseEditor.setOptions({
            fontSize: '14px',
            showPrintMargin: false,
            highlightActiveLine: true,
            showGutter: true,
            tabSize: 2,
            enableAutoIndent: true,
            useSoftTabs: true,
            readOnly: true,
        });
        responseEditor.setValue(JSON.stringify(data, null, 2));
    }, [data])
    
    const send = useCallback(() => {
        const rsStr = `return ${str}`.replace(/return (\r?\n)+/g, 'return ')
        const fn = new Function('axios',rsStr)
        fn(axios).then((res: {data: object}) => {
            setData(res)
        })
    },[str, setData])

    return (<>
        <div style={{ textAlign: 'right'}}>
            <Button 
                icon={<IconSend />} 
                style={{marginBottom: '10px'}} 
                onClick={() => {
                    send()
            }}>Send</Button>
            <Button 
                icon={<IconSave />} 
                style={{marginBottom: '10px', marginLeft: '10px'}} 
                onClick={() => {
                    
            }}>Save</Button>
        </div>
        
        <Row gutter={16}>
            <Col span={12}>
                <h3>Request</h3>
                <div id="code-request-editor" style={{height:'500px'}}></div>
            </Col>
            <Col span={12}>
                <h3>Response</h3>
                <div id="code-response-editor" style={{height:'500px'}}></div>
            </Col>
        </Row>
            
        
    </>);
}

export default CodeEditor;