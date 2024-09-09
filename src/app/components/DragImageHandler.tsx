import Image from 'next/image';

function DragImageHandler({
  setInputImage,
  handleUploadClick,
}: {
  setInputImage: React.Dispatch<React.SetStateAction<string>>;
  handleUploadClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}) {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    try {
      const userImage = files[0];
      const validType = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!userImage || !validType.includes(userImage.type)) {
        throw new Error(
          '지원하지 않는 형식입니다. 이미지 파일을 업로드 해주세요.',
        );
      }

      const usersDropImageURL = URL.createObjectURL(userImage);
      setInputImage(usersDropImageURL);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        className='flex h-96 min-h-min w-[32rem] min-w-min cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 bg-ivory bg-dropbox bg-cover bg-center bg-no-repeat p-3 transition-colors hover:border-gray-400'
      >
        <Image
          src={process.env.NEXT_PUBLIC_UPLOAD_ICON}
          width={100}
          height={100}
          alt='업로드 일러스트'
        />
        <h3 className='text-2xl font-medium leading-3 text-dark-green'>
          드래그 앤 드롭
        </h3>
        <span className='text-1xl relative font-regular text-dark-green before:absolute before:right-8 before:top-1/2 before:inline-block before:h-px before:w-full before:-translate-y-1/2 before:bg-dark-green before:content-[""] after:absolute after:left-8 after:top-1/2 after:inline-block after:h-px after:w-full after:-translate-y-1/2 after:bg-dark-green after:content-[""]'>
          또는
        </span>
        <p className='text-2xl font-medium leading-3 text-dark-green'>
          클릭하여 파일 선택
        </p>
      </div>
    </>
  );
}

export default DragImageHandler;
