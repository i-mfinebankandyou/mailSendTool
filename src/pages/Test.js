import React, { useState } from "react";
import boardData from "../board.json";
import { useNavigate } from "react-router-dom";
import { Container } from "./Test.styles";

function Test() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState("mail");
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [boardPosts, setBoardPosts] = useState(boardData);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [currentId, setCurrentId] = useState(4);
  const [checkBody, setCheckBody] = useState("");
  const [checkAttachments, setCheckAttachments] = useState([]);
  const [checkIsSending, setCheckIsSending] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setAttachments([]);
      return;
    }
    setAttachments([...e.target.files]);
  };

  // 메일 보기
  const handleSend = async (e) => {
    e.preventDefault();

    if (!from || !to || !subject || !body) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(from) || !emailRegex.test(to)) {
      alert("메일 형식이 잘못되었습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("from", from);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("body", body);
    if (attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append("attachment", file);
      });
    }

    setIsSending(true);

    try {
      const response = await fetch("http://localhost:5678/webhook-test/check", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setIsSending(false);
        throw new Error("서버 응답 오류");
      }

      const data = await response.json();

      setIsSending(false);

      if (data[0].response.status === "success") {
        alert("메일 전송에 성공하였습니다.");
        // handleReset();
      } else {
        const confirmForce = window.confirm(
          "메일 전송에 실패하였습니다.\n\n사유: " +
            data[0].response.message +
            "\n\n강제로 전송하시겠습니까?"
        );

        if (confirmForce) {
          await handleForceSend(); // ✅ 강제 전송 실행
        }
      }
    } catch (error) {
      setIsSending(false);
      console.error(error);
    }
  };

  const handleReset = () => {
    setFrom("");
    setTo("");
    setSubject("");
    setBody("");
    setAttachments([]);

    document.getElementById("fileInput").value = "";
  };

  const handleForceSend = async () => {
    const formData = new FormData();
    formData.append("from", from);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("body", body);
    if (attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append("attachment", file);
      });
    }

    setIsSending(true);

    try {
      const response = await fetch("http://localhost:5678/webhook-test/cc", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setIsSending(false);
        throw new Error("서버 응답 오류");
      }

      const data = await response.json();

      setIsSending(false);

      if (data[0].response.status === "success") {
        alert("강제 전송이 완료되었습니다.");
        // handleReset();
      } else {
        alert("강제 전송 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setIsSending(false);
      console.error(error);
    }
  };

  const handleCheckFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setCheckAttachments([]);
      return;
    }
    setCheckAttachments([...e.target.files]);
  };

  const handleCheckSend = async (e) => {
    e.preventDefault();

    if ((checkAttachments.length === 0) & !checkBody) {
      alert("파일 업로드 혹은 내용을 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("message", checkBody);
    checkAttachments.forEach((file) => {
      formData.append("binary", file);
    });

    setCheckResult(null);

    setCheckIsSending(true);

    try {
      const response = await fetch(
        "http://localhost:5678/webhook-test/chat_check",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setCheckIsSending(false);
        throw new Error("서버 응답 오류");
      }

      const data = await response.json();
      console.log(data[0].output);
      setCheckResult(data[0].output);

      setCheckIsSending(false);
    } catch (error) {
      setCheckIsSending(false);
      console.error(error);
    }
  };

  const handleCheckReset = () => {
    setCheckBody("");
    setCheckAttachments([]);
    setCheckResult(null);

    document.getElementById("fileInput").value = "";
  };

  return (
    <Container>
      <div className="mode-selector">
        <button
          type="button"
          className={`mode-button ${mode === "mail" ? "active" : ""}`}
          onClick={() => setMode("mail")}
        >
          메일
        </button>
        <button
          type="button"
          className={`mode-button ${mode === "check" ? "active" : ""}`}
          onClick={() => setMode("check")}
        >
          자가 확인
        </button>
        <button
          type="button"
          className={`mode-button ${mode === "board" ? "active" : ""}`}
          onClick={() => setMode("board")}
        >
          사내 게시판
        </button>
      </div>
      {mode === "mail" && (
        <>
          <h1>메일 전송 개인정보 감지</h1>
          <form onSubmit={handleSend}>
            <table className="mail">
              <tbody>
                <tr>
                  <td>보내는 이메일</td>
                  <td>
                    <input
                      type="email"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="example@domain.com"
                    />
                  </td>
                </tr>
                <tr>
                  <td>받는 이메일</td>
                  <td>
                    <input
                      type="email"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="example@domain.com"
                    />
                  </td>
                </tr>
                <tr>
                  <td>제목</td>
                  <td>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="메일 제목을 입력하세요"
                    />
                  </td>
                </tr>
                <tr>
                  <td>내용</td>
                  <td>
                    <textarea
                      rows={6}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="메일 내용을 입력하세요"
                    />
                  </td>
                </tr>
                <tr>
                  <td>파일 첨부</td>
                  <td>
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      onChange={handleFileChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              className="bottom-button"
              type="submit"
              disabled={isSending}
            >
              {isSending ? "전송 중..." : "전송"}
            </button>
            <button
              className="bottom-button"
              type="button"
              id="cancel-button"
              onClick={handleReset}
              disabled={isSending}
            >
              초기화
            </button>
          </form>
        </>
      )}
      {mode === "check" && (
        <>
          <h1>자가 확인</h1>
          <form onSubmit={handleCheckSend}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{ width: "80%", display: "flex", flexFlow: "column" }}
              >
                <input
                  style={{ width: "250px" }}
                  type="file"
                  id="fileInput"
                  multiple
                  onChange={handleCheckFileChange}
                />
                <textarea
                  style={{ marginTop: "20px" }}
                  rows={6}
                  value={checkBody}
                  onChange={(e) => setCheckBody(e.target.value)}
                  placeholder="내용을 입력하세요"
                />
              </div>
            </div>
            <button
              className="bottom-button"
              type="submit"
              disabled={checkIsSending}
            >
              {checkIsSending ? "분석 중..." : "분석"}
            </button>
            <button
              className="bottom-button"
              type="button"
              id="cancel-button"
              onClick={handleCheckReset}
              disabled={checkIsSending}
            >
              초기화
            </button>
          </form>
          <div
            className="checkResult"
            style={{ color: checkResult ? "auto" : "dimgray" }}
          >
            {checkResult ? checkResult : "분석 결과창"}
          </div>
        </>
      )}
      {mode === "board" && (
        <>
          <h1>사내 게시판</h1>
          {isWriting ? (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (!boardTitle || !boardContent) {
                    alert("제목과 내용을 입력하세요.");
                    return;
                  }

                  // 게시글 데이터 생성
                  const newPost = {
                    id: currentId,
                    title: boardTitle,
                    content: boardContent,
                    person: "관리자",
                    time: Date.now(),
                  };

                  try {
                    // 🟦 서버에 게시글 저장 요청 보내기
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

                  // 🟩 서버 저장 성공 → 프론트 목록에도 추가
                  setBoardPosts([newPost, ...boardPosts]);
                  setBoardTitle("");
                  setBoardContent("");
                  setCurrentId(currentId + 1);
                  setIsWriting(false);
                }}
              >
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
                      onClick={
                        () => navigate(`/board/${post.id}`, { state: { post } }) // ✅ 클릭 시 페이지 이동 + 데이터 같이 전달
                      }
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
      )}
    </Container>
  );
}

export default Test;
