import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import Editor from '@monaco-editor/react';
import type { JSONEditorProps } from "./types";



export type CustomBodyRefProps = {
  getValue: () => string | undefined;
}
const JSONEditorReact = forwardRef<CustomBodyRefProps, JSONEditorProps>((props, ref) => {
    const [value, setValue] = useState<string>();

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value
            }
        }
    }, [value])
    
    const handleEditorChange = (val: string | undefined) => {
      setValue(val)
    }

    useEffect(() => {
      setValue(props.defaultValue)
    }, [props.defaultValue])
    
    return (<div style={{height: props.height ?? 'calc(100vh - 400px)'}}>
      <Editor 
        height="100%" 
        defaultLanguage={props.mode || 'json'} 
        value={value} 
        onChange={handleEditorChange}
        options={{ 
            scrollBeyondLastLine: false,
            scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
            },
            glyphMargin: false,
            lineNumbersMinChars: 1,
            lineDecorationsWidth: 0,
            minimap: { enabled: false },
            readOnly: props.readOnly || false // Added read-only option
        }}
      />
    </div>);
});

export default JSONEditorReact;