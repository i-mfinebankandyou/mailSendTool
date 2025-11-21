// Test.jsx
import React, { useState } from "react";
import { Container } from "./Test.styles";
import Board from "./Board"; // ✅ 새로 추가

function Test() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState("mail");

  const [checkBody, setCheckBody] = useState("");
  const [checkAttachments, setCheckAttachments] = useState([]);
  const [checkIsSending, setCheckIsSending] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setAttachments([]);
      return;
    }
    setAttachments([...e.target.files]);
  };

  // 메일 전송
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
      const response = await fetch("http://localhost:5678/webhook/check", {
        method: "POST",
        body: formData,
      });

      console.log(1);

      if (!response.ok) {
        setIsSending(false);
        throw new Error("서버 응답 오류");
      }

      console.log(2);

      const data = await response.json();

      setIsSending(false);

      console.log(3);

      if (data.response.status === "success") {
        alert("메일 전송에 성공하였습니다.");
        // handleReset();
      } else {
        const confirmForce = window.confirm(
          "메일 전송에 실패하였습니다.\n\n사유: " +
            data.response.message +
            "\n\n강제로 전송하시겠습니까?"
        );

        if (confirmForce) {
          await handleForceSend();
        }
      }
      console.log(4);
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

    const input = document.getElementById("fileInput");
    if (input) input.value = "";
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
      const response = await fetch("http://localhost:5678/webhook/cc", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setIsSending(false);
        throw new Error("서버 응답 오류");
      }

      const data = await response.json();

      setIsSending(false);

      if (data.response.status === "success") {
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

    const input = document.getElementById("fileInput");
    if (input) input.value = "";
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

      {/* 메일 모드 */}
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

      {/* 자가 확인 모드 */}
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

      {/* 게시판 모드 */}
      {mode === "board" && <Board />}
    </Container>
  );
}

export default Test;
