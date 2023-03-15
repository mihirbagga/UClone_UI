import React, { useState } from "react";
import { Button, Upload, Card, Row, Col, Modal, message } from 'antd';
import { upload } from '../../../services/api'
import { PlusOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons'
import './upload.css'

export default function FileUpload() {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([])

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const handleCancel = () => setPreviewOpen(false);
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const onChange = info => {
        console.log(info)
        setFileList(info.fileList)
    }


    const props = {
        onChange: onChange,
        onPreview: handlePreview,
        customRequest: dummyRequest,
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
        beforeUpload: (file) => {
            console.log(file)
            const isWav = file.type === "audio/wav" || file.type === "video/mp4";

            if (!isWav) {
                message.error(`${file.name} is not supported`);
            }
            console.log(isWav || Upload.LIST_IGNORE)
            return isWav || Upload.LIST_IGNORE;
        }
    };
    const handleSubmit = () => {
        let formData = new FormData();

        console.log(fileList)
        if (fileList[0]?.name) {
            let name = fileList[0].name.split('.')
            if (name[1] == 'wav') {
                formData.append('audio', fileList[0]?.originFileObj)
            }
            if (name[1] == 'mp4' || name[1] == 'mov') {
                formData.append('video', fileList[0]?.originFileObj)
            }
        }
        if (fileList[1]?.name) {
            let name = fileList[1].name.split('.')
            if (name[1] == 'wav') {
                formData.append('audio', fileList[0]?.originFileObj)
            }
            if (name[1] == 'mp4' || name[1] == 'mov') {
                formData.append('video', fileList[0]?.originFileObj)
            }
        }
        let result = upload(formData)

    };

    return (
        <div>
            <Card className="header">
                <span className="header_font">
                    UClone
                </span>
            </Card>
            <br />
            <Card className="upload_card" title="Upload Files">
                <div>
                    <Row>
                        <Col span={8}>
                            Upload Audio and Video files (.wav and .m4a only)
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={4}>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                {...props}
                            >
                                <PlusOutlined />
                            </Upload>
                        </Col>
                    </Row>
                </div>
                <Row style={{ marginTop: '50px' }}>
                    <Col span={4}>
                        <Button disabled={fileList.length == 2 ? false : true} onClick={() => handleSubmit()} className="button_upload">Submit</Button>
                    </Col>
                    <Col span={4}>
                        <Button className="button_upload">Reset</Button>
                    </Col>
                </Row>
            </Card>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    )
}