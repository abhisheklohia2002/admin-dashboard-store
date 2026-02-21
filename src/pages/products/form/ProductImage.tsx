import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, message, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";
import type { ProductImageUploaderProps } from "../../../types";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const validateFile = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) message.error("You can only upload JPG/PNG file!");

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) message.error("Image must smaller than 2MB!");

  return isJpgOrPng && isLt2M;
};

const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  onImageChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const uploaderProps: UploadProps = {
    name: "avatar",
    listType: "picture-card",
    className: "avatar-uploader",
    showUploadList: false,

    beforeUpload: (file) => {
      const ok = validateFile(file as FileType);
      if (!ok) return Upload.LIST_IGNORE;

      setLoading(true);

      getBase64(file as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
        onImageChange?.(url, file as unknown as File);
      });

      return false; 
    },
  };

  const uploadButton = (
    <div style={{ border: 0, background: "none" }}>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Flex gap="middle" wrap>
      <Upload {...uploaderProps}>
        {imageUrl ? (
          <img
            draggable={false}
            src={imageUrl}
            alt="avatar"
            style={{ width: "100%" }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </Flex>
  );
};

export default ProductImageUploader;