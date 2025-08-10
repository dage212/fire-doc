/// <reference types="vite/client" />
/// <reference types="react-dom" />

declare module '@douyinfe/semi-ui';
declare module '@douyinfe/semi-icons';

declare module 'react-split-pane' {
    import * as React from 'react';
    
    interface SplitPaneProps {
        split?: 'vertical' | 'horizontal';
        minSize?: number;
        defaultSize?: number;
        children?: React.ReactNode[];
    }
    
    const SplitPane: React.ComponentClass<SplitPaneProps>;
    export default SplitPane;
}
