
import { Layout, Nav, Button, Avatar } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconBytedanceLogo, IconHome, IconHistogram, IconLive } from '@douyinfe/semi-icons';
import { Link, Outlet, useLocation } from 'react-router';
import { IconTextRectangle } from '@douyinfe/semi-icons';
import { useEffect, useState } from 'react';
import { Typography } from '@douyinfe/semi-ui';

const { Header, Footer, Sider, Content } = Layout;

function Home() {
    const [selectedKey, setSelectedKey] = useState('');
    const location = useLocation()
    useEffect(() => {
        setSelectedKey(location.pathname.slice(1));
    }, [location]);
    return (
        <Layout style={{ border: '1px solid var(--semi-color-border)',height: '100%' }}>
                    <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                        <Nav
                            defaultSelectedKeys={[selectedKey]}
                            style={{ maxWidth: 220, height: '100%' }}
                            items={[
                                { itemKey: '', text: 'Page Request', icon: <IconHome size="large" /> },
                                { itemKey: 'code', text: 'Code Request', icon: <IconHistogram size="large" /> },
                                { itemKey: 'dev', text: 'Pending Development', icon: <IconLive size="large" /> },
                            ]}
                            renderWrapper={({ itemElement, props }: { itemElement: React.ReactNode, props: { itemKey: string } }) => {
                                return <Link style={{ textDecoration: "none" }} to={props.itemKey}>{itemElement}</Link>;

                            }}
                            header={{
                                logo: <Typography.Text icon={<IconTextRectangle style={{ fontSize: 36 }} />} link={{ href: 'https://github.com/dage212/fire-doc' }}></Typography.Text>,
                                text: <Typography.Text link={{ href: 'https://github.com/dage212/fire-doc' }}><span style={{fontSize: 20}}>Fire Doc</span></Typography.Text>,
                            }}
                            footer={{
                                collapseButton: true,
                                collapseText: () => 'Toggle Sidebar',
                            }}
                        />
                    </Sider>
                    <Layout style={{ height: '100%' }}>
                        <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                            <Nav
                                mode="horizontal"
                                footer={
                                    <>
                                        <Button
                                            theme="borderless"
                                            icon={<IconBell size="large" />}
                                            style={{
                                                color: 'var(--semi-color-text-2)',
                                                marginRight: '12px',
                                            }}
                                        />
                                        <Button
                                            theme="borderless"
                                            icon={<IconHelpCircle size="large" />}
                                            style={{
                                                color: 'var(--semi-color-text-2)',
                                                marginRight: '12px',
                                            }}
                                        />
                                        <Avatar color="orange" size="small">
                                            YJ
                                        </Avatar>
                                    </>
                                }
                            ></Nav>
                        </Header>
                        <Content
                            style={{
                                padding: '24px',
                                height: '100%',
                                backgroundColor: 'var(--semi-color-bg-0)',
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: '10px',
                                    border: '1px solid var(--semi-color-border)',
                                    height: 'calc(100% - 104px)',
                                    padding: '32px',
                                }}
                            >
                                <Outlet />
                            </div>
                        </Content>
                        <Footer
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '20px',
                                color: 'var(--semi-color-text-2)',
                                backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                            }}
                        >
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <IconBytedanceLogo size="large" style={{ marginRight: '8px' }} />
                                <span>Copyright © 2025 <Typography.Text link={{ href: 'https://github.com/dage212/fire-doc' }}>dage212</Typography.Text>. All Rights Reserved. </span>
                            </span>
                        </Footer>
                    </Layout>
                </Layout>
    );
}

export default Home;