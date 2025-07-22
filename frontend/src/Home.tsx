
import { Layout, Nav, Button, Breadcrumb, Avatar } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconBytedanceLogo, IconHome, IconHistogram, IconLive, IconSetting, IconSemiLogo } from '@douyinfe/semi-icons';
import { Link, Outlet } from 'react-router';

const { Header, Footer, Sider, Content } = Layout;

function Home() {


  return (
    <Layout style={{ border: '1px solid var(--semi-color-border)',height: '100%' }}>
                <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                    <Nav
                        defaultSelectedKeys={['Home']}
                        style={{ maxWidth: 220, height: '100%' }}
                        items={[
                            { itemKey: 'page', text: 'Page Request', icon: <IconHome size="large" /> },
                            { itemKey: 'code', text: 'Code Request', icon: <IconHistogram size="large" /> },
                            { itemKey: 'Live', text: '测试功能', icon: <IconLive size="large" /> },
                            { itemKey: 'Setting', text: '设置', icon: <IconSetting size="large" /> },
                        ]}
                        renderWrapper={({ itemElement, props }: { itemElement: React.ReactNode, props: { itemKey: string } }) => {
                            return <Link style={{ textDecoration: "none" }} to={props.itemKey}>{itemElement}</Link>;

                        }}
                        header={{
                            logo: <IconSemiLogo style={{ fontSize: 36 }} />,
                            text: 'Semi Design',
                        }}
                        footer={{
                            collapseButton: true,
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
                            <span>Copyright © 2025 dage212. All Rights Reserved. </span>
                        </span>
                    </Footer>
                </Layout>
            </Layout>
  );
}

export default Home;