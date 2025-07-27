import { useEffect } from 'react';

import * as ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const CustomJsonEditor: React.FC<{value: string}> = ({ value }) => {
  console.log("value", value);
  useEffect(() => {
    const editor = ace.edit('json-editor');
    editor.getSession().setMode('ace/mode/javascript');
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
    editor.setValue(value || '{}');
    console.log('value', value);
    editor.clearSelection();
  }, [value]);
  
  return <div id="json-editor" style={{ height: '500px' }}></div>;
}

export default CustomJsonEditor