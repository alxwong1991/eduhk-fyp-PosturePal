const WebcamFeed = ({ image }) => {
  return image ? (
      <img src={image} alt="Webcam Feed" style={{ width: "100%", height: "100%" }} />
  ) : null;
};

export default WebcamFeed;