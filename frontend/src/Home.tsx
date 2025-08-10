import { useMemo, useState } from 'react';
import { Layout, Nav, Avatar, Image, Button } from '@douyinfe/semi-ui';
import { IconCloud } from '@douyinfe/semi-icons';
import { Outlet } from 'react-router';
import SplitPane from 'react-split-pane';
import styled from 'styled-components';
import InnerList from './innerList';
import { MyContext } from './contexts';
import bg from './assets/bg.png'

const { Header, Content } = Layout;

const SplitPaneStyle = styled(SplitPane)`
.Resizer {
  background: var(--semi-color-border);
  z-index: 1;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -moz-background-clip: padding;
  -webkit-background-clip: padding;
  background-clip: padding-box;
}

.Resizer:hover {
  -webkit-transition: all 2s ease;
  transition: all 2s ease;
  opacity: 0.2;
}

.Resizer.horizontal {
  height: 11px;
  margin: -5px 0;
  border-top: 5px solid var(--semi-color-border);
  border-bottom: 5px solid var(--semi-color-border);
  cursor: row-resize;
  width: 100%;
}

.Resizer.horizontal:hover {
  border-top: 5px solid rgba(0, 0, 0, 0.5);
  border-bottom: 5px solid rgba(0, 0, 0, 0.5);
}

.Resizer.vertical {
  width: 11px;
  margin: 0 -5px;
  border-left: 5px solid rgba(255, 255, 255, 0);
  border-right: 5px solid rgba(255, 255, 255, 0);
  cursor: col-resize;
}

.Resizer.vertical:hover {
  border-left: 5px solid rgba(0, 0, 0, 0.5);
  border-right: 5px solid rgba(0, 0, 0, 0.5);
}
.Resizer.disabled {
  cursor: not-allowed;
}
.Resizer.disabled:hover {
  border-color: transparent;
}
`

function Home() {
    const [refresh, setRefresh] = useState(false);
    const value = useMemo(() => ({ refresh, setRefresh }), [refresh]);
    return (
        <Layout style={{ border: '1px solid var(--semi-color-border)',height: '100%' }}>
                    <Layout style={{ height: '100%' }}>
                        <Header style={{ backgroundColor: 'var(--semi-color-bg-1)', display: 'flex'}}>
                            <Nav mode="horizontal" defaultSelectedKeys={['Home']}>
                        <Nav.Header>
                            <Image style={{cursor: 'pointer'}} src={bg} width={80} height={40} preview={false} alt="logo" onClick={() => {
                                window.location.href = 'https://github.com/dage212/fire-doc';
                            }}/>
                        </Nav.Header>
                        <Nav.Footer>
                            <Button
                                icon={<IconCloud />}
                                onClick={() => {
                                    alert('Not implemented yet.\nThis will become a cloud service feature.');
                                }}
                                style={{
                                    // color: 'var(--semi-color-text-2)',
                                    marginRight: '12px',
                                }}
                            >Publish</Button>
                            <Avatar color="orange" size="small" onClick={() => {
                                    alert('Not implemented yet.\nThis will become a cloud service feature.');
                                }}>
                                YJ
                            </Avatar>
                        </Nav.Footer>
                    </Nav>
                        </Header>
                        <Content
                            style={{
                                height: '100%',
                                backgroundColor: 'var(--semi-color-bg-0)',
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: '10px',
                                    height: '100%',
                                    position: 'relative',
                                }}
                            >
                                <MyContext.Provider value={value}>
                                    <SplitPaneStyle split="vertical" minSize={100} defaultSize={300}>
                                            <InnerList />
                                            <Outlet />
                                    </SplitPaneStyle>
                                </MyContext.Provider>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
    );
}

export default Home;

