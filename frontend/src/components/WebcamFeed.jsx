import styled from "styled-components";

const WebcamFeed = styled.img`
  margin-top: 20px;
  width: 640px;
  height: 480px;
  border-radius: 10px;
  border: 2px solid #fff;
`;

export default function Webcam({ image }) {
  return image ? <WebcamFeed src={image} alt="Webcam Feed" /> : null;
}