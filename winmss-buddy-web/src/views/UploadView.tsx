import React, { useState, useEffect } from "react";
import { Upload, Typography, message, List, Progress, Button } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useAppContext } from "../context/AppContext";
import { UploadController } from "../controllers/UploadController";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

interface FileProgress {
    file: File;
    progress: number;
    status: "active" | "success" | "exception";
}

const UploadView: React.FC = () => {
    const { setApiResponse } = useAppContext();
    const [fileList, setFileList] = useState<FileProgress[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [matchNames, setMatchNames] = useState<{ matchId: number; matchName: string }[]>([]);

    const uploadController = new UploadController(setApiResponse);

    useEffect(() => {
        const savedMatchNames = localStorage.getItem("matchNames");
        if (savedMatchNames) {
            setMatchNames(JSON.parse(savedMatchNames));
        }
    }, []);

    const handleFileChange = (file: File) => {
        setFileList((prev) => [...prev, { file, progress: 0, status: "active" }]);
        return false;
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error("No files selected for upload.");
            return;
        }

        setUploading(true);

        try {
            setFileList((prev) =>
                prev.map((fp) => ({ ...fp, progress: 100, status: "success" }))
            );

            const filesToUpload = fileList.map((fp) => fp.file);
            const returnedMatchNames = await uploadController.uploadFiles(filesToUpload);

            setMatchNames(returnedMatchNames);
            localStorage.setItem("matchNames", JSON.stringify(returnedMatchNames));

            message.success("Files uploaded and processed successfully!");
            setFileList([]);
        } catch (error) {
            console.error("Error uploading files:", error);
            setFileList((prev) =>
                prev.map((fp) => ({ ...fp, progress: 100, status: "exception" }))
            );
            message.error("Failed to upload files.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Title>Upload WinMSS Data</Title>
            <Paragraph>
                Drag and drop .cab files here, or click to browse and upload one or more files.
            </Paragraph>
            <Dragger
                multiple
                beforeUpload={handleFileChange}
                fileList={[]}
                showUploadList={false}
                style={{
                    padding: "20px",
                    border: "1px dashed #d9d9d9",
                    borderRadius: "8px",
                    backgroundColor: "#fafafa",
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or drag files to this area to upload
                </p>
                <p className="ant-upload-hint">
                    Support for multiple files. Ensure files are in .cab format.
                </p>
            </Dragger>

            {fileList.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                    <Title level={3}>Selected Files</Title>
                    <List
                        bordered
                        dataSource={fileList}
                        renderItem={({ file, progress, status }) => (
                            <List.Item>
                                <div style={{ width: "100%" }}>
                                    <strong>{file.name}</strong>
                                    <Progress percent={progress} size="small" status={status} />
                                </div>
                            </List.Item>
                        )}
                    />
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={handleUpload}
                        loading={uploading}
                        style={{ marginTop: "16px" }}
                    >
                        Upload All Files
                    </Button>
                </div>
            )}

            {matchNames.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                    <Title level={3}>Imported Matches</Title>
                    <List
                        bordered
                        dataSource={matchNames}
                        renderItem={(item) => <List.Item>{item.matchName}</List.Item>}
                    />
                </div>
            )}
        </div>
    );
};

export default UploadView;