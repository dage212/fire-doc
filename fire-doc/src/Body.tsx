import { useEffect } from "react";


import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/monokai';
import { withField } from "@douyinfe/semi-ui";

interface JSONEditorProps {
        // onChange: (val: unknown) => void;
        field: string;
}
const JSONEditorReact = (props: JSONEditorProps) => {
    
    useEffect(() => {
        const editor = ace.edit('javascript-editor');
        editor.getSession().setMode('ace/mode/json');
        editor.setTheme('ace/theme/monokai');
        editor.setOptions({
            fontSize: '14px',
            showPrintMargin: false,
            highlightActiveLine: true,
            showGutter: true,
            tabSize: 2,
            enableAutoIndent: true,
            useSoftTabs: true,
        });
        editor.setValue([
            '{'
        , '\n'
        , '}'
        ].join('\n')
        );
        editor.session.on('change', function() {
            const str = editor.getValue()
            let json = {};
            try {
                json = JSON.parse(str || '{}');
            } catch (e: unknown) {
                json = {}
                console.error('JSON parse error:', e);
            }
            console.log('JSON changed:', json, props.field);
            // props?.onChange(json);
        });
        editor.clearSelection();
    },[])
    
    return (<div id="javascript-editor" style={{height:'500px'}}></div>);
}
const CustomFormBody = withField(JSONEditorReact, { valueKey: 'value', onKeyChangeFnName: 'onChange'});

export default CustomFormBody;