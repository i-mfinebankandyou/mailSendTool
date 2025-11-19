// BoardDetail.jsx
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container } from "./BoardDetail.styles";
import boardData from "../board.json";

function BoardDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  let post = location.state?.post;

  if (!post) {
    const numericId = Number(id);
    post = boardData.find((p) => p.id === numericId);
  }

  if (!post) {
    return (
      <Container>
        <table className="detail-table">
          <tbody>
            <tr className="detail-row">
              <td className="label-cell">제목</td>
              <td className="value-cell">
                <div className="value-box">게시글을 찾을 수 없습니다.</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="meta">작성자 정보를 찾을 수 없습니다.</div>
        <div className="bottom-area">
          <button className="back-button" onClick={() => navigate(-1)}>
            목록으로
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <table className="detail-table">
        <tbody>
          <tr className="detail-row">
            <td className="label-cell">제목</td>
            <td className="value-cell">
              <div className="value-box">{post.title}</div>
            </td>
          </tr>
          <tr className="detail-row content-row">
            <td className="label-cell">내용</td>
            <td className="value-cell">
              <div className="value-box content-box">{post.content}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="meta">
        작성자: {post.person} &nbsp;|&nbsp;{" "}
        {new Date(post.time).toLocaleString("ko-KR")}
      </div>

      <div className="bottom-area">
        <button className="back-button" onClick={() => navigate(-1)}>
          목록으로
        </button>
      </div>
    </Container>
  );
}

export default BoardDetail;
