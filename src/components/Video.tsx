const VideoComponent = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <video
        autoPlay
        loop
        muted
        controls={false}
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      >
        <source src="/src/assets/video/VIDEO PCT.mp4" type="video/mp4" />
        El navegador no soporta el elemento <code>video</code>
      </video>
    </div>
  );
};

export default VideoComponent;
