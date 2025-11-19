import styled from "styled-components";

export const Container = styled.div`
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
