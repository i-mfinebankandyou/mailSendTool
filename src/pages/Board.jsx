// Board.jsx
import React, { useState } from "react";
import boardData from "../board.json";
import { useNavigate } from "react-router-dom";

function Board() {
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [boardPosts, setBoardPosts] = useState(boardData);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  // 초깃값 4 하드코딩 대신, json에서 최대 id + 1 로 계산
  const getInitialId = () => {
    if (!boardData || boardData.length === 0) return 1;
    return Math.max(...boardData.map((p) => p.id)) + 1;
  };
  const [currentId, setCurrentId] = useState(getInitialId());

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!boardTitle || !boardContent) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    const newPost = {
      id: currentId,
      title: boardTitle,
      content: boardContent,
      person: "관리자",
      time: Date.now(),
    };

    try {
      const response = await fetch(
        "http://localhost:5678/webhook-test/db-check",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
        }
      );

      if (!response.ok) {
        throw new Error("게시글 저장 실패");
      }

      const result = await response.json();
      console.log("게시글 저장됨:", result);
    } catch (error) {
      console.error(error);
      alert("서버 오류로 인해 게시글 저장에 실패했습니다.");
      return;
    }

    // 서버 저장 성공 → 프론트 목록에도 추가
    setBoardPosts([newPost, ...boardPosts]);
    setBoardTitle("");
    setBoardContent("");
    setCurrentId(currentId + 1);
    setIsWriting(false);
  };

  return (
    <>
      <h1>사내 게시판</h1>
      {isWriting ? (
        <>
          <form onSubmit={handleSubmit}>
            <table className="board">
              <tbody>
                <tr>
                  <td>제목</td>
                  <td>
                    <input
                      type="text"
                      value={boardTitle}
                      onChange={(e) => setBoardTitle(e.target.value)}
                      placeholder="게시글 제목"
                    />
                  </td>
                </tr>
                <tr>
                  <td>내용</td>
                  <td>
                    <textarea
                      rows={5}
                      value={boardContent}
                      onChange={(e) => setBoardContent(e.target.value)}
                      placeholder="게시글 내용을 입력하세요"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <button className="bottom-button" type="submit">
              작성하기
            </button>
            <button
              className="bottom-button"
              type="button"
              style={{
                backgroundColor: "white",
                color: "#5877f9",
                marginLeft: 10,
              }}
              onClick={() => setIsWriting(false)}
            >
              취소
            </button>
          </form>
        </>
      ) : (
        <>
          <table className="board">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>ID</th>
                <th style={{ width: "50%" }}>제목</th>
                <th style={{ width: "10%" }}>작성자</th>
                <th style={{ width: "30%" }}>작성 시간</th>
              </tr>
            </thead>
            <tbody>
              {boardPosts.map((post) => (
                <tr
                  key={post.id}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/board/${post.id}`, { state: { post } })
                  } // 기존 동작 유지
                >
                  <td>{post.id}</td>
                  <td style={{ fontWeight: "500" }}>{post.title}</td>
                  <td>{post.person}</td>
                  <td>{new Date(post.time).toLocaleString("ko-KR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedPost && (
            <div
              className="board-detail"
              style={{
                width: "80%",
                margin: "20px auto",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "16px",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                {selectedPost.title}
              </h3>
              <div
                style={{
                  marginBottom: "8px",
                  color: "dimgray",
                  fontSize: "14px",
                }}
              >
                작성자: {selectedPost.person} &nbsp;|&nbsp; 작성 시간:{" "}
                {new Date(selectedPost.time).toLocaleString("ko-KR")}
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {selectedPost.content}
              </div>
            </div>
          )}

          <div className="right-align">
            <button
              className="bottom-button"
              type="button"
              onClick={() => setIsWriting(true)}
            >
              글쓰기
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Board;
