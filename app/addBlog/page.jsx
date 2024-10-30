"use client";
import { Button, Container, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import classes from "./addblog.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

export default function AddBlog() {
  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postUserId, setPostUserId] = useState("");
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const getData = async () => {
    setIsLoading(true);
    try {
      const url = "https://dummyjson.com/posts?limit=5";
      const response = await axios.get(url);
      setPosts(response.data.posts);
    } catch (error) {
      console.log("Error fetching posts:", error);
      toast.error("Failed to fetch posts.");
    } finally {
      setIsLoading(false);
    }
  };

  const addPosts = async () => {
    let dataSet = {
      title: postTitle,
      body: postDesc,
      userId: postUserId,
    };
    for (const key in dataSet) {
      const value = dataSet[key];
      if (!dataSet[key]) {
        return toast.error(`${key} is required `);
      }
    }
    setIsLoading(true);
    try {
      const url = selectedItem
        ? `https://dummyjson.com/posts/${selectedItem?.userId}`
        : "https://dummyjson.com/posts/add";

      const response = selectedItem
        ? await axios.put(url, dataSet)
        : await axios.post(url, dataSet);
      if (response.data) {
        const updatedPost = response.data;
        console.log(updatedPost.id, "Updated Posts");
        if (!selectedItem) {
          setPosts((prev) => [updatedPost, ...prev]);
          toast.success("Post added successfully");
          resetForm();
        } else {
          setPosts((prev) => {
            const index = prev.findIndex(
              (item) => item.userId === updatedPost.userId
            );
            if (index !== -1) {
              const newPosts = [...prev];
              newPosts[index] = updatedPost;
              return newPosts;
            }
            return prev;
          });
          toast.success("Post updated successfully!");
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error posting:", error);
      toast.error("Failed post. Please try again.");
    }
    setIsLoading(false);
  };

  const removePosts = async (id) => {
    try {
      await axios.delete(`https://dummyjson.com/posts/${id}`);
      setPosts((prev) => prev.filter((item) => item.userId !== id));
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error("Failed to delete blog.");
      console.error("Error deleting post:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPosts();
    console.log("Submit Handle");
  };

  const handleUpdate = (item) => {
    setPostTitle(item.title);
    setPostDesc(item.body);
    setPostUserId(item.userId);
    setIsEditing(item.userId);
  };

  let resetForm = () => {
    setPostTitle("");
    setPostDesc("");
    setPostUserId("");
    setIsEditing(null);
    setSelectedItem(null);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="py-3">Add Post</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Select
          aria-label="Default select example"
          value={postUserId}
          onChange={(e) => setPostUserId(e.target.value)}
          className={classes.formInputDesign}
        >
          <option>Choose User ID's</option>
          {posts.map((item) => (
            <option
              value={item.userId}
              onChange={(e) => setPostUserId(e.target.value)}
            >
              {item.userId}
            </option>
          ))}
        </Form.Select>

        <Form.Control
          type="text"
          placeholder="Enter Post Title"
          className={classes.formInputDesign}
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter Post Content"
          className={classes.formInputDesign}
          value={postDesc}
          onChange={(e) => setPostDesc(e.target.value)}
        />
        <Button
          variant="dark"
          type="submit"
          className={classes.formInputDesign}
        >
          {isEditing ? "Update Post" : "Add Post"}
        </Button>
      </Form>
      <ToastContainer autoClose={2000} />
      {isLoading && <Spinner animation="border" />}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((item) => (
            <tr key={item.id}>
              <td>{item.userId}</td>
              <td>{item.title}</td>
              <td>{item.body}</td>
              <td>
                <div className={classes.actionBtns}>
                  <Button
                    variant="success"
                    onClick={() => {
                      setSelectedItem(item);
                      handleUpdate(item);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => removePosts(item.userId)}
                  >
                    Remove
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
