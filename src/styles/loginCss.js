/** @format */

import styled from '@emotion/styled';
const LoginDiv = styled.div`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  form {
    width: 100%;
    padding: 20px;
    box-shadow: 0px 19px 38px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    laber {
      font-weight: bold;
      margin-bottom: 5px;
    }
    input {
      border-radius: 10px;
      border: 1px solid #c6c6c6;
      padding: 5px;
      margin-bottom: 15px;
      &:active,
      &:focus {
        outline: none;
      }
    }
    button {
      border-radius: 15px;
      padding: 5px 10px;
      background-color: #000;
      color: #fff;
      margin-bottom: 10px;
      border: 1px solid #fff;
      &:hover {
        background-color: #ffc107;
        color: #000;
        border: 1px solid #ffc107;
      }
    }
  }
`;
export default LoginDiv;
