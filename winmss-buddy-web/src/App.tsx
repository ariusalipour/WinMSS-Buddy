import { useState } from "react";
import { Layout, Table, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadRawData } from "./services/api";
import {Match} from "./models.ts";

const { Header, Content, Footer } = Layout;

const columns = [
    {
        title: "Match Name",
        dataIndex: "matchName",
        key: "matchName",
    },
];

function App() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleUpload = async (file: File) => {
        setLoading(true);
        try {
            const response = await uploadRawData(file);
            console.log(`DEBUG: ${JSON.stringify(response.matches)}`);
            setMatches(response.matches); // Assuming the response is an array of matches
            message.success("File uploaded and processed successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
            message.error("Failed to process the file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Header style={{ color: "white", fontSize: "20px" }}>
                WinMSS Buddy Dashboard
            </Header>
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                <div style={{ padding: 24, background: "#fff" }}>
                    <h2>Upload and Process Data</h2>
                    <Upload
                        beforeUpload={(file) => {
                            handleUpload(file);
                            return false; // Prevent default upload
                        }}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} type="primary">
                            Upload .cab File
                        </Button>
                    </Upload>
                    <div style={{ marginTop: 24 }}>
                        <h3>Matches</h3>
                        <Table
                            dataSource={matches.map((match, index) => ({
                                ...match,
                                key: index,
                            }))}
                            columns={columns}
                            loading={loading}
                            bordered
                        />
                    </div>
                </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                WinMSS Buddy ©2025 Created by Chamber Check
            </Footer>
        </Layout>
    );
}

export default App;
