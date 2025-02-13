import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createPost } from '../../../services/api';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
    const [fileList, setFileList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [form] = Form.useForm();

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);

        // Preview image
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj;
            const reader = new FileReader();
            reader.addEventListener('load', () => setPreviewImage(reader.result));
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const onFinish = async (values) => {
        try {
            // Try to create post via API
            if (fileList.length > 0) {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('description', values.description);
                formData.append('location', values.location || '');
                formData.append('image', fileList[0].originFileObj);

                await createPost(formData);
            }

            // Create local post as backup or for offline support
            const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
            const newPost = {
                id: `local_${Date.now()}`,
                title: values.title,
                description: values.description,
                location: values.location || '',
                imagePreview: previewImage,
                likes_count: 0,
                liked: false
            };

            localPosts.push(newPost);
            localStorage.setItem('localPosts', JSON.stringify(localPosts));

            message.success('Post created successfully');
            onPostCreated && onPostCreated();
            handleCancel();
        } catch (error) {
            // If API creation fails, fall back to local post
            message.warning('Could not create post via server. Saved locally.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setFileList([]);
        setPreviewImage(null);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <React.Fragment>
            <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                className="create-post-button"
            >
                Create New Post
            </Button>

            <Modal
                title="Create New Post"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                className="create-post-modal"
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item name="image" label="Upload Image">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                            maxCount={1}
                            className="image-upload"
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        {previewImage && (
                            <div className="image-preview">
                                <img 
                                    src={previewImage} 
                                    alt="Preview" 
                                    style={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '300px', 
                                        objectFit: 'contain' 
                                    }} 
                                />
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input a title' }]}
                    >
                        <Input placeholder="Enter post title" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input a description' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Write your post description" />
                    </Form.Item>

                    <Form.Item name="location" label="Location">
                        <Input placeholder="Optional location" />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            className="submit-post-button"
                        >
                            Create Post
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

export default CreatePost;