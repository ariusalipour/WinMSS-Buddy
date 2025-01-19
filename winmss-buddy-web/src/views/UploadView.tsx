import React, { useState } from "react";
import { Upload, Typography, message, List, Progress, Button } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useAppContext } from "../context/AppContext";
import { uploadRawData } from "../services/api";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

interface FileProgress {
    file: File;
    progress: number;
    status: "active" | "success" | "exception"; // Add status for success or failure
}

const UploadView: React.FC = () => {
    const { processedData, setProcessedData } = useAppContext();
    const [fileList, setFileList] = useState<FileProgress[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (file: File) => {
        setFileList((prev) => [...prev, { file, progress: 0, status: "active" }]);
        return false; // Prevent automatic upload
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error("No files selected for upload.");
            return;
        }

        setUploading(true);

        try {
            // Instantly move progress bars to 100%
            setFileList((prev) =>
                prev.map((fileProgress) => ({
                    ...fileProgress,
                    progress: 100,
                    status: "success",
                }))
            );

            // Create FormData and append all files
            const formData = new FormData();
            fileList.forEach(({ file }) => formData.append("files", file));

            // Make the API call
            const response = await uploadRawData(formData);

            setProcessedData(response); // Assuming the API returns `ProcessedData`
            message.success("Files uploaded and processed successfully!");
            setFileList([]); // Clear file list after successful upload
        } catch (error) {
            console.error("Error uploading files:", error);

            // Set progress bars to failed state
            setFileList((prev) =>
                prev.map((fileProgress) => ({
                    ...fileProgress,
                    progress: 100,
                    status: "exception", // Mark progress bar as failed
                }))
            );

            message.error("Failed to upload files.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Title level={2}>Upload WinMSS Data</Title>
            <Paragraph>
                Drag and drop `.cab` files here, or click to browse and upload one or more files.
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
                <p className="ant-upload-text">Click or drag files to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for multiple files. Ensure files are in `.cab` format.
                </p>
            </Dragger>

            {/* Show Selected Files Section Only When Files Are Added */}
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
                                    <Progress
                                        percent={progress}
                                        size="small"
                                        status={status} // Use status to show active, success, or exception
                                    />
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

            {/* Display Matches */}
            {(processedData?.matches?.length || 0) > 0 && (
                <div style={{ marginTop: "24px" }}>
                    <Title level={3}>Imported Matches</Title>
                    <List
                        bordered
                        dataSource={processedData?.matches || []} // Fallback to an empty array
                        renderItem={(item) => <List.Item>{item.matchName}</List.Item>}
                    />
                </div>
            )}
        </div>
    );
};

export default UploadView;
