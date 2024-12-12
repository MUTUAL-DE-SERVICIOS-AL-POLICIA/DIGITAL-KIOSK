const VideoComponent = () => {
  return (
    <div>
      <video
        autoPlay
        loop
        muted
        controls={false}
        style={{
          width: "100%",
          height: "auto",
        }}
      >
        <source src="/src/assets/video/POLICE.mp4" type="video/mp4" />
        El navegador no soporta el elemento <code>video</code>
      </video>
    </div>
  );
};

export default VideoComponent;
