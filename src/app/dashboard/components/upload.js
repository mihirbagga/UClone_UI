import React, { useState } from "react";
import { Button, Upload, Card, Row, Col, Modal, message, Spin } from 'antd';
import { upload, process } from '../../../services/api'
import { PlusOutlined } from '@ant-design/icons'
import logo from '../../../assets/logo.png'
import './upload.css'

export default function FileUpload() {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([])
    const [audioName, setAudioName] = useState('')
    const [videoName, setVideoName] = useState('')
    const [loading, setLoading] = useState(false)


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
        formData.append('video', videoFile.originFileObj); setAudioName(audioFile.name.split('.')[0]); setVideoName(videoFile.name.split('.')[0]);
        let result = await upload(formData);
        try {
            if (result.audio && result.video) {
                console.log(audioName, videoName)
                let audio_split = audioName.split('.')
                let video_split = videoName.split('.')

                let req = {
                    video_filename: video_split[0],
                    audio_filename: audio_split[0]
                }
                let process_result = await process(req)
                console.log(process_result)
                if (process_result.message == 'Sucess and email sent') {
                    message.success(`Email sent`);
                }
                else {
                    setLoading(false)
                }
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

    // const handleSubmit = async () => {
    //     setLoading(true)

    //     if ((fileList[0].name.split('.')[1] == 'wav' || fileList[1].name.split('.')[1] == 'wav') && (fileList[1].name.split('.')[1] == 'mp4' || fileList[0].name.split('.')[1] == 'mp4' || fileList[1].name.split('.')[1] == 'mov' || fileList[0].name.split('.')[1] == 'mov')) {
    //         let formData = new FormData();
    //         if (fileList[0]?.name) {
    //             let name = fileList[0].name.split('.')

    //             if (name[1] == 'wav') {
    //                 formData.append('audio', fileList[0]?.originFileObj)
    //                 setAudioName(fileList[0]?.name)
    //             }
    //             if (name[1] == 'mp4' || name[1] == 'mov') {
    //                 formData.append('video', fileList[0]?.originFileObj)
    //                 setVideoName(fileList[0]?.name)
    //             }
    //         }
    //         if (fileList[1]?.name) {
    //             let name = fileList[1].name.split('.')
    //             if (name[1] == 'wav') {
    //                 formData.append('audio', fileList[1]?.originFileObj)

    //                 setAudioName(fileList[1]?.name)

    //             }
    //             if (name[1] == 'mp4' || name[1] == 'mov') {
    //                 formData.append('video', fileList[1]?.originFileObj)
    //                 console.log(fileList[1]?.name)
    //                 setVideoName(fileList[1]?.name)

    //             }
    //         }
    //         try {
    //             let result = await upload(formData);
    //             if (result.audio && result.video) {
    //                 console.log(audioName, videoName)
    //                 let audio_split = audioName.split('.')
    //                 let video_split = videoName.split('.')

    //                 let req = {
    //                     video_filename: video_split[0],
    //                     audio_filename: audio_split[0]
    //                 }
    //                 let process_result = await process(req)
    //                 console.log(process_result)

    //                 if (process_result.message == 'Sucess and email sent') {
    //                     message.error(`Email sent`);
    //                 }
    //             }
    //         }
    //         catch (err) {
    //             message.error(err);
    //         }
    //         finally {
    //             setLoading(true)
    //         }
    //     }
    //     else {
    //         message.error(`Upload one audio and one video file`);
    //     }
    // };

    return (
        <>
            <div style={{ backgroundColor: "#EAF7FF" }}>
                <span className="header">
                    {/* <span className="header_font">
                        UClone
                    </span> */}
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
                    </div>
                    <Row style={{ marginTop: '50px' }}>
                        <Col span={4}>
                            <Button disabled={fileList.length == 2 ? false : true} onClick={() => handleSubmit()} className="button_upload">Submit</Button>
                        </Col>
                        {/* <Col span={4}>
                        <Button className="button_upload">Reset</Button>
                    </Col> */}
                    </Row>
                    {loading ? <center><Spin tip="Processing" size="large" style={{ fontSize: '40px', zIndex: -1, overflow: 'auto' }} /></center> : <></>}

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
            </div></>
    )
}