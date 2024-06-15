/* eslint-disable */

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { propTypes } from 'react-bootstrap/esm/Image';

const UploadImage = ({
  onDone,
  onError,
  className,
  text,
  changeImgText,
  changing,
  disabled,
  inputName,
  acceptedexe = 'image/png,image/jpeg,image/jpg',
  maxSizeUpload = '1000',
  setErrorMessage = false,
  children,
  loading,
}) => {
  const uploadInput = useRef();
  const [isImageUploaded, setIsImageUploaded] = useState(null);
  const acceptedOrNot = (extensionOfUploaded) => {
    const exeArray = acceptedexe.split(',');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < exeArray.length; i++) {
      const element = exeArray[i];
      if (element === extensionOfUploaded) {
        return 1;
      }
    }
    return -1;
  };

  // Upload Image Function
  const upload = async (e) => {
    let base64 = '';
    const file = e.target.files[0];
    const imgSizeKb = (file?.size / 1000).toFixed(1);
    if (file && acceptedOrNot(file?.type) !== -1 && imgSizeKb <= +maxSizeUpload) {
      base64 = await convertBase64(file);
      if (onDone) onDone(base64);
      setIsImageUploaded(true);
      setErrorMessage && setErrorMessage(false);
    } else {
      if (imgSizeKb > +maxSizeUpload) {
        //   error appear when image greter than size defined
        if (setErrorMessage && !inputName) {
          setErrorMessage(
            <FormattedMessage
              id={
                maxSizeUpload > 1000
                  ? 'upload.image.size.mb.error'
                  : 'upload.image.size.error'
              }
              values={{
                size: maxSizeUpload > 1000 ? maxSizeUpload / 1000 : maxSizeUpload,
              }}
            />,
          );
        }
        if (setErrorMessage && inputName) {
          setErrorMessage(
            <FormattedMessage
              id={
                maxSizeUpload > 1000
                  ? 'upload.image.input.size.mb.error'
                  : 'upload.image.input.size.error'
              }
              values={{
                size: maxSizeUpload > 1000 ? maxSizeUpload / 1000 : maxSizeUpload,
                name: inputName,
              }}
            />,
          );
        }
      }
      if (acceptedOrNot(file?.type) === -1 && file) {
        //   error appear when upload non image
        setErrorMessage &&
          setErrorMessage(<FormattedMessage id="upload.image.invalid.format.error" />);
      }
      if (onDone) onDone(base64);
      setIsImageUploaded(false);
    }
  };

  // Conver File to Base64
  const convertBase64 = (file) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (err) => {
        reject(err);
        if (onError) onError(err);
      };
    });

  return (
    <>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={uploadInput}
        onChange={(e) => {
          upload(e);
        }}
        accept={acceptedexe}
      />
      <button
        type="button"
        className={className}
        onClick={() => uploadInput.current.click()}
        disabled={disabled || loading}
      >
        {loading ? (
          <div className="spinner-border spinner-border-sm mb-1" role="status" />
        ) : children ? (
          children
        ) : changing && isImageUploaded ? (
          changeImgText || 'Change Image'
        ) : (
          text || 'Upload Image'
        )}
      </button>
    </>
  );
};

UploadImage.propTypes = {
  onDone: PropTypes.func,
  onError: PropTypes.func,
  changing: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  text: PropTypes.string,
  changeImgText: PropTypes.string,
  acceptedexe: PropTypes.string,
  maxSizeUpload: PropTypes.string,
  setErrorMessage: PropTypes.func,
  children: PropTypes.elementType,
};
export default UploadImage;
