import React from "react";
import { Upload, Button, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const UploadView: React.FC = () => {
    const handleUpload = (file: File) => {
        console.log("Uploading file:", file.name);
        return false; // Prevent automatic upload
    };

    return (
        <div>
            <Title level={2}>Upload WinMSS Data</Title>
    <Paragraph>
    Upload one or more `.cab` files to process the data and analyze the matches.
    </Paragraph>
    <Upload
    multiple
    beforeUpload={handleUpload}
    showUploadList={true}
    >
    <Button icon={<UploadOutlined />} type="primary">
        Upload Files
    </Button>
    </Upload>
    </div>
);
};

export default UploadView;
