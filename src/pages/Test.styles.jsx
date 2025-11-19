import styled from "styled-components";

export const Container = styled.div`
  form {
    text-align: center;
    margin-top: 20px;
  }

  .mode-selector {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 20px;
  }

  .mode-button {
    width: 100px;
    padding: 10px 0;
    border: none;
    background-color: white;
    color: dimgray;
    cursor: pointer;
    font-size: 16px;
    transition: 0.2s;
    border-bottom: 2px solid white;

    &:hover {
      border-bottom: 2px solid #5877f9;
      color: #5877f9;
    }
  }

  .mode-button.active {
    border-bottom: 2px solid #5877f9;
    color: #5877f9;
  }

  .mail {
    width: 80%;
    margin: 0 auto;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .board {
    width: 80%;
    margin: 0 auto;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border-top: 2px solid black;
  }

  thead {
    background-color: aliceblue;
  }

  th {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    vertical-align: middle;
  }

  td {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    vertical-align: middle;
  }

  .mail td:first-child {
    width: 150px;
    font-weight: 300;
    color: black;
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
    resize: vertical;
  }

  .bottom-button {
    padding: 10px 24px;
    background-color: #5877f9;
    border: 2px solid #5877f9;
    color: white;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
    margin: 20px 0;

    &:hover {
      background-color: #4766e0;
      border: 2px solid #4766e0;
    }
  }

  #cancel-button {
    background-color: white;
    color: #5877f9;
    margin-left: 10px;
  }

  .right-align {
    display: flex;
    justify-content: flex-end;
    width: 80%; /* 테이블 너비에 맞추고 싶다면 */
    margin: 0 auto;
  }

  .checkResult {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 80%;
    display: flex;
    justify-self: center;
    box-sizing: border-box;
    font-size: 15px;
  }
`;
