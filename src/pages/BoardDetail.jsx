// BoardDetail.jsx
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import boardData from "../board.json";

const Container = styled.div`
  width: 80%;
  margin: 40px auto 0 auto;

  .detail-table {
    width: 100%;
    border-collapse: collapse;
    border-top: 2px solid #000; /* 맨 윗줄 진한 선 */
  }

  .detail-row {
    border-bottom: 2px solid #000;
  }

  /* 내용 행은 밑줄을 더 두껍게 */
  .content-row {
    border-bottom: 2px solid #000;
  }

  .label-cell {
    width: 20%;
    padding: 16px 12px;
    text-align: center;
    vertical-align: middle;
    font-size: 18px;
    /* 왼쪽/오른쪽 영역 사이 굵은 세로선 */
    border-right: 2px solid #000;
    background-color: #e9f2ff;
    align-items: center;
    justify-content: center;
  }

  .value-cell {
    padding: 12px 16px;
    vertical-align: middle;
    text-align: left;
  }

  .value-box {
    width: 100%;
    padding: 8px 12px;
    font-size: 18px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .content-box {
    min-height: 500px;
    white-space: pre-wrap;
  }

  /* 메타데이터 가운데 정렬 */
  .meta {
    width: 100%;
    margin: 12px auto 0 auto;
    font-size: 14px;
    color: dimgray;
    text-align: center;
  }

  .bottom-area {
    width: 100%;
    margin: 20px auto;
    display: flex;
    justify-content: center; /* 가운데 정렬 */
  }

  .back-button {
    padding: 8px 20px;
    border-radius: 6px;
    border: 1px solid #5877f9;
    background-color: #5877f9;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }

  .back-button:hover {
    background-color: #4766e0;
    border-color: #4766e0;
  }
`;

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
