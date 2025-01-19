import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
    Layout,
    Menu,
    Typography,
    theme,
    Tooltip,
} from "antd";
import {
    UploadOutlined,
    UnorderedListOutlined,
    TeamOutlined,
    TrophyOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import UploadView from "./views/UploadView";
import ViewView from "./views/ViewView";
import MergeView from "./views/MergeView";
import ResultsView from "./views/ResultsView";
import InfoView from "./views/InfoView";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const sidebarMenu = [
        {
            key: "1",
            icon: <UploadOutlined />,
            label: <Link to="/">Upload</Link>,
        },
        {
            key: "2",
            icon: <UnorderedListOutlined />,
            label: <Link to="/view">View</Link>,
        },
        {
            key: "3",
            icon: <TeamOutlined />,
            label: <Link to="/merge">Merge</Link>,
        },
        {
            key: "4",
            icon: <TrophyOutlined />,
            label: <Link to="/results">Results</Link>,
        },
    ];

    return (
        <Router>
            <Layout style={{ minHeight: "100vh" }}>
                <Header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 16px",
                        background: "#001529",
                    }}
                >
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", color: "white" }}>
                        <img
                            src="/logo.png" // Replace with your logo path
                            alt="Logo"
                            style={{ height: "40px", marginRight: "16px" }}
                        />
                    </div>

                    {/* Title */}
                    <Title level={3} style={{ margin: 0, color: "white" }}>
                        WinMSS Buddy
                    </Title>

                    {/* Info Icon */}
                    <Tooltip title="Learn more about WinMSS Buddy">
                        <Link to="/info">
                            <InfoCircleOutlined
                                style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
                            />
                        </Link>
                    </Tooltip>
                </Header>
                <Layout>
                    <Sider
                        width={200}
                        style={{
                            background: colorBgContainer,
                            borderRight: "1px solid #f0f0f0",
                        }}
                    >
                        <Menu mode="inline" defaultSelectedKeys={["1"]} items={sidebarMenu} />
                    </Sider>
                    <Layout style={{ padding: "16px" }}>
                        <Content
                            style={{
                                padding: 24,
                                background: colorBgContainer,
                                borderRadius: "8px",
                            }}
                        >
                            <Routes>
                                <Route path="/" element={<UploadView />} />
                                <Route path="/view" element={<ViewView />} />
                                <Route path="/merge" element={<MergeView />} />
                                <Route path="/results" element={<ResultsView />} />
                                <Route path="/info" element={<InfoView />} />
                            </Routes>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </Router>
    );
};

export default App;
