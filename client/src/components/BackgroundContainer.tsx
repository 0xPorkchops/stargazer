interface BackgroundContainerProps {
  children: React.ReactNode;
  backgroundSrc: string;
}

const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ children, backgroundSrc }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100vh', // Adjust height as needed
        backgroundImage: `url(${backgroundSrc})`,
        backgroundSize: 'cover', // Cover the entire area
        backgroundPosition: 'center', // Center the background
        backgroundRepeat: 'no-repeat', // Prevent tiling
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundContainer;
