import React, { useState } from "react";
import { Button, Upload, Card, Row, Col, Modal, message, Spin, Input, Select } from 'antd';
import { upload, process } from '../../../services/api'
import { PlusOutlined } from '@ant-design/icons'
import logo from '../../../assets/logo.png'
import './upload.css'

const Option = { Select }

export default function FileUpload() {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([])
    const [audioName, setAudioName] = useState('')
    const [videoName, setVideoName] = useState('')
    const [loading, setLoading] = useState(false)
    const [excelUrl, setExcelUrl] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [processMessage, setProcessMessage] = useState('Uploading Files')


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
        maxCount: 2

    };
    const processFiles = async () => {

        let req = {
            video_filename: videoName,
            audio_filename: audioName,
            google_sheet: excelUrl,
            email_id: email,
            password: password

        }
        let process_result = await process(req)
        if (process_result.message == 'Sucess and email sent') {
            message.success(`Email sent`);
        }
        else {
            message.err(`Error in sending email`);
            setLoading(false)
        }
    }
    const handleSubmit = async () => {
        setLoading(true)
        if (fileList.length !== 2) {
            message.error('Upload one audio and one video file');
            return;
        }
        const audioExtensions = ['wav'];
        const videoExtensions = ['mp4', 'mov'];

        const audioFile = fileList.find((file) => audioExtensions.includes(file.name.split('.')[1]));
        const videoFile = fileList.find((file) => videoExtensions.includes(file.name.split('.')[1]));

        if (!audioFile || !videoFile) { message.error('Upload one audio and one video file with valid extensions'); return; }
        const formData = new FormData(); formData.append('audio', audioFile.originFileObj);
        formData.append('video', videoFile.originFileObj);
        let result = await upload(formData);
        try {
            if (result.audio && result.video) {
                let audio_split = audioFile.name.split('.')
                let video_split = videoFile.name.split('.')
                setAudioName(audio_split[0])
                setVideoName(video_split[0])
                setIsSubmit(true)
                setProcessMessage('Processing Files and sending email')
            }
        }
        catch (err) {
            message.error(err);
            setLoading(false)
        }
        finally {
            setLoading(false)
        }

    }


    return (
        <>
            <Spin tip={processMessage} size="large" style={{ fontSize: '40px', marginTop: '150px', zIndex: -1, overflow: 'auto' }} spinning={loading} >
                <div style={{ backgroundColor: "#EAF7FF" }}>
                    <span className="header">
                        <img src={logo} style={{ display: 'inline-block', height: '90px', width: '90px', margin: '0' }} />
                    </span>
                    <br />
                    <Card className="upload_card" title="Upload Files">
                        <div>
                            <Row>
                                <Col span={8}>
                                    Upload Audio and Video files (.wav .mp4 .mov supported only)
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
                            <Row style={{ marginTop: '5px' }}>
                                <Col span={4}>
                                    <Button disabled={fileList.length == 2 ? false : true} onClick={() => handleSubmit()} className="button_upload">Upload Files</Button>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={12}>
                                    Upload Excel Sheet URL
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <Input value={excelUrl} onChange={(e) => setExcelUrl(e.target.value)} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>
                                    Email
                                </Col>
                                &nbsp;&nbsp;&nbsp;
                                <Col span={10}>
                                    Password
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Col>&nbsp;&nbsp;&nbsp;
                                <Col span={10}>
                                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Col>
                            </Row>
                        </div>
                        <Row style={{ marginTop: '50px' }}>
                            <Col span={4}>
                                <Button disabled={!isSubmit} onClick={() => processFiles()} className="button_upload">Submit</Button>
                            </Col>
                        </Row>
                        {loading ? <center></center> : <></>}

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
            </Spin >
        </>
    )
}
