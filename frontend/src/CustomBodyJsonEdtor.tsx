import { forwardRef, useEffect, useImperativeHandle, useState } from "react";


import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

interface JSONEditorProps {
        onChange?: (val: unknown) => void;
        field?: string;
        id: string;
        mode: string;
        defaultValue: string

}

export type CustomBodyRefProps = {
  getValue: () => string | undefined;
}
const JSONEditorReact = forwardRef<CustomBodyRefProps, JSONEditorProps>((props, ref) => {
    const [value, setValue] = useState<string>();

    useEffect(() => {
        const editor = ace.edit(props.id);
        editor.getSession().setMode(`ace/mode/${props.mode}`);
        editor.setTheme('ace/theme/github');
        editor.setOptions({
            fontSize: '14px',
            showPrintMargin: false,
            highlightActiveLine: true,
            showGutter: true,
            tabSize: 2,
            enableAutoIndent: true,
            useSoftTabs: true,
        });
        editor.setValue(props.defaultValue);
        editor.session.on('change', function() {
            const str = editor.getValue()
            setValue(str)
        });
        editor.clearSelection();
    },[props.id, props.mode, props.defaultValue])

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value
            }
        }
    }, [value])
    
    return (<div id={props.id} style={{height:'400px', margin: '20px'}}></div>);
});

export default JSONEditorReact;