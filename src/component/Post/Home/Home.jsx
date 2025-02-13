import React, { useState, useEffect } from 'react';
import { Row, Card, Button, message, Modal, Form, Input, Upload } from 'antd';
import { fetchPosts, likePost, dislikePost, deletePost, updatePost } from '../../../services/api';
import CreatePost from '../CreatePost/CreatePost';
import { EyeOutlined, HeartOutlined, HeartFilled, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewPost, setViewPost] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const loadPosts = async () => {
        setLoading(!loading);
        try {
            const response = await fetchPosts();
            setPosts(response.data.posts);
        } catch (error) {
            message.error('Failed to fetch posts');
            error
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleLikeToggle = async (postId, liked) => {
        try {
            if (liked) {
                await dislikePost(postId);
            } else {
                await likePost(postId);
            }

            const updatedPosts = posts.map((post) =>
                post.id === postId ? { ...post, liked: !liked, likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1 } : post
            );

            setPosts(updatedPosts);
        } catch (error) {
            message.error('Failed to toggle like/dislike');
            error
        }
    };

    const handleDelete = async (postId) => {
        try {
            await deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId));
            message.success('Post deleted successfully');
        } catch (error) {
            if (error.response?.status === 403) {
                message.error('You are not authorized to delete this post.');
            } else if (error.response?.status === 401) {
                message.error('Your session has expired. Please log in again.');
            } else {
                message.error('Failed to delete post');
            }
            console.error('Delete Post Error:', error);
        }
    };

    const showPostDetails = (post) => {
        setViewPost(post);
    };

    const closeViewModal = () => {
        setViewPost(null);
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setIsModalVisible(true);  
        form.setFieldsValue({
            title: post.title,
            description: post.description,
            location: post.location,
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleUpdatePost = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('location', values.location || '');

        if (values.image && values.image[0]) {
            formData.append('image', values.image[0].originFileObj);
        }

        try {
            const response = await updatePost(editingPost.id, formData);

            const updatedPosts = posts.map((post) =>
                post.id === editingPost.id ? { ...post, ...response.data.post } : post
            );

            setPosts(updatedPosts);
            message.success('Post updated successfully');
            setIsModalVisible(false);
            form.resetFields(); 
        } catch (error) {
            message.error('Failed to update post');
            console.error('Update Post Error:', error);
        }
    };

    return (
        <React.Fragment>
            <div style={{ padding: '30px', backgroundColor: '#f7f7f7' }}>
                <CreatePost onPostCreated={loadPosts} />
                <Row gutter={[16, 16]} style={{ marginTop: '30px', display: "flex", justifyContent: "space-between" }}>
                    {posts.map(post => (
                        <div key={post.id} className="post-card-container">
                            <Card
                                hoverable
                                cover={<img alt="post" src={post.image} style={{
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px 8px 0 0',
                                }} />}
                                actions={[
                                    <div className="post-card-actions" style={{ display: "flex", justifyContent: "space-between" }} key={post.id}>
                                        <Button
                                            key={`${post.id}-like`}
                                            type="link"
                                            icon={post.liked ? <HeartFilled style={{ color: 'red', fontSize: '1.5rem' }} /> : <HeartOutlined style={{ fontSize: '1.5rem' }} />}
                                            onClick={() => handleLikeToggle(post.id, post.liked)}
                                        >
                                            {post.likes_count}
                                        </Button><Button
                                            key={`${post.id}-view`}
                                            type="link"
                                            icon={<EyeOutlined style={{ fontSize: '1.5rem' }} />}
                                            onClick={() => showPostDetails(post)}
                                        >
                                            View
                                        </Button><Button
                                            key={`${post.id}-edit`}
                                            type="link"
                                            icon={<EditOutlined style={{ fontSize: '1.5rem' }} />}
                                            onClick={() => handleEdit(post)}
                                        >
                                            Edit
                                        </Button><Button
                                            key={`${post.id}-delete`}
                                            type="link"
                                            icon={<DeleteOutlined style={{ fontSize: '1.5rem', color: '#ff4d4f' }} />}
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ]}
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Card.Meta
                                    title={<span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{post.title}</span>}
                                    description={<span style={{ color: '#888', fontSize: '0.95rem' }}>{post.description}</span>}
                                />
                            </Card>
                        </div>
                    ))}
                </Row>

                <Modal
                    title="Post Details"
                    open={!!viewPost}
                    onCancel={closeViewModal}
                    footer={null}
                    width={700}
                    style={{ top: 20 }}
                >
                    {viewPost && (
                        <>
                            <img src={viewPost.image} alt="Post" style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewPost.title}</h3>
                            <p style={{ fontSize: '1rem', color: '#555' }}>{viewPost.description}</p>
                            <p><strong>Location:</strong> {viewPost.location}</p>
                        </>
                    )}
                </Modal>

                <Modal
                    title="Edit Post"
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={700}
                    style={{ top: 20 }}
                >
                    <Form
                        form={form}
                        onFinish={handleUpdatePost}
                        layout="vertical"
                    >
                        <Form.Item
                            name="image"
                            label="Upload Image"
                        >
                            <Upload
                                listType="picture-card"
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Please input the title' }]}>
                            <Input placeholder="Enter post title" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please input the description' }]}>
                            <Input.TextArea placeholder="Write your post description" />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label="Location">
                            <Input placeholder="Optional location" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Update Post
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default HomePage;
