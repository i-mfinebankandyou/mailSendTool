import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    form {
        text-align: center;
        margin-top: 20px;
    }

    table {
        width: 80%;
        margin: 0 auto;
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
        border: 1px solid #ccc;
        border-radius: 6px;
    }

    td {
        padding: 10px;
        border-bottom: 1px solid #ccc;
        vertical-align: middle;
    }

    td:first-child {
        width: 150px;
        font-weight: 300;
        fcolor: black;
        text-align: left;
        padding-right: 20px;
        border-right: 1px solid #ccc;
        background-color: aliceblue;
    }

    tr:last-child td {
        border-bottom: none;
    }

    input,
    textarea {
        width: 100%;
        padding: 8px;
        font-size: 15px;
        box-sizing: border-box;
        border-radius: 6px;
        border: 1px solid #ccc;
    }

    input[type="file"] {
        // border: none;
    }

    button {
        padding: 10px 24px;
        background-color: #5877f9;
        border: 2px solid #5877f9;
        color: white;
        font-size: 16px;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 20px;

        &:hover {
            background-color: #4766e0;
            border: 2px solid #4766e0;
        }
    }
    
    .cancel-button {
        
    }
`;

function Test() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [showForceSend, setShowForceSend] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            setAttachment(null);
            return;
        }
        setAttachment(file);
    };

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
        if (attachment) formData.append("attachment", attachment);

        setIsSending(true);

        try {
            const response = await fetch("http://localhost:5678/webhook-test/check", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("서버 응답 오류");

            const data = await response.json();

            if (data.output === "개인정보가 포함되어 있지 않습니다.") {
                alert("메일 전송에 성공하였습니다.");
                handleReset();
            } else {
                alert("메일 전송에 실패하였습니다.\n사유: " + data[0].output);
                setShowForceSend(true); // ✅ 강제 전송 버튼 활성화
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const handleReset = () => {
        setFrom("");
        setTo("");
        setSubject("");
        setBody("");
        setAttachment(null);
        
        document.getElementById("fileInput").value = "";
    };

    // const handleForceSend = async () => {
    //     if (!window.confirm("개인정보가 포함되어 있습니다. 그래도 강제 전송하시겠습니까?"))
    //     return;

    //     setIsSending(true);
    //     try {
    //     const formData = new FormData();
    //     formData.append("sender", form.sender);
    //     formData.append("receiver", form.receiver);
    //     formData.append("subject", form.subject);
    //     formData.append("content", form.content);
    //     if (form.file) formData.append("file", form.file);

    //     // ✅ 다른 API로 강제 전송
    //     const response = await fetch("/api/force-send-email", {
    //         method: "POST",
    //         body: formData,
    //     });

    //     if (response.ok) {
    //         alert("강제 전송이 완료되었습니다.");
    //         handleReset();
    //     } else {
    //         alert("강제 전송 중 오류가 발생했습니다.");
    //     }
    //     } catch (error) {
    //     alert("강제 전송 중 네트워크 오류가 발생했습니다.");
    //     } finally {
    //     setIsSending(false);
    //     }
    // };

    return (
        <Container>
            <h1>메일 전송 개인정보 감지</h1>
            <form onSubmit={handleSend}>
                <table>
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
                                <input type="file" id="fileInput" onChange={handleFileChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button type="submit" disabled={isSending}>
                    {isSending ? "전송 중..." : "전송"}
                </button>
                <button
                    type="button"
                    id="cancel-button"
                    onClick={handleReset}
                    disabled={isSending}
                    style={{ backgroundColor: "white", color: "#5877f9", marginLeft: 10 }}
                >
                    초기화
                </button>
            </form>
        </Container>
    );
}

export default Test;
