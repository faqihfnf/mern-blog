import { Alert, Button, Modal, Textarea, Toast } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiCheckBadge } from "react-icons/hi2";
import Comment from "./Comment";
import { FaExclamationCircle } from "react-icons/fa";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [showToastDelete, setShowToastDelete] = useState(false);

  const handleSubmit = async (e) => {
    setShowToast(false);
    e.preventDefault();
    if (comment > 500) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setComment("");
          setCommentError(error.message);
        }, 2000);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getpostcomments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((cmt) =>
        cmt._id === comment._id ? { ...cmt, content: editedContent } : cmt
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setShowToastDelete(true);
        setTimeout(() => {
          setComments(comments.filter((comment) => comment._id !== commentId));
          setShowToastDelete(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" mx-auto w-full py-5">
      {currentUser ? (
        <div className=" flex items-center gap-1 my-5 text-slate-500 text-sm">
          <p className="font-semibold text-slate-700">Login sebagai : </p>
          <img
            className="w-5 h-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="text-indigo-600 hover:underline font-semibold">
            {" "}
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className=" flex items-center gap-1 font-semibold">
          Anda harus login untuk berkomentar!
          <Link to="/sign-in" className="ml-1 text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border-2 border-teal-600 p-5 rounded-md mt-5"
          onSubmit={handleSubmit}>
          <Textarea
            type="text"
            placeholder="Tuliskan Komentar Anda....."
            rows="5"
            maxLength={500}
            className="w-full"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between mt-4 ">
            <p className="text-sm text-slate-500 p-1">
              {500 - comment.length} karakter tersisa
            </p>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-3">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {/* Toast Create Comment */}
      {showToast && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast
            color="success"
            className="bg-green-500 gap-1 dark:bg-green-500 w-full p-5">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-1 text-sm font-semibold text-white">
              Komentar berhasil ditambahkan{" "}
            </div>
            <Toast.Toggle className="ml-1 bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
      )}
      {/* Toast Delete Comment */}
      {showToastDelete && (
        <div className="fixed top-0 right-0 gap-4">
          <Toast
            color="success"
            className="bg-red-500 gap-1 dark:bg-red-500 w-full p-5">
            <HiCheckBadge className="w-8 h-8 text-white" />
            <div className="ml-1 text-sm font-semibold text-white">
              Komentar berhasil dihapus{" "}
            </div>
            <Toast.Toggle className="ml-1 bg-opacity-15 dark:bg-opacity-15 dark:text-white hover:bg-opacity-30 text-white" />
          </Toast>
        </div>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">Belum ada komentar</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-2">
            <p className="font-semibold text-slate-700">Komentar</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaExclamationCircle className="text-6xl text-gray-500 mb-4 mx-auto" />
            <h3 className="mb-5 text-xl font-normal text-gray-500">
              Apakah anda yakin ingin menghapus komentar ini?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}>
                Hapus
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Batal
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
